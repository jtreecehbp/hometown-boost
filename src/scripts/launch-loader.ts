const defaultLoader = () => import('./launch-scene');

/** Keep the 3D engine off the critical path and honor motion/data preferences before downloading it. */
export function loadLaunch(root: HTMLElement, loader = defaultLoader) {
  const controls = root.querySelector<HTMLElement>('[data-launch-controls]')!;
  const button = root.querySelector<HTMLButtonElement>('[data-launch-pause]')!;
  const navigation = root.querySelector<HTMLElement>('.launch-chapters')!;
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  const events = new AbortController();
  let waiting = preference.matches || !!connection?.saveData;
  let loading = false, disposed = false, mounted = false, preferenceVersion = 0;
  const active = () => {
    if (disposed || mounted) return;
    const visible = root.getBoundingClientRect().bottom > window.innerHeight * 0.45;
    root.classList.toggle('is-active', visible);
    navigation.inert = !visible;
    controls.inert = !visible;
  };
  function readingMode() {
    root.dataset.launchStatic = 'true';
    controls.hidden = false;
    button.disabled = false;
    button.setAttribute('aria-pressed', 'true');
    button.innerHTML = 'Play motion <span aria-hidden="true">▶</span>';
    active();
  }
  async function start(forcePlay = false) {
    if (disposed || mounted || loading) return;
    loading = true;
    const version = preferenceVersion;
    button.disabled = true;
    if (waiting) button.innerHTML = 'Loading motion…';
    try {
      const { mountLaunch } = await loader();
      if (disposed) return;
      const release = mountLaunch(root, { forcePlay: forcePlay && version === preferenceVersion });
      if (!release) throw new Error('3D unavailable');
      mounted = true;
      button.disabled = false;
      events.abort();
    } catch {
      if (!disposed) {
        waiting = true;
        readingMode();
      }
    } finally { loading = false; }
  }
  button.addEventListener('click', () => { void start(true); }, { signal: events.signal });
  preference.addEventListener('change', () => {
    preferenceVersion++;
    waiting = preference.matches || !!connection?.saveData;
    if (waiting) readingMode();
    else if (!document.hidden) void start();
  }, { signal: events.signal });
  document.addEventListener('visibilitychange', () => { if (!document.hidden && !waiting) void start(); }, { signal: events.signal });
  window.addEventListener('scroll', active, { passive: true, signal: events.signal });
  window.addEventListener('pagehide', event => { if (!event.persisted) { disposed = true; events.abort(); } }, { signal: events.signal });
  if (waiting) readingMode();
  else if (!document.hidden) void start();
  return () => { disposed = true; events.abort(); };
}
