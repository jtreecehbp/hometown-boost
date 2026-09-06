import * as THREE from 'three';
import { kit, colors, smooth } from './kit.ts';
export function create(compact: boolean) {
  const k = kit(compact);
  k.platform(3.4);
  k.part('open-welcome-envelope', b => {
    b.box(3.2, 1.65, 0.5, colors.blue, 0, 1.05, 0);
    b.rod([-1.5, 1.8, 0.29], [0, 0.75, 0.31], 0.05, colors.white);
    b.rod([0, 0.75, 0.31], [1.5, 1.8, 0.29], 0.05, colors.white);
    const flap = new THREE.Shape(); flap.moveTo(-1.5, 0); flap.lineTo(1.5, 0); flap.lineTo(0, 1.15); flap.closePath();
    b.add(new THREE.ExtrudeGeometry(flap, { depth: 0.07, bevelEnabled: false }), colors.pale, [0, 1.86, -0.22]);
  });
  const check = k.check('welcome-check'); check.scale.setScalar(1.65);
  const halo = k.ring('welcome-halo', 1, colors.orange);
  const ribbons = Array.from({ length: compact ? 10 : 16 }, (_, i) => k.part('welcome-ribbon-' + i, b => b.box(0.11, 0.32, 0.055, [colors.orange, colors.blue, colors.gold][i % 3])));
  return { root: k.root, update(p: number, t: number) {
    const welcome = smooth(0.1, 2.2, t);
    check.position.set(0, 1.5 + welcome * 1.05, 0.5);
    halo.position.copy(check.position); halo.position.z -= 0.1; halo.rotation.y = 0.12 + p * 0.45;
    ribbons.forEach((ribbon, i) => { const a = i * 2.4; const arc = smooth(0.15 + i * 0.02, 3.1 + i * 0.02, t); ribbon.position.set(Math.sin(a) * (0.3 + arc * 2.5), 1.6 + Math.sin(arc * Math.PI) * 2 - arc * 1.2, Math.cos(a) * (0.3 + arc * 1.6)); ribbon.rotation.set(arc * 3 + i, arc * 4, a + arc); });
    k.root.rotation.y = -0.2 + p * 0.3;
  } };
}
