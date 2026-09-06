import { kit, colors } from './kit.ts';
export function create(compact: boolean) {
  const k = kit(compact);
  k.platform(4);
  const street = k.ring('neighborhood-loop', 2.65, colors.blue);
  street.rotation.x = -Math.PI / 2; street.position.y = 0.04;
  const businesses = [colors.orange, colors.blue, colors.green, colors.navy, '#cf9d67'].map((color, i) => {
    const shop = k.shop('industry-storefront-' + i, color);
    const a = i * Math.PI * 2 / 5;
    shop.position.set(Math.sin(a) * 2.6, 0, Math.cos(a) * 2.6);
    shop.rotation.y = a;
    shop.scale.setScalar(0.82 + i % 2 * 0.1);
    return shop;
  });
  k.tree('town-square-tree', 1.2);
  const van = k.part('neighborhood-delivery', b => {
    b.box(0.45, 0.3, 0.76, colors.orange, 0, 0.22, 0);
    b.box(0.35, 0.16, 0.25, colors.pale, 0, 0.35, 0.2);
    for (const x of [-0.23, 0.23]) for (const z of [-0.23, 0.23]) b.sphere(colors.navy, [x, 0.1, z], [0.065, 0.1, 0.1]);
  });
  return { root: k.root, update(p: number, t: number) {
    const a = t * 0.16 + p * Math.PI * 2;
    van.position.set(Math.sin(a) * 1.55, 0.02, Math.cos(a) * 1.55); van.rotation.y = a + Math.PI / 2;
    businesses.forEach((shop, i) => { shop.position.y = Math.sin(t * 0.35 + i) * 0.025; });
    k.root.rotation.y = p * 1.25 + Math.sin(t * 0.1) * 0.035;
  } };
}
