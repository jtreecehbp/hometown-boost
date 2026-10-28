import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { sculpt } from "./scene-sculpt.ts";
import type { SkyState } from "./launch-sky.ts";

/** Farmland that runs out to the horizon, so the town sits in a real place instead of on a platter. */
export const LAND_RADIUS = 620;
const RIVER = (x: number) => 78 + 24 * Math.sin(x / 47) + 9 * Math.sin(x / 13 + 1.3);
const hash = (x: number, y: number) => {
  const v = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return v - Math.floor(v);
};
const nearRoad = (x: number, z: number, gap: number) =>
  Math.min(Math.abs(x - 5.5), Math.abs(x + 5.5), Math.abs(z - 5.5), Math.abs(z + 5.5)) < gap;
const nearRiver = (x: number, z: number, gap: number) => Math.abs(z - RIVER(x)) < gap;

const vertexShader = /* glsl */ `
  varying vec3 vWorld;
  varying float vFogDepth;
  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorld = world.xyz;
    vec4 view = viewMatrix * world;
    vFogDepth = -view.z;
    gl_Position = projectionMatrix * view;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uSun;
  uniform vec3 uSunDirection;
  uniform float uSunIntensity;
  uniform vec3 uSky;
  uniform float uAmbient;
  uniform float uEnvironment;
  uniform vec3 fogColor;
  uniform float fogDensity;
  varying vec3 vWorld;
  varying float vFogDepth;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  vec3 linear(vec3 c) { return pow(c, vec3(2.2)); }

  vec3 crop(float h) {
    if (h < 0.22) return linear(vec3(0.47, 0.62, 0.31));
    if (h < 0.4) return linear(vec3(0.63, 0.67, 0.35));
    if (h < 0.56) return linear(vec3(0.79, 0.70, 0.40));
    if (h < 0.7) return linear(vec3(0.40, 0.56, 0.31));
    if (h < 0.84) return linear(vec3(0.60, 0.50, 0.35));
    return linear(vec3(0.55, 0.66, 0.36));
  }

  void main() {
    vec2 p = vWorld.xz;
    float radius = length(p);
    vec2 region = floor(p / 96.0);
    float regionSeed = hash(region + 3.0);
    float angle = regionSeed > 0.5 ? 0.21 : -0.34;
    mat2 turn = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
    vec2 q = turn * p;
    vec2 cellSize = vec2(27.0, 17.0) * (0.82 + 0.36 * regionSeed);
    vec2 cell = floor(q / cellSize);
    vec2 f = fract(q / cellSize);
    float h = hash(cell + region * 31.0);
    vec3 color = crop(h);
    color *= 0.92 + 0.08 * (0.5 + 0.5 * sin((h > 0.5 ? q.x : q.y) * (1.4 + h)));
    vec2 edge = min(f, 1.0 - f) * cellSize;
    float edgeDistance = min(edge.x, edge.y);
    float aa = fwidth(edgeDistance) * 1.5 + 0.001;
    float hedge = (1.0 - smoothstep(0.5, 0.5 + aa, edgeDistance)) * step(0.22, hash(cell * 1.73 + 9.0));
    color = mix(color, linear(vec3(0.26, 0.40, 0.24)), hedge);
    float road = min(min(abs(p.x - 5.5), abs(p.x + 5.5)), min(abs(p.y - 5.5), abs(p.y + 5.5)));
    float roadMask = (1.0 - smoothstep(1.05, 1.05 + fwidth(road) * 1.5 + 0.001, road)) * smoothstep(17.0, 19.0, radius);
    color = mix(color, linear(vec3(0.39, 0.41, 0.44)), roadMask);
    float riverZ = 78.0 + 24.0 * sin(p.x / 47.0) + 9.0 * sin(p.x / 13.0 + 1.3);
    float river = abs(p.y - riverZ);
    color = mix(color, linear(vec3(0.43, 0.55, 0.34)), 1.0 - smoothstep(3.7, 4.7, river));
    color = mix(color, linear(vec3(0.30, 0.50, 0.66)), 1.0 - smoothstep(2.5, 2.5 + fwidth(river) * 1.5 + 0.001, river));
    color = mix(color, linear(vec3(0.53, 0.66, 0.36)), 1.0 - smoothstep(19.0, 21.0, radius));
    vec3 light = (uSun * uSunIntensity * max(uSunDirection.y, 0.0) + uSky * uAmbient) / 3.14159265 + vec3(uEnvironment);
    vec3 lit = color * light;
    float fogFactor = 1.0 - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
    gl_FragColor = vec4(mix(lit, fogColor, fogFactor), 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

export function createCountryside(compact: boolean) {
  const root = new THREE.Group();
  root.name = "countryside";

  const groundMaterial = new THREE.ShaderMaterial({
    name: "patchwork-fields",
    uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.fog, {
      uSun: { value: new THREE.Color() },
      uSunDirection: { value: new THREE.Vector3(0, 1, 0) },
      uSunIntensity: { value: 3 },
      uSky: { value: new THREE.Color() },
      uAmbient: { value: 1 },
      uEnvironment: { value: 0.15 },
    }]),
    vertexShader,
    fragmentShader,
    fog: true,
  });
  const ground = new THREE.Mesh(new THREE.CircleGeometry(LAND_RADIUS, 96), groundMaterial);
  ground.name = "patchwork-farmland";
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.05;
  ground.renderOrder = -5;
  root.add(ground);

  // Woods and hedgerow trees: one instanced draw.
  const trunk = new THREE.CylinderGeometry(0.11, 0.16, 1.1, 5).translate(0, 0.55, 0);
  const crown = new THREE.IcosahedronGeometry(1, 1).scale(0.95, 1.15, 0.95).translate(0, 1.75, 0);
  const paint = (geometry: THREE.BufferGeometry, hex: string) => {
    const piece = geometry.index ? geometry.toNonIndexed() : geometry;
    const color = new THREE.Color(hex), colors = new Float32Array(piece.getAttribute("position").count * 3);
    for (let i = 0; i < colors.length; i += 3) color.toArray(colors, i);
    piece.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return piece;
  };
  const treeGeometry = mergeGeometries([paint(trunk, "#6b5443"), paint(crown, "#ffffff")])!;
  trunk.dispose(); crown.dispose();
  const treeCount = compact ? 170 : 360;
  const trees = new THREE.InstancedMesh(treeGeometry,
    new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9, envMapIntensity: 0.5 }), treeCount);
  trees.name = "countryside-trees";
  const dummy = new THREE.Object3D(), tint = new THREE.Color();
  const greens = ["#5f8f4c", "#4d7d45", "#6d9a52", "#3f6e3e", "#7aa35a"];
  let placed = 0, attempt = 0;
  const clusters = Array.from({ length: 34 }, (_, i) => {
    const angle = hash(i, 4) * Math.PI * 2, distance = 30 + hash(i, 9) ** 0.8 * 150;
    return [Math.sin(angle) * distance, Math.cos(angle) * distance, 4 + hash(i, 2) * 10];
  });
  while (placed < treeCount && attempt < treeCount * 30) {
    attempt++;
    const [cx, cz, spread] = clusters[attempt % clusters.length];
    const a = hash(attempt, 1) * Math.PI * 2, r = Math.sqrt(hash(attempt, 2)) * spread;
    const x = cx + Math.sin(a) * r, z = cz + Math.cos(a) * r;
    if (Math.hypot(x, z) < 23 || nearRoad(x, z, 2.6) || nearRiver(x, z, 5)) continue;
    const scale = 0.85 + hash(attempt, 3) * 0.9;
    dummy.position.set(x, 0, z);
    dummy.rotation.set(0, hash(attempt, 5) * 6.28, 0);
    dummy.scale.set(scale, scale * (0.85 + hash(attempt, 6) * 0.4), scale);
    dummy.updateMatrix();
    trees.setMatrixAt(placed, dummy.matrix);
    trees.setColorAt(placed, tint.set(greens[placed % greens.length]));
    placed++;
  }
  trees.count = placed;
  trees.castShadow = trees.receiveShadow = false;
  root.add(trees);

  // Farmsteads and a ring of low hills, baked into one vertex-coloured mesh.
  const farm = sculpt(new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.85, envMapIntensity: 0.5 }), true);
  const farmsteads = compact ? 6 : 10;
  for (let i = 0; i < farmsteads; i++) {
    const angle = i / farmsteads * Math.PI * 2 + hash(i, 7) * 0.5, distance = 42 + hash(i, 8) * 95;
    let x = Math.sin(angle) * distance, z = Math.cos(angle) * distance;
    if (nearRiver(x, z, 9)) z -= 14;
    if (nearRoad(x, z, 6)) x += 9;
    const turn = hash(i, 10) * Math.PI;
    const place = (lx: number, lz: number): [number, number] =>
      [x + lx * Math.cos(turn) - lz * Math.sin(turn), z + lx * Math.sin(turn) + lz * Math.cos(turn)];
    const [bx, bz] = place(0, 0), [sx, sz] = place(3.6, 1.2), [hx, hz] = place(-4.5, -2.5);
    farm.add(new THREE.BoxGeometry(3.4, 2.4, 5), i % 3 ? "#a9473a" : "#c25d43", [bx, 1.2, bz], [1, 1, 1], [0, turn, 0]);
    farm.add(new THREE.CylinderGeometry(0.01, 2.2, 1.5, 4, 1).rotateY(Math.PI / 4), "#4f3a34", [bx, 3.15, bz], [1.1, 1, 1.6], [0, turn, 0]);
    farm.add(new THREE.CylinderGeometry(0.9, 0.9, 5, 10), "#d9d4c6", [sx, 2.5, sz]);
    farm.add(new THREE.SphereGeometry(0.9, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), "#9fb0bd", [sx, 5, sz]);
    farm.add(new THREE.BoxGeometry(2.6, 2, 2.6), "#efe0c2", [hx, 1, hz], [1, 1, 1], [0, turn, 0]);
    farm.add(new THREE.CylinderGeometry(0.01, 1.9, 1.2, 4, 1).rotateY(Math.PI / 4), "#3c4f6b", [hx, 2.6, hz], [1, 1, 1], [0, turn, 0]);
  }
  const hills = compact ? 18 : 28;
  for (let i = 0; i < hills; i++) {
    const angle = i / hills * Math.PI * 2 + hash(i, 12) * 0.2, distance = 310 + hash(i, 13) * 150;
    farm.add(new THREE.SphereGeometry(1, 14, 6, 0, Math.PI * 2, 0, Math.PI / 2),
      i % 2 ? "#748f6e" : "#7f9874",
      [Math.sin(angle) * distance, -1.5, Math.cos(angle) * distance],
      [70 + hash(i, 14) * 60, 6 + hash(i, 15) * 9, 40 + hash(i, 16) * 35], [0, angle, 0]);
  }
  const farms = farm.finish("farms-and-hills");
  root.add(farms);

  return { root, ground, trees, farms };
}
export type Countryside = ReturnType<typeof createCountryside>;

export function updateCountryside(land: Countryside, sky: SkyState) {
  const u = land.ground.material.uniforms;
  u.uSun.value.copy(sky.sun);
  u.uSunDirection.value.copy(sky.sunDirection);
  u.uSunIntensity.value = sky.sunIntensity;
  u.uSky.value.copy(sky.skyLight);
  u.uAmbient.value = sky.ambient;
  u.uEnvironment.value = sky.reflections * 0.22;
}
