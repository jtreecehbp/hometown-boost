import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import * as THREE from 'three';
import { pageScenes, pageSceneForPath } from '../src/data/pageScenes.ts';
import { sceneLoaders } from '../src/scripts/page-scenes/loaders.ts';
import { disposeModel } from '../src/scripts/page-scenes/kit.ts';
import { framePageCamera } from '../src/scripts/page-scene-renderer.ts';

test('every supporting page, including individual guides, has a unique scene and one reserved window', () => {
  const ids = Object.keys(pageScenes);
  assert.equal(ids.length, 16);
  assert.deepEqual(Object.keys(sceneLoaders).sort(), [...ids].sort());
  for (const id of ids) {
    const config = pageScenes[id];
    assert.equal(pageSceneForPath(config.path), id);
    assert.equal(pageSceneForPath(config.path.slice(0, -1)), id);
    const html = readFileSync('dist' + config.path + 'index.html', 'utf8');
    assert.equal((html.match(/data-page-scene="/g) || []).length, 1, config.path);
    assert.ok(html.includes('data-page-scene="' + id + '"'), config.path);
    assert.equal((html.match(/data-scene-window/g) || []).length, 1, config.path);
    assert.match(html, /data-page-scene-controls hidden/);
    assert.doesNotMatch(html, /data-town-scene|data-launch-stage/);
  }
  assert.equal(pageSceneForPath('/'), undefined);
  const home = readFileSync('dist/index.html', 'utf8');
  assert.doesNotMatch(home, /data-page-scene="/);
  assert.equal((home.match(/data-launch-stage/g) || []).length, 1);
});

function snapshot(root) {
  root.updateMatrixWorld(true);
  const parts = [];
  root.traverse(object => { if (object.isMesh) parts.push([...object.matrixWorld.elements]); });
  return parts;
}

test('the 16 scenes have distinct geometry, bounded detail, and reversible scroll choreography', async () => {
  const signatures = new Set();
  for (const [id, load] of Object.entries(sceneLoaders)) {
    const { create } = await load();
    for (const compact of [false, true]) {
      const model = create(compact);
      const hash = createHash('sha256');
      let meshes = 0, triangles = 0;
      model.root.traverse(object => {
        if (!object.isMesh) return;
        meshes++;
        const positions = object.geometry.getAttribute('position');
        assert.ok(positions.count > 0, id);
        for (const n of positions.array) assert.ok(Number.isFinite(n), id + ' finite geometry');
        triangles += (object.geometry.index?.count ?? positions.count) / 3;
        hash.update(Buffer.from(positions.array.buffer, positions.array.byteOffset, positions.array.byteLength));
      });
      assert.ok(meshes <= 24, id + ': ' + meshes + ' meshes');
      assert.ok(triangles < 65000, id + ': ' + triangles + ' triangles');
      if (!compact) signatures.add(hash.digest('hex'));
      model.update(0, 4); const opening = snapshot(model.root);
      model.update(1, 4); const ending = snapshot(model.root);
      assert.notDeepEqual(opening, ending, id + ' responds to scrolling');
      model.update(0.4, 6); const first = snapshot(model.root);
      model.update(0.95, 12); model.update(0.4, 6);
      assert.deepEqual(snapshot(model.root), first, id + ' reverses without accumulating drift');
      model.update(0.4, 7);
      // The thank-you welcome intentionally settles after its opening gesture.
      if (id !== 'thanks' && id !== 'terms') assert.notDeepEqual(snapshot(model.root), first, id + ' has an ambient gesture');
      disposeModel(model.root);
    }
  }
  assert.equal(signatures.size, 16, 'no pages share the same model');
});

test('every scene stays inside its reserved composition on phone and desktop', async () => {
  const camera = new THREE.OrthographicCamera(-5, 5, 5, -5, 0.1, 60);
  for (const [id, load] of Object.entries(sceneLoaders)) {
    const { create } = await load(); const model = create(true);
    for (const p of [0, 0.5, 1]) {
      model.update(p, 3); model.root.updateMatrixWorld(true);
      for (const [width, height, box] of [
        [1440, 826, { x: 780, y: 90, width: 550, height: 490 }],
        [390, 710, { x: 20, y: 170, width: 350, height: 290 }],
        [768, 950, { x: 395, y: 140, width: 340, height: 360 }],
      ]) {
        framePageCamera(camera, width, height, box);
        const point = new THREE.Vector3();
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity, minZ = Infinity, maxZ = -Infinity;
        // Project actual vertices: a rotated circular base's bounding-box corners aren't part of the model.
        model.root.traverse(object => {
          if (!object.isMesh) return;
          const positions = object.geometry.getAttribute('position');
          for (let i = 0; i < positions.count; i++) {
            point.fromBufferAttribute(positions, i).applyMatrix4(object.matrixWorld).project(camera);
            const sx = (point.x + 1) * width / 2, sy = (1 - point.y) * height / 2;
            minX = Math.min(minX, sx); maxX = Math.max(maxX, sx); minY = Math.min(minY, sy); maxY = Math.max(maxY, sy);
            minZ = Math.min(minZ, point.z); maxZ = Math.max(maxZ, point.z);
          }
        });
        assert.ok(minX >= box.x && maxX <= box.x + box.width, `${id}: horizontal framing ${width} at ${p}`);
        assert.ok(minY >= box.y && maxY <= box.y + box.height, `${id}: vertical framing ${width} at ${p}`);
        assert.ok(minZ > -1 && maxZ < 1, id + ': depth clipping');
      }
    }
    disposeModel(model.root);
  }
});

test('the initial page controller defers 3D and individual scene modules remain small', () => {
  const files = readdirSync('dist/_astro');
  const controller = files.find(name => /^PageBackdrop\..*\.js$/.test(name));
  assert.ok(controller);
  const source = readFileSync('dist/_astro/' + controller, 'utf8');
  assert.ok(source.length < 12000, 'initial controller stays small');
  assert.match(source, /import\(/, 'graphics are loaded on demand');
  assert.doesNotMatch(source, /class WebGLRenderer/);
});
