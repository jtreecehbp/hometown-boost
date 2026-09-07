// Loaded only by the local browser fixture, never by the published site.
(() => {
  const mode = new URLSearchParams(location.search).get('qa_mode') || 'normal';
  if (mode === 'large-type') document.documentElement.style.fontSize = '200%';
  // Local integration checks without changing the owner's browser preferences.
  if (mode === 'reduced-motion') {
    const original = matchMedia.bind(window);
    window.matchMedia = query => {
      const result = original(query);
      if (!query.includes('prefers-reduced-motion')) return result;
      return new Proxy(result, { get(target, key) {
        if (key === 'matches') return true;
        const value = Reflect.get(target, key, target);
        return typeof value === 'function' ? value.bind(target) : value;
      } });
    };
  }
  if (mode === 'save-data') {
    Object.defineProperty(navigator, 'connection', { configurable: true, value: { saveData: true } });
  }
  if (mode === 'webgl-unavailable') {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(type, ...args) {
      return /webgl/.test(type) ? null : original.call(this, type, ...args);
    };
  }
  if (mode === 'lifecycle' || mode === 'context-loss') {
    let hidden = false, lost = false, extension;
    if (mode === 'lifecycle') Object.defineProperty(document, 'hidden', { configurable: true, get: () => hidden });
    addEventListener('DOMContentLoaded', () => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = mode === 'lifecycle' ? 'QA: hide page' : 'QA: lose WebGL context';
      button.style.cssText = 'position:fixed;z-index:9999;right:8px;top:80px;padding:10px;background:white;color:#102e50;border:2px solid #102e50;border-radius:6px';
      button.onclick = () => {
        if (mode === 'lifecycle') {
          hidden = !hidden;
          document.dispatchEvent(new Event('visibilitychange'));
          button.textContent = hidden ? 'QA: show page' : 'QA: hide page';
        } else {
          if (!extension) extension = document.querySelector('canvas')?.getContext('webgl2')?.getExtension('WEBGL_lose_context');
          if (!extension) { button.textContent = 'QA: context test unavailable'; return; }
          if (lost) extension.restoreContext(); else extension.loseContext();
          lost = !lost;
          button.textContent = lost ? 'QA: restore WebGL context' : 'QA: lose WebGL context';
        }
      };
      document.body.append(button);
    });
  }
  const metrics = { fcp: 0, lcp: 0, cls: 0, longTasks: 0, longTaskMs: 0, callbacks: 0 };
  const shifts = [];
  const work = [];
  const raf = requestAnimationFrame.bind(window);
  window.requestAnimationFrame = callback => raf(time => {
    const start = performance.now();
    try { callback(time); }
    finally { work.push(performance.now() - start); if (work.length > 300) work.shift(); metrics.callbacks++; }
  });
  const observe = (type, receive) => {
    try { new PerformanceObserver(list => list.getEntries().forEach(receive)).observe({type,buffered:true}); }
    catch { /* Report only metrics supported by this browser. */ }
  };
  observe('paint', entry => { if (entry.name === 'first-contentful-paint') metrics.fcp = entry.startTime; });
  observe('largest-contentful-paint', entry => { metrics.lcp = entry.startTime; });
  let windowStart = 0, windowLast = 0, windowShift = 0;
  observe('layout-shift', entry => {
    if (entry.hadRecentInput) return;
    shifts.push({ value: entry.value, sources: entry.sources.map(source => ({
      element: source.node?.tagName + '.' + source.node?.className,
      before: { x: source.previousRect.x, y: source.previousRect.y, width: source.previousRect.width, height: source.previousRect.height },
      after: { x: source.currentRect.x, y: source.currentRect.y, width: source.currentRect.width, height: source.currentRect.height },
    })) });
    if (shifts.length > 8) shifts.shift();
    if (entry.startTime - windowLast > 1000 || entry.startTime - windowStart > 5000) { windowStart = entry.startTime; windowShift = 0; }
    windowLast = entry.startTime; windowShift += entry.value; metrics.cls = Math.max(metrics.cls, windowShift);
  });
  observe('longtask', entry => { metrics.longTasks++; metrics.longTaskMs += entry.duration; });
  const round = n => Math.round(n * 10) / 10;
  const report = () => {
    const ordered = [...work].sort((a,b) => a-b);
    const resources = performance.getEntriesByType('resource');
    document.documentElement.dataset.qaMetrics = JSON.stringify({
      mode,
      shifts,
      ...Object.fromEntries(Object.entries(metrics).map(([key,value]) => [key,round(value)])),
      cls: Math.round(metrics.cls * 10000) / 10000,
      callbackP95: round(ordered[Math.floor(ordered.length * .95)] || 0),
      resourceKB: round(resources.reduce((n,r) => n+r.encodedBodySize,0)/1024),
      hidden: document.hidden,
      scripts: resources.filter(r => r.initiatorType === 'script').map(r => new URL(r.name).pathname),
    });
  };
  setInterval(report, 1000); addEventListener('pageshow', report);
})();
