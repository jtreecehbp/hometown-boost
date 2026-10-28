import * as THREE from "three";
import { clamp } from "./launch-motion.ts";

/** The time of day follows the flight: golden morning, blue day, space, then sunset at home. */
export interface SkyState {
  zenith: THREE.Color;
  horizon: THREE.Color;
  glow: THREE.Color;
  glowStrength: number;
  fog: THREE.Color;
  fogDensity: number;
  sun: THREE.Color;
  sunIntensity: number;
  sunDirection: THREE.Vector3;
  skyLight: THREE.Color;
  groundLight: THREE.Color;
  ambient: number;
  rimColor: THREE.Color;
  rim: number;
  stars: number;
  nightLights: number;
  reflections: number;
}

interface SkyKey {
  at: number;
  zenith: string;
  horizon: string;
  glow: string;
  glowStrength: number;
  fog: string;
  fogDensity: number;
  sun: string;
  sunIntensity: number;
  /** Radians around the town, measured from +z toward +x. */
  sunAzimuth: number;
  sunElevation: number;
  skyLight: string;
  groundLight: string;
  ambient: number;
  rimColor: string;
  rim: number;
  stars: number;
  nightLights: number;
  reflections: number;
}

const morning: SkyKey = {
  at: 0,
  zenith: "#5f9bd4", horizon: "#ffe2bd", glow: "#ffae5e", glowStrength: 0.85,
  fog: "#f1d9bd", fogDensity: 0.0105,
  sun: "#ffc98c", sunIntensity: 3.3, sunAzimuth: -0.95, sunElevation: 0.3,
  skyLight: "#bcd6ef", groundLight: "#c7a27d", ambient: 1.05,
  rimColor: "#ffd9a8", rim: 1.1, stars: 0, nightLights: 0, reflections: 0.32,
};
const space: Omit<SkyKey, "at"> = {
  zenith: "#030a1a", horizon: "#1d528f", glow: "#78c6f7", glowStrength: 0.6,
  fog: "#1d4677", fogDensity: 0.0034,
  sun: "#ffffff", sunIntensity: 4.4, sunAzimuth: -1.25, sunElevation: 0.32,
  skyLight: "#5577a6", groundLight: "#22314a", ambient: 0.5,
  rimColor: "#93ccff", rim: 2.2, stars: 1, nightLights: 0, reflections: 0.26,
};
const lunar: Omit<SkyKey, "at"> = {
  zenith: "#010409", horizon: "#03070f", glow: "#000000", glowStrength: 0,
  fog: "#020509", fogDensity: 0.0004,
  sun: "#ffffff", sunIntensity: 4.6, sunAzimuth: -1.3, sunElevation: 0.3,
  skyLight: "#46506a", groundLight: "#5c5c60", ambient: 0.42,
  rimColor: "#a9cbff", rim: 1.4, stars: 1, nightLights: 0, reflections: 0.14,
};
const keys: SkyKey[] = [
  morning,
  { ...morning, at: 0.17, sunElevation: 0.36, glowStrength: 0.72, fogDensity: 0.0098 },
  {
    at: 0.27,
    zenith: "#3a86d4", horizon: "#bcdcf2", glow: "#ffe0b6", glowStrength: 0.28,
    fog: "#c4dcee", fogDensity: 0.0072,
    sun: "#fff0da", sunIntensity: 3.7, sunAzimuth: -0.85, sunElevation: 0.62,
    skyLight: "#cfe3f6", groundLight: "#a8b28d", ambient: 1.05,
    rimColor: "#e3f1ff", rim: 1, stars: 0, nightLights: 0, reflections: 0.32,
  },
  {
    at: 0.43,
    zenith: "#2669c0", horizon: "#a9d3f0", glow: "#ffffff", glowStrength: 0.12,
    fog: "#b3d4ee", fogDensity: 0.006,
    sun: "#fff5e6", sunIntensity: 3.9, sunAzimuth: -0.9, sunElevation: 0.7,
    skyLight: "#c2dcf3", groundLight: "#9fac8a", ambient: 1,
    rimColor: "#e3f1ff", rim: 1.1, stars: 0, nightLights: 0, reflections: 0.32,
  },
  {
    at: 0.5,
    zenith: "#1a509f", horizon: "#c4ddf2", glow: "#ffffff", glowStrength: 0.2,
    fog: "#d7e7f4", fogDensity: 0.0066,
    sun: "#fff8ee", sunIntensity: 4, sunAzimuth: -0.95, sunElevation: 0.6,
    skyLight: "#d4e6f6", groundLight: "#b7c2c9", ambient: 1.05,
    rimColor: "#e8f4ff", rim: 1.2, stars: 0, nightLights: 0, reflections: 0.3,
  },
  {
    at: 0.575,
    zenith: "#103a78", horizon: "#86bde9", glow: "#fff0d4", glowStrength: 0.3,
    fog: "#a3c9ec", fogDensity: 0.0042,
    sun: "#fffaf0", sunIntensity: 4.2, sunAzimuth: -1.05, sunElevation: 0.5,
    skyLight: "#9fc3ea", groundLight: "#6d7f99", ambient: 0.85,
    rimColor: "#cfe7ff", rim: 1.5, stars: 0.12, nightLights: 0, reflections: 0.3,
  },
  { ...space, at: 0.665 },
  { ...space, at: 0.85 },
  // Beyond the atmosphere: black sky to the horizon, hard white sun, and a little earthshine.
  { ...lunar, at: 0.889 },
  { ...lunar, at: 1 },
];

const colorFields = ["zenith", "horizon", "glow", "fog", "sun", "skyLight", "groundLight", "rimColor"] as const;
const numberFields = ["glowStrength", "fogDensity", "sunIntensity", "ambient", "rim", "stars", "nightLights", "reflections"] as const;
const parsed = keys.map(key => ({
  key,
  colors: Object.fromEntries(colorFields.map(field => [field, new THREE.Color(key[field])])) as Record<(typeof colorFields)[number], THREE.Color>,
}));

export function createSkyState(): SkyState {
  return {
    zenith: new THREE.Color(), horizon: new THREE.Color(), glow: new THREE.Color(), glowStrength: 0,
    fog: new THREE.Color(), fogDensity: 0, sun: new THREE.Color(), sunIntensity: 0,
    sunDirection: new THREE.Vector3(0, 1, 0), skyLight: new THREE.Color(), groundLight: new THREE.Color(),
    ambient: 0, rimColor: new THREE.Color(), rim: 0, stars: 0, nightLights: 0, reflections: 0,
  };
}

/** Sample the sky for a flight progress; the result is written into `target` to avoid garbage. */
export function sampleSky(progress: number, target = createSkyState()): SkyState {
  const p = clamp(progress);
  const right = Math.max(1, parsed.findIndex(entry => entry.key.at >= p));
  const a = parsed[right - 1], b = parsed[right];
  const span = Math.max(1e-6, b.key.at - a.key.at);
  const linear = clamp((p - a.key.at) / span);
  const t = linear * linear * (3 - 2 * linear);
  for (const field of colorFields) target[field].copy(a.colors[field]).lerp(b.colors[field], t);
  for (const field of numberFields) target[field] = a.key[field] + (b.key[field] - a.key[field]) * t;
  const azimuth = a.key.sunAzimuth + (b.key.sunAzimuth - a.key.sunAzimuth) * t;
  const elevation = a.key.sunElevation + (b.key.sunElevation - a.key.sunElevation) * t;
  target.sunDirection.set(
    Math.cos(elevation) * Math.sin(azimuth),
    Math.sin(elevation),
    Math.cos(elevation) * Math.cos(azimuth),
  );
  return target;
}

const vertexShader = /* glsl */ `
  varying vec3 vDirection;
  void main() {
    vDirection = position;
    vec4 clip = projectionMatrix * vec4(mat3(viewMatrix) * position * 50.0, 1.0);
    // Pin the dome just inside the far plane so it always sits behind the town.
    gl_Position = vec4(clip.xy, clip.w * 0.99995, clip.w);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uZenith;
  uniform vec3 uHorizon;
  uniform vec3 uGlow;
  uniform vec3 uFog;
  uniform vec3 uSun;
  uniform vec3 uSunDirection;
  uniform float uGlowStrength;
  uniform float uStars;
  uniform float uTime;
  varying vec3 vDirection;

  float hash(vec3 p) {
    p = fract(p * 0.3183099 + vec3(0.71, 0.113, 0.419));
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  void main() {
    vec3 direction = normalize(vDirection);
    float up = direction.y;
    float height = clamp(up, 0.0, 1.0);
    vec3 color = mix(uHorizon, uZenith, pow(smoothstep(0.0, 0.85, height), 0.62));
    vec2 planar = normalize(direction.xz + 1e-5);
    vec2 sunPlanar = normalize(uSunDirection.xz + 1e-5);
    float facing = 0.5 + 0.5 * dot(planar, sunPlanar);
    float band = exp(-height * 9.0) * uGlowStrength * (0.38 + 0.62 * facing * facing);
    color = mix(color, uGlow, clamp(band, 0.0, 1.0));
    float sunAngle = max(dot(direction, normalize(uSunDirection)), 0.0);
    color += uSun * (pow(sunAngle, 900.0) * 3.5 + pow(sunAngle, 28.0) * 0.22) * smoothstep(-0.03, 0.02, up);
    // Below the visible horizon the dome shows the same haze as the distant fields.
    color = mix(color, uFog, smoothstep(0.0, -0.06, up));
    if (uStars > 0.001) {
      vec3 cell = floor(direction * 210.0);
      float seed = hash(cell);
      vec3 local = fract(direction * 210.0) - 0.5;
      float star = step(0.9946, seed) * smoothstep(0.36, 0.0, length(local));
      float twinkle = 0.72 + 0.28 * sin(uTime * 1.7 + seed * 91.0);
      color += vec3(star * twinkle * uStars * smoothstep(0.02, 0.3, up) * (0.6 + 0.8 * fract(seed * 37.0)));
    }
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

export function createSkyDome() {
  const material = new THREE.ShaderMaterial({
    name: "launch-sky",
    uniforms: {
      uZenith: { value: new THREE.Color() },
      uHorizon: { value: new THREE.Color() },
      uGlow: { value: new THREE.Color() },
      uFog: { value: new THREE.Color() },
      uSun: { value: new THREE.Color() },
      uSunDirection: { value: new THREE.Vector3(0, 1, 0) },
      uGlowStrength: { value: 0 },
      uStars: { value: 0 },
      uTime: { value: 0 },
    },
    vertexShader,
    fragmentShader,
    depthTest: false,
    depthWrite: false,
    side: THREE.BackSide,
  });
  const dome = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 24), material);
  dome.name = "time-of-day-sky";
  dome.frustumCulled = false;
  dome.renderOrder = -10;
  dome.castShadow = dome.receiveShadow = false;
  return dome;
}

export function updateSkyDome(dome: THREE.Mesh, sky: SkyState, time: number) {
  const u = (dome.material as THREE.ShaderMaterial).uniforms;
  u.uZenith.value.copy(sky.zenith);
  u.uHorizon.value.copy(sky.horizon);
  u.uGlow.value.copy(sky.glow);
  u.uFog.value.copy(sky.fog);
  u.uSun.value.copy(sky.sun).multiplyScalar(Math.min(1, sky.sunIntensity / 3));
  u.uSunDirection.value.copy(sky.sunDirection);
  u.uGlowStrength.value = sky.glowStrength;
  u.uStars.value = sky.stars;
  u.uTime.value = time;
}
