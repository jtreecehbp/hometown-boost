import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { TessellateModifier } from "three/addons/modifiers/TessellateModifier.js";
import type { FlightPose } from "./launch-motion.ts";

export const REST_HEIGHT = 3.6;

export interface LaunchWorld {
  scene: THREE.Scene;
  town: THREE.Group;
  gantry: THREE.Group;
  rocket: THREE.Group;
  exhaust: THREE.Group;
  flame: THREE.Mesh[];
  smoke: THREE.InstancedMesh;
  clouds: THREE.InstancedMesh;
  engineLight: THREE.PointLight;
  van: THREE.Group;
  dispose: () => void;
}

const up = new THREE.Vector3(0, 1, 0);
const dummy = new THREE.Object3D();
const seed = (n: number) => {
  const value = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
};

/** Batch the static town by material: hundreds of details, a few draw calls. */
function batchStatic(group: THREE.Group) {
  group.updateMatrixWorld(true);
  const inverse = group.matrixWorld.clone().invert();
  const batches = new Map<THREE.Material, THREE.BufferGeometry[]>();
  const originals = new Set<THREE.BufferGeometry>();
  group.traverse((object) => {
    if (!(object instanceof THREE.Mesh) || Array.isArray(object.material))
      return;
    const geometry = object.geometry.clone();
    geometry.applyMatrix4(inverse.clone().multiply(object.matrixWorld));
    const list = batches.get(object.material) ?? [];
    list.push(geometry);
    batches.set(object.material, list);
    originals.add(object.geometry);
  });
  group.clear();
  batches.forEach((geometries, material) => {
    // All primitive geometries have position, normal, and uv attributes.
    const pieces = geometries.map((g) => (g.index ? g.toNonIndexed() : g));
    const geometry = mergeGeometries(pieces);
    if (geometry) {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);
    }
    geometries.forEach((g) => g.dispose());
    pieces.forEach((g) => g.dispose());
  });
  originals.forEach((g) => g.dispose());
}

export function createLaunchWorld(compact = false): LaunchWorld {
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2("#d5ecfa", 0.008);
  const town = new THREE.Group();
  town.name = "hometown";
  const gantry = new THREE.Group();
  gantry.name = "stationary-launch-gantry";
  const rocket = new THREE.Group();
  rocket.name = "hb-water-tower-rocket";
  rocket.position.y = REST_HEIGHT;
  scene.add(town, gantry, rocket);

  const materials = new Map<string, THREE.MeshStandardMaterial>();
  const matte = (color: string) => {
    if (!materials.has(color))
      materials.set(
        color,
        new THREE.MeshStandardMaterial({ color, roughness: 0.8 }),
      );
    return materials.get(color)!;
  };
  const navy = new THREE.MeshPhysicalMaterial({
    color: "#16467c",
    metalness: 0.3,
    roughness: 0.24,
    clearcoat: 0.9,
    clearcoatRoughness: 0.2,
  });
  const ivory = new THREE.MeshStandardMaterial({
    color: "#fffaf0",
    metalness: 0.22,
    roughness: 0.3,
  });
  const steel = new THREE.MeshStandardMaterial({
    color: "#577891",
    metalness: 0.64,
    roughness: 0.32,
  });
  const orange = new THREE.MeshStandardMaterial({
    color: "#ff8a32",
    roughness: 0.42,
    metalness: 0.12,
  });
  const windowLight = new THREE.MeshStandardMaterial({
    color: "#bde7f6",
    emissive: "#e6f7ff",
    emissiveIntensity: 0.08,
    roughness: 0.19,
    metalness: 0.3,
  });

  const mesh = (
    geometry: THREE.BufferGeometry,
    material: THREE.Material,
    parent: THREE.Object3D,
    x = 0,
    y = 0,
    z = 0,
  ) => {
    const object = new THREE.Mesh(geometry, material);
    object.position.set(x, y, z);
    object.castShadow = true;
    object.receiveShadow = true;
    parent.add(object);
    return object;
  };
  const box = (
    parent: THREE.Object3D,
    w: number,
    h: number,
    d: number,
    material: THREE.Material,
    x = 0,
    y = 0,
    z = 0,
    radius = 0.035,
  ) =>
    mesh(
      radius
        ? new RoundedBoxGeometry(
            w,
            h,
            d,
            1,
            Math.min(radius, w / 4, h / 4, d / 4),
          )
        : new THREE.BoxGeometry(w, h, d),
      material,
      parent,
      x,
      y,
      z,
    );
  const cylinder = (
    parent: THREE.Object3D,
    top: number,
    bottom: number,
    h: number,
    material: THREE.Material,
    x = 0,
    y = 0,
    z = 0,
    segments = 48,
  ) =>
    mesh(
      new THREE.CylinderGeometry(top, bottom, h, segments),
      material,
      parent,
      x,
      y,
      z,
    );
  const rod = (
    parent: THREE.Object3D,
    a: number[],
    b: number[],
    r: number,
    material: THREE.Material,
  ) => {
    const start = new THREE.Vector3(...a),
      end = new THREE.Vector3(...b);
    const direction = end.clone().sub(start);
    const object = cylinder(
      parent,
      r,
      r,
      direction.length(),
      material,
      0,
      0,
      0,
      8,
    );
    object.position.copy(start.add(end).multiplyScalar(0.5));
    object.quaternion.setFromUnitVectors(up, direction.normalize());
    return object;
  };
  const ring = (
    parent: THREE.Object3D,
    radius: number,
    tube: number,
    y: number,
    material: THREE.Material,
  ) => {
    const object = mesh(
      new THREE.TorusGeometry(radius, tube, 8, 64),
      material,
      parent,
      0,
      y,
      0,
    );
    object.rotation.x = Math.PI / 2;
    return object;
  };

  // Broad, gently bevelled ground with a connected main street and town square.
  cylinder(town, 20, 19.2, 0.7, matte("#88a7a1"), 0, -0.48, 0, 80);
  cylinder(town, 20.1, 20, 0.12, matte("#92bca2"), 0, -0.07, 0, 80);
  box(town, 32, 0.05, 2.2, matte("#63798e"), 0, 0.015, 5.5);
  box(town, 32, 0.05, 2.2, matte("#63798e"), 0, 0.016, -5.5);
  box(town, 2.2, 0.05, 26, matte("#63798e"), -5.5, 0.017, 0);
  box(town, 2.2, 0.05, 26, matte("#63798e"), 5.5, 0.018, 0);
  for (const z of [-6.65, -4.35, 4.35, 6.65])
    box(town, 31, 0.09, 0.17, matte("#e4e8e7"), 0, 0.02, z);
  for (const x of [-6.65, -4.35, 4.35, 6.65])
    box(town, 0.17, 0.09, 25, matte("#e4e8e7"), x, 0.02, 0);
  for (let i = -14; i <= 14; i += 1.4) {
    if (Math.abs(Math.abs(i) - 5.5) < 1.6) continue;
    for (const z of [-5.5, 5.5])
      box(town, 0.6, 0.015, 0.055, ivory, i, 0.052, z, 0);
  }
  for (let i = -11; i <= 11; i += 1.4) {
    if (Math.abs(Math.abs(i) - 5.5) < 1.6) continue;
    for (const x of [-5.5, 5.5])
      box(town, 0.055, 0.015, 0.6, ivory, x, 0.055, i, 0);
  }
  for (const x of [-5.5, 5.5])
    for (let i = 0; i < 6; i++)
      box(town, 0.14, 0.015, 1.3, ivory, x - 0.7 + i * 0.28, 0.06, 3.85, 0);

  cylinder(town, 3.65, 3.85, 0.18, matte("#d9e2e5"), 0, 0.07, 0, 64);
  cylinder(town, 3.2, 3.2, 0.05, matte("#9fb6c6"), 0, 0.18, 0, 64);
  ring(town, 2.85, 0.045, 0.22, orange);
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    cylinder(
      town,
      0.065,
      0.065,
      0.05,
      windowLight,
      Math.sin(angle) * 3.4,
      0.19,
      Math.cos(angle) * 3.4,
      8,
    );
  }

  const shop = (
    x: number,
    z: number,
    height: number,
    width: number,
    color: string,
    rotation = 0,
    pitched = false,
  ) => {
    const building = new THREE.Group();
    building.position.set(x, 0.08, z);
    building.rotation.y = rotation;
    town.add(building);
    box(building, width + 0.3, 0.12, 2.95, matte("#d9e2e5"), 0, 0.01, 0);
    box(building, width, height, 2.5, matte(color), 0, height / 2, 0, 0.06);
    box(
      building,
      width + 0.18,
      0.2,
      2.68,
      matte("#59788d"),
      0,
      height + 0.08,
      0,
    );
    if (pitched) {
      const roof = cylinder(
        building,
        0,
        1,
        1,
        matte("#6584a0"),
        0,
        height + 0.7,
        0,
        4,
      );
      roof.rotation.y = Math.PI / 4;
      roof.scale.set(width * 0.78, 1.25, 1.95);
    } else {
      box(building, 0.48, 0.23, 0.6, steel, -0.5, height + 0.32, -0.3);
    }
    const front = 1.27;
    box(building, 0.48, 1.3, 0.055, matte("#17364b"), width * 0.26, 0.7, front);
    box(
      building,
      0.32,
      0.77,
      0.06,
      windowLight,
      width * 0.26,
      0.83,
      front + 0.04,
    );
    box(
      building,
      width * 0.46,
      0.94,
      0.06,
      windowLight,
      -width * 0.2,
      0.98,
      front,
    );
    box(building, 0.055, 0.94, 0.065, ivory, -width * 0.2, 0.98, front + 0.045);
    box(
      building,
      width * 0.52,
      0.07,
      0.2,
      ivory,
      -width * 0.2,
      0.48,
      front + 0.04,
    );
    if (!pitched) {
      box(
        building,
        width - 0.3,
        0.4,
        0.12,
        matte("#17364b"),
        0,
        height - 0.45,
        front + 0.02,
      );
      // Recessed sign face and striped fabric canopy, with no invented testimonials.
      box(
        building,
        width * 0.44,
        0.045,
        0.04,
        ivory,
        0,
        height - 0.42,
        front + 0.095,
      );
      for (let i = 0; i < 7; i++) {
        const awning = box(
          building,
          (width + 0.12) / 7,
          0.07,
          0.67,
          i % 2 ? ivory : orange,
          -(width + 0.12) / 2 + ((i + 0.5) * (width + 0.12)) / 7,
          1.69,
          front + 0.3,
          0.01,
        );
        awning.rotation.x = 0.17;
      }
    }
    if (height > 2.9)
      for (let i = 0; i < 3; i++)
        box(
          building,
          0.43,
          0.6,
          0.055,
          windowLight,
          (i - 1) * width * 0.27,
          height - 0.78,
          front,
        );
  };
  const shopColors = ["#f1dec1", "#8fc8d9", "#dfaa88", "#d9e5ec", "#b8cfbb"];
  const plots = [
    [-10, -8.5, 3.2, 3.5],
    [-2.1, -8.5, 2.4, 3.1],
    [1.7, -8.5, 3.4, 3.3],
    [10, -8.5, 2.7, 3.8],
    [-9, 0, 2.6, 3.2],
    [9, 0, 3.2, 3.4],
    [-10, 9, 2.5, 3.2],
    [-1.9, 9.5, 2.5, 2.8],
    [1.7, 9.5, 2.9, 3.1],
    [10, 9.5, 3.1, 3.7],
    [-12, -1.2, 2.6, 2.6],
    [12, 1, 2.5, 2.5],
  ];
  plots.forEach(([x, z, h, w], i) =>
    shop(
      x,
      z,
      h,
      w,
      shopColors[i % 5],
      z > 5
        ? Math.PI
        : x < -6 && Math.abs(z) < 4
          ? Math.PI / 2
          : x > 6 && Math.abs(z) < 4
            ? -Math.PI / 2
            : 0,
      i > 9,
    ),
  );

  const foliageGeometry = new THREE.IcosahedronGeometry(1, 2);
  for (let i = 0; i < 32; i++) {
    const angle = (i / 32) * Math.PI * 2;
    const radius = 14 + seed(i) * 3.3;
    const x = Math.sin(angle) * radius,
      z = Math.cos(angle) * radius;
    const height = 1.25 + seed(i + 90) * 1.05;
    cylinder(town, 0.09, 0.12, 1.2, matte("#6f6860"), x, 0.6, z, 6);
    const crown = mesh(
      foliageGeometry,
      matte(i % 2 ? "#72a77d" : "#4b886a"),
      town,
      x,
      1.4 + height * 0.28,
      z,
    );
    crown.scale.set(0.7, height * 0.72, 0.7);
    crown.rotation.y = angle;
  }
  for (const x of [-3.6, 3.6])
    for (const z of [-3.6, 3.6]) {
      cylinder(town, 0.09, 0.14, 0.6, matte("#6f6860"), x, 0.3, z, 6);
      const crown = mesh(foliageGeometry, matte("#72a77d"), town, x, 1.15, z);
      crown.scale.set(0.65, 0.85, 0.65);
    }
  for (const x of [-6.9, 6.9])
    for (const z of [-8, -2.5, 2.5, 8]) {
      cylinder(town, 0.04, 0.07, 2.6, steel, x, 1.3, z, 8);
      box(town, 0.46, 0.06, 0.12, steel, x + 0.18, 2.61, z);
      box(town, 0.27, 0.07, 0.2, windowLight, x + 0.32, 2.57, z);
    }

  // Four fixed splayed legs, bolted feet, and X bracing form the launch gantry.
  const bottom = 1.7,
    top = 1.1,
    upperY = REST_HEIGHT + 0.22;
  const feet = [
    [-bottom, -bottom],
    [bottom, -bottom],
    [bottom, bottom],
    [-bottom, bottom],
  ];
  feet.forEach(([x, z]) => {
    const tx = Math.sign(x) * top,
      tz = Math.sign(z) * top;
    box(gantry, 0.5, 0.12, 0.5, ivory, x, 0.27, z);
    rod(gantry, [x, 0.3, z], [tx, upperY, tz], 0.12, steel);
    cylinder(gantry, 0.035, 0.035, 0.045, orange, x + 0.16, 0.35, z + 0.16, 6);
  });
  for (let i = 0; i < 4; i++) {
    const a = feet[i],
      b = feet[(i + 1) % 4];
    const low = (v: number) => v * 0.91,
      high = (v: number) => v * 0.72;
    rod(
      gantry,
      [low(a[0]), 0.85, low(a[1])],
      [high(b[0]), 3, high(b[1])],
      0.05,
      steel,
    );
    rod(
      gantry,
      [low(b[0]), 0.85, low(b[1])],
      [high(a[0]), 3, high(a[1])],
      0.05,
      steel,
    );
    rod(
      gantry,
      [low(a[0]), 0.85, low(a[1])],
      [low(b[0]), 0.85, low(b[1])],
      0.055,
      steel,
    );
  }
  ring(gantry, 1.62, 0.09, upperY, steel);
  // Access ladder stays with the structure.
  for (const x of [-0.22, 0.22])
    rod(gantry, [x, 0.35, -1.8], [x, 3.68, -1.24], 0.027, ivory);
  for (let i = 0; i < 12; i++)
    rod(
      gantry,
      [-0.22, 0.48 + i * 0.26, -1.78 + i * 0.044],
      [0.22, 0.48 + i * 0.26, -1.78 + i * 0.044],
      0.024,
      ivory,
    );

  // The recognizable tank, roof, lettering, and engine travel as one solid model.
  cylinder(rocket, 1.58, 1.58, 2.62, navy, 0, 1.7, 0, 80);
  cylinder(rocket, 1.67, 1.67, 0.19, ivory, 0, 0.32, 0, 80);
  cylinder(rocket, 1.63, 1.63, 0.11, navy, 0, 0.18, 0, 80);
  cylinder(rocket, 1.64, 1.64, 0.15, ivory, 0, 3.08, 0, 80);
  ring(rocket, 1.58, 0.035, 2.96, ivory);
  cylinder(rocket, 0.04, 1.86, 1.04, navy, 0, 3.69, 0, 80);
  ring(rocket, 1.82, 0.055, 3.17, navy);
  // Fine standing seams catch the daylight around the enamel roof.
  for (let i = 0; i < 16; i++) {
    const angle = (i / 16) * Math.PI * 2;
    rod(rocket,
      [Math.sin(angle) * 0.07, 4.2, Math.cos(angle) * 0.07],
      [Math.sin(angle) * 1.83, 3.18, Math.cos(angle) * 1.83],
      0.016, navy);
  }
  cylinder(rocket, 0.055, 0.115, 0.3, navy, 0, 4.32, 0, 16);
  cylinder(rocket, 0, 0.06, 0.38, ivory, 0, 4.65, 0, 16);
  cylinder(rocket, 0.76, 0.52, 0.43, steel, 0, -0.025, 0);
  cylinder(rocket, 0.37, 0.57, 0.74, navy, 0, -0.57, 0);
  ring(rocket, 0.57, 0.055, -0.95, ivory);
  ring(rocket, 0.43, 0.03, -0.44, ivory);
  ring(rocket, 0.38, 0.032, -0.2, ivory);
  cylinder(rocket, 0.49, 0.49, 0.03, matte("#071322"), 0, -0.94, 0);

  const letters = new THREE.Group();
  letters.name = "raised-HB-lettering";
  letters.rotation.y = 0.52;
  rocket.add(letters);
  const h = new THREE.Shape();
  h.moveTo(-1.28, 0.69);
  h.lineTo(-0.88, 0.69);
  h.lineTo(-0.88, 1.47);
  h.lineTo(-0.37, 1.47);
  h.lineTo(-0.37, 0.69);
  h.lineTo(0.02, 0.69);
  h.lineTo(0.02, 2.64);
  h.lineTo(-0.37, 2.64);
  h.lineTo(-0.37, 1.88);
  h.lineTo(-0.88, 1.88);
  h.lineTo(-0.88, 2.64);
  h.lineTo(-1.28, 2.64);
  h.closePath();
  const b = new THREE.Shape();
  b.moveTo(0.22, 0.69);
  b.lineTo(0.95, 0.69);
  b.bezierCurveTo(1.64, 0.69, 1.64, 1.55, 1.16, 1.68);
  b.bezierCurveTo(1.58, 1.81, 1.56, 2.64, 0.96, 2.64);
  b.lineTo(0.22, 2.64);
  b.closePath();
  for (const y of [1.08, 1.92]) {
    const hole = new THREE.Path();
    hole.moveTo(0.64, y);
    hole.lineTo(0.64, y + 0.34);
    hole.lineTo(0.9, y + 0.34);
    hole.bezierCurveTo(1.15, y + 0.34, 1.15, y, 0.9, y);
    hole.closePath();
    b.holes.push(hole);
  }
  for (const shape of [h, b]) {
    const extrusion = new THREE.ExtrudeGeometry(shape, {
      depth: 0.075,
      bevelEnabled: true,
      bevelThickness: 0.018,
      bevelSize: 0.018,
      bevelSegments: 2,
      curveSegments: 10,
    });
    // Subdivide before curving so broad letter strokes stay above the tank surface.
    const geometry = new TessellateModifier(0.22, 6).modify(extrusion);
    extrusion.dispose();
    const positions = geometry.getAttribute("position");
    for (let i = 0; i < positions.count; i++) {
      const angle = positions.getX(i) / 1.62,
        radius = 1.62 + positions.getZ(i);
      positions.setXYZ(
        i,
        Math.sin(angle) * radius,
        positions.getY(i),
        Math.cos(angle) * radius,
      );
    }
    geometry.computeVertexNormals();
    mesh(geometry, ivory, letters);
  }
  // Small rivets on the rear repeat the crafted metal detail of the supplied logo.
  const rivetGeometry = new THREE.SphereGeometry(0.035, 6, 4);
  for (let i = 0; i < 20; i++) {
    const angle = (i / 20) * Math.PI * 2;
    for (const y of [0.48, 2.85])
      mesh(
        rivetGeometry,
        ivory,
        rocket,
        Math.sin(angle) * 1.588,
        y,
        Math.cos(angle) * 1.588,
      );
  }
  batchStatic(rocket);

  const exhaust = new THREE.Group();
  exhaust.name = "engine-exhaust";
  exhaust.position.y = -0.95;
  rocket.add(exhaust);
  const profile = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, -5.8, 0),
    new THREE.Vector3(0.17, -4.35, 0),
    new THREE.Vector3(0.42, -2.7, 0),
    new THREE.Vector3(0.6, -1.05, 0),
    new THREE.Vector3(0.34, 0, 0),
  ])
    .getPoints(30)
    .map((p) => new THREE.Vector2(Math.max(0, p.x), p.y));
  const flameGeometry = new THREE.LatheGeometry(profile, compact ? 20 : 32);
  const flame = ["#ff661f", "#ffb732", "#fff7cf"].map((color, i) => {
    const material = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: i === 0 ? 0.38 : 0.88,
      depthWrite: false,
      blending: i === 2 ? THREE.AdditiveBlending : THREE.NormalBlending,
    });
    const object = mesh(flameGeometry, material, exhaust);
    object.scale.set(1 - i * 0.22, 1 - i * 0.14, 1 - i * 0.22);
    object.castShadow = false;
    return object;
  });
  const engineLight = new THREE.PointLight("#ff9540", 0, 16, 2);
  engineLight.position.set(0, -1.2, 0);
  rocket.add(engineLight);

  const smoke = new THREE.InstancedMesh(
    new THREE.SphereGeometry(1, compact ? 12 : 20, compact ? 8 : 12),
    new THREE.MeshStandardMaterial({
      color: "#f6f9fc",
      roughness: 1,
      transparent: true,
      opacity: 0.82,
      depthWrite: false,
    }),
    compact ? 24 : 48,
  );
  smoke.name = "launch-pad-smoke";
  smoke.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  smoke.frustumCulled = false;
  scene.add(smoke);

  const clouds = new THREE.InstancedMesh(
    new THREE.SphereGeometry(1, compact ? 12 : 20, compact ? 8 : 12),
    new THREE.MeshStandardMaterial({
      color: "#ffffff",
      emissive: "#e7f4ff",
      emissiveIntensity: 0.16,
      roughness: 1,
      transparent: true,
      opacity: 0.56,
      depthWrite: false,
    }),
    compact ? 45 : 90,
  );
  clouds.name = "altitude-clouds";
  for (let i = 0; i < clouds.count; i++) {
    const band = Math.floor(i / 15),
      angle = i * 2.399;
    const radius = 8 + seed(i + 30) * 18;
    dummy.position.set(
      Math.sin(angle) * radius,
      17 + band * 7 + seed(i + 12) * 2,
      Math.cos(angle) * radius - 6,
    );
    dummy.rotation.set(0, angle, 0);
    const size = 1.5 + seed(i + 200) * 3.5;
    dummy.scale.set(size * 1.7, size * 0.3, size);
    dummy.updateMatrix();
    clouds.setMatrixAt(i, dummy.matrix);
  }
  clouds.instanceMatrix.needsUpdate = true;
  scene.add(clouds);

  const van = new THREE.Group();
  van.name = "local-service-van";
  scene.add(van);
  box(van, 0.68, 0.58, 1.35, ivory, 0, 0.63, 0, 0.1);
  box(van, 0.64, 0.2, 0.43, matte("#a9c0cf"), 0, 0.84, 0.31, 0.05);
  box(van, 0.69, 0.09, 0.48, orange, 0, 0.65, -0.15, 0.01);
  for (const x of [-0.35, 0.35])
    for (const z of [-0.4, 0.4]) {
      const wheel = cylinder(
        van,
        0.16,
        0.16,
        0.12,
        matte("#14263a"),
        x,
        0.32,
        z,
        12,
      );
      wheel.rotation.z = Math.PI / 2;
    }
  van.position.set(5.5, 0, -1);

  scene.add(new THREE.HemisphereLight("#effaff", "#9fae9b", 2.8));
  const sun = new THREE.DirectionalLight("#fff3dc", 3.8);
  sun.position.set(-8, 17, 12);
  sun.castShadow = true;
  sun.shadow.mapSize.set(compact ? 1024 : 2048, compact ? 1024 : 2048);
  sun.shadow.camera.left = -19;
  sun.shadow.camera.right = 19;
  sun.shadow.camera.top = 19;
  sun.shadow.camera.bottom = -19;
  sun.shadow.camera.far = 65;
  sun.shadow.normalBias = 0.05;
  sun.shadow.bias = -0.00015;
  scene.add(sun);
  const rim = new THREE.DirectionalLight("#d2edff", 2.4);
  rim.position.set(8, 10, -10);
  scene.add(rim);
  const front = new THREE.DirectionalLight("#ffffff", 1.4);
  front.position.set(5, 6, 15);
  scene.add(front);

  batchStatic(town);
  batchStatic(gantry);

  const dispose = () => {
    const geometries = new Set<THREE.BufferGeometry>(),
      usedMaterials = new Set<THREE.Material>();
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
        geometries.add(object.geometry);
        (Array.isArray(object.material)
          ? object.material
          : [object.material]
        ).forEach((m) => usedMaterials.add(m));
      }
    });
    geometries.forEach((g) => g.dispose());
    usedMaterials.forEach((m) => m.dispose());
    sun.shadow.map?.dispose();
    scene.clear();
  };
  return {
    scene,
    town,
    gantry,
    rocket,
    exhaust,
    flame,
    smoke,
    clouds,
    engineLight,
    van,
    dispose,
  };
}

export function updateLaunchWorld(
  world: LaunchWorld,
  pose: FlightPose,
  time: number,
) {
  world.rocket.position.y = REST_HEIGHT + pose.lift;
  // No physical sway at rest, and no drift in the scroll-driven vertical position.
  world.rocket.rotation.z =
    Math.sin(time * 0.7) * 0.012 * Math.min(1, pose.lift / 10);
  world.exhaust.visible = pose.ignition > 0.005;
  world.exhaust.scale.set(
    1,
    pose.ignition * (1 + Math.sin(time * 23) * 0.025),
    1,
  );
  world.engineLight.intensity = pose.ignition * (105 + Math.sin(time * 19) * 7);
  world.flame.forEach((object, i) => {
    const width = (1 - i * 0.22) * (1 + Math.sin(time * 17 + i) * 0.04);
    object.scale.x = width;
    object.scale.z = width;
  });
  world.smoke.visible = pose.smoke > 0.005;
  if (world.smoke.visible) {
    (world.smoke.material as THREE.MeshStandardMaterial).opacity =
      0.76 * pose.smoke;
    for (let i = 0; i < world.smoke.count; i++) {
      const angle = i * 2.399 + Math.sin(time * 0.16 + i) * 0.04;
      const expansion = pose.smoke * (1.3 + seed(i + 17) * 4.2);
      dummy.position.set(
        Math.sin(angle) * expansion,
        0.28 + seed(i + 33) * 0.8 + Math.sin(time * 0.65 + i) * 0.06,
        Math.cos(angle) * expansion,
      );
      const size = (0.36 + seed(i + 51) * 0.76) * pose.smoke;
      dummy.scale.set(size * 1.3, size * 0.8, size);
      dummy.rotation.set(i, angle, 0);
      dummy.updateMatrix();
      world.smoke.setMatrixAt(i, dummy.matrix);
    }
    world.smoke.instanceMatrix.needsUpdate = true;
  }
  world.clouds.position.x = Math.sin(time * 0.025) * 0.65;
  world.van.position.z = Math.sin(time * 0.07) * 3;
  world.van.rotation.y = Math.cos(time * 0.07) >= 0 ? 0 : Math.PI;
  world.scene.updateMatrixWorld(true);
}

/** Reserve the left side for copy; on narrow screens place the model below it. */
export function frameLaunchCamera(
  camera: THREE.PerspectiveCamera,
  pose: FlightPose,
  width: number,
  height: number,
  centered = false,
) {
  const aspect = Math.max(1, width) / Math.max(1, height),
    mobile = aspect < 0.9;
  camera.aspect = aspect;
  camera.fov = 39;
  const distance = pose.distance * (mobile && !centered ? 1.48 : 1);
  camera.position.set(
    Math.sin(pose.orbit) * distance,
    pose.lift + pose.lookHeight + pose.elevation,
    Math.cos(pose.orbit) * distance,
  );
  camera.lookAt(0, pose.lift + pose.lookHeight, 0);
  if (centered) camera.clearViewOffset();
  else
    camera.setViewOffset(
      width,
      height,
      -width * (mobile ? 0.07 : 0.2),
      -height * (mobile ? 0.23 : 0.01),
      width,
      height,
    );
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld(true);
}
