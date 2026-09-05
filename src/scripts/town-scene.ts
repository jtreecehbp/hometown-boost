import { createLaunchRenderer } from "./launch-renderer";
import { sampleFlight } from "./launch-motion";

/** A quieter view of the same town on supporting pages. */
export function mountTown(host: HTMLElement) {
  if (host.dataset.townMounted) return;
  const viewport = host.querySelector<HTMLElement>("[data-town-viewport]")!;
  const controls = host.querySelector<HTMLElement>("[data-scene-controls]")!;
  const pause = host.querySelector<HTMLButtonElement>("[data-scene-pause]")!;
  const preference = matchMedia("(prefers-reduced-motion: reduce)");
  const events = new AbortController();
  let graphics: ReturnType<typeof createLaunchRenderer>;
  try {
    graphics = createLaunchRenderer(viewport, window.innerWidth < 700);
  } catch {
    return;
  }
  host.dataset.townMounted = "true";
  let paused = preference.matches,
    visible = false,
    disposed = false,
    lost = false,
    suspended = false;
  let frame = 0,
    previous = 0,
    time = 0,
    angle = 0.53,
    target = 0.53;
  let dragging = false,
    lastX = 0;
  const render = () => {
    if (disposed || lost) return;
    const pose = sampleFlight(0);
    pose.orbit = angle + (paused ? 0 : Math.sin(time * 0.14) * 0.035);
    pose.distance = 23;
    pose.elevation = 12;
    pose.lookHeight = 2.9;
    try {
      graphics.render(pose, time, true);
      host.classList.add("is-ready");
    } catch {
      dispose();
    }
  };
  const stop = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    previous = 0;
  };
  const tick = (now: number) => {
    frame = 0;
    if (!visible || document.hidden || disposed || lost || suspended) {
      previous = 0;
      return;
    }
    if (previous && now - previous < 32) {
      frame = requestAnimationFrame(tick);
      return;
    }
    const elapsed = previous ? Math.min((now - previous) / 1000, 0.1) : 0;
    previous = now;
    if (!paused) time += elapsed;
    angle = preference.matches
      ? target
      : angle + (target - angle) * (1 - Math.exp(-elapsed * 12));
    if (Math.abs(target - angle) < 0.001) angle = target;
    render();
    if (!disposed && (!paused || angle !== target))
      frame = requestAnimationFrame(tick);
  };
  const start = () => {
    if (
      !frame &&
      visible &&
      !document.hidden &&
      !disposed &&
      !lost &&
      !suspended
    )
      frame = requestAnimationFrame(tick);
  };
  const label = () => {
    pause.textContent = paused ? "▶" : "Ⅱ";
    pause.setAttribute(
      "aria-label",
      paused ? "Play town animation" : "Pause town animation",
    );
    pause.setAttribute("aria-pressed", String(paused));
  };
  const observer = new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
    if (visible) start();
    else stop();
  });
  observer.observe(host);
  const resize = new ResizeObserver(() => {
    graphics.resize();
    render();
  });
  resize.observe(viewport);
  function dispose() {
    if (disposed) return;
    disposed = true;
    stop();
    observer.disconnect();
    resize.disconnect();
    events.abort();
    graphics.dispose();
    host.classList.remove("is-ready");
    controls.hidden = true;
    delete host.dataset.townMounted;
  }
  host.querySelector("[data-scene-left]")!.addEventListener(
    "click",
    () => {
      target -= 0.32;
      start();
    },
    { signal: events.signal },
  );
  host.querySelector("[data-scene-right]")!.addEventListener(
    "click",
    () => {
      target += 0.32;
      start();
    },
    { signal: events.signal },
  );
  pause.addEventListener(
    "click",
    () => {
      paused = !paused;
      label();
      if (paused) stop();
      else start();
      render();
    },
    { signal: events.signal },
  );
  preference.addEventListener(
    "change",
    () => {
      paused = preference.matches;
      label();
      if (paused) stop();
      else start();
      render();
    },
    { signal: events.signal },
  );
  viewport.addEventListener(
    "pointerdown",
    (event) => {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      dragging = true;
      lastX = event.clientX;
      viewport.setPointerCapture(event.pointerId);
    },
    { signal: events.signal },
  );
  viewport.addEventListener(
    "pointermove",
    (event) => {
      if (!dragging) return;
      target -= (event.clientX - lastX) * 0.006;
      lastX = event.clientX;
      start();
    },
    { signal: events.signal },
  );
  viewport.addEventListener(
    "pointerup",
    () => {
      dragging = false;
    },
    { signal: events.signal },
  );
  viewport.addEventListener(
    "pointercancel",
    () => {
      dragging = false;
    },
    { signal: events.signal },
  );
  viewport.addEventListener(
    "lostpointercapture",
    () => {
      dragging = false;
    },
    { signal: events.signal },
  );
  document.addEventListener(
    "visibilitychange",
    () => {
      if (document.hidden) stop();
      else start();
    },
    { signal: events.signal },
  );
  window.addEventListener(
    "pagehide",
    (event) => {
      if (event.persisted) {
        suspended = true;
        stop();
      } else dispose();
    },
    { signal: events.signal },
  );
  window.addEventListener(
    "pageshow",
    () => {
      suspended = false;
      graphics.resize();
      render();
      start();
    },
    { signal: events.signal },
  );
  graphics.renderer.domElement.addEventListener(
    "webglcontextlost",
    (event) => {
      event.preventDefault();
      lost = true;
      stop();
      host.classList.remove("is-ready");
      controls.hidden = true;
    },
    { signal: events.signal },
  );
  graphics.renderer.domElement.addEventListener(
    "webglcontextrestored",
    () => {
      lost = false;
      controls.hidden = false;
      render();
      start();
    },
    { signal: events.signal },
  );
  graphics.resize();
  label();
  render();
  controls.hidden = false;
  return dispose;
}
