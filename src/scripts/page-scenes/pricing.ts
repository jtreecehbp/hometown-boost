import { kit, colors, smooth } from './kit.ts';
export function create(compact: boolean) {
  const k = kit(compact);
  k.platform(3.9);
  const platforms = [0.85, 1.5, 2.15, 2.8].map((height, i) => {
    const block = k.part('plan-platform-' + i, b => {
      b.box(1.3, height, 1.8, [colors.pale, colors.blue, colors.orange, colors.navy][i], 0, height / 2, 0);
      b.box(1.34, 0.11, 1.85, colors.white, 0, height + 0.02, 0);
      for (let j = 0; j <= i; j++) b.box(0.13, 0.07, 0.05, colors.white, -0.31 + j * 0.2, height * 0.65, 0.94);
    });
    block.position.set((i - 1.5) * 1.58, 0, 0);
    return block;
  });
  const marker = k.ring('level-of-support', 0.38);
  const route = k.path('growth-arc', [[-2.5, 1.4, -0.9], [-0.6, 2.3, -1], [1.1, 3.1, -1], [2.5, 3.6, -0.8]], colors.gold, 0.055);
  return { root: k.root, update(p: number, t: number) {
    platforms.forEach((block, i) => { block.scale.y = 0.18 + smooth(i * 0.15, 1.4 + i * 0.15, t) * 0.82; });
    route.curve.getPoint(0.1 + p * 0.8, marker.position);
    marker.rotation.y = Math.sin(t * 0.3) * 0.09;
    k.root.rotation.y = -0.22 + p * 0.16;
  } };
}
