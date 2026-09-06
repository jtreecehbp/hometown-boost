import { kit, colors, mix, smooth } from './kit.ts';
export function create(compact: boolean) {
  const k = kit(compact);
  k.platform();
  const desk = k.part('workshop-table', b => {
    b.box(5.1, 0.22, 2.5, colors.blue, 0, 0.55, 0);
    for (const x of [-2, 2]) b.box(0.18, 0.55, 1.75, colors.navy, x, 0.18, 0);
  });
  const screen = k.screen('assembled-website');
  screen.position.set(0, 0.68, -0.3);
  const modules = Array.from({ length: 3 }, (_, i) => {
    const part = k.paper('website-building-block-' + i, 0.9, 1.05);
    return part;
  });
  const gear = k.part('turning-support-gear', b => {
    for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; b.box(0.22, 0.22, 0.25, colors.orange, Math.sin(a) * 0.62, Math.cos(a) * 0.62, 0); }
    b.sphere(colors.gold, [0, 0, 0], [0.55, 0.55, 0.12]);
    b.sphere(colors.navy, [0, 0, 0.13], [0.2, 0.2, 0.07]);
  });
  gear.position.set(2.3, 2, 0.3);
  return { root: k.root, update(p: number, t: number) {
    const assembly = smooth(0, 1.8, t) * 0.6 + p * 0.4;
    modules.forEach((part, i) => {
      const q = smooth(i * 0.13, 0.65 + i * 0.13, assembly);
      part.position.set(mix(-2.6 + i * 2.6, -0.98 + i * 0.98, q), mix(3.6 + i * 0.15, 0.88, q), mix(1.2, 0.1, q));
      part.rotation.y = (1 - q) * (i - 1) * 0.5;
    });
    gear.rotation.z = -t * 0.22 - p * 2;
    screen.rotation.y = Math.sin(t * 0.25) * 0.025;
    desk.position.y = p * 0.08;
    k.root.rotation.y = -0.12 + p * 0.45;
  } };
}
