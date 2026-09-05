import { test } from "node:test";
import assert from "node:assert/strict";
import * as THREE from "three";
import {
  approachProgress,
  progressFromAnchors,
  sampleFlight,
} from "../src/scripts/launch-motion.ts";
import {
  createLaunchWorld,
  frameLaunchCamera,
  REST_HEIGHT,
  updateLaunchWorld,
} from "../src/scripts/launch-model.ts";

test("the rocket ignites on the ground, lifts, and retraces the same flight when scrolling back", () => {
  const ignition = sampleFlight(1 / 6);
  assert.equal(ignition.lift, 0);
  assert.ok(ignition.ignition > 0.8 && ignition.smoke > 0.8);
  let lastHeight = 0;
  const forward = Array.from({ length: 101 }, (_, i) => {
    const pose = sampleFlight(i / 100);
    assert.ok(pose.lift >= lastHeight, "ascent must never jump downward");
    assert.ok(Object.values(pose).every(Number.isFinite));
    lastHeight = pose.lift;
    return pose;
  });
  for (let i = 100; i >= 0; i--)
    assert.deepEqual(sampleFlight(i / 100), forward[i]);
  assert.equal(sampleFlight(0).ignition, 0);
  assert.equal(sampleFlight(1).lift, 48);
  assert.equal(sampleFlight(0.5).smoke, 0);
  assert.ok(
    sampleFlight(5 / 6).lift - sampleFlight(4 / 6).lift <= 2,
    "pricing and FAQ ascent stays calm",
  );
  assert.deepEqual(sampleFlight(-1), sampleFlight(0));
  assert.deepEqual(sampleFlight(Infinity), sampleFlight(0));
});

test("uneven mobile sections and expanded FAQs keep the correct chapter timing", () => {
  const anchors = [0, 800, 1650, 2500, 3400, 6200, 7400];
  anchors.forEach((scroll, index) =>
    assert.equal(progressFromAnchors(scroll, anchors), index / 6),
  );
  assert.equal(progressFromAnchors(4800, anchors), 0.75);
  assert.equal(progressFromAnchors(-50, anchors), 0);
  assert.equal(progressFromAnchors(20000, anchors), 1);
  assert.equal(progressFromAnchors(10, []), 0);
  assert.ok(Number.isFinite(progressFromAnchors(1, [0, 0, 10])));
});

test("scroll easing remains stable across refresh rates and converges after a reverse scroll", () => {
  const advance = (fps, target, start = 0) => {
    for (let i = 0; i < fps; i++)
      start = approachProgress(start, target, 1 / fps);
    return start;
  };
  assert.ok(Math.abs(advance(30, 1) - advance(120, 1)) < 0.0001);
  assert.equal(advance(60, 0, 1), 0);
});

test("the actual 3D tank separates from a stationary gantry, with finite geometry and bounded draw calls", () => {
  const world = createLaunchWorld();
  try {
    updateLaunchWorld(world, sampleFlight(0), 0);
    const gantryBounds = new THREE.Box3().setFromObject(world.gantry);
    assert.equal(world.exhaust.visible, false);
    assert.equal(world.smoke.visible, false);
    let meshCount = 0;
    world.scene.traverse((object) => {
      if (!object.isMesh) return;
      meshCount++;
      assert.ok(
        [...object.geometry.attributes.position.array].every(Number.isFinite),
      );
    });
    assert.ok(meshCount < 65, "static details must be batched for mobile");
    for (const progress of [0.17, 1 / 3, 0.5, 0.75, 1, 0.5, 0]) {
      updateLaunchWorld(world, sampleFlight(progress), 2);
      assert.equal(
        world.rocket.position.y,
        REST_HEIGHT + sampleFlight(progress).lift,
      );
      assert.deepEqual(
        new THREE.Box3().setFromObject(world.gantry),
        gantryBounds,
      );
      assert.ok([...world.smoke.instanceMatrix.array].every(Number.isFinite));
    }
    updateLaunchWorld(world, sampleFlight(1 / 3), 2);
    assert.equal(world.exhaust.parent, world.rocket);
    assert.equal(world.exhaust.visible, true);
    assert.ok(world.engineLight.intensity > 0);
  } finally {
    world.dispose();
  }
});

test("the moving tower stays in frame across mobile, tablet, desktop, and landscape views", () => {
  for (const [width, height] of [
    [320, 740],
    [390, 844],
    [768, 1024],
    [1024, 768],
    [1440, 900],
    [1920, 1080],
    [844, 390],
  ]) {
    const camera = new THREE.PerspectiveCamera(39, 1, 0.1, 240);
    for (let step = 0; step <= 30; step++) {
      const pose = sampleFlight(step / 30);
      frameLaunchCamera(camera, pose, width, height);
      for (const x of [-1.85, 0, 1.85])
        for (const y of [-0.95, 4.84]) {
          const point = new THREE.Vector3(
            x,
            REST_HEIGHT + pose.lift + y,
            0,
          ).project(camera);
          assert.ok(
            Math.abs(point.x) < 0.99 && Math.abs(point.y) < 0.99,
            `${width}×${height}, step ${step}: ${point.toArray()}`,
          );
          assert.ok(point.z > -1 && point.z < 1);
        }
    }
  }
});
