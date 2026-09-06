import * as THREE from 'three';
import { kit, colors, smooth, mix } from './kit.ts';
export function create(compact: boolean) {
  const k = kit(compact);
  k.platform(3.8);
  k.part('production-line', b => {
    b.box(6.1, 0.3, 1.9, colors.navy, 0, 0.58, 0);
    for (let i = 0; i < 13; i++) b.add(new THREE.CylinderGeometry(0.13, 0.13, 1.7, 12), i % 2 ? colors.blue : colors.pale, [-2.75 + i * 0.45, 0.8, 0], [1, 1, 1], [Math.PI / 2, 0, 0]);
    for (const x of [-2.4, 0, 2.4]) b.box(0.2, 0.6, 1.2, colors.blue, x, 0.25, 0);
  });
  const idea = k.paper('first-brief', 1.15, 1.6);
  const build = k.screen('website-in-progress', 1.5, 1.2);
  const approved = k.check('review-approved');
  const gantry = k.part('assembly-arm', b => { b.box(0.18, 2.8, 0.2, colors.orange, 0, 1.4, 0); b.box(1.15, 0.18, 0.2, colors.gold, 0.46, 2.7, 0); });
  gantry.position.set(-0.5, 0.4, -1);
  const parcel = k.part('launch-ready', b => { b.box(1.15, 0.9, 1, colors.white, 0, 0.45, 0); b.box(0.2, 0.93, 1.03, colors.orange, 0, 0.45, 0); });
  return { root: k.root, update(p: number, t: number) {
    const intro = smooth(0, 1.4, t);
    idea.position.set(-2.3, 0.8 + (1 - intro) * 1.8, 0);
    idea.rotation.y = -0.2 + p * 0.3;
    build.position.set(-0.5, 0.82, 0); build.scale.setScalar(0.7 + smooth(0, 0.45, p) * 0.3);
    approved.position.set(0.8, 1.65 + Math.sin(t * 0.8) * 0.07, 0.3);
    parcel.position.set(mix(1.1, 2.4, p), 0.85, 0);
    gantry.rotation.y = Math.sin(t * 0.6 + p * 2) * 0.2;
    k.root.rotation.y = -0.12 + p * 0.32;
  } };
}
