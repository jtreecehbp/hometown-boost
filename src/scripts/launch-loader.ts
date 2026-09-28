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
  let engaged = window.scrollY > 0;
  let loading = false, disposed = false, mounted = false, preferenceVersion = 0;
  let cancelScheduled: (() => void) | undefined;
  // The scroll-driven scene is optional until a visitor starts exploring.
  // Then give useful HTML two paint opportunities before geometry work.
  function scheduleStart() {
    if (!engaged || cancelScheduled || waiting || disposed || mounted || loading || document.hidden) return;
    let frame = 0, idle = 0, timer = 0;
    const cancel = () => { cancelAnimationFrame(frame); if (idle) window.cancelIdleCallback?.(idle); clearTimeout(timer); cancelScheduled = undefined; };
    cancelScheduled = cancel;
    frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        const ready = () => { cancelScheduled = undefined; if (!waiting && !document.hidden && !disposed) void start(); };
        if (window.requestIdleCallback) idle = window.requestIdleCallback(ready, { timeout: 1500 });
        else timer = window.setTimeout(ready, 50);
      });
    });
  }
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
    cancelScheduled?.();
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
    if (waiting) { cancelScheduled?.(); readingMode(); }
    else scheduleStart();
  }, { signal: events.signal });
  document.addEventListener('visibilitychange', () => { if (document.hidden) cancelScheduled?.(); else scheduleStart(); }, { signal: events.signal });
  window.addEventListener('scroll', () => {
    active();
    if (window.scrollY > 0) { engaged = true; scheduleStart(); }
  }, { passive: true, signal: events.signal });
  window.addEventListener('pagehide', event => { cancelScheduled?.(); if (!event.persisted) { disposed = true; events.abort(); } }, { signal: events.signal });
  window.addEventListener('pageshow', scheduleStart, { signal: events.signal });
  if (waiting) readingMode();
  else scheduleStart();
  return () => { disposed = true; cancelScheduled?.(); events.abort(); };
}
