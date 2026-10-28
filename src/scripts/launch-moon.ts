import * as THREE from "three";
import { sculpt } from "./scene-sculpt.ts";
import { mechanic } from "./launch-cinema.ts";
import type { SkyState } from "./launch-sky.ts";

/**
 * The finale set: a small cratered moon whose top sits where the town square is, so the
 * same camera framing works. The hometown and the moon are never visible at the same time.
 */
export const MOON_RADIUS = 130;
/** Earth hangs behind the landing site in the finale shot. */
export const EARTH_POSITION = new THREE.Vector3(-110, 22, -262);
export const EARTH_RADIUS = 27;

const hash = (x: number, y: number) => {
  const v = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return v - Math.floor(v);
};
function valueNoise(x: number, y: number) {
  const ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
  const a = hash(ix, iy), b = hash(ix + 1, iy), c = hash(ix, iy + 1), d = hash(ix + 1, iy + 1);
  return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
}

/** Height of the surface at a horizontal distance from the landing site, before craters. */
export const moonSurfaceY = (x: number, z: number) =>
  Math.sqrt(Math.max(0, MOON_RADIUS * MOON_RADIUS - x * x - z * z)) - MOON_RADIUS;

const earthVertex = /* glsl */ `
  varying vec3 vNormalWorld;
  varying vec3 vLocal;
  varying vec3 vToCamera;
  void main() {
    vLocal = position;
    vec4 world = modelMatrix * vec4(position, 1.0);
    vNormalWorld = normalize(mat3(modelMatrix) * normal);
    vToCamera = cameraPosition - world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const earthFragment = /* glsl */ `
  uniform vec3 uSunDirection;
  uniform float uLights;
  uniform float uTime;
  varying vec3 vNormalWorld;
  varying vec3 vLocal;
  varying vec3 vToCamera;
  float hash(vec3 p) {
    p = fract(p * 0.3183099 + vec3(0.71, 0.113, 0.419));
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }
  float noise(vec3 p) {
    vec3 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i), hash(i + vec3(1, 0, 0)), f.x), mix(hash(i + vec3(0, 1, 0)), hash(i + vec3(1, 1, 0)), f.x), f.y),
      mix(mix(hash(i + vec3(0, 0, 1)), hash(i + vec3(1, 0, 1)), f.x), mix(hash(i + vec3(0, 1, 1)), hash(i + vec3(1, 1, 1)), f.x), f.y),
      f.z);
  }
  float fbm(vec3 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 4; i++) { v += noise(p) * a; p *= 2.03; a *= 0.5; }
    return v;
  }
  void main() {
    vec3 n = normalize(vNormalWorld);
    vec3 local = normalize(vLocal);
    float land = smoothstep(0.5, 0.54, fbm(local * 2.4 + 3.1));
    vec3 ocean = vec3(0.04, 0.18, 0.45);
    vec3 ground = mix(vec3(0.2, 0.42, 0.17), vec3(0.58, 0.5, 0.31), smoothstep(0.45, 0.7, fbm(local * 6.0)));
    vec3 albedo = mix(ocean, ground, land);
    float clouds = smoothstep(0.52, 0.72, fbm(local * 3.6 + vec3(uTime * 0.012, 0.0, 0.0)));
    albedo = mix(albedo, vec3(0.94), clouds * 0.85);
    float facing = dot(n, normalize(uSunDirection));
    vec3 color = albedo * (max(facing, 0.0) * 1.3 + 0.015);
    // City lights glow on the night side and brighten as the story's businesses connect.
    float night = 1.0 - smoothstep(-0.08, 0.12, facing);
    vec3 cell = local * 70.0;
    float spark = step(0.93, hash(floor(cell))) * smoothstep(0.42, 0.1, length(fract(cell) - 0.5));
    float city = spark * land * (1.0 - clouds);
    color += vec3(1.0, 0.58, 0.22) * city * night * (0.45 + uLights * 1.5);
    float rim = pow(1.0 - max(dot(n, normalize(vToCamera)), 0.0), 2.6);
    color += vec3(0.42, 0.68, 1.0) * rim * (0.18 + max(facing, 0.0) * 0.95);
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

export function createMoonWorld(compact: boolean) {
  const root = new THREE.Group();
  root.name = "moon-finale";
  root.visible = false;

  // Cratered surface: a spherical cap, displaced and painted in code.
  const geometry = new THREE.SphereGeometry(MOON_RADIUS, compact ? 120 : 180, compact ? 72 : 112, 0, Math.PI * 2, 0, 0.82);
  geometry.translate(0, -MOON_RADIUS, 0);
  // A few big craters further out and many small ones near the pad, keeping the pad itself flat.
  const craters = Array.from({ length: compact ? 70 : 110 }, (_, i) => {
    const big = i < (compact ? 22 : 34);
    const angle = hash(i, 1) * Math.PI * 2;
    const distance = big ? 14 + hash(i, 2) ** 0.85 * 92 : 6 + hash(i, 2) ** 1.4 * 60;
    const radius = big ? 3 + hash(i, 3) ** 2 * 15 : 0.5 + hash(i, 3) ** 2 * 2.6;
    return { x: Math.sin(angle) * distance, z: Math.cos(angle) * distance, radius, depth: radius * (0.2 + hash(i, 4) * 0.12) };
  }).filter(crater => Math.hypot(crater.x, crater.z) - crater.radius * 1.6 > 4.5);
  const position = geometry.getAttribute("position");
  const colors = new Float32Array(position.count * 3);
  const center = new THREE.Vector3(0, -MOON_RADIUS, 0), point = new THREE.Vector3();
  for (let i = 0; i < position.count; i++) {
    point.fromBufferAttribute(position, i);
    const x = point.x, z = point.z;
    // Mid-grey regolith (linear albedo), darker lunar "seas", and fine speckle.
    let height = (valueNoise(x / 6, z / 6) - 0.5) * 0.35 * THREE.MathUtils.smoothstep(Math.hypot(x, z), 3, 9);
    let shade = 0.24 + (valueNoise(x / 9, z / 9) - 0.5) * 0.06;
    shade *= 0.62 + 0.38 * THREE.MathUtils.smoothstep(valueNoise(x / 46 + 7, z / 46 + 3), 0.45, 0.7);
    shade *= 0.9 + hash(Math.round(x * 3), Math.round(z * 3)) * 0.2;
    for (const crater of craters) {
      const t = Math.hypot(x - crater.x, z - crater.z) / crater.radius;
      if (t > 1.8) continue;
      if (t < 1) { height -= crater.depth * (1 - t * t); shade *= 0.8; }
      height += crater.depth * 0.55 * Math.exp(-(((t - 1) / 0.2) ** 2));
      if (t > 0.88 && t < 1.25) shade *= 1.25;
      else if (t >= 1.25) shade *= 1.08;
    }
    point.sub(center).normalize().multiplyScalar(MOON_RADIUS + height).add(center);
    position.setXYZ(i, point.x, point.y, point.z);
    colors[i * 3] = shade * 1.02;
    colors[i * 3 + 1] = shade;
    colors[i * 3 + 2] = shade * 0.97;
  }
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  const surface = new THREE.Mesh(geometry,
    new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, metalness: 0, envMapIntensity: 0.25 }));
  surface.name = "cratered-moon";
  surface.receiveShadow = true;
  root.add(surface);

  const earth = new THREE.Mesh(new THREE.SphereGeometry(EARTH_RADIUS, compact ? 48 : 72, compact ? 24 : 36),
    new THREE.ShaderMaterial({
      name: "earth",
      uniforms: { uSunDirection: { value: new THREE.Vector3(0, 1, 0) }, uLights: { value: 0 }, uTime: { value: 0 } },
      vertexShader: earthVertex,
      fragmentShader: earthFragment,
    }));
  earth.name = "earth-in-the-sky";
  earth.position.copy(EARTH_POSITION);
  earth.rotation.set(0.35, 2.2, 0.1);
  root.add(earth);

  // An HB-orange flag beside the landing site.
  const flag = sculpt(new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.6 }), compact);
  flag.rod([0, 0, 0], [0, 2.5, 0], 0.035, "#d9dde3");
  flag.box(1.15, 0.72, 0.03, "#ff8a32", 0.6, 2.1, 0);
  flag.box(1.15, 0.12, 0.035, "#fffaf0", 0.6, 2.1, 0);
  flag.box(0.08, 0.04, 0.04, "#d9dde3", 0.6, 2.47, 0);
  const banner = flag.finish("hb-moon-flag");
  banner.children[0].castShadow = true;
  banner.position.set(-3.9, moonSurfaceY(-3.9, 1.1), 1.1);
  banner.rotation.y = 0.5;
  root.add(banner);

  // The mechanic makes one last cameo, now in a helmet.
  const astronaut = mechanic(compact);
  astronaut.root.name = "mechanic-moon-cameo";
  const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.34, 20, 14),
    new THREE.MeshPhysicalMaterial({ color: "#d9ecff", roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.38, depthWrite: false }));
  helmet.position.set(0, 1.08, 0.02);
  astronaut.root.add(helmet);
  astronaut.root.scale.setScalar(1.15);
  astronaut.root.position.set(-2.4, moonSurfaceY(-2.4, 2.6), 2.6);
  astronaut.root.rotation.y = 0.7;
  astronaut.root.traverse(object => { if (object instanceof THREE.Mesh && object !== helmet) object.castShadow = true; });
  root.add(astronaut.root);

  return { root, surface, earth, banner, astronaut };
}
export type MoonWorld = ReturnType<typeof createMoonWorld>;

export function updateMoonWorld(moon: MoonWorld, sky: SkyState, network: number, time: number) {
  const u = (moon.earth.material as THREE.ShaderMaterial).uniforms;
  u.uSunDirection.value.copy(sky.sunDirection);
  u.uLights.value = network;
  u.uTime.value = time;
  moon.earth.rotation.y = 2.2 + time * 0.01;
  moon.astronaut.arm.rotation.z = -0.3 + Math.sin(time * 2.4) * 0.4;
}
