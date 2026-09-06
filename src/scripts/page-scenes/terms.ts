import { kit, colors, smooth, mix } from './kit.ts';
export function create(compact: boolean) {
  const k = kit(compact);
  k.platform(3.4);
  const pages = [0, 1, 2].map(i => k.paper('aligned-agreement-page-' + i, 2.6, 3.15));
  const ruler = k.part('scope-ruler', b => {
    b.box(0.43, 0.12, 3.7, colors.orange, 2, 0.1, 0);
    for (let i = 0; i < 12; i++) b.box(i % 3 ? 0.12 : 0.23, 0.025, 0.035, colors.white, 2.1, 0.17, -1.55 + i * 0.28);
  });
  const seal = k.part('agreement-seal', b => {
    b.sphere(colors.gold, [0, 0, 0], [0.44, 0.13, 0.44]);
    b.box(0.14, 0.05, 0.62, colors.orange, -0.16, -0.08, 0.4);
    b.box(0.14, 0.05, 0.62, colors.orange, 0.16, -0.08, 0.4);
  });
  return { root: k.root, update(p: number, t: number) {
    const align = smooth(0, 1.9, t) * 0.65 + p * 0.35;
    pages.forEach((page, i) => { page.position.set(mix((i - 1) * 0.9, -0.35, align), 0.12 + i * 0.1, 1.4); page.rotation.set(-Math.PI / 2, 0, mix((i - 1) * 0.25, 0, align)); });
    seal.position.set(0.25, mix(2.4, 0.61, smooth(0.6, 2.4, t)), 0.35);
    ruler.position.x = p * -0.2;
    k.root.rotation.y = -0.3 + p * 0.3;
  } };
}
