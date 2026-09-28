import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const compiled = ts.transpileModule(readFileSync('src/scripts/launch-loader.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const flush = async () => { for (let i = 0; i < 5; i++) await Promise.resolve(); };
function fixture({ reduced = false, saveData = false, hidden = false, unavailable = false, delayed = false } = {}) {
  function element() {
    const handlers = new Map(), classes = new Set();
    return {
      dataset: {}, attributes: {}, hidden: true, disabled: false, inert: false, innerHTML: '',
      classList: { toggle: (key, value) => value ? classes.add(key) : classes.delete(key) },
      setAttribute(name, value) { this.attributes[name] = value; },
      addEventListener(name, fn, options = {}) {
        const set = handlers.get(name) ?? new Set(); set.add(fn); handlers.set(name, set);
        options.signal?.addEventListener('abort', () => set.delete(fn), { once: true });
      },
      emit(name, event = {}) { handlers.get(name)?.forEach(fn => fn(event)); },
    };
  }
  const root = element(), controls = element(), button = element(), nav = element();
  const preference = { ...element(), matches: reduced }, document = { ...element(), hidden };
  const scheduled = new Map(); let nextId = 1;
  const schedule = fn => {const id=nextId++;scheduled.set(id,fn);return id;};
  const cancel = id => scheduled.delete(id);
  const window = { ...element(), innerHeight: 900, requestIdleCallback:schedule, cancelIdleCallback:cancel, setTimeout:schedule };
  const advance = () => {const batch=[...scheduled.values()];scheduled.clear();batch.forEach(fn=>fn());};
  const paint = () => {advance();advance();advance();};
  let bottom = 4500, loads = 0, mounts = 0, options, complete;
  root.querySelector = selector => ({ '[data-launch-controls]': controls, '[data-launch-pause]': button, '.launch-chapters': nav })[selector];
  root.getBoundingClientRect = () => ({ bottom });
  const module = { mountLaunch(_, arg) { mounts++; options = arg; return unavailable ? undefined : () => {}; } };
  const loader = async () => { loads++; return delayed ? new Promise(resolve => { complete = () => resolve(module); }) : module; };
  const sandbox = { exports: {}, matchMedia: () => preference, navigator: { connection: { saveData } }, document, window, AbortController, requestAnimationFrame:schedule, cancelAnimationFrame:cancel, clearTimeout:cancel };
  vm.runInNewContext(compiled, sandbox);
  const dispose = sandbox.exports.loadLaunch(root, loader);
  return { root, controls, button, nav, document, window, preference, dispose,
    paint, advance,
    get loads() { return loads; }, get mounts() { return mounts; }, get options() { return options; },
    complete() { complete(); }, footer() { bottom = 0; window.emit('scroll'); },
  };
}
test('homepage preferences stop the 3D download before it starts and Play is an explicit opt-in', async () => {
  for (const prefs of [{ reduced: true }, { saveData: true }]) {
    const f = fixture(prefs); await flush();
    assert.equal(f.loads, 0); assert.equal(f.mounts, 0);
    assert.equal(f.root.dataset.launchStatic, 'true'); assert.equal(f.controls.hidden, false);
    f.button.emit('click'); f.button.emit('click'); await flush();
    assert.equal(f.loads, 1); assert.equal(f.mounts, 1); assert.equal(f.options.forcePlay, true);
    f.button.emit('click'); await flush(); assert.equal(f.loads, 1, 'the animation controller owns subsequent clicks');
    f.dispose();
  }
});
test('hidden tabs postpone startup and disposed pages cannot mount a late import', async () => {
  const f = fixture({ hidden: true }); await flush(); assert.equal(f.loads, 0);
  f.document.hidden = false; f.document.emit('visibilitychange'); f.paint(); await flush(); assert.equal(f.mounts, 1); f.dispose();
  const late = fixture({ delayed: true }); late.paint(); await flush(); late.window.emit('pagehide', { persisted: false }); late.complete(); await flush(); assert.equal(late.mounts, 0);
});
test('unsupported graphics keeps the concise reading layout and a retry control', async () => {
  const f = fixture({ unavailable: true }); f.paint(); await flush();
  assert.equal(f.root.dataset.launchStatic, 'true'); assert.equal(f.button.disabled, false); assert.match(f.button.innerHTML, /Play motion/);
  f.footer(); assert.equal(f.controls.inert, true); assert.equal(f.nav.inert, true); f.dispose();
});
test('a newer reduced-motion setting takes precedence over an earlier Play request', async () => {
  const f = fixture({ reduced: true, delayed: true }); f.button.emit('click');
  f.preference.emit('change'); f.complete(); await flush(); assert.equal(f.options.forcePlay, false); f.dispose();
});

test('optional scene waits for two paint opportunities and idle time; hidden pages cancel pending startup', async () => {
 const f=fixture(); await flush(); assert.equal(f.loads,0);
 f.advance(); await flush(); assert.equal(f.loads,0);
 f.advance(); await flush(); assert.equal(f.loads,0);
 f.advance(); await flush(); assert.equal(f.loads,1); f.dispose();
 const hidden=fixture(); hidden.advance(); hidden.document.hidden=true; hidden.document.emit('visibilitychange'); hidden.paint(); await flush(); assert.equal(hidden.loads,0); hidden.dispose();
});
