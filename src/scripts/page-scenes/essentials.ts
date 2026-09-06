import { kit, colors, smooth, mix } from './kit.ts';
export function create(compact: boolean) {
  const k = kit(compact);
  k.platform(3.7);
  const foundations = Array.from({ length: 6 }, (_, i) => k.part('website-foundation-' + i, b => b.box(1.1, 0.45, 1.05, i % 2 ? colors.blue : colors.pale)));
  const website = k.screen('website-on-solid-foundations', 3.5, 2.5);
  website.position.set(0, 0.8, -0.65);
  const mobile = k.screen('mobile-essentials', 0.9, 1.8); mobile.position.set(2.15, 0.25, 0.8);
  const checklist = k.check('foundation-check'); checklist.position.set(-2.25, 1.6, 0.7);
  return { root: k.root, update(p: number, t: number) {
    const assembly = smooth(0, 2, t) * 0.6 + p * 0.4;
    foundations.forEach((block, i) => {
      const q = smooth(i * 0.07, 0.62 + i * 0.07, assembly);
      block.position.set(mix((i % 3 - 1) * 2.4, (i % 3 - 1) * 1.2, q), 0.25, mix(Math.floor(i / 3) * 2.5 - 1.4, Math.floor(i / 3) * 1.12 - 0.5, q));
      block.rotation.y = (1 - q) * 0.4;
    });
    website.position.y = 1.15 - assembly * 0.38;
    mobile.rotation.y = -0.22 + p * 0.25;
    checklist.rotation.z = Math.sin(t * 0.5) * 0.055;
    k.root.rotation.y = -0.18 + p * 0.5;
  } };
}
