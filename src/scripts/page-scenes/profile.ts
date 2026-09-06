import { kit, colors, smooth } from './kit.ts';
export function create(compact: boolean) {
  const k = kit(compact);
  k.platform(3.5);
  const shop = k.shop('featured-business-profile', colors.orange);
  shop.scale.setScalar(1.4); shop.position.set(-0.65, 0, -0.1);
  const listing = k.paper('business-listing', 1.65, 2.4); listing.position.set(1.8, 0.15, -0.6);
  listing.rotation.y = -0.25;
  const lens = k.ring('profile-magnifier', 1.12, colors.navy);
  const handle = k.part('magnifier-handle', b => b.rod([0.8, -0.8, 0], [1.6, -1.65, 0], 0.13, colors.orange), lens);
  const pin = k.part('profile-location-pin', b => {
    b.sphere(colors.orange, [0, 0.4, 0], [0.4, 0.4, 0.12]); b.sphere(colors.white, [0, 0.4, 0.13], [0.15, 0.15, 0.04]);
    b.rod([0, 0.1, 0], [0, -0.35, 0], 0.07, colors.orange);
  });
  return { root: k.root, update(p: number, t: number) {
    lens.position.set(-0.65 + Math.sin(t * 0.35) * 0.25 + p * 0.8, 1.72, 1.3);
    lens.rotation.y = -0.14;
    pin.position.set(-0.65, 3.1 - smooth(0, 2, t) * 0.25, -0.1);
    listing.position.y = 0.15 + smooth(0, 0.7, p) * 0.4;
    handle.rotation.z = 0;
    k.root.rotation.y = -0.3 + p * 0.32;
  } };
}
