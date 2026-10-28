import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { TessellateModifier } from "three/addons/modifiers/TessellateModifier.js";
import type { FlightPose } from "./launch-motion.ts";
import { smoothRange } from "./launch-motion.ts";
import { createSkyLandmarks, updateSkyLandmarks } from "./launch-landmarks.ts";
import type { SkyLandmarks } from "./launch-landmarks.ts";
import { createCinema, updateCinema } from "./launch-cinema.ts";
import type { Cinema, Storefront } from "./launch-cinema.ts";
import { REST_HEIGHT } from "./launch-motion.ts";
import { createSkyDome, createSkyState, sampleSky, updateSkyDome } from "./launch-sky.ts";
import type { SkyState } from "./launch-sky.ts";
import { commitParticles, createGlowTexture, createParticles, createPuffTexture, setParticle } from "./launch-particles.ts";
import type { Particles } from "./launch-particles.ts";
import { createCountryside, updateCountryside } from "./launch-land.ts";
import type { Countryside } from "./launch-land.ts";
import { createMoonWorld, updateMoonWorld } from "./launch-moon.ts";
import type { MoonWorld } from "./launch-moon.ts";
import { sculpt } from "./scene-sculpt.ts";

export { REST_HEIGHT } from "./launch-motion.ts";

interface Walker { from: THREE.Vector2; to: THREE.Vector2; phase: number; speed: number; }

export interface LaunchWorld {
  scene: THREE.Scene;
  town: THREE.Group;
  gantry: THREE.Group;
  rocket: THREE.Group;
  exhaust: THREE.Group;
  flame: THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>[];
  smoke: Particles;
  clouds: Particles;
  landmarks: SkyLandmarks;
  cinema: Cinema;
  townWindows: THREE.MeshStandardMaterial;
  engineLight: THREE.PointLight;
  van: THREE.Group;
  sky: THREE.Mesh;
  skyState: SkyState;
  land: Countryside;
  lights: {
    hemisphere: THREE.HemisphereLight;
    sun: THREE.DirectionalLight;
    rim: THREE.DirectionalLight;
    fill: THREE.DirectionalLight;
  };
  glows: { nozzle: Particles; lamps: Particles; pools: THREE.InstancedMesh; pad: THREE.Mesh };
  people: { bodies: THREE.InstancedMesh; heads: THREE.InstancedMesh; walkers: Walker[] };
  moon: MoonWorld;
  legs: { struts: THREE.InstancedMesh; feet: THREE.InstancedMesh; hinges: THREE.Vector3[] };
  dispose: () => void;
}

const up = new THREE.Vector3(0, 1, 0);
const dummy = new THREE.Object3D();
const direction = new THREE.Vector3();
const nozzle = new THREE.Vector3();
const euler = new THREE.Euler();
const foot = new THREE.Vector3();
const downward = new THREE.Vector3(0, -1, 0);
const lunarDust = new THREE.Color().setRGB(0.6, 0.58, 0.55);
const lunarShadow = new THREE.Color().setRGB(0.11, 0.11, 0.12);
const morningWindow = new THREE.Color("#cfe6f2");
const connectedWindow = new THREE.Color("#ffc574");
const coolGlow = new THREE.Color("#e6f7ff");
const warmGlow = new THREE.Color("#ffb75e");
const cloudWhite = new THREE.Color("#eef5fb");
const scratch = new THREE.Color();
const scratchB = new THREE.Color();
const engineColor = new THREE.Color("#ff9540");
const nightColor = new THREE.Color("#ffb468");
const seed = (n: number) => {
  const value = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
};

/** Camera height for a pose; matches frameLaunchCamera so the cloud haze lines up with the deck. */
const cameraHeight = (pose: FlightPose) => pose.lift + pose.lookHeight + pose.elevation;
const CLOUD_DECK = 33;

/**
 * Batch the static town by material: hundreds of details, a few draw calls.
 * Plain painted surfaces share one vertex-coloured material, so new colours cost no extra draws.
 */
function batchStatic(group: THREE.Group, painted: THREE.MeshStandardMaterial) {
  group.updateMatrixWorld(true);
  const inverse = group.matrixWorld.clone().invert();
  const batches = new Map<THREE.Material, THREE.BufferGeometry[]>();
  const originals = new Set<THREE.BufferGeometry>();
  const retired = new Set<THREE.Material>();
  group.traverse((object) => {
    if (!(object instanceof THREE.Mesh) || Array.isArray(object.material))
      return;
    let geometry = object.geometry.clone();
    geometry.applyMatrix4(inverse.clone().multiply(object.matrixWorld));
    let material: THREE.Material = object.material;
    if (material.userData.matte) {
      if (geometry.index) {
        const flat = geometry.toNonIndexed();
        geometry.dispose();
        geometry = flat;
      }
      const color = (material as THREE.MeshStandardMaterial).color;
      const colors = new Float32Array(geometry.getAttribute("position").count * 3);
      for (let i = 0; i < colors.length; i += 3) color.toArray(colors, i);
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      retired.add(material);
      material = painted;
    }
    const list = batches.get(material) ?? [];
    list.push(geometry);
    batches.set(material, list);
    originals.add(object.geometry);
  });
  group.clear();
  retired.forEach((material) => material.dispose());
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
  scene.fog = new THREE.FogExp2("#f1d9bd", 0.0105);
  const skyState = sampleSky(0, createSkyState());
  const town = new THREE.Group();
  town.name = "hometown";
  const gantry = new THREE.Group();
  gantry.name = "stationary-launch-gantry";
  const rocket = new THREE.Group();
  rocket.name = "hb-water-tower-rocket";
  rocket.position.y = REST_HEIGHT;
  scene.add(town, gantry, rocket);
  const puffTexture = createPuffTexture(compact ? 64 : 128, 1);
  const cloudTexture = createPuffTexture(compact ? 64 : 128, 7);
  const glowTexture = createGlowTexture(64);

  const materials = new Map<string, THREE.MeshStandardMaterial>();
  const matte = (color: string) => {
    if (!materials.has(color)) {
      const material = new THREE.MeshStandardMaterial({ color, roughness: 0.8 });
      material.userData.matte = true;
      materials.set(color, material);
    }
    return materials.get(color)!;
  };
  const painted = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.8,
    envMapIntensity: 0.75,
  });
  const navy = new THREE.MeshPhysicalMaterial({
    color: "#15457d",
    metalness: 0.28,
    roughness: 0.2,
    clearcoat: 1,
    clearcoatRoughness: 0.14,
  });
  const ivory = new THREE.MeshStandardMaterial({
    color: "#fffaf0",
    metalness: 0.18,
    roughness: 0.3,
  });
  const steel = new THREE.MeshStandardMaterial({
    color: "#4f6f8c",
    metalness: 0.6,
    roughness: 0.34,
  });
  const orange = new THREE.MeshStandardMaterial({
    color: "#ff8a32",
    roughness: 0.42,
    metalness: 0.12,
  });
  const windowLight = new THREE.MeshStandardMaterial({
    color: "#cfe6f2",
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
  // The lawn sits flush with the surrounding farmland; streets run on out of town.
  cylinder(town, 20, 19.2, 0.7, matte("#7d9a5e"), 0, -0.48, 0, 80);
  cylinder(town, 20.1, 20, 0.12, matte("#87a85c"), 0, -0.07, 0, 80);
  box(town, 39, 0.05, 2.2, matte("#5d6670"), 0, 0.015, 5.5);
  box(town, 39, 0.05, 2.2, matte("#5d6670"), 0, 0.016, -5.5);
  box(town, 2.2, 0.05, 39, matte("#5d6670"), -5.5, 0.017, 0);
  box(town, 2.2, 0.05, 39, matte("#5d6670"), 5.5, 0.018, 0);
  for (const z of [-6.65, -4.35, 4.35, 6.65])
    box(town, 31, 0.09, 0.17, matte("#e9e1d1"), 0, 0.02, z);
  for (const x of [-6.65, -4.35, 4.35, 6.65])
    box(town, 0.17, 0.09, 25, matte("#e9e1d1"), x, 0.02, 0);
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

  cylinder(town, 3.65, 3.85, 0.18, matte("#e3d6c1"), 0, 0.07, 0, 64);
  cylinder(town, 3.2, 3.2, 0.05, matte("#c9b48f"), 0, 0.18, 0, 64);
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

  const shopFronts: Storefront[] = [];
  const businesses: THREE.Vector3[] = [];
  const shop = (
    x: number,
    z: number,
    height: number,
    width: number,
    color: string,
    rotation = 0,
    pitched = false,
    index = 0,
  ) => {
    const building = new THREE.Group();
    building.position.set(x, 0.08, z);
    building.rotation.y = rotation;
    town.add(building);
    box(building, width + 0.3, 0.12, 2.95, matte("#e6dccb"), 0, 0.01, 0);
    box(building, width, height, 2.5, matte(color), 0, height / 2, 0, 0.06);
    box(
      building,
      width + 0.18,
      0.2,
      2.68,
      matte("#22406a"),
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
        matte(index % 2 ? "#8a4b3c" : "#35517a"),
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
    shopFronts.push({
      position: new THREE.Vector3(-width * 0.2, 1.06, front + 0.1)
        .applyAxisAngle(up, rotation).add(new THREE.Vector3(x, 0, z)),
      rotation, width: width * 0.46,
    });
    businesses.push(new THREE.Vector3(width * 0.26, 0.24, front + 0.25)
      .applyAxisAngle(up, rotation).add(new THREE.Vector3(x, 0, z)));
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
    // Generic hanging blade signs; no real client names or logos.
    if (!pitched && index % 3 !== 2) {
      const signColors = ["#ff8a32", "#1f4f7a", "#f3e6cc", "#3f7d6a"];
      const sx = -width / 2 + 0.16;
      box(building, 0.05, 0.06, 0.5, steel, sx, height - 0.55, front + 0.27, 0);
      box(building, 0.07, 0.48, 0.44, matte(signColors[index % 4]), sx, height - 0.86, front + 0.33);
      for (const side of [-1, 1]) {
        const disc = cylinder(building, 0.12, 0.12, 0.02, index % 4 === 2 ? orange : ivory,
          sx + side * 0.045, height - 0.86, front + 0.33, 16);
        disc.rotation.z = Math.PI / 2;
      }
    }
    if (index === 1) {
      // A striped barber pole beside one door.
      for (let i = 0; i < 6; i++)
        cylinder(building, 0.075, 0.075, 0.1, matte(i % 2 ? "#ffffff" : "#d23b2e"),
          width / 2 - 0.16, 0.95 + i * 0.1, front + 0.13, 12);
      cylinder(building, 0.095, 0.095, 0.05, matte("#1f3d63"), width / 2 - 0.16, 0.88, front + 0.13, 12);
      cylinder(building, 0.095, 0.095, 0.05, matte("#1f3d63"), width / 2 - 0.16, 1.57, front + 0.13, 12);
    }
  };
  const shopColors = ["#c65b3f", "#f0dcb3", "#93b78e", "#eec36b", "#7ea6c8", "#d98a66"];
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
      shopColors[i % shopColors.length],
      z > 5
        ? Math.PI
        : x < -6 && Math.abs(z) < 4
          ? Math.PI / 2
          : x > 6 && Math.abs(z) < 4
            ? -Math.PI / 2
            : 0,
      i > 9,
      i,
    ),
  );

  const foliageGeometry = new THREE.IcosahedronGeometry(1, 2);
  for (let i = 0; i < 32; i++) {
    const angle = (i / 32) * Math.PI * 2;
    const radius = 14 + seed(i) * 3.3;
    const x = Math.sin(angle) * radius,
      z = Math.cos(angle) * radius;
    const height = 1.25 + seed(i + 90) * 1.05;
    cylinder(town, 0.09, 0.12, 1.2, matte("#6b5443"), x, 0.6, z, 6);
    const crown = mesh(
      foliageGeometry,
      matte(i % 3 === 0 ? "#7aa95c" : i % 2 ? "#6c9e57" : "#4c8449"),
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
      cylinder(town, 0.09, 0.14, 0.6, matte("#6b5443"), x, 0.3, z, 6);
      const crown = mesh(foliageGeometry, matte("#6c9e57"), town, x, 1.15, z);
      crown.scale.set(0.65, 0.85, 0.65);
    }
  const lampHeads: THREE.Vector3[] = [];
  for (const x of [-6.9, 6.9])
    for (const z of [-8, -2.5, 2.5, 8]) {
      const reach = Math.sign(x) * -1;
      cylinder(town, 0.04, 0.07, 2.6, steel, x, 1.3, z, 8);
      box(town, 0.46, 0.06, 0.12, steel, x + reach * 0.18, 2.61, z);
      box(town, 0.27, 0.07, 0.2, windowLight, x + reach * 0.32, 2.57, z);
      lampHeads.push(new THREE.Vector3(x + reach * 0.32, 2.5, z));
    }
  // Festive bunting strung across the two main streets beside the square.
  const flagShape = new THREE.Shape();
  flagShape.moveTo(-0.11, 0);
  flagShape.lineTo(0.11, 0);
  flagShape.lineTo(0, -0.27);
  flagShape.closePath();
  const flagGeometry = new THREE.ExtrudeGeometry(flagShape, { depth: 0.018, bevelEnabled: false });
  const flagColors = ["#ff8a32", "#fff3df", "#1f4f7a", "#f2c14e", "#3f7d6a"];
  for (const sideX of [-1, 1])
    for (const z of [-2.5, 2.5]) {
      const outer = new THREE.Vector3(sideX * 6.9, 2.45, z);
      const inner = new THREE.Vector3(sideX * 4.15, 2.45, z);
      cylinder(town, 0.035, 0.05, 2.5, steel, inner.x, 1.25, inner.z, 8);
      const middle = outer.clone().lerp(inner, 0.5).setY(2.22);
      rod(town, outer.toArray(), middle.toArray(), 0.012, steel);
      rod(town, middle.toArray(), inner.toArray(), 0.012, steel);
      for (let i = 1; i < 8; i++) {
        const t = i / 8;
        const point = t < 0.5
          ? outer.clone().lerp(middle, t * 2)
          : middle.clone().lerp(inner, (t - 0.5) * 2);
        mesh(flagGeometry, matte(flagColors[(i + (z > 0 ? 2 : 0)) % flagColors.length]),
          town, point.x, point.y - 0.01, point.z - 0.009);
      }
    }
  // A few parked cars along the curbs.
  const cars: [number, number, number, string][] = [
    [6.2, -9.6, 0, "#d94f3d"], [6.2, 8.9, 0, "#2f6fa8"], [-6.2, -8.7, 0, "#f2c14e"],
    [-6.2, 9.6, 0, "#e9e4d8"], [-10.2, 6.2, Math.PI / 2, "#4f8a5b"], [9.6, -6.2, Math.PI / 2, "#7b5ea7"],
  ];
  for (const [x, z, turn, paint] of cars) {
    const car = new THREE.Group();
    car.position.set(x, 0.05, z);
    car.rotation.y = turn;
    town.add(car);
    box(car, 0.62, 0.3, 1.18, matte(paint), 0, 0.3, 0, 0.08);
    box(car, 0.54, 0.25, 0.64, matte("#bcd3e1"), 0, 0.55, -0.06, 0.07);
    for (const wx of [-0.3, 0.3])
      for (const wz of [-0.38, 0.38]) {
        const wheel = cylinder(car, 0.13, 0.13, 0.1, matte("#1b2431"), wx, 0.14, wz, 10);
        wheel.rotation.z = Math.PI / 2;
      }
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
  batchStatic(rocket, painted);

  const exhaust = new THREE.Group();
  exhaust.name = "engine-exhaust";
  exhaust.position.y = -0.95;
  rocket.add(exhaust);
  const profile = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, -6.4, 0),
    new THREE.Vector3(0.2, -4.7, 0),
    new THREE.Vector3(0.5, -2.8, 0),
    new THREE.Vector3(0.66, -1.05, 0),
    new THREE.Vector3(0.38, 0, 0),
  ])
    .getPoints(30)
    .map((p) => new THREE.Vector2(Math.max(0, p.x), p.y));
  const flameGeometry = new THREE.LatheGeometry(profile, compact ? 20 : 32);
  const flame = [0, 1].map((core) => {
    const material = new THREE.ShaderMaterial({
      name: core ? "flame-core" : "flame",
      uniforms: {
        uTime: { value: 0 },
        uIgnition: { value: 0 },
        uCore: { value: core },
        uHot: { value: new THREE.Color("#fff6d8") },
        uMid: { value: new THREE.Color(core ? "#ffd36a" : "#ffb23c") },
        uEdge: { value: new THREE.Color(core ? "#ff9b3d" : "#ff5a1c") },
      },
      vertexShader: flameVertex,
      fragmentShader: flameFragment,
      transparent: true,
      depthWrite: false,
      blending: THREE.CustomBlending,
      blendSrc: THREE.OneFactor,
      blendDst: THREE.OneMinusSrcAlphaFactor,
      blendSrcAlpha: THREE.OneFactor,
      blendDstAlpha: THREE.OneMinusSrcAlphaFactor,
    });
    const object = new THREE.Mesh(flameGeometry, material);
    object.name = core ? "flame-core" : "flame-body";
    if (core) object.scale.set(0.52, 0.7, 0.52);
    object.renderOrder = 6 + core;
    exhaust.add(object);
    return object;
  });
  const engineLight = new THREE.PointLight("#ff9540", 0, 18, 2);
  engineLight.position.set(0, -1.2, 0);
  rocket.add(engineLight);

  // Landing legs fold out from under the tank for the moon touchdown.
  const hinges = [0, 1, 2, 3].map((i) => {
    const angle = Math.PI / 4 + (i * Math.PI) / 2;
    return new THREE.Vector3(Math.sin(angle) * 1.3, 0.28, Math.cos(angle) * 1.3);
  });
  const struts = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.07, 0.09, 1, 8).translate(0, -0.5, 0), steel, 4);
  struts.name = "landing-legs";
  const footpads = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.26, 0.32, 0.08, 14), ivory, 4);
  footpads.name = "landing-feet";
  for (const part of [struts, footpads]) {
    part.castShadow = true;
    part.frustumCulled = false;
    part.visible = false;
    part.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    rocket.add(part);
  }

  const nozzleGlow = createParticles({ name: "engine-glow", count: 1, map: glowTexture, additive: true, renderOrder: 8 });
  nozzleGlow.material.uniforms.uLit.value.set("#ffb45c");
  nozzleGlow.material.uniforms.uShade.value.set("#ff8a3a");
  scene.add(nozzleGlow);
  const padGlow = new THREE.Mesh(
    new THREE.PlaneGeometry(13, 13).rotateX(-Math.PI / 2),
    new THREE.MeshBasicMaterial({
      map: glowTexture, color: "#ff8a3a", transparent: true, opacity: 0,
      blending: THREE.AdditiveBlending, depthWrite: false,
    }),
  );
  padGlow.name = "flame-light-on-the-square";
  padGlow.position.y = 0.26;
  padGlow.renderOrder = 4;
  scene.add(padGlow);

  const smoke = createParticles({ name: "launch-pad-smoke", count: compact ? 38 : 66, map: puffTexture, renderOrder: 5 });
  smoke.visible = false;
  scene.add(smoke);

  // Scattered cumulus rather than a solid sheet, so the farmland shows between the clouds.
  const clouds = createParticles({ name: "altitude-clouds", count: compact ? 44 : 78, map: cloudTexture, renderOrder: 1 });
  clouds.material.uniforms.uNearFade.value.set(2.5, 11);
  const puffsPerCloud = 3;
  const cloudLayout = Array.from({ length: clouds.count }, (_, i) => {
    const group = Math.floor(i / puffsPerCloud), part = i % puffsPerCloud;
    const deck = group < (clouds.count / puffsPerCloud) * 0.72;
    const angle = group * 2.399;
    const radius = deck ? 5 + seed(group + 30) * 34 : 12 + seed(group + 30) * 30;
    const size = deck ? 5 + seed(group + 200) * 5.5 : 3 + seed(group + 200) * 3.5;
    return {
      x: Math.sin(angle) * radius + (part - 1) * size * 0.55,
      y: (deck ? CLOUD_DECK - 1.2 + seed(group + 12) * 2.6 : 14 + seed(group + 12) * 12) + (part === 1 ? size * 0.22 : 0),
      z: Math.cos(angle) * radius - 6 + (seed(i + 77) - 0.5) * size * 0.5,
      size: size * (part === 1 ? 1.15 : 0.85),
      alpha: deck ? 0.78 + seed(i + 300) * 0.18 : 0.62 + seed(i + 300) * 0.25,
      rotation: seed(i + 400) * Math.PI * 2,
    };
  });
  scene.add(clouds);

  const landmarks = createSkyLandmarks(compact);
  scene.add(landmarks.root);
  const cinema = createCinema(compact, shopFronts, businesses, landmarks.satellite, puffTexture);
  scene.add(cinema.root);

  const vanModel = sculpt(new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.45, metalness: 0.1 }), compact);
  vanModel.box(0.68, 0.58, 1.35, "#fffaf0", 0, 0.63, 0);
  vanModel.box(0.64, 0.2, 0.43, "#a9c6d8", 0, 0.84, 0.31);
  vanModel.box(0.69, 0.09, 0.48, "#ff8a32", 0, 0.65, -0.15);
  for (const x of [-0.35, 0.35])
    for (const z of [-0.4, 0.4])
      vanModel.add(new THREE.CylinderGeometry(0.16, 0.16, 0.12, 12), "#14263a", [x, 0.32, z], [1, 1, 1], [0, 0, Math.PI / 2]);
  const van = vanModel.finish("local-service-van");
  van.children[0].castShadow = true;
  van.position.set(5.5, 0, -1);
  scene.add(van);

  // Neighbours walking the sidewalks, as two instanced draws.
  const walks: [number, number, number, number][] = [
    [-12.4, -6.95, -7.3, -6.95], [-3.7, -6.95, 3.7, -6.95], [7.3, -6.95, 12.4, -6.95],
    [-12.2, 7.1, -7.3, 7.1], [-3.7, 7.1, 3.7, 7.1], [7.3, 7.1, 12.2, 7.1],
    [-7.1, -3.7, -7.1, 3.7], [7.1, -3.7, 7.1, 3.7],
    [-3.6, 3.98, 3.6, 3.98], [-3.98, -3.6, -3.98, 3.6], [3.98, -3.6, 3.98, 3.6], [-3.6, -3.98, 3.6, -3.98],
  ];
  const walkerCount = compact ? 8 : 14;
  const walkers: Walker[] = Array.from({ length: walkerCount }, (_, i) => {
    const [ax, az, bx, bz] = walks[(i * 5) % walks.length];
    return { from: new THREE.Vector2(ax, az), to: new THREE.Vector2(bx, bz), phase: seed(i + 60) * Math.PI * 2, speed: 0.22 + seed(i + 61) * 0.22 };
  });
  const bodyParts = [
    new THREE.CylinderGeometry(0.115, 0.14, 0.44, 8).translate(0, 0.6, 0),
    new THREE.BoxGeometry(0.2, 0.38, 0.13).translate(0, 0.19, 0),
  ].map((geometry, part) => {
    const flat = geometry.toNonIndexed();
    geometry.dispose();
    const shade = part ? 0.42 : 1, colors = new Float32Array(flat.getAttribute("position").count * 3).fill(shade);
    flat.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return flat;
  });
  const bodies = new THREE.InstancedMesh(mergeGeometries(bodyParts)!,
    new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.7 }), walkerCount);
  bodyParts.forEach(part => part.dispose());
  bodies.name = "neighbours";
  const heads = new THREE.InstancedMesh(new THREE.SphereGeometry(0.1, 10, 8).translate(0, 0.94, 0),
    new THREE.MeshStandardMaterial({ roughness: 0.6 }), walkerCount);
  heads.name = "neighbour-heads";
  const shirts = ["#ff8a32", "#2f6fa8", "#3f7d6a", "#d94f3d", "#f2c14e", "#7b5ea7", "#ffffff"];
  const skins = ["#f1c7a5", "#d9a37c", "#a8714f", "#7d4f35"];
  for (let i = 0; i < walkerCount; i++) {
    bodies.setColorAt(i, scratch.set(shirts[i % shirts.length]));
    heads.setColorAt(i, scratch.set(skins[(i * 3) % skins.length]));
  }
  for (const crowd of [bodies, heads]) {
    crowd.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    crowd.castShadow = true;
    crowd.frustumCulled = false;
    scene.add(crowd);
  }

  // Street and square lights come on as the sun sets.
  const plazaLights = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * Math.PI * 2;
    return new THREE.Vector3(Math.sin(angle) * 3.4, 0.26, Math.cos(angle) * 3.4);
  });
  const lamps = createParticles({ name: "lamp-glows", count: lampHeads.length + plazaLights.length, map: glowTexture, additive: true, renderOrder: 7 });
  lamps.material.uniforms.uLit.value.set("#ffd28f");
  lamps.material.uniforms.uShade.value.set("#ffb45c");
  [...lampHeads, ...plazaLights].forEach((point, i) =>
    setParticle(lamps, i, point.x, point.y, point.z, i < lampHeads.length ? 1.5 : 0.7, 0));
  commitParticles(lamps);
  scene.add(lamps);
  const pools = new THREE.InstancedMesh(
    new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2),
    new THREE.MeshBasicMaterial({
      map: glowTexture, color: "#ffb05a", transparent: true, opacity: 0,
      blending: THREE.AdditiveBlending, depthWrite: false,
    }),
    lampHeads.length,
  );
  pools.name = "street-light-pools";
  lampHeads.forEach((point, i) => {
    dummy.position.set(point.x, 0.07, point.z);
    dummy.rotation.set(0, 0, 0);
    dummy.scale.setScalar(4.2);
    dummy.updateMatrix();
    pools.setMatrixAt(i, dummy.matrix);
  });
  pools.renderOrder = 4;
  scene.add(pools);

  const hemisphere = new THREE.HemisphereLight("#bcd6ef", "#c7a27d", 1);
  scene.add(hemisphere);
  const sun = new THREE.DirectionalLight("#ffc98c", 3.3);
  sun.castShadow = true;
  sun.shadow.mapSize.set(compact ? 1024 : 2048, compact ? 1024 : 2048);
  sun.shadow.camera.left = -21;
  sun.shadow.camera.right = 21;
  sun.shadow.camera.top = 21;
  sun.shadow.camera.bottom = -21;
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 110;
  sun.shadow.normalBias = 0.05;
  sun.shadow.bias = -0.00015;
  scene.add(sun);
  const rim = new THREE.DirectionalLight("#ffd9a8", 1.1);
  scene.add(rim);
  const fill = new THREE.DirectionalLight("#ffffff", 0.35);
  fill.position.set(5, 6, 15);
  scene.add(fill);

  const land = createCountryside(compact);
  scene.add(land.root);
  const moon = createMoonWorld(compact);
  scene.add(moon.root);
  const sky = createSkyDome();
  scene.add(sky);

  batchStatic(town, painted);
  batchStatic(gantry, painted);

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
    [puffTexture, cloudTexture, glowTexture].forEach((texture) => texture.dispose());
    sun.shadow.map?.dispose();
    scene.clear();
  };
  const world: LaunchWorld = {
    scene,
    town,
    gantry,
    rocket,
    exhaust,
    flame,
    smoke,
    clouds,
    landmarks,
    cinema,
    townWindows: windowLight,
    engineLight,
    van,
    sky,
    skyState,
    land,
    lights: { hemisphere, sun, rim, fill },
    glows: { nozzle: nozzleGlow, lamps, pools, pad: padGlow },
    people: { bodies, heads, walkers },
    moon,
    legs: { struts, feet: footpads, hinges },
    dispose,
  };
  cloudPlacement.set(world, cloudLayout);
  return world;
}

const cloudPlacement = new WeakMap<LaunchWorld, { x: number; y: number; z: number; size: number; alpha: number; rotation: number }[]>();

const flameVertex = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vNormalView;
  varying vec3 vViewPosition;
  void main() {
    vUv = uv;
    vec3 p = position;
    float tail = clamp(-p.y / 6.4, 0.0, 1.0);
    p.x += sin(uTime * 23.0 + p.y * 3.1) * 0.06 * tail;
    p.z += cos(uTime * 19.0 + p.y * 2.7) * 0.06 * tail;
    vec4 view = modelViewMatrix * vec4(p, 1.0);
    vViewPosition = -view.xyz;
    vNormalView = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * view;
  }
`;

const flameFragment = /* glsl */ `
  uniform float uTime;
  uniform float uIgnition;
  uniform float uCore;
  uniform vec3 uHot;
  uniform vec3 uMid;
  uniform vec3 uEdge;
  varying vec2 vUv;
  varying vec3 vNormalView;
  varying vec3 vViewPosition;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
  }
  void main() {
    float along = 1.0 - vUv.y;
    float facing = abs(dot(normalize(vNormalView), normalize(vViewPosition)));
    float n = noise(vec2(vUv.x * 7.0, along * 6.0 - uTime * 8.0)) * 0.6
      + noise(vec2(vUv.x * 15.0, along * 13.0 - uTime * 14.0)) * 0.4;
    float body = smoothstep(0.04, 0.55, facing);
    float tip = 1.0 - smoothstep(0.2, 1.0, along + (n - 0.5) * 0.5);
    vec3 color = mix(uMid, uEdge, smoothstep(0.05, 0.75, along + (1.0 - facing) * 0.35));
    color = mix(color, uHot, (1.0 - smoothstep(0.0, 0.55, along)) * pow(facing, 2.0) * (0.55 + uCore * 0.45));
    float alpha = body * tip * uIgnition * (0.7 + n * 0.45);
    gl_FragColor = vec4(color * (1.25 + uCore * 0.9), 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
    gl_FragColor = vec4(gl_FragColor.rgb * alpha, alpha * (1.0 - uCore) * 0.9);
  }
`;

export function updateLaunchWorld(
  world: LaunchWorld,
  pose: FlightPose,
  time: number,
  portrait = false,
) {
  const sky = sampleSky(pose.progress, world.skyState);
  const night = sky.nightLights;
  // The hometown and the moon share the same spot; only one of them is ever shown.
  const onMoon = pose.moon >= 0.5;
  world.moon.root.visible = onMoon;
  for (const home of [world.town, world.gantry, world.land.root, world.landmarks.root, world.cinema.root,
    world.clouds, world.van, world.people.bodies, world.people.heads]) home.visible = !onMoon;
  if (onMoon) updateMoonWorld(world.moon, sky, pose.network, time);
  const { struts, feet, hinges } = world.legs;
  struts.visible = feet.visible = pose.legs > 0.01;
  if (struts.visible) {
    hinges.forEach((hinge, i) => {
      foot.set(hinge.x * 2, -REST_HEIGHT + 0.06, hinge.z * 2);
      direction.subVectors(foot, hinge);
      const length = direction.length();
      direction.normalize();
      dummy.position.copy(hinge);
      dummy.quaternion.setFromUnitVectors(downward, direction);
      dummy.scale.set(1, length * pose.legs, 1);
      dummy.updateMatrix();
      struts.setMatrixAt(i, dummy.matrix);
      dummy.position.copy(hinge).addScaledVector(direction, length * pose.legs);
      dummy.quaternion.identity();
      dummy.scale.setScalar(Math.min(1, pose.legs * 1.5));
      dummy.updateMatrix();
      feet.setMatrixAt(i, dummy.matrix);
    });
    struts.instanceMatrix.needsUpdate = true;
    feet.instanceMatrix.needsUpdate = true;
  }
  updateSkyLandmarks(world.landmarks, pose.lift, time, portrait);
  updateCinema(world.cinema, pose, time);
  world.rocket.position.set(pose.x, REST_HEIGHT + pose.lift, pose.z);
  world.rocket.rotation.set(pose.pitch, 0,
    pose.bank + Math.sin(time * 0.7) * 0.009 * Math.min(1, pose.lift / 10));

  // Time of day: sky, haze, and the light rig all come from one sampled state.
  const deck = 1 - smoothRange(0, 4.5, Math.abs(cameraHeight(pose) - CLOUD_DECK));
  const haze = Math.max(deck * (1 - pose.overlook), pose.cloud * 0.2);
  const fog = world.scene.fog as THREE.FogExp2;
  fog.color.copy(sky.fog).lerp(cloudWhite, haze * 0.7);
  fog.density = sky.fogDensity + haze * 0.016;
  updateSkyDome(world.sky, sky, time);
  updateCountryside(world.land, sky);
  world.scene.environmentIntensity = sky.reflections;
  const { hemisphere, sun, rim, fill } = world.lights;
  hemisphere.color.copy(sky.skyLight);
  hemisphere.groundColor.copy(sky.groundLight);
  hemisphere.intensity = sky.ambient;
  sun.color.copy(sky.sun);
  sun.intensity = sky.sunIntensity;
  // Shadows keep a sensible angle even while the visible sun sits on the horizon.
  direction.copy(sky.sunDirection);
  direction.y = Math.max(direction.y, 0.24);
  sun.position.copy(direction.normalize()).multiplyScalar(48);
  rim.color.copy(sky.rimColor);
  rim.intensity = sky.rim;
  rim.position.set(-sky.sunDirection.x * 30, 22, -sky.sunDirection.z * 30);
  fill.color.copy(sky.skyLight);
  fill.intensity = 0.3 + night * 0.15;

  world.exhaust.visible = pose.ignition > 0.005;
  world.exhaust.scale.set(
    1,
    pose.ignition * (1 + Math.sin(time * 23) * 0.025),
    1,
  );
  world.flame.forEach((object, i) => {
    object.material.uniforms.uTime.value = time;
    object.material.uniforms.uIgnition.value = pose.ignition;
    const width = (i ? 0.52 : 1) * (1 + Math.sin(time * 17 + i) * 0.04);
    object.scale.x = width;
    object.scale.z = width;
  });
  const grounded = 1 - smoothRange(0.5, 10, pose.lift);
  world.engineLight.intensity = pose.ignition * (95 + Math.sin(time * 19) * 9)
    + night * (1 - pose.ignition) * 14;
  world.engineLight.color.copy(pose.ignition > 0.2 ? engineColor : nightColor);

  nozzle.set(0, -1.3, 0).applyEuler(euler.set(pose.pitch, 0, pose.bank)).add(world.rocket.position);
  setParticle(world.glows.nozzle, 0, nozzle.x, nozzle.y, nozzle.z,
    5.2 * pose.ignition * (1 + Math.sin(time * 21) * 0.06), 0.85 * pose.ignition);
  commitParticles(world.glows.nozzle);
  world.glows.nozzle.visible = pose.ignition > 0.005;
  const padMaterial = world.glows.pad.material as THREE.MeshBasicMaterial;
  padMaterial.opacity = Math.min(1, pose.ignition * grounded * (0.85 + Math.sin(time * 19) * 0.08) + night * 0.32);
  world.glows.pad.visible = padMaterial.opacity > 0.004;

  // Smoke and clouds take their colour from the same light.
  const smokeUniforms = world.smoke.material.uniforms;
  scratch.copy(sky.sun).multiplyScalar(0.42 * Math.min(1.25, sky.sunIntensity / 3.4));
  smokeUniforms.uLit.value.copy(sky.skyLight).multiplyScalar(0.55 * sky.ambient).add(scratch);
  smokeUniforms.uShade.value.copy(sky.skyLight).multiplyScalar(0.42 * sky.ambient).lerp(sky.groundLight, 0.3);
  // At dusk the town's own glow keeps the smoke from reading as soot; on the moon it is grey dust.
  smokeUniforms.uLit.value.lerp(sky.glow, night * 0.35);
  smokeUniforms.uShade.value.lerp(sky.horizon, night * 0.25);
  if (onMoon) {
    smokeUniforms.uLit.value.copy(lunarDust);
    smokeUniforms.uShade.value.copy(lunarShadow);
  }
  const dusty = onMoon ? 1 : 0;
  const trail = world.cinema.trail[0];
  trail.material.uniforms.uLit.value.copy(smokeUniforms.uLit.value);
  trail.material.uniforms.uShade.value.copy(smokeUniforms.uShade.value);
  trail.material.uniforms.uOpacity.value = 1 - pose.overlook * 0.55;
  world.smoke.visible = pose.smoke > 0.005;
  if (world.smoke.visible) {
    for (let i = 0; i < world.smoke.count; i++) {
      const spread = seed(i + 17) ** 0.75;
      const angle = i * 2.399 + Math.sin(time * 0.13 + i) * 0.05;
      const reach = pose.smoke * (1 + spread * (11 + dusty * 5));
      const size = (2.4 + seed(i + 51) * 3.4) * (0.4 + pose.smoke * 0.6) * (0.85 + spread * 0.75) * (1 + dusty * 0.15);
      setParticle(world.smoke, i,
        Math.sin(angle) * reach,
        0.7 + seed(i + 33) * 2.6 * (0.35 + pose.smoke * 0.65) * (1 - spread * 0.5) * (1 - dusty * 0.7)
          + Math.sin(time * 0.6 + i) * 0.08,
        Math.cos(angle) * reach,
        size,
        pose.smoke * (0.62 + seed(i + 71) * 0.36) * (1 - spread * 0.3),
        seed(i + 91) * 6.28 + time * 0.05 * (seed(i + 3) - 0.5),
        pose.ignition * grounded * (1 - spread) * 0.95,
        spread * 0.12);
    }
    commitParticles(world.smoke);
  }

  const cloudUniforms = world.clouds.material.uniforms;
  cloudUniforms.uLit.value.copy(sky.sun).multiplyScalar(0.3 * Math.min(1.3, sky.sunIntensity / 3))
    .add(scratchB.copy(sky.skyLight).multiplyScalar(0.62 * sky.ambient)).lerp(sky.glow, sky.glowStrength * 0.22);
  cloudUniforms.uShade.value.copy(sky.skyLight).multiplyScalar(0.55 * sky.ambient).lerp(sky.horizon, 0.25);
  const layout = cloudPlacement.get(world)!;
  const drift = Math.sin(time * 0.025) * 0.65;
  const fade = 1 - pose.overlook * 0.88;
  layout.forEach((cloud, i) => setParticle(world.clouds, i,
    cloud.x + drift, cloud.y, cloud.z, cloud.size, cloud.alpha * fade, cloud.rotation, 0, 0.05));
  commitParticles(world.clouds);

  // Windows, lamps, and light pools glow at dusk and when the town connects.
  const glow = Math.max(pose.network, night);
  world.townWindows.color.copy(morningWindow).lerp(connectedWindow, glow);
  world.townWindows.emissive.copy(coolGlow).lerp(warmGlow, glow);
  world.townWindows.emissiveIntensity = 0.08 + night * 1.25 + pose.network * 0.35;
  const lamps = world.glows.lamps, lampParams = lamps.params.array as Float32Array;
  for (let i = 0; i < lamps.count; i++) lampParams[i * 4] = night * (0.75 + 0.25 * Math.sin(time * 1.3 + i * 1.7) ** 2);
  lamps.params.needsUpdate = true;
  lamps.visible = night > 0.01 && !onMoon;
  (world.glows.pools.material as THREE.MeshBasicMaterial).opacity = night * 0.55;
  world.glows.pools.visible = night > 0.01 && !onMoon;

  const { bodies, heads, walkers } = world.people;
  walkers.forEach((walker, i) => {
    const length = walker.from.distanceTo(walker.to);
    const wave = time * walker.speed / Math.max(1, length) * 2 + walker.phase;
    const t = 0.5 + 0.5 * Math.sin(wave);
    const heading = Math.cos(wave) >= 0 ? 1 : -1;
    dummy.position.set(
      walker.from.x + (walker.to.x - walker.from.x) * t,
      0.08 + Math.abs(Math.sin(time * 7 + walker.phase)) * 0.025,
      walker.from.y + (walker.to.y - walker.from.y) * t,
    );
    dummy.rotation.set(0, Math.atan2((walker.to.x - walker.from.x) * heading, (walker.to.y - walker.from.y) * heading), 0);
    dummy.scale.setScalar(1);
    dummy.updateMatrix();
    bodies.setMatrixAt(i, dummy.matrix);
    heads.setMatrixAt(i, dummy.matrix);
  });
  bodies.instanceMatrix.needsUpdate = true;
  heads.instanceMatrix.needsUpdate = true;

  const roadProgress = (time * 0.016 + 0.18) % 1;
  world.cinema.vanRoute.getPointAt(roadProgress, world.van.position);
  world.cinema.vanRoute.getTangentAt(roadProgress, direction);
  world.van.rotation.y = Math.atan2(direction.x, direction.z);
  world.scene.updateMatrixWorld(true);
}

/**
 * Reserve the left side for copy on wide screens. On phones the model sits under the
 * opening headline, then rises above the reading panels for the rest of the flight.
 */
export function frameLaunchCamera(
  camera: THREE.PerspectiveCamera,
  pose: FlightPose,
  width: number,
  height: number,
  centered = false,
  time?: number,
) {
  const aspect = Math.max(1, width) / Math.max(1, height),
    mobile = width <= 680,
    portrait = aspect < 0.9;
  camera.aspect = aspect;
  camera.fov = pose.fov + (portrait && !centered ? pose.overlook * 7 : 0);
  const tall = portrait && !centered;
  const distance = pose.distance * (tall ? 1.48 + pose.overlook * 0.42 : 1);
  // Tall screens look down on the finale a little more, so the whole town fits the width.
  const elevation = pose.elevation * (tall ? 1 + pose.overlook * 1.1 : 1);
  const focusX = pose.x * (1 - pose.overlook), focusZ = pose.z * (1 - pose.overlook);
  camera.position.set(
    focusX + Math.sin(pose.orbit) * distance,
    pose.lift + pose.lookHeight + elevation,
    focusZ + Math.cos(pose.orbit) * distance,
  );
  camera.lookAt(focusX, pose.lift + pose.lookHeight, focusZ);
  if (time !== undefined) {
    // A small engine rumble while the tank is on or just above the pad.
    const rumble = pose.ignition * (1 - smoothRange(0.5, 9, pose.lift)) * (0.03 + pose.smoke * 0.02);
    if (rumble > 0.0005) {
      camera.position.x += (Math.sin(time * 41) * 0.6 + Math.sin(time * 67 + 1) * 0.4) * rumble;
      camera.position.y += (Math.sin(time * 53 + 2) * 0.6 + Math.sin(time * 89) * 0.4) * rumble;
    }
  }
  camera.rotateZ(pose.cameraRoll * (mobile ? 0.5 : 1));
  if (centered) camera.clearViewOffset();
  else {
    let rise = 0.23 + (-0.17 - 0.23) * smoothRange(0.05, 0.15, pose.progress);
    rise += (-0.03 - rise) * pose.sceneOpen;
    rise += (0.3 - rise) * pose.overlook;
    camera.setViewOffset(
      width,
      height,
      -width * (mobile ? 0.07 * (1 - pose.overlook) : 0.2 - pose.sceneOpen * 0.06),
      -height * (mobile ? rise : 0.01),
      width,
      height,
    );
  }
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld(true);
}
