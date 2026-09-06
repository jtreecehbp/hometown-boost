import * as THREE from 'three';
import { kit, colors } from './kit.ts';
export function create(compact: boolean) {
  const k = kit(compact);
  k.platform();
  k.part('open-book-binding', b => {
    b.box(4.7, 0.16, 3.15, colors.navy, 0, 0.18, 0);
    b.box(2.12, 0.27, 2.9, colors.white, -1.13, 0.36, 0);
    b.box(2.12, 0.27, 2.9, colors.white, 1.13, 0.36, 0);
    b.box(0.12, 0.38, 3.2, colors.orange, 0, 0.28, 0);
    for (let i = 0; i < 5; i++) for (const x of [-1.1, 1.1]) b.box(1.5 - i % 2 * 0.3, 0.025, 0.06, colors.pale, x, 0.52, -0.9 + i * 0.32);
  });
  const pagePivot = new THREE.Group(); pagePivot.name = 'turning-page-hinge'; pagePivot.position.y = 0.58; k.root.add(pagePivot);
  k.part('turning-book-page', b => { b.box(2.1, 0.045, 2.82, colors.white, 1.05, 0, 0); for (let i = 0; i < 4; i++) b.box(1.35, 0.022, 0.065, colors.blue, 1.04, 0.035, -0.8 + i * 0.34); }, pagePivot);
  const bookmarks = [0, 1, 2].map(i => {
    const marker = k.part('floating-bookmark-' + i, b => { b.box(0.52, 1.2, 0.1, [colors.orange, colors.blue, colors.gold][i]); b.box(0.23, 0.07, 0.025, colors.white, 0, 0.22, 0.06); });
    return marker;
  });
  return { root: k.root, update(p: number, t: number) {
    pagePivot.rotation.z = 0.25 + p * 2.5 + Math.sin(t * 0.45) * 0.08;
    bookmarks.forEach((marker, i) => { marker.position.set((i - 1) * 1.25, 2.4 + Math.sin(t * 0.6 + i) * 0.2, -0.8); marker.rotation.z = (i - 1) * -0.12; });
    k.root.rotation.y = -0.4 + p * 0.3;
  } };
}
