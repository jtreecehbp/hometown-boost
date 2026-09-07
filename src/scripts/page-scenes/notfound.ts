import * as THREE from 'three';
import { kit, colors, smooth } from './kit.ts';

export function create(compact: boolean) {
  const k = kit(compact);
  k.platform(3.4);
  k.part('compass-cradle', b => {
    b.box(2.6, 0.2, 1.7, colors.navy, 0, 0.12, 0);
    b.rod([-1.1, 0.2, 0], [-1.1, 1.8, 0], 0.1, colors.gold);
    b.rod([1.1, 0.2, 0], [1.1, 1.8, 0], 0.1, colors.gold);
  });
  const compass = new THREE.Group();
  compass.position.y = 2;
  compass.rotation.x = -0.22;
  k.root.add(compass);
  k.part('compass-face-and-bearings', b => {
    b.add(new THREE.CylinderGeometry(1.75, 1.75, 0.25, 48), colors.navy, [0, 0, 0], [1, 1, 1], [Math.PI / 2, 0, 0]);
    b.add(new THREE.CylinderGeometry(1.6, 1.6, 0.04, 48), colors.white, [0, 0, 0.15], [1, 1, 1], [Math.PI / 2, 0, 0]);
    b.add(new THREE.TorusGeometry(1.69, 0.075, 8, 64), colors.gold, [0, 0, 0.12]);
    for (let i = 0; i < 24; i++) {
      const a = i * Math.PI / 12, length = i % 6 === 0 ? 0.22 : 0.09;
      b.rod([Math.sin(a) * (1.43 - length), Math.cos(a) * (1.43 - length), 0.2], [Math.sin(a) * 1.43, Math.cos(a) * 1.43, 0.2], i % 6 === 0 ? 0.035 : 0.017, i === 0 ? colors.orange : colors.blue);
    }
  }, compass);
  const loop = k.ring('compass-carry-loop', 0.23, colors.gold, compass);
  loop.position.y = 1.99;
  const needle = k.part('two-tone-compass-needle', b => {
    for (const direction of [1, -1]) {
      const triangle = new THREE.Shape();
      triangle.moveTo(0, 1.24 * direction);
      triangle.lineTo(-0.3, 0);
      triangle.lineTo(0.3, 0);
      triangle.closePath();
      b.add(new THREE.ExtrudeGeometry(triangle, { depth: 0.07, bevelEnabled: true, bevelThickness: 0.025, bevelSize: 0.025, bevelSegments: 1, steps: 1 }), direction === 1 ? colors.orange : colors.blue, [0, 0, 0.25]);
    }
    b.sphere(colors.gold, [0, 0, 0.37], [0.14, 0.14, 0.09]);
  }, compass);
  return { root: k.root, update(p: number, t: number) {
    const settle = smooth(0, 2.5, t);
    needle.rotation.z = (1 - p) * (1.1 * (1 - settle) + Math.sin(t * 0.8) * 0.09) - p * 0.35;
    compass.rotation.y = Math.sin(t * 0.3) * 0.045;
    k.root.rotation.y = -0.18 + p * 0.32;
  } };
}
