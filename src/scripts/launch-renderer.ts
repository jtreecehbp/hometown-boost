import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import {
  createLaunchWorld,
  frameLaunchCamera,
  updateLaunchWorld,
} from "./launch-model";
import type { FlightPose } from "./launch-motion";

export function createLaunchRenderer(viewport: HTMLElement, compact: boolean) {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(
    Math.min(window.devicePixelRatio || 1, compact ? 1.25 : 1.75),
  );
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  // Neutral tone mapping keeps the brand navy and orange true instead of washing them out.
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.setClearColor(0x6ea7da, 0);
  renderer.domElement.setAttribute("aria-hidden", "true");
  viewport.appendChild(renderer.domElement);
  const world = createLaunchWorld(compact);
  // Bake the reflections once, then rebake only if the browser restores WebGL.
  // The scene can still use its daylight rig if this optional GPU pass fails.
  let reflection: THREE.WebGLRenderTarget | undefined;
  const refreshEnvironment = () => {
    world.scene.environment = null;
    reflection?.dispose();
    reflection = undefined;
    const studio = new RoomEnvironment();
    const pmrem = new THREE.PMREMGenerator(renderer);
    try {
      reflection = pmrem.fromScene(studio, 0.035, 0.1, 100, { size: compact ? 128 : 256 });
      world.scene.environment = reflection.texture;
    } catch {
      // Direct lights retain the model and scroll experience on limited devices.
    } finally {
      studio.dispose();
      pmrem.dispose();
    }
  };
  refreshEnvironment();
  renderer.domElement.addEventListener("webglcontextrestored", refreshEnvironment);
  // The far plane reaches the farmland horizon; the haze hides its edge.
  const camera = new THREE.PerspectiveCamera(39, 1, 0.1, 720);
  let width = 1,
    height = 1;
  return {
    renderer,
    world,
    resize() {
      width = Math.max(1, viewport.clientWidth);
      height = Math.max(1, viewport.clientHeight);
      renderer.setPixelRatio(
        Math.min(window.devicePixelRatio || 1, width < 700 ? 1.25 : 1.75),
      );
      renderer.setSize(width, height, false);
    },
    render(pose: FlightPose, time: number, centered = false) {
      updateLaunchWorld(world, pose, time, width / height < 0.9);
      frameLaunchCamera(camera, pose, width, height, centered, time);
      renderer.render(world.scene, camera);
    },
    dispose() {
      renderer.domElement.removeEventListener("webglcontextrestored", refreshEnvironment);
      world.scene.environment = null;
      world.dispose();
      reflection?.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
