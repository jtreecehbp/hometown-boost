export const pageScenes = {
  services: { path: '/services/', label: 'The website workshop', mood: 'workshop' },
  pricing: { path: '/pricing/', label: 'Room to grow', mood: 'clear' },
  process: { path: '/how-it-works/', label: 'From first idea to launch', mood: 'workshop' },
  industries: { path: '/industries/', label: 'A town full of possibilities', mood: 'town' },
  about: { path: '/about/', label: 'Growing from local roots', mood: 'town' },
  ads: { path: '/google-ads/', label: 'A signal across your hometown', mood: 'sky' },
  faq: { path: '/faq/', label: 'The pieces fall into place', mood: 'clear' },
  resources: { path: '/resources/', label: 'Open a new chapter', mood: 'paper' },
  contact: { path: '/contact/', label: 'A conversation takes flight', mood: 'sky' },
  thanks: { path: '/thank-you/', label: 'A little hometown welcome', mood: 'sky' },
  privacy: { path: '/privacy/', label: 'Care for the details', mood: 'clear' },
  terms: { path: '/terms/', label: 'A clear foundation', mood: 'paper' },
  essentials: { path: '/resources/local-business-website-essentials/', label: 'The foundations of a useful website', mood: 'workshop' },
  profile: { path: '/resources/google-business-profile-basics/', label: 'A business worth finding', mood: 'town' },
  calls: { path: '/resources/old-website-costing-calls/', label: 'Reconnect the conversation', mood: 'sky' },
  channels: { path: '/resources/website-vs-google-ads/', label: 'Two routes, working together', mood: 'clear' },
  notfound: { path: '/404/', label: 'Find your way home', mood: 'sky' },
} as const;

export type PageSceneId = keyof typeof pageScenes;
export function pageSceneForPath(path: string): PageSceneId | undefined {
  const normalized = '/' + path.split('/').filter(Boolean).join('/') + '/';
  return (Object.keys(pageScenes) as PageSceneId[]).find(id => pageScenes[id].path === normalized);
}
