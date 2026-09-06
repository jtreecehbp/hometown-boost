import { kit, colors, smooth } from './kit.ts';
export function create(compact: boolean) {
  const k = kit(compact);
  k.platform();
  const tree = k.tree('hometown-roots', 1.7);
  const roots = [-1, 0, 1].map((side, i) => {
    const x = side * 2.4, z = i === 1 ? 2.5 : -0.7;
    const root = k.path('root-to-business-' + i, [[0, 0.2, 0], [x * 0.5, 0.3, z * 0.4], [x, 0.1, z]], colors.orange, 0.09);
    const shop = k.shop('rooted-local-shop-' + i, [colors.navy, colors.orange, colors.blue][i]);
    shop.position.set(x, 0, z); shop.scale.setScalar(0.6);
    return { root, shop, light: k.orb('neighbor-light-' + i, colors.gold, 0.15) };
  });
  const leaves = Array.from({ length: 5 }, (_, i) => k.orb('new-leaf-' + i, i % 2 ? colors.gold : colors.green, 0.18));
  return { root: k.root, update(p: number, t: number) {
    tree.scale.y = 1.52 + smooth(0, 1, p) * 0.28;
    tree.rotation.z = Math.sin(t * 0.5) * 0.012;
    roots.forEach(({ root, shop, light }, i) => {
      root.curve.getPoint((t * 0.11 + i * 0.3 + p * 0.5) % 1, light.position);
      shop.scale.setScalar(0.55 + smooth(i * 0.18, 0.55 + i * 0.18, p) * 0.13);
    });
    leaves.forEach((leaf, i) => { const a = t * 0.12 + i * 1.256; leaf.position.set(Math.sin(a) * 1.45, 2.85 + Math.sin(a * 2) * 0.5, Math.cos(a) * 1.2); });
    k.root.rotation.y = -0.3 + p * 0.65;
  } };
}
