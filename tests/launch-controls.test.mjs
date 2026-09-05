import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";
import * as motion from "../src/scripts/launch-motion.ts";

const compiled = ts.transpileModule(
  readFileSync(
    new URL("../src/scripts/launch-scene.ts", import.meta.url),
    "utf8",
  ),
  {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  },
).outputText;

// A small event/renderer fixture tests behavior without a browser or a GPU.
function fixture({ reduced = false, unavailable = false } = {}) {
  const element = () => {
    const handlers = new Map(),
      classes = new Set(),
      attributes = {};
    return {
      hidden: true,
      inert: false,
      dataset: {},
      innerHTML: "",
      textContent: "",
      attributes,
      classList: {
        add: (name) => classes.add(name),
        remove: (name) => classes.delete(name),
        contains: (name) => classes.has(name),
        toggle: (name, value) =>
          value ? classes.add(name) : classes.delete(name),
      },
      addEventListener(name, fn, options = {}) {
        const set = handlers.get(name) ?? new Set();
        set.add(fn);
        handlers.set(name, set);
        options.signal?.addEventListener("abort", () => set.delete(fn), {
          once: true,
        });
      },
      emit(name, value = {}) {
        handlers.get(name)?.forEach((fn) => fn(value));
      },
      setAttribute: (name, value) => (attributes[name] = value),
      removeAttribute: (name) => delete attributes[name],
    };
  };
  const window = {
    ...element(),
    scrollY: 0,
    innerWidth: 1440,
    innerHeight: 900,
  };
  const document = {
    ...element(),
    hidden: false,
    fonts: { ready: Promise.resolve() },
  };
  const preference = { ...element(), matches: reduced };
  window.matchMedia = () => preference;
  const root = element(),
    stage = element(),
    viewport = element(),
    controls = element(),
    button = element(),
    label = element(),
    navigation = element();
  const heights = [0, 1000, 2000, 3000, 4000, 5500, 6500];
  const chapters = heights.map((top) => ({
    ...element(),
    getBoundingClientRect: () => ({ top: top - window.scrollY }),
  }));
  const links = heights.map(() => element());
  const selectors = {
    "[data-launch-stage]": stage,
    "[data-launch-canvas]": viewport,
    "[data-launch-controls]": controls,
    "[data-launch-pause]": button,
    "[data-launch-label]": label,
    ".launch-chapters": navigation,
  };
  root.querySelector = (selector) => selectors[selector];
  root.querySelectorAll = (selector) =>
    selector === "[data-flight-stop]" ? chapters : links;
  root.getBoundingClientRect = () => ({ bottom: 8000 - window.scrollY });
  const renders = [],
    canvas = element(),
    frames = new Map();
  let next = 0,
    now = 0,
    disposed = false;
  const graphics = {
    renderer: { domElement: canvas },
    resize() {},
    render(pose, time) {
      renders.push({ pose, time });
    },
    dispose() {
      disposed = true;
    },
  };
  const sandbox = {
    exports: {},
    window,
    document,
    AbortController,
    requestAnimationFrame: (fn) => {
      const id = ++next;
      frames.set(id, fn);
      return id;
    },
    cancelAnimationFrame: (id) => frames.delete(id),
    ResizeObserver: class {
      observe() {}
      disconnect() {}
    },
    require(name) {
      if (name === "./launch-motion") return motion;
      return {
        createLaunchRenderer() {
          if (unavailable) throw Error("WebGL unavailable");
          return graphics;
        },
      };
    },
  };
  vm.runInNewContext(compiled, sandbox);
  const cleanup = sandbox.exports.mountLaunch(root);
  return {
    window,
    document,
    preference,
    root,
    stage,
    controls,
    button,
    label,
    navigation,
    links,
    renders,
    canvas,
    cleanup,
    get disposed() {
      return disposed;
    },
    get pendingFrames() {
      return frames.size;
    },
    scroll(y) {
      window.scrollY = y;
      window.emit("scroll");
    },
    advance(count = 90) {
      for (let i = 0; i < count; i++) {
        const scheduled = [...frames.values()];
        frames.clear();
        now += 34;
        scheduled.forEach((fn) => fn(now));
      }
    },
  };
}

test("pause freezes the flight and ambient effects while scrolling and links remain available", () => {
  const app = fixture();
  try {
    app.scroll(2865);
    app.advance();
    assert.ok(app.renders.at(-1).pose.lift > 20);
    app.button.emit("click");
    const frozen = app.renders.at(-1),
      count = app.renders.length;
    app.scroll(6200);
    app.advance();
    assert.equal(app.renders.length, count);
    assert.equal(app.button.attributes["aria-pressed"], "true");
    assert.equal(app.navigation.inert, false);
    app.button.emit("click");
    app.advance();
    assert.ok(app.renders.at(-1).pose.lift > frozen.pose.lift);
    app.scroll(0);
    app.advance();
    assert.equal(app.renders.at(-1).pose.lift, 0);
    assert.equal(app.renders.at(-1).pose.ignition, 0);
  } finally {
    app.cleanup();
  }
});

test("reduced motion starts grounded and stationary until the visitor explicitly plays", () => {
  const app = fixture({ reduced: true });
  try {
    app.scroll(6500);
    app.advance();
    assert.equal(app.renders.at(-1).pose.lift, 0);
    assert.equal(app.renders.at(-1).time, 0);
    assert.equal(app.pendingFrames, 0);
    app.button.emit("click");
    app.advance();
    assert.ok(app.renders.at(-1).pose.lift > 40);
  } finally {
    app.cleanup();
  }
});

test("background tabs, the footer, and page caching suspend rendering and resume safely", () => {
  const app = fixture();
  try {
    app.advance(3);
    app.document.hidden = true;
    app.document.emit("visibilitychange");
    const count = app.renders.length;
    app.advance();
    assert.equal(app.renders.length, count);
    app.document.hidden = false;
    app.document.emit("visibilitychange");
    app.advance(3);
    assert.ok(app.renders.length > count);
    app.scroll(7900);
    app.advance();
    assert.equal(app.pendingFrames, 0);
    assert.equal(app.controls.inert, true);
    app.scroll(1000);
    app.advance(3);
    app.window.emit("pagehide", { persisted: true });
    assert.equal(app.pendingFrames, 0);
    assert.equal(app.disposed, false);
    app.window.emit("pageshow");
    app.advance(3);
    assert.ok(app.pendingFrames > 0);
  } finally {
    app.cleanup();
  }
  assert.equal(app.disposed, true);
  assert.equal(app.controls.hidden, true);
  assert.equal(app.pendingFrames, 0);
});

test("WebGL failure keeps the emblem fallback and hides unavailable animation controls", () => {
  const unavailable = fixture({ unavailable: true });
  assert.equal(unavailable.controls.hidden, true);
  assert.equal(unavailable.stage.classList.contains("is-ready"), false);
  const app = fixture();
  try {
    app.canvas.emit("webglcontextlost", { preventDefault() {} });
    assert.equal(app.controls.hidden, true);
    assert.equal(app.stage.classList.contains("is-ready"), false);
    assert.equal(app.pendingFrames, 0);
    app.canvas.emit("webglcontextrestored");
    app.advance(3);
    assert.equal(app.controls.hidden, false);
    assert.equal(app.stage.classList.contains("is-ready"), true);
  } finally {
    app.cleanup();
  }
});
