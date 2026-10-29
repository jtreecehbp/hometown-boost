import * as THREE from 'three';
import { sculpt } from '../scene-sculpt.ts';

/** The same warm hometown palette as the home page town. */
export const colors = {
  navy: '#173b63', blue: '#2f6fa8', pale: '#cfe6f2', orange: '#ff8a3d', gold: '#efc56d', white: '#fff8ec', green: '#6c9e57', ink: '#6b5443',
  brick: '#c65b3f', cream: '#f0dcb3', sage: '#93b78e', sky: '#7ea6c8', leaf: '#86bb6c', lawn: '#a2c074', soil: '#7f9b5f', stone: '#e3d6c1', steel: '#4f6f8c', road: '#5d6670',
};
export const clamp = (n: number) => Math.max(0, Math.min(1, n));
export const smooth = (a: number, b: number, n: number) => { const t = clamp((n - a) / (b - a)); return t * t * (3 - 2 * t); };
export const mix = (a: number, b: number, p: number) => a + (b - a) * p;
export type Builder = ReturnType<typeof sculpt>;
export interface PageModel { root: THREE.Group; update: (progress: number, time: number) => void; }

/** Shared materials and baked details keep every page to a small set of draws. */
export function kit(compact: boolean) {
  const root = new THREE.Group();
  const material = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.38, metalness: 0.12 });
  function part(name: string, build: (b: Builder) => void, parent: THREE.Object3D = root) {
    const b = sculpt(material, compact);
    build(b);
    const object = b.finish(name);
    object.traverse(child => { if (child instanceof THREE.Mesh) { child.castShadow = true; child.receiveShadow = true; } });
    parent.add(object);
    return object;
  }
  /** A round piece of the hometown: lawn, warm stone edging, and a few shrubs. */
  function platform(radius = 3.6) {
    return part('hometown-lawn', b => {
      b.add(new THREE.CylinderGeometry(radius, radius * 0.97, 0.3, 48), colors.lawn, [0, -0.18, 0]);
      b.add(new THREE.CylinderGeometry(radius * 0.97, radius * 0.88, 0.2, 48), colors.soil, [0, -0.42, 0]);
      b.add(new THREE.TorusGeometry(radius * 0.985, 0.05, 6, compact ? 40 : 64), colors.stone, [0, -0.03, 0], [1, 1, 1], [Math.PI / 2, 0, 0]);
      for (let i = 0; i < 9; i++) {
        const a = (i / 9) * Math.PI * 2 + 0.3;
        b.sphere(i % 2 ? colors.green : colors.leaf, [Math.sin(a) * radius * 0.9, 0.06, Math.cos(a) * radius * 0.9], [0.22, 0.17, 0.22]);
      }
    });
  }
  function screen(name: string, w = 3.5, h = 2.45, parent: THREE.Object3D = root) {
    return part(name, b => {
      b.box(w, h, 0.2, colors.navy, 0, h / 2, 0);
      b.box(w - 0.22, h - 0.23, 0.03, colors.white, 0, h / 2, 0.12);
      for (let i = 0; i < 3; i++) b.sphere([colors.orange, colors.gold, colors.green][i], [-w / 2 + 0.28 + i * 0.17, h - 0.27, 0.15], [0.047, 0.047, 0.035]);
      b.box(w * 0.39, h * 0.46, 0.04, colors.pale, w * 0.23, h * 0.48, 0.15);
      b.box(w * 0.33, 0.11, 0.035, colors.navy, -w * 0.24, h * 0.65, 0.15);
      b.box(w * 0.27, 0.065, 0.035, colors.blue, -w * 0.27, h * 0.52, 0.15);
      b.box(w * 0.22, 0.065, 0.035, colors.blue, -w * 0.295, h * 0.43, 0.15);
      b.box(w * 0.23, h * 0.13, 0.07, colors.orange, -w * 0.29, h * 0.25, 0.17);
    }, parent);
  }
  /** A Main Street storefront: painted walls, navy trim, a sign band, and a striped awning. */
  function shop(name: string, wall = colors.brick, parent: THREE.Object3D = root) {
    return part(name, b => {
      b.box(1.5, 1.35, 1.3, wall, 0, 0.72, 0);
      b.box(1.64, 0.16, 1.44, colors.navy, 0, 1.46, 0);
      b.box(1.5, 0.22, 0.06, colors.navy, 0, 1.25, 0.66);
      b.box(0.72, 0.05, 0.065, colors.white, 0, 1.25, 0.69);
      b.box(0.56, 0.5, 0.05, colors.pale, -0.34, 0.66, 0.68);
      b.box(0.3, 0.82, 0.06, colors.navy, 0.42, 0.48, 0.68);
      for (let i = 0; i < 6; i++) b.box(0.26, 0.07, 0.42, i % 2 ? colors.white : colors.orange, -0.65 + i * 0.26, 1.02, 0.86);
    }, parent);
  }
  function tree(name: string, size = 1, parent: THREE.Object3D = root) {
    const tree = part(name, b => {
      b.rod([0, 0, 0], [0, 1.55, 0], 0.1, colors.ink);
      b.sphere(colors.green, [0, 1.8, 0], [0.64, 0.85, 0.62]);
      b.sphere(colors.leaf, [0.3, 1.66, 0.15], [0.46, 0.54, 0.44]);
    }, parent);
    tree.scale.setScalar(size);
    return tree;
  }
  /** The HB water-tower tank on its own: navy with ivory bands, an orange stripe, and a cone roof. */
  function tank(name: string, parent: THREE.Object3D = root) {
    return part(name, b => {
      b.add(new THREE.CylinderGeometry(0.62, 0.62, 0.95, 28), colors.navy, [0, 0.47, 0]);
      b.add(new THREE.CylinderGeometry(0.645, 0.645, 0.08, 28), colors.white, [0, 0.03, 0]);
      b.add(new THREE.CylinderGeometry(0.645, 0.645, 0.08, 28), colors.white, [0, 0.92, 0]);
      b.add(new THREE.CylinderGeometry(0.632, 0.632, 0.06, 28), colors.orange, [0, 0.79, 0]);
      b.add(new THREE.CylinderGeometry(0.02, 0.72, 0.42, 28), colors.navy, [0, 1.17, 0]);
      b.add(new THREE.CylinderGeometry(0.2, 0.28, 0.16, 16), colors.steel, [0, -0.07, 0]);
    }, parent);
  }
  /** The legs of the water tower, the same landmark that stands in the home page town. */
  function tower(name: string, parent: THREE.Object3D = root) {
    return part(name, b => {
      for (const [x, z] of [[-0.6, -0.6], [0.6, -0.6], [0.6, 0.6], [-0.6, 0.6]]) {
        b.rod([x, 0, z], [x * 0.62, 1.62, z * 0.62], 0.055, colors.steel);
        b.box(0.22, 0.06, 0.22, colors.white, x, 0.03, z);
      }
      b.add(new THREE.TorusGeometry(0.47, 0.03, 6, 24), colors.steel, [0, 0.82, 0], [1, 1, 1], [Math.PI / 2, 0, 0]);
      b.add(new THREE.TorusGeometry(0.4, 0.035, 6, 24), colors.steel, [0, 1.6, 0], [1, 1, 1], [Math.PI / 2, 0, 0]);
    }, parent);
  }
  function lamp(name: string, parent: THREE.Object3D = root) {
    return part(name, b => {
      b.rod([0, 0, 0], [0, 1.55, 0], 0.035, colors.navy);
      b.rod([0, 1.55, 0], [0.3, 1.6, 0], 0.028, colors.navy);
      b.box(0.2, 0.07, 0.14, colors.gold, 0.33, 1.56, 0);
    }, parent);
  }
  function ring(name: string, radius: number, color = colors.orange, parent: THREE.Object3D = root) {
    return part(name, b => b.add(new THREE.TorusGeometry(radius, 0.075, 8, compact ? 40 : 64), color), parent);
  }
  function path(name: string, points: number[][], color = colors.orange, radius = 0.07, parent: THREE.Object3D = root) {
    const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(p[0], p[1], p[2])));
    const object = part(name, b => b.add(new THREE.TubeGeometry(curve, 48, radius, 6, false), color), parent);
    return { curve, object };
  }
  function orb(name: string, color = colors.orange, radius = 0.15, parent: THREE.Object3D = root) {
    return part(name, b => b.sphere(color, [0, 0, 0], [radius, radius, radius]), parent);
  }
  function check(name: string, parent: THREE.Object3D = root) {
    return part(name, b => {
      b.rod([-0.35, 0, 0], [-0.06, -0.25, 0], 0.09, colors.orange);
      b.rod([-0.06, -0.25, 0], [0.45, 0.38, 0], 0.09, colors.orange);
    }, parent);
  }
  function paper(name: string, w = 1.7, h = 2.2, parent: THREE.Object3D = root) {
    return part(name, b => {
      b.box(w, h, 0.09, colors.white, 0, h / 2, 0);
      b.box(w * 0.58, 0.09, 0.025, colors.blue, -w * 0.04, h * 0.76, 0.06);
      for (let i = 0; i < 3; i++) b.box(w * (0.64 - i * 0.09), 0.05, 0.025, colors.pale, -i * w * 0.045, h * 0.59 - i * 0.19, 0.06);
    }, parent);
  }
  return { root, part, platform, screen, shop, tree, tank, tower, lamp, ring, path, orb, check, paper };
}

export function disposeModel(root: THREE.Object3D) {
  const geometries = new Set<THREE.BufferGeometry>(), materials = new Set<THREE.Material>();
  root.traverse(object => {
    if (!(object instanceof THREE.Mesh)) return;
    geometries.add(object.geometry);
    (Array.isArray(object.material) ? object.material : [object.material]).forEach(material => materials.add(material));
  });
  geometries.forEach(geometry => geometry.dispose());
  materials.forEach(material => material.dispose());
}
