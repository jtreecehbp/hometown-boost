import type { PageSceneId } from '../data/pageScenes';
import type { createPageRenderer, SceneFrame } from './page-scene-renderer';
type Graphics = Awaited<ReturnType<typeof createPageRenderer>>;
const clamp = (n: number) => Math.max(0, Math.min(1, n));
const mix = (a: number, b: number, p: number) => a + (b - a) * p;
const loadGraphics = async (viewport: HTMLElement, id: PageSceneId, compact: boolean) =>
  (await import('./page-scene-renderer')).createPageRenderer(viewport, id, compact);

/** The lightweight controller loads one scene only when its reserved window approaches view. */
export function mountPageScene(host: HTMLElement, factory = loadGraphics) {
  if (host.dataset.sceneMounted) return;
  const scope = host.closest<HTMLElement>('main')!;
  const anchor = scope.querySelector<HTMLElement>('[data-scene-window]');
  if (!anchor) return;
  host.dataset.sceneMounted = 'true';
  const pin = host.querySelector<HTMLElement>('[data-scene-pin]')!;
  const viewport = host.querySelector<HTMLElement>('[data-page-viewport]')!;
  const controls = host.querySelector<HTMLElement>('[data-page-scene-controls]')!;
  const button = host.querySelector<HTMLButtonElement>('[data-page-scene-pause]')!;
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  const events = new AbortController();
  let paused = preference.matches || !!connection?.saveData;
  let graphics: Graphics | undefined;
  let loading = false, disposed = false, visible = true, suspended = false, lost = false, focused = false;
  let frame = 0, last = 0, time = 0, progress = 0, target = 0;
  let box: SceneFrame = { x: 0, y: 0, width: 1, height: 1 };
  const label = () => {
    button.innerHTML = paused ? 'Play motion <span aria-hidden="true">▶</span>' : 'Pause motion <span aria-hidden="true">Ⅱ</span>';
    button.setAttribute('aria-label', paused ? 'Play background animation' : 'Pause background animation');
    button.setAttribute('aria-pressed', String(paused));
  };
  const stop = () => { cancelAnimationFrame(frame); frame = 0; last = 0; };
  const canAnimate = () => !!graphics && !paused && visible && !document.hidden && !suspended && !lost && !focused && !disposed;
  const render = () => {
    if (!graphics || lost || disposed) return;
    try {
      graphics.render(progress, time, box);
      scope.dataset.pageSceneReady = 'true';
    } catch { dispose(); }
  };
  const tick = (now: number) => {
    frame = 0;
    if (!canAnimate()) { last = 0; return; }
    if (last && now - last < 32) { frame = requestAnimationFrame(tick); return; }
    const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
    last = now; time += dt;
    progress += (target - progress) * (1 - Math.exp(-dt * 7));
    render();
    if (canAnimate()) frame = requestAnimationFrame(tick);
  };
  const start = () => { if (!frame && canAnimate()) frame = requestAnimationFrame(tick); };
  const measure = () => {
    if (disposed) return;
    const rect = anchor.getBoundingClientRect(), stage = pin.getBoundingClientRect(), page = scope.getBoundingClientRect();
    const w = stage.width, h = stage.height;
    const q = clamp((stage.top + 36 - rect.top) / Math.max(1, rect.height));
    const dock = q * q * (3 - 2 * q);
    const small = w < 700;
    const size = Math.min(small ? 270 : 380, w * (small ? 0.7 : 0.33), h * 0.54);
    box = {
      x: mix(rect.left - stage.left, w - size + (small ? 25 : 15), dock),
      y: mix(rect.top - stage.top, h * 0.28, dock),
      width: mix(rect.width, size, dock), height: mix(rect.height, size, dock),
    };
    viewport.style.opacity = String(1 - dock * (small ? 0.7 : 0.5));
    target = clamp(-page.top / Math.max(1, page.height - window.innerHeight));
    visible = page.bottom > 100 && page.top < window.innerHeight;
    controls.hidden = !visible || lost || (!graphics && !paused);
    if (!visible) stop();
    else { if (!canAnimate()) render(); start(); }
  };
  const onResize = () => { graphics?.resize(); measure(); render(); };
  const resize = new ResizeObserver(onResize);
  resize.observe(pin); resize.observe(anchor); resize.observe(scope);
  async function ensureGraphics() {
    if (graphics || loading || disposed) return;
    loading = true;
    try {
      const result = await factory(viewport, host.dataset.pageScene as PageSceneId, window.innerWidth < 700);
      if (disposed) { result.dispose(); return; }
      graphics = result;
      graphics.canvas.addEventListener('webglcontextlost', event => {
        event.preventDefault(); lost = true; stop(); controls.hidden = true; delete scope.dataset.pageSceneReady;
      }, { signal: events.signal });
      graphics.canvas.addEventListener('webglcontextrestored', () => {
        lost = false; onResize(); controls.hidden = !visible; start();
      }, { signal: events.signal });
      graphics.resize(); measure(); progress = paused ? 0 : target; render(); label(); start();
    } catch {
      paused = true; label(); controls.hidden = !visible;
    } finally { loading = false; }
  }
  const observer = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting) && !paused) { observer.disconnect(); void ensureGraphics(); }
  }, { rootMargin: '160px' });
  observer.observe(anchor);
  button.addEventListener('click', () => {
    paused = !paused; label();
    if (paused) stop();
    else { void ensureGraphics(); start(); }
  }, { signal: events.signal });
  preference.addEventListener('change', () => {
    paused = preference.matches; label();
    if (paused) stop();
    else { void ensureGraphics(); start(); }
  }, { signal: events.signal });
  window.addEventListener('scroll', measure, { passive: true, signal: events.signal });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else start(); }, { signal: events.signal });
  window.addEventListener('pagehide', event => { if (event.persisted) { suspended = true; stop(); } else dispose(); }, { signal: events.signal });
  window.addEventListener('pageshow', () => { suspended = false; onResize(); start(); }, { signal: events.signal });
  const form = scope.querySelector('form');
  form?.addEventListener('focusin', () => { focused = true; stop(); }, { signal: events.signal });
  form?.addEventListener('focusout', event => {
    focused = form.contains(event.relatedTarget as Node | null);
    if (!focused) start();
  }, { signal: events.signal });
  function dispose() {
    if (disposed) return;
    disposed = true; stop(); observer.disconnect(); resize.disconnect(); events.abort(); graphics?.dispose();
    delete scope.dataset.pageSceneReady; delete host.dataset.sceneMounted; controls.hidden = true;
  }
  label(); measure();
  return dispose;
}
