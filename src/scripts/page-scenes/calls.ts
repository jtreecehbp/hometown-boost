import { kit, colors, smooth, mix } from './kit.ts';
export function create(compact: boolean) {
  const k = kit(compact);
  k.platform(3.9);
  const screen = k.screen('website-reconnected', 2.1, 1.8); screen.position.set(-1.8, 0.35, -0.6); screen.rotation.y = 0.16;
  const phone = k.part('incoming-call-handset', b => {
    b.box(1.2, 2.35, 0.26, colors.navy, 0, 1.18, 0);
    b.box(1.03, 1.95, 0.04, colors.pale, 0, 1.21, 0.16);
    b.sphere(colors.orange, [0, 0.6, 0.22], [0.28, 0.28, 0.04]);
    b.rod([-0.26, 1.7, 0.22], [-0.26, 1.42, 0.22], 0.1, colors.white);
    b.rod([-0.26, 1.42, 0.22], [0.28, 1.24, 0.22], 0.1, colors.white);
    b.rod([0.28, 1.24, 0.22], [0.36, 1.53, 0.22], 0.1, colors.white);
  }); phone.position.set(2, 0.25, 0);
  const bridge = Array.from({ length: 5 }, (_, i) => k.part('restored-contact-path-' + i, b => b.box(0.57, 0.12, 0.44, i % 2 ? colors.blue : colors.orange)));
  const route = k.path('call-signal-route', [[-1.8, 0.35, 0.7], [-0.7, 0.4, 1], [0.8, 0.4, 1], [2, 0.5, 0.4]], colors.pale, 0.025).curve;
  const pulse = k.orb('connected-call', colors.orange, 0.17);
  const waves = [0, 1].map(i => { const wave = k.ring('phone-ring-' + i, 0.34 + i * 0.18, colors.orange); wave.position.set(2, 2.8, 0); return wave; });
  return { root: k.root, update(p: number, t: number) {
    const connection = smooth(0, 2.2, t) * 0.6 + p * 0.4;
    bridge.forEach((block, i) => { const q = smooth(i * 0.07, 0.6 + i * 0.07, connection); block.position.set((i - 2) * 0.65, mix(1.2 + i * 0.2, 0.2, q), 1); block.rotation.z = (1 - q) * (i - 2) * 0.2; });
    route.getPoint((t * 0.15 + p * 0.6) % 1, pulse.position);
    phone.rotation.z = Math.sin(t * 3) * 0.013;
    waves.forEach((wave, i) => { wave.scale.setScalar(0.9 + Math.sin(t * 1.5 - i) * 0.12); });
    k.root.rotation.y = -0.15 + p * 0.3;
  } };
}
