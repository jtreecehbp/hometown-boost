import * as THREE from 'three';
import { kit, colors } from './kit.ts';
export function create(compact: boolean) {
  const k = kit(compact);
  k.platform(3.9);
  const website = k.screen('owned-website-channel', 1.9, 1.5); website.position.set(-2.05, 0.25, 0.8); website.rotation.y = 0.18;
  const megaphone = k.part('paid-search-channel', b => {
    b.add(new THREE.CylinderGeometry(0.63, 0.23, 1.05, 32, 1, true), colors.orange, [0, 0.8, 0], [1, 1, 1], [Math.PI / 2, 0, 0]);
    b.box(0.2, 0.67, 0.23, colors.navy, 0, 0.3, -0.1);
    b.add(new THREE.TorusGeometry(0.63, 0.075, 8, 32), colors.gold, [0, 0.8, -0.54]);
  }); megaphone.position.set(2.3, 0.3, 0.8); megaphone.rotation.y = -0.35;
  const shop = k.shop('shared-business-destination', colors.navy); shop.position.set(0, 0, -1.7); shop.scale.setScalar(0.82);
  const routes = [
    k.path('website-route', [[-2, 0.2, 0.8], [-1.5, 0.2, -0.15], [-0.4, 0.2, -0.65], [0, 0.2, -1.5]], colors.blue, 0.08),
    k.path('advertising-route', [[2.3, 0.2, 0.8], [1.55, 0.2, -0.15], [0.4, 0.2, -0.65], [0, 0.2, -1.5]], colors.orange, 0.08),
  ];
  const pulses = Array.from({ length: 4 }, (_, i) => k.orb('channel-pulse-' + i, i < 2 ? colors.blue : colors.orange, 0.14));
  return { root: k.root, update(p: number, t: number) {
    pulses.forEach((pulse, i) => routes[Math.floor(i / 2)].curve.getPoint((t * 0.12 + i * 0.36 + p * 0.7) % 1, pulse.position));
    megaphone.rotation.z = Math.sin(t * 0.65) * 0.035;
    website.rotation.y = 0.18 - p * 0.25;
    k.root.rotation.y = -0.17 + p * 0.4;
  } };
}
