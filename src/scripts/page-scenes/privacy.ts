import * as THREE from 'three';
import { kit, colors } from './kit.ts';
export function create(compact: boolean) {
  const k = kit(compact);
  k.platform(3.2);
  k.part('closed-privacy-lock', b => {
    b.box(2.7, 2.1, 1.1, colors.navy, 0, 1.18, 0);
    b.add(new THREE.TorusGeometry(0.79, 0.14, 12, 40, Math.PI), colors.blue, [0, 2.3, 0]);
    for (const x of [-0.79, 0.79]) b.rod([x, 2.3, 0], [x, 2, 0], 0.14, colors.blue);
    b.sphere(colors.gold, [0, 1.3, 0.62], [0.58, 0.58, 0.12]);
  });
  const dial = k.part('privacy-combination-dial', b => {
    b.sphere(colors.white, [0, 0, 0], [0.43, 0.43, 0.1]);
    b.box(0.065, 0.21, 0.035, colors.orange, 0, 0.2, 0.11);
  }); dial.position.set(0, 1.3, 0.76);
  const perimeter = k.ring('protective-perimeter', 2.5, colors.pale); perimeter.rotation.x = -Math.PI / 2; perimeter.position.y = 0.08;
  const points = [0, 1, 2].map(i => k.orb('protected-detail-' + i, colors.orange, 0.13));
  return { root: k.root, update(p: number, t: number) {
    dial.rotation.z = -p * Math.PI * 0.7 + Math.sin(t * 0.18) * 0.06;
    points.forEach((point, i) => { const a = t * 0.1 + i * Math.PI * 2 / 3; point.position.set(Math.sin(a) * 2.5, 0.14, Math.cos(a) * 2.5); });
    k.root.rotation.y = -0.28 + p * 0.3;
  } };
}
