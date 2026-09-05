import { createLaunchRenderer } from "./launch-renderer";
import {
  approachProgress,
  chapterLabels,
  progressFromAnchors,
  sampleFlight,
} from "./launch-motion";

/** One canvas, normal document scrolling, and an absolute, reversible flight path. */
export function mountLaunch(root: HTMLElement) {
  if (root.dataset.launchMounted) return;
  root.dataset.launchMounted = "true";
  const stage = root.querySelector<HTMLElement>("[data-launch-stage]")!;
  const viewport = root.querySelector<HTMLElement>("[data-launch-canvas]")!;
  const chapters = [
    ...root.querySelectorAll<HTMLElement>("[data-flight-stop]"),
  ];
  const links = [...root.querySelectorAll<HTMLElement>("[data-chapter-link]")];
  const controls = root.querySelector<HTMLElement>("[data-launch-controls]")!;
  const pauseButton = root.querySelector<HTMLButtonElement>(
    "[data-launch-pause]",
  )!;
  const label = root.querySelector<HTMLElement>("[data-launch-label]")!;
  const navigation = root.querySelector<HTMLElement>(".launch-chapters")!;
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  const events = new AbortController();
  let graphics: ReturnType<typeof createLaunchRenderer>;
  try {
    graphics = createLaunchRenderer(viewport, window.innerWidth < 700);
  } catch {
    delete root.dataset.launchMounted;
    return;
  }

  let paused = preference.matches;
  let suspended = false;
  let lostContext = false;
  let disposed = false;
  let active = false;
  let anchors: number[] = [];
  let target = 0,
    progress = 0,
    time = 0,
    lastFrame = 0,
    frameId = 0;
  let measureId = 0,
    end = 0,
    chapterIndex = -1;

  const setPauseLabel = () => {
    pauseButton.setAttribute("aria-pressed", String(paused));
    pauseButton.innerHTML = paused
      ? 'Play motion <span aria-hidden="true">▶</span>'
      : 'Pause motion <span aria-hidden="true">Ⅱ</span>';
  };
  const canAnimate = () =>
    active &&
    !paused &&
    !suspended &&
    !document.hidden &&
    !lostContext &&
    !disposed;
  const stop = () => {
    cancelAnimationFrame(frameId);
    frameId = 0;
    lastFrame = 0;
  };
  const render = () => {
    if (lostContext || disposed) return;
    try {
      graphics.render(sampleFlight(progress), time);
      stage.classList.add("is-ready");
    } catch {
      // Text and links are independent of WebGL; keep the finished emblem visible.
      dispose();
    }
  };
  const tick = (now: number) => {
    frameId = 0;
    if (!canAnimate()) {
      lastFrame = 0;
      return;
    }
    // Limit GPU work on high-refresh screens; elapsed time keeps easing consistent.
    if (lastFrame && now - lastFrame < (window.innerWidth < 700 ? 32 : 21)) {
      frameId = requestAnimationFrame(tick);
      return;
    }
    const elapsed = lastFrame ? Math.min((now - lastFrame) / 1000, 0.1) : 0;
    lastFrame = now;
    time += elapsed;
    progress = approachProgress(progress, target, elapsed);
    render();
    if (canAnimate()) frameId = requestAnimationFrame(tick);
  };
  const start = () => {
    if (!frameId && canAnimate()) frameId = requestAnimationFrame(tick);
  };
  const onScroll = () => {
    target = progressFromAnchors(window.scrollY, anchors);
    const index = Math.min(
      chapters.length - 1,
      Math.floor(target * (chapters.length - 1) + 0.35),
    );
    if (index !== chapterIndex) {
      chapterIndex = index;
      label.textContent = chapterLabels[index];
      links.forEach((link, i) =>
        i === index
          ? link.setAttribute("aria-current", "step")
          : link.removeAttribute("aria-current"),
      );
    }
    const nextActive = window.scrollY + window.innerHeight * 0.45 < end;
    if (nextActive !== active) {
      active = nextActive;
      root.classList.toggle("is-active", active);
      navigation.inert = !active;
      controls.inert = !active;
      if (!active) stop();
    }
    start();
  };
  const measure = () => {
    measureId = 0;
    if (disposed) return;
    const scroll = window.scrollY;
    // Place a chapter when its heading reaches the clear area under the header.
    anchors = chapters.map((chapter, i) =>
      i === 0
        ? 0
        : Math.max(
            0,
            chapter.getBoundingClientRect().top +
              scroll -
              window.innerHeight * 0.15,
          ),
    );
    end = root.getBoundingClientRect().bottom + scroll;
    graphics.resize();
    onScroll();
    render();
  };
  const queueMeasure = () => {
    if (!measureId) measureId = requestAnimationFrame(measure);
  };
  const resizeObserver = new ResizeObserver(queueMeasure);
  // Observing sections also catches open FAQ answers, font loading, and text zoom.
  resizeObserver.observe(viewport);
  chapters.forEach((chapter) => resizeObserver.observe(chapter));

  function dispose() {
    if (disposed) return;
    disposed = true;
    stop();
    cancelAnimationFrame(measureId);
    resizeObserver.disconnect();
    events.abort();
    graphics.dispose();
    stage.classList.remove("is-ready");
    controls.hidden = true;
    delete root.dataset.launchMounted;
  }

  pauseButton.addEventListener(
    "click",
    () => {
      paused = !paused;
      setPauseLabel();
      if (paused) stop();
      else start();
    },
    { signal: events.signal },
  );
  preference.addEventListener(
    "change",
    () => {
      paused = preference.matches;
      setPauseLabel();
      if (paused) stop();
      else start();
    },
    { signal: events.signal },
  );
  window.addEventListener("scroll", onScroll, {
    passive: true,
    signal: events.signal,
  });
  window.addEventListener("resize", queueMeasure, {
    passive: true,
    signal: events.signal,
  });
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
      queueMeasure();
      start();
    },
    { signal: events.signal },
  );
  graphics.renderer.domElement.addEventListener(
    "webglcontextlost",
    (event) => {
      event.preventDefault();
      lostContext = true;
      stop();
      stage.classList.remove("is-ready");
      controls.hidden = true;
    },
    { signal: events.signal },
  );
  graphics.renderer.domElement.addEventListener(
    "webglcontextrestored",
    () => {
      lostContext = false;
      controls.hidden = false;
      graphics.resize();
      render();
      start();
    },
    { signal: events.signal },
  );

  controls.hidden = false;
  setPauseLabel();
  measure();
  // Direct links start at their section; reduced motion keeps the tower grounded.
  progress = paused ? 0 : target;
  render();
  start();
  document.fonts.ready.then(() => {
    if (!disposed) queueMeasure();
  });
  return dispose;
}
