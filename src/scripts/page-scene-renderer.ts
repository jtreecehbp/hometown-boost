import * as THREE from 'three';
import { disposeModel } from './page-scenes/kit.ts';
import { sceneLoaders } from './page-scenes/loaders.ts';
import type { PageSceneId } from '../data/pageScenes.ts';
export interface SceneFrame { x: number; y: number; width: number; height: number; }

export function framePageCamera(camera: THREE.OrthographicCamera, width: number, height: number, box: SceneFrame) {
  const span = 8.8 * height / Math.max(1, Math.min(box.width, box.height));
  camera.left = -span * width / height / 2;
  camera.right = -camera.left;
  camera.top = span / 2;
  camera.bottom = -camera.top;
  camera.position.set(7.1, 6.3, 12);
  camera.lookAt(0, 1.45, 0);
  camera.setViewOffset(width, height, width / 2 - box.x - box.width / 2, height / 2 - box.y - box.height / 2, width, height);
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld();
}

export async function createPageRenderer(viewport: HTMLElement, id: PageSceneId, compact: boolean) {
  const load = sceneLoaders[id];
  if (!load) throw new Error('Unknown page animation');
  const { create } = await load();
  const model = create(compact);
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
  } catch (error) { disposeModel(model.root); throw error; }
  const scene = new THREE.Scene();
  scene.add(model.root);
  scene.add(new THREE.HemisphereLight(0xf5fbff, 0x6c95b4, 2.5));
  const sun = new THREE.DirectionalLight(0xfff2d8, 3.2);
  sun.position.set(-4, 9, 7);
  sun.castShadow = true;
  sun.shadow.mapSize.setScalar(compact ? 512 : 1024);
  Object.assign(sun.shadow.camera, { left: -6, right: 6, top: 7, bottom: -6, near: 0.5, far: 25 });
  sun.shadow.bias = -0.001;
  sun.shadow.normalBias = 0.04;
  scene.add(sun);
  const rim = new THREE.DirectionalLight(0xaadfff, 1.7);
  rim.position.set(5, 4, -5);
  scene.add(rim);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.setAttribute('aria-hidden', 'true');
  viewport.appendChild(renderer.domElement);
  const camera = new THREE.OrthographicCamera(-5, 5, 5, -5, 0.1, 60);
  let width = 1, height = 1;
  return {
    canvas: renderer.domElement,
    resize() {
      width = Math.max(1, viewport.clientWidth); height = Math.max(1, viewport.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, width < 700 ? 1.15 : 1.5));
      renderer.setSize(width, height, false);
    },
    render(progress: number, time: number, frame: SceneFrame) {
      model.update(progress, time);
      framePageCamera(camera, width, height, frame);
      renderer.render(scene, camera);
    },
    dispose() { disposeModel(model.root); sun.shadow.map?.dispose(); renderer.dispose(); renderer.domElement.remove(); },
  };
}
