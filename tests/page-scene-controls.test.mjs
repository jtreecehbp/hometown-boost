import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const compiled = ts.transpileModule(readFileSync('src/scripts/page-scene.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const flush = async () => { for (let i = 0; i < 5; i++) await Promise.resolve(); };

function fixture({ reduced = false, saveData = false, deferred = false, unavailable = false } = {}) {
  function element() {
    const events = new Map();
    return {
      dataset: {}, style: {}, attributes: {}, hidden: true, innerHTML: '',
      setAttribute(name, value) { this.attributes[name] = value; },
      addEventListener(name, fn, options = {}) {
        const set = events.get(name) ?? new Set(); set.add(fn); events.set(name, set);
        options.signal?.addEventListener('abort', () => set.delete(fn), { once: true });
      },
      emit(name, data = {}) { events.get(name)?.forEach(fn => fn(data)); },
    };
  }
  const window = { ...element(), innerWidth: 1440, innerHeight: 900, scrollY: 0 };
  const document = { ...element(), hidden: false };
  const preference = { ...element(), matches: reduced };
  const scope = element(), host = element(), viewport = element(), pin = element(), anchor = element(), controls = element(), button = element(), form = element();
  const field = {}, table = element();
  table.contains = object => object === table;
  form.contains = object => object === field;
  scope.querySelector = selector => selector === 'form' ? form : anchor;
  scope.querySelectorAll = () => [form, table];
  scope.getBoundingClientRect = () => ({ top: 74 - window.scrollY, bottom: 3574 - window.scrollY, height: 3500 });
  pin.getBoundingClientRect = () => ({ left: 0, top: 74, width: 1440, height: 826 });
  anchor.getBoundingClientRect = () => ({ left: 810, top: 180 - window.scrollY, width: 520, height: 440 });
  host.closest = () => scope;
  host.dataset.pageScene = 'services';
  host.querySelector = selector => ({ '[data-scene-pin]': pin, '[data-page-viewport]': viewport, '[data-page-scene-controls]': controls, '[data-page-scene-pause]': button })[selector];
  const frames = new Map(), renders = [], observers = [];
  let serial = 0, now = 0, loads = 0, disposals = 0, complete;
  const graphics = { canvas: element(), resize() {}, render(progress, time, box) { renders.push({ progress, time, box }); }, dispose() { disposals++; } };
  const factory = async () => {
    loads++;
    if (unavailable) throw new Error('WebGL unavailable');
    if (deferred) return new Promise(resolve => { complete = () => resolve(graphics); });
    return graphics;
  };
  const sandbox = {
    exports: {}, window, document, navigator: { connection: { saveData } }, AbortController,
    matchMedia: () => preference,
    requestAnimationFrame(fn) { const id = ++serial; frames.set(id, fn); return id; },
    cancelAnimationFrame(id) { frames.delete(id); },
    IntersectionObserver: class { constructor(fn) { this.fn = fn; observers.push(this); } observe() {} disconnect() {} },
    ResizeObserver: class { observe() {} disconnect() {} },
  };
  vm.runInNewContext(compiled, sandbox);
  const dispose = sandbox.exports.mountPageScene(host, factory);
  return {
    window, document, preference, host, scope, button, controls, form, field, table, graphics, renders, frames, dispose,
    get loads() { return loads; }, get disposals() { return disposals; },
    enter() { observers[0].fn([{ isIntersecting: true }]); },
    complete() { complete(); },
    tick(count = 1) { for (let i = 0; i < count; i++) { now += 40; const pending = [...frames.values()]; frames.clear(); pending.forEach(fn => fn(now)); } },
    scroll(y) { window.scrollY = y; window.emit('scroll'); },
  };
}

test('page scenes load once near view and pause freezes time and choreography', async () => {
  const f = fixture();
  assert.equal(f.loads, 0);
  f.enter(); f.enter(); await flush();
  assert.equal(f.loads, 1);
  assert.equal(f.scope.dataset.pageSceneReady, 'true');
  f.tick(20); f.scroll(900); f.tick(30);
  const before = f.renders.at(-1);
  assert.ok(before.progress > 0.2);
  f.button.emit('click'); f.scroll(1800); f.tick(20);
  assert.equal(f.frames.size, 0);
  assert.equal(f.renders.at(-1).time, before.time);
  assert.equal(f.renders.at(-1).progress, before.progress);
  f.button.emit('click'); f.tick(40);
  assert.ok(f.renders.at(-1).progress > before.progress);
  f.scroll(0); f.tick(45);
  assert.ok(f.renders.at(-1).progress < 0.01, 'scrolling up retraces the page');
  f.dispose();
});

test('reduced motion and data saving do not download 3D until Play is requested', async () => {
  for (const mode of [{ reduced: true }, { saveData: true }]) {
    const f = fixture(mode); f.enter(); await flush();
    assert.equal(f.loads, 0); assert.equal(f.frames.size, 0);
    assert.equal(f.controls.hidden, false); assert.match(f.button.innerHTML, /Play motion/);
    f.button.emit('click'); await flush(); f.tick(10);
    assert.equal(f.loads, 1); assert.ok(f.renders.at(-1).time > 0);
    f.preference.matches = true; f.preference.emit('change');
    assert.equal(f.frames.size, 0); f.dispose();
  }
});

test('background tabs, the footer, form and table interaction, and page caching suspend animation', async () => {
  const f = fixture(); f.enter(); await flush(); f.tick(10);
  for (const [suspend, resume] of [
    [() => { f.document.hidden = true; f.document.emit('visibilitychange'); }, () => { f.document.hidden = false; f.document.emit('visibilitychange'); }],
    [() => f.scroll(3200), () => f.scroll(300)],
    [() => f.form.emit('focusin'), () => f.form.emit('focusout', { relatedTarget: null })],
    [() => f.table.emit('focusin'), () => f.table.emit('focusout', { relatedTarget: null })],
    [() => f.window.emit('pagehide', { persisted: true }), () => f.window.emit('pageshow')],
  ]) {
    const time = f.renders.at(-1).time;
    suspend(); f.tick(20); assert.equal(f.frames.size, 0); assert.equal(f.renders.at(-1).time, time);
    resume(); f.tick(5); assert.ok(f.renders.at(-1).time > time);
  }
  f.form.emit('focusin'); f.form.emit('focusout', { relatedTarget: f.field });
  assert.equal(f.frames.size, 0, 'moving between form fields stays paused');
  f.scroll(800);
  assert.equal(f.controls.hidden, true, 'the motion control cannot cover fields during form interaction');
  f.form.emit('focusout', { relatedTarget: null });
  assert.equal(f.controls.hidden, false, 'the control returns after leaving the form');
  f.dispose(); assert.equal(f.disposals, 1);
});

test('failed WebGL and late loads preserve the fallback; restored contexts resume safely', async () => {
  const failed = fixture({ unavailable: true }); failed.enter(); await flush();
  assert.equal(failed.scope.dataset.pageSceneReady, undefined); assert.match(failed.button.innerHTML, /Play motion/);
  assert.equal(failed.frames.size, 0); failed.dispose();
  const late = fixture({ deferred: true }); late.enter(); await flush(); late.dispose(); late.complete(); await flush();
  assert.equal(late.disposals, 1); assert.equal(late.frames.size, 0);
  const f = fixture(); f.enter(); await flush();
  let prevented = false;
  f.graphics.canvas.emit('webglcontextlost', { preventDefault() { prevented = true; } });
  assert.equal(prevented, true); assert.equal(f.scope.dataset.pageSceneReady, undefined); assert.equal(f.frames.size, 0);
  f.graphics.canvas.emit('webglcontextrestored'); f.tick(5);
  assert.equal(f.scope.dataset.pageSceneReady, 'true'); assert.ok(f.frames.size > 0);
  f.window.emit('pagehide', { persisted: false }); assert.equal(f.disposals, 1); assert.equal(f.frames.size, 0);
});
