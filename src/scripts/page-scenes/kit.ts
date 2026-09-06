import * as THREE from 'three';
import { sculpt } from '../scene-sculpt.ts';

export const colors = { navy: '#153e64', blue: '#398fbc', pale: '#c8e6f5', orange: '#f78b36', gold: '#ffd087', white: '#fffcf6', green: '#70ad94', ink: '#25516c' };
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
  function platform(radius = 3.6) {
    return part('porcelain-stage', b => {
      b.add(new THREE.CylinderGeometry(radius, radius * 0.96, 0.3, 48), colors.white, [0, -0.18, 0]);
      b.add(new THREE.CylinderGeometry(radius * 0.94, radius * 0.94, 0.06, 48), colors.pale, [0, -0.38, 0]);
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
  function shop(name: string, color = colors.blue, parent: THREE.Object3D = root) {
    return part(name, b => {
      b.box(1.5, 1.35, 1.3, colors.white, 0, 0.72, 0);
      b.box(1.65, 0.2, 1.5, color, 0, 1.43, 0);
      b.box(0.55, 0.62, 0.05, colors.pale, -0.34, 0.79, 0.68);
      b.box(0.32, 0.9, 0.06, colors.navy, 0.42, 0.54, 0.68);
      b.box(1.58, 0.17, 0.48, color, 0, 1.12, 0.8);
      for (let i = 0; i < 4; i++) b.box(0.15, 0.18, 0.49, colors.white, -0.59 + i * 0.39, 1.12, 0.8);
      b.box(0.9, 0.2, 0.07, colors.gold, 0, 1.32, 0.76);
    }, parent);
  }
  function tree(name: string, size = 1, parent: THREE.Object3D = root) {
    const tree = part(name, b => {
      b.rod([0, 0, 0], [0, 1.65, 0], 0.11, colors.ink);
      b.sphere(colors.green, [0, 1.8, 0], [0.62, 0.83, 0.6]);
      b.sphere('#93c9b0', [0.32, 1.64, 0.13], [0.48, 0.56, 0.45]);
    }, parent);
    tree.scale.setScalar(size);
    return tree;
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
  return { root, part, platform, screen, shop, tree, ring, path, orb, check, paper };
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
