import * as THREE from 'three';
import { kit, colors } from './kit.ts';
export function create(compact: boolean) {
  const k = kit(compact);
  k.platform(3.6);
  const mailbox = k.part('hometown-mailbox', b => {
    b.box(0.18, 1.5, 0.2, colors.navy, -1.3, 0.75, 0);
    b.box(1.6, 1.05, 1.3, colors.blue, -1.3, 1.7, 0);
    b.box(1.25, 0.12, 0.07, colors.navy, -1.3, 1.86, 0.69);
    b.box(0.7, 0.22, 0.06, colors.white, -1.3, 1.55, 0.69);
    b.rod([-0.42, 1.72, 0.15], [-0.42, 2.48, 0.15], 0.055, colors.orange);
    b.box(0.4, 0.27, 0.06, colors.orange, -0.24, 2.4, 0.15);
  });
  const curve = k.path('hello-flight-path', [[-2.5, 0.8, 1.3], [0, 2.75, 1.3], [2.35, 2.3, -0.8], [1.2, 1.25, -1.5], [-1.25, 1.9, 0.9]], colors.gold, 0.035).curve;
  const plane = k.part('paper-plane', b => {
    for (const side of [-1, 1]) {
      const shape = new THREE.Shape(); shape.moveTo(-0.8, 0); shape.lineTo(1.1, 0); shape.lineTo(-0.6, side * 0.75); shape.closePath();
      b.add(new THREE.ExtrudeGeometry(shape, { depth: 0.025, bevelEnabled: false }), side < 0 ? colors.white : colors.orange, [0, 0, 0], [1, 1, 1], [-Math.PI / 2, 0, side * 0.06]);
    }
  });
  const direction = new THREE.Vector3();
  return { root: k.root, update(p: number, t: number) {
    const flight = (t * 0.065 + p * 0.75) % 1;
    curve.getPoint(flight, plane.position); curve.getTangent(flight, direction);
    plane.rotation.set(0, -Math.atan2(direction.z, direction.x), Math.asin(direction.y) * 0.5);
    mailbox.rotation.y = 0.08;
    k.root.rotation.y = -0.15 + p * 0.25;
  } };
}
