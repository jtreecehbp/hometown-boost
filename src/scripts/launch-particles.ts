import * as THREE from "three";

/**
 * Soft billboards for smoke, exhaust, clouds, and light glows.
 * Textures are generated in code, so nothing extra is downloaded.
 */
const hash = (x: number, y: number, s: number) => {
  const v = Math.sin(x * 127.1 + y * 311.7 + s * 74.7) * 43758.5453;
  return v - Math.floor(v);
};
function valueNoise(x: number, y: number, s: number) {
  const ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
  const a = hash(ix, iy, s), b = hash(ix + 1, iy, s), c = hash(ix, iy + 1, s), d = hash(ix + 1, iy + 1, s);
  return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
}

/** A lumpy puff: alpha holds density, red holds detail used for fake self-shadowing. */
export function createPuffTexture(size = 128, seed = 1) {
  const data = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) {
      const u = (x + 0.5) / size * 2 - 1, v = (y + 0.5) / size * 2 - 1;
      const angle = Math.atan2(v, u);
      const radius = Math.hypot(u, v);
      // Wobble the edge so puffs read as cauliflower smoke, not discs.
      const edge = 0.74 + 0.16 * valueNoise(Math.cos(angle) * 2.2 + 3, Math.sin(angle) * 2.2 + 3, seed)
        + 0.08 * valueNoise(Math.cos(angle) * 5 + 7, Math.sin(angle) * 5 + 7, seed + 1);
      const detail = valueNoise(u * 3 + 11, v * 3 + 5, seed + 2) * 0.55
        + valueNoise(u * 7 + 2, v * 7 + 9, seed + 3) * 0.3 + valueNoise(u * 15, v * 15, seed + 4) * 0.15;
      const falloff = 1 - THREE.MathUtils.smoothstep(radius, edge * 0.35, edge);
      const density = falloff * (0.72 + detail * 0.42);
      const i = (y * size + x) * 4;
      data[i] = Math.round(THREE.MathUtils.clamp(detail, 0, 1) * 255);
      data[i + 1] = data[i + 2] = 255;
      data[i + 3] = Math.round(THREE.MathUtils.clamp(density, 0, 1) * 255);
    }
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  return texture;
}

/** A smooth radial glow for lamps, flames, and light pools. */
export function createGlowTexture(size = 64) {
  const data = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) {
      const r = Math.hypot((x + 0.5) / size * 2 - 1, (y + 0.5) / size * 2 - 1);
      const glow = Math.max(0, 1 - r) ** 2.2;
      const i = (y * size + x) * 4;
      data[i] = data[i + 1] = data[i + 2] = 255;
      data[i + 3] = Math.round(glow * 255);
    }
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  return texture;
}

const vertexShader = /* glsl */ `
  attribute vec4 aParams;
  uniform vec2 uNearFade;
  varying vec2 vUv;
  varying vec4 vParams;
  varying float vLightY;
  varying float vFogDepth;
  varying float vNear;
  void main() {
    vec4 center = modelMatrix * instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
    float size = length(instanceMatrix[0].xyz);
    vec4 view = viewMatrix * center;
    float c = cos(aParams.y), s = sin(aParams.y);
    vec2 corner = vec2(c * position.x - s * position.y, s * position.x + c * position.y);
    view.xy += corner * size;
    vUv = uv;
    vParams = aParams;
    vLightY = corner.y + 0.5;
    vFogDepth = -view.z;
    // Sprites right at the lens fade out, so flying through a cloud never blanks the screen.
    vNear = uNearFade.y > 0.0 ? smoothstep(uNearFade.x, uNearFade.y, -view.z) : 1.0;
    gl_Position = projectionMatrix * view;
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D uMap;
  uniform vec3 uLit;
  uniform vec3 uShade;
  uniform vec3 uWarm;
  uniform float uOpacity;
  uniform float uAdditive;
  uniform vec3 fogColor;
  uniform float fogDensity;
  varying vec2 vUv;
  varying vec4 vParams;
  varying float vLightY;
  varying float vFogDepth;
  varying float vNear;
  void main() {
    vec4 tex = texture2D(uMap, vUv);
    float alpha = tex.a * vParams.x * uOpacity * vNear;
    if (alpha < 0.002) discard;
    float light = clamp(vLightY * 0.95 + 0.18 + (tex.r - 0.5) * 0.55 - vParams.w, 0.0, 1.0);
    vec3 color = mix(uShade, uLit, light);
    color = mix(color, uWarm, clamp(vParams.z * (1.15 - vLightY * 0.6), 0.0, 1.0));
    float fogFactor = 1.0 - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
    color = mix(color, fogColor, fogFactor * (1.0 - uAdditive));
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
    // Premultiplied output: additive glows keep their colour but add no coverage.
    gl_FragColor = vec4(gl_FragColor.rgb * alpha, alpha * (1.0 - uAdditive));
  }
`;

export interface ParticleOptions {
  name: string;
  count: number;
  map: THREE.Texture;
  additive?: boolean;
  renderOrder?: number;
  depthTest?: boolean;
}

export type Particles = THREE.InstancedMesh<THREE.PlaneGeometry, THREE.ShaderMaterial> & {
  params: THREE.InstancedBufferAttribute;
};

export function createParticles({ name, count, map, additive = false, renderOrder = 2, depthTest = true }: ParticleOptions) {
  const geometry = new THREE.PlaneGeometry(1, 1);
  const params = new THREE.InstancedBufferAttribute(new Float32Array(count * 4), 4);
  params.setUsage(THREE.DynamicDrawUsage);
  geometry.setAttribute("aParams", params);
  const material = new THREE.ShaderMaterial({
    name,
    uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.fog, {
      uMap: { value: null },
      uLit: { value: new THREE.Color("#ffffff") },
      uShade: { value: new THREE.Color("#a9b8c8") },
      uWarm: { value: new THREE.Color("#ff8a3c") },
      uOpacity: { value: 1 },
      uAdditive: { value: additive ? 1 : 0 },
      uNearFade: { value: new THREE.Vector2(0, 0) },
    }]),
    vertexShader,
    fragmentShader,
    fog: true,
    transparent: true,
    depthWrite: false,
    depthTest,
    blending: THREE.CustomBlending,
    blendSrc: THREE.OneFactor,
    blendDst: THREE.OneMinusSrcAlphaFactor,
    blendSrcAlpha: THREE.OneFactor,
    blendDstAlpha: THREE.OneMinusSrcAlphaFactor,
  });
  material.uniforms.uMap.value = map;
  const mesh = new THREE.InstancedMesh(geometry, material, count) as Particles;
  mesh.name = name;
  mesh.params = params;
  mesh.frustumCulled = false;
  mesh.castShadow = mesh.receiveShadow = false;
  mesh.renderOrder = renderOrder;
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  for (let i = 0; i < count; i++) setParticle(mesh, i, 0, 0, 0, 0, 0);
  return mesh;
}

/** Write one billboard: world position, size, and look (alpha, rotation, flame warmth, extra shade). */
export function setParticle(
  mesh: Particles, index: number, x: number, y: number, z: number, size: number,
  alpha: number, rotation = 0, warm = 0, shade = 0,
) {
  const m = mesh.instanceMatrix.array as Float32Array, o = index * 16;
  m[o] = size; m[o + 1] = 0; m[o + 2] = 0; m[o + 3] = 0;
  m[o + 4] = 0; m[o + 5] = size; m[o + 6] = 0; m[o + 7] = 0;
  m[o + 8] = 0; m[o + 9] = 0; m[o + 10] = size; m[o + 11] = 0;
  m[o + 12] = x; m[o + 13] = y; m[o + 14] = z; m[o + 15] = 1;
  const p = mesh.params.array as Float32Array, q = index * 4;
  p[q] = alpha; p[q + 1] = rotation; p[q + 2] = warm; p[q + 3] = shade;
}

export function commitParticles(mesh: Particles) {
  mesh.instanceMatrix.needsUpdate = true;
  mesh.params.needsUpdate = true;
}
