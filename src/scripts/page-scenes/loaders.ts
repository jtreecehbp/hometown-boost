import type { PageSceneId } from '../../data/pageScenes.ts';
import type { PageModel } from './kit.ts';
type Factory = { create: (compact: boolean) => PageModel };
export const sceneLoaders: Record<PageSceneId, () => Promise<Factory>> = {
  services: () => import('./services.ts'),
  pricing: () => import('./pricing.ts'),
  process: () => import('./process.ts'),
  industries: () => import('./industries.ts'),
  about: () => import('./about.ts'),
  ads: () => import('./ads.ts'),
  faq: () => import('./faq.ts'),
  resources: () => import('./resources.ts'),
  contact: () => import('./contact.ts'),
  thanks: () => import('./thanks.ts'),
  privacy: () => import('./privacy.ts'),
  terms: () => import('./terms.ts'),
  essentials: () => import('./essentials.ts'),
  profile: () => import('./profile.ts'),
  calls: () => import('./calls.ts'),
  channels: () => import('./channels.ts'),
};
