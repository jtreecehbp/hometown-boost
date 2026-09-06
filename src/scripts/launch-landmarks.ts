import * as THREE from "three";
import { sculpt } from "./scene-sculpt.ts";

export interface SkyLandmarks {
  root: THREE.Group;
  balloons: [THREE.Group, THREE.Group];
  plane: THREE.Group;
  propeller: THREE.Group;
  satellite: THREE.Group;
}

const white = "#fff6e8";
const orange = "#f78b36";
const blue = "#2a749e";
const navy = "#163d60";

export function createSkyLandmarks(compact: boolean): SkyLandmarks {
  const fabric = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.72 });
  const enamel = new THREE.MeshPhysicalMaterial({
    vertexColors: true, roughness: 0.32, metalness: 0.14, clearcoat: 0.45,
  });
  const metal = new THREE.MeshStandardMaterial({
    vertexColors: true, roughness: 0.38, metalness: 0.5, side: THREE.DoubleSide,
  });

  const balloon = (name: string, stripe: string) => {
    const model = sculpt(fabric, compact);
    const profile = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.19, 0.08),
      new THREE.Vector3(0.39, 0.43),
      new THREE.Vector3(0.87, 1.04),
      new THREE.Vector3(1.18, 1.8),
      new THREE.Vector3(1.09, 2.55),
      new THREE.Vector3(0.64, 3.12),
      new THREE.Vector3(0, 3.36),
    ]).getPoints(compact ? 20 : 30).map(point => new THREE.Vector2(Math.max(0, point.x), point.y));
    for (let i = 0; i < 16; i++) {
      model.add(new THREE.LatheGeometry(profile, 4, i * Math.PI / 8, Math.PI / 8),
        i % 4 === 0 ? navy : i % 2 ? white : stripe);
    }
    model.box(0.61, 0.39, 0.49, "#b38150", 0, -0.83, 0);
    model.box(0.66, 0.08, 0.54, "#d8ac73", 0, -0.62, 0);
    for (let i = 0; i < 3; i++) {
      model.box(0.62, 0.025, 0.5, "#d8ac73", 0, -0.74 - i * 0.085, 0);
    }
    for (const x of [-1, 1]) for (const z of [-1, 1])
      model.rod([x * 0.24, -0.6, z * 0.18], [x * 0.15, 0.18, z * 0.15], 0.018, "#a87542");
    model.box(0.17, 0.13, 0.17, navy, 0, -0.12, 0);
    model.sphere("#ffc567", [0, 0.035, 0], [0.07, 0.16, 0.07]);
    return model.finish(name);
  };
  const balloons: SkyLandmarks["balloons"] = [
    balloon("orange-hot-air-balloon", orange),
    balloon("blue-hot-air-balloon", blue),
  ];

  const airframe = sculpt(enamel, compact);
  airframe.sphere(white, [0, 0, 0], [1.48, 0.26, 0.32]);
  airframe.sphere(blue, [0.3, 0.23, 0], [0.43, 0.24, 0.25]);
  airframe.box(1.92, 0.075, 0.6, orange, 0.1, -0.055, 0);
  airframe.box(0.8, 0.075, 4.15, white, 0.06, 0.05, 0);
  for (const side of [-1, 1]) {
    airframe.box(0.8, 0.08, 0.4, orange, 0.06, 0.05, side * 1.87);
    airframe.rod([0.14, -0.15, side * 0.2], [0.14, 0.02, side * 1.4], 0.027, navy);
  }
  airframe.box(0.5, 0.065, 1.55, orange, -1.03, 0.07, 0);
  const fin = new THREE.Shape();
  fin.moveTo(-1.36, 0.08);
  fin.lineTo(-1.3, 0.74);
  fin.lineTo(-1.08, 0.78);
  fin.lineTo(-0.63, 0.08);
  fin.closePath();
  airframe.add(new THREE.ExtrudeGeometry(fin, {
    depth: 0.06, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.012, bevelSegments: 1,
  }), orange, [0, 0, -0.03]);
  airframe.sphere(orange, [1.44, 0, 0], [0.22, 0.21, 0.21]);
  const plane = airframe.finish("hometown-propeller-plane");
  const blades = sculpt(enamel, compact);
  blades.box(0.04, 1.18, 0.095, navy);
  blades.box(0.04, 0.095, 1.18, navy);
  blades.sphere(white, [0.035, 0, 0], [0.11, 0.115, 0.115]);
  const propeller = blades.finish("spinning-propeller");
  propeller.position.x = 1.65;
  plane.add(propeller);

  const spacecraft = sculpt(metal, compact);
  spacecraft.box(0.83, 0.73, 0.79, "#e8b768");
  spacecraft.box(0.72, 0.07, 0.7, white, 0, 0.4, 0);
  spacecraft.rod([-2.15, 0, 0], [2.15, 0, 0], 0.045, "#aec6d6");
  for (const side of [-1, 1]) {
    const panelX = side * 1.45;
    spacecraft.box(1.63, 0.095, 1.18, "#a4bacb", panelX, 0.03, 0);
    for (let column = 0; column < 6; column++) for (let row = 0; row < 3; row++) {
      spacecraft.box(0.23, 0.02, 0.34, (column + row) % 2 ? "#256b9e" : "#174f80",
        panelX - 0.66 + column * 0.264, 0.088, -0.375 + row * 0.375);
    }
  }
  spacecraft.rod([0, 0.38, 0.08], [0, 0.78, 0.14], 0.045, white);
  const dishProfile = Array.from({ length: 12 }, (_, i) => {
    const radius = i / 11 * 0.46;
    return new THREE.Vector2(radius, radius * radius * 1.3);
  });
  spacecraft.add(new THREE.LatheGeometry(dishProfile, compact ? 20 : 32), white,
    [0, 0.7, 0.14], [1, 1, 1], [0.65, 0, -0.12]);
  spacecraft.rod([0, 0.73, 0.14], [0, 1.14, 0.45], 0.023, "#d9b77a");
  spacecraft.sphere(orange, [0, 1.14, 0.45], [0.055, 0.055, 0.055]);
  spacecraft.rod([0.28, -0.24, 0.31], [0.49, -0.9, 0.51], 0.018, "#a4bacb");
  const satellite = spacecraft.finish("solar-panel-satellite");

  const root = new THREE.Group();
  root.name = "ascent-landmarks";
  root.add(...balloons, plane, satellite);
  const landmarks = { root, balloons, plane, propeller, satellite };
  updateSkyLandmarks(landmarks, 0, 0);
  return landmarks;
}

const laneAngle = 0.44;
function place(object: THREE.Object3D, horizontal: number, height: number, depth: number) {
  object.position.set(
    Math.cos(laneAngle) * horizontal + Math.sin(laneAngle) * depth,
    height,
    -Math.sin(laneAngle) * horizontal + Math.cos(laneAngle) * depth,
  );
}

/** Fixed altitudes create true parallax; only the plane's crossing follows scroll. */
export function updateSkyLandmarks(landmarks: SkyLandmarks, lift: number, time: number, portrait = false) {
  const [warm, cool] = landmarks.balloons;
  warm.scale.setScalar(portrait ? 0.82 : 1);
  cool.scale.setScalar(portrait ? 0.55 : 0.67);
  place(warm, portrait ? -2.75 : -4.5, 12.8 + Math.sin(time * 0.32) * 0.12, -5.5);
  place(cool, portrait ? 3.2 : 5.6, 18.5 + Math.sin(time * 0.27 + 2) * 0.14, -9);
  warm.rotation.set(0.015, -0.15, Math.sin(time * 0.25) * 0.025);
  cool.rotation.set(0, 0.3, Math.sin(time * 0.22 + 1) * 0.025);

  const crossing = THREE.MathUtils.clamp((lift - 12) / 18, 0, 1);
  const travel = crossing * crossing * (3 - 2 * crossing);
  landmarks.plane.scale.setScalar(portrait ? 0.82 : 1.05);
  place(landmarks.plane, (portrait ? 5.4 : 8) * (1 - travel * 2), 28 + travel * 0.6, -7 - travel * 2);
  landmarks.plane.rotation.set(0.07, Math.PI + 0.18, -0.09 + Math.sin(travel * Math.PI) * 0.16);
  landmarks.propeller.rotation.x = time * 24;

  landmarks.satellite.scale.setScalar(portrait ? 0.67 : 0.95);
  place(landmarks.satellite, portrait ? 2.85 : 4.5, 46.5 + Math.sin(time * 0.2) * 0.09, -5.5);
  landmarks.satellite.rotation.set(0.3, -0.35 + Math.sin(time * 0.18) * 0.18, -0.18);
}
