import * as THREE from "three";
import {
  createLaunchWorld,
  frameLaunchCamera,
  updateLaunchWorld,
} from "./launch-model";
import type { FlightPose } from "./launch-motion";

export function createLaunchRenderer(viewport: HTMLElement, compact: boolean) {
  const renderer = new THREE.WebGLRenderer({
    antialias: !compact,
    alpha: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(
    Math.min(window.devicePixelRatio || 1, compact ? 1.25 : 1.5),
  );
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor(0x081426, 0);
  renderer.domElement.setAttribute("aria-hidden", "true");
  viewport.appendChild(renderer.domElement);
  const world = createLaunchWorld(compact);
  const camera = new THREE.PerspectiveCamera(39, 1, 0.1, 240);
  let width = 1,
    height = 1;
  return {
    renderer,
    world,
    resize() {
      width = Math.max(1, viewport.clientWidth);
      height = Math.max(1, viewport.clientHeight);
      renderer.setPixelRatio(
        Math.min(window.devicePixelRatio || 1, width < 700 ? 1.25 : 1.5),
      );
      renderer.setSize(width, height, false);
    },
    render(pose: FlightPose, time: number, centered = false) {
      updateLaunchWorld(world, pose, time);
      frameLaunchCamera(camera, pose, width, height, centered);
      renderer.render(world.scene, camera);
    },
    dispose() {
      world.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
