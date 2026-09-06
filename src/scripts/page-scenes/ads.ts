import { kit, colors } from './kit.ts';
export function create(compact: boolean) {
  const k = kit(compact);
  k.platform(3.9);
  const map = k.part('local-search-map', b => {
    for (let i = -2; i <= 2; i++) { b.box(6.3, 0.035, 0.055, colors.pale, 0, 0.02, i * 1.1); b.box(0.055, 0.035, 6.3, colors.pale, i * 1.1, 0.02, 0); }
  });
  const business = k.shop('search-destination', colors.orange); business.position.set(0, 0, -0.4);
  const rings = [1.3, 2.2, 3.2].map((r, i) => { const ring = k.ring('search-radius-' + i, r, i % 2 ? colors.blue : colors.orange); ring.rotation.x = -Math.PI / 2; ring.position.y = 0.07; return ring; });
  const sweep = k.part('search-sweep', b => { b.rod([0, 0.11, 0], [0, 0.11, 3.3], 0.07, colors.gold); b.sphere(colors.orange, [0, 0.14, 3.3], [0.15, 0.15, 0.15]); });
  const signals = Array.from({ length: 5 }, (_, i) => k.orb('local-search-signal-' + i, colors.orange, 0.12));
  const pointer = k.part('search-map-pin', b => {
    b.sphere(colors.navy, [0, 0.5, 0], [0.39, 0.39, 0.15]);
    b.sphere(colors.gold, [0, 0.5, 0.15], [0.15, 0.15, 0.06]);
    b.rod([0, 0.25, 0], [0, -0.18, 0], 0.085, colors.navy);
  });
  pointer.position.set(0, 2.1, -0.4);
  return { root: k.root, update(p: number, t: number) {
    sweep.rotation.y = t * 0.38 + p * Math.PI * 2;
    rings.forEach((ring, i) => { ring.scale.setScalar(1 + Math.sin(t * 1.1 - i + p * 3) * 0.04); });
    signals.forEach((light, i) => { const a = i * 1.256; const r = 1.5 + ((t * 0.1 + i * 0.17) % 1) * 1.4; light.position.set(Math.sin(a) * r, 0.15, Math.cos(a) * r); });
    pointer.position.y = 2.1 + Math.sin(t) * 0.08;
    map.rotation.y = 0;
    k.root.rotation.y = -0.18 + p * 0.35;
  } };
}
