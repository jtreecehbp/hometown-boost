import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { sculpt } from "./scene-sculpt.ts";
import { REST_HEIGHT, sampleFlight, smoothRange } from "./launch-motion.ts";
import type { FlightPose } from "./launch-motion.ts";

export interface Storefront { position: THREE.Vector3; rotation: number; width: number; }
const dummy = new THREE.Object3D();
const vector = new THREE.Vector3();
const wingRotation = new THREE.Quaternion();
const axis = new THREE.Vector3(0, 0, 1);
const seed = (n: number) => { const value = Math.sin(n * 87.13 + 13.47) * 43758.5453; return value - Math.floor(value); };

function mechanic(compact: boolean) {
  const material = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.57 });
  const body = sculpt(material, compact);
  for (const side of [-1, 1]) {
    body.box(0.19, 0.12, 0.32, "#183b58", side * 0.14, 0.07, 0.055);
    body.box(0.17, 0.38, 0.23, "#df7627", side * 0.14, 0.29, 0);
  }
  body.box(0.49, 0.46, 0.3, "#f99840", 0, 0.66, 0);
  body.box(0.26, 0.24, 0.025, "#204f72", 0, 0.66, 0.16);
  body.sphere("#e8b088", [0, 1.04, 0], [0.23, 0.24, 0.2]);
  body.sphere("#237496", [0, 1.19, -0.01], [0.245, 0.12, 0.21]);
  body.box(0.37, 0.045, 0.25, "#237496", 0, 1.15, 0.16);
  for (const x of [-0.08, 0.08]) body.sphere("#16364d", [x, 1.04, 0.189], [0.027, 0.035, 0.018]);
  body.box(0.1, 0.022, 0.02, "#925237", 0, 0.95, 0.2);
  body.rod([-0.28, 0.78, 0], [-0.36, 0.48, 0.06], 0.075, "#f99840");
  body.sphere("#e8b088", [-0.36, 0.43, 0.06], [0.077, 0.088, 0.075]);
  const root = body.finish("hometown-mechanic");
  const sleeve = sculpt(material, compact);
  sleeve.box(0.14, 0.32, 0.16, "#f99840", 0, 0.17, 0);
  sleeve.sphere("#e8b088", [0, 0.4, 0], [0.082, 0.1, 0.075]);
  const arm = sleeve.finish("mechanic-wave");
  arm.position.set(0.3, 0.79, 0);
  root.add(arm);
  return { root, arm };
}

/** Sample the exact flight path rather than accumulating a trail over time. */
class ExhaustPath extends THREE.Curve<THREE.Vector3> {
  constructor() { super(); }
  getPoint(t: number, target = new THREE.Vector3()) {
    const pose = sampleFlight(0.19 + t * 0.795);
    target.set(0, -0.95, 0).applyEuler(new THREE.Euler(pose.pitch, 0, pose.bank));
    return target.add(new THREE.Vector3(pose.x, REST_HEIGHT + pose.lift, pose.z));
  }
  getPointAt(t: number, target = new THREE.Vector3()) { return this.getPoint(t, target); }
  getTangentAt(t: number, target = new THREE.Vector3()) { return this.getTangent(t, target); }
}

function vanRoute() {
  const route = new THREE.CurvePath<THREE.Vector3>();
  const v = (x: number, z: number) => new THREE.Vector3(x, 0, z);
  route.add(new THREE.LineCurve3(v(5.5, -4.65), v(5.5, 4.65)));
  route.add(new THREE.QuadraticBezierCurve3(v(5.5, 4.65), v(5.5, 5.5), v(4.65, 5.5)));
  route.add(new THREE.LineCurve3(v(4.65, 5.5), v(-4.65, 5.5)));
  route.add(new THREE.QuadraticBezierCurve3(v(-4.65, 5.5), v(-5.5, 5.5), v(-5.5, 4.65)));
  route.add(new THREE.LineCurve3(v(-5.5, 4.65), v(-5.5, -4.65)));
  route.add(new THREE.QuadraticBezierCurve3(v(-5.5, -4.65), v(-5.5, -5.5), v(-4.65, -5.5)));
  route.add(new THREE.LineCurve3(v(-4.65, -5.5), v(4.65, -5.5)));
  route.add(new THREE.QuadraticBezierCurve3(v(4.65, -5.5), v(5.5, -5.5), v(5.5, -4.65)));
  return route;
}

export function createCinema(compact: boolean, fronts: Storefront[], businesses: THREE.Vector3[], satellite: THREE.Group) {
  const root = new THREE.Group();
  root.name = "hometown-cinematic-details";
  const groundMechanic = mechanic(compact);
  groundMechanic.root.position.set(2.6, 0.22, 2.25);
  groundMechanic.root.rotation.y = 0.35;
  groundMechanic.root.scale.setScalar(1.2);
  root.add(groundMechanic.root);
  // The same cap and overalls make the second wave a recognizable little surprise.
  const satelliteMechanic = groundMechanic.root.clone(true);
  satelliteMechanic.name = "mechanic-satellite-cameo";
  satelliteMechanic.position.set(-0.08, 0.46, -0.52);
  satelliteMechanic.rotation.set(0, 0.35, 0);
  satelliteMechanic.scale.setScalar(0.82);
  satellite.add(satelliteMechanic);

  const shutters = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 0.045),
    new THREE.MeshStandardMaterial({ color: "#4e87a6", roughness: 0.55 }), fronts.length);
  shutters.name = "opening-storefront-shutters";
  shutters.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  shutters.frustumCulled = false;
  root.add(shutters);

  const birdCount = compact ? 7 : 11;
  const birdMaterial = new THREE.MeshStandardMaterial({ color: "#28465d", roughness: 0.8 });
  const birds = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 8, 6), birdMaterial, birdCount);
  birds.name = "startled-birds";
  const wingShape = new THREE.Shape();
  wingShape.moveTo(0, 0); wingShape.lineTo(0.46, -0.1); wingShape.lineTo(0.13, 0.09); wingShape.closePath();
  const wings = new THREE.InstancedMesh(new THREE.ShapeGeometry(wingShape),
    new THREE.MeshStandardMaterial({ color: "#28465d", roughness: 0.8, side: THREE.DoubleSide }), birdCount * 2);
  wings.name = "bird-wings";
  for (const object of [birds, wings]) {
    object.frustumCulled = false;
    object.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    root.add(object);
  }

  const trailSegments = compact ? 140 : 210;
  const trail = [0.35, 0.115].map((radius, index) => {
    const object = new THREE.Mesh(new THREE.TubeGeometry(new ExhaustPath(), trailSegments, radius, 6, false),
      new THREE.MeshBasicMaterial({ color: index ? "#ffd084" : "#f78b36", transparent: true, opacity: 0, depthWrite: false }));
    object.name = index ? "exhaust-trail-core" : "curved-orange-exhaust-trail";
    root.add(object);
    return object;
  });

  const paths = businesses.slice(0, 10).map((end, i) => new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.31, 0),
    new THREE.Vector3(end.x * 0.35, 0.65 + i % 3 * 0.12, end.z * 0.35),
    new THREE.Vector3(end.x * 0.72, 0.45, end.z * 0.72), end.clone().setY(0.24),
  ]));
  const routePieces = paths.map(path => new THREE.TubeGeometry(path, 36, 0.085, 5, false));
  const connectionsGeometry = mergeGeometries(routePieces)!;
  routePieces.forEach(piece => piece.dispose());
  const connections = new THREE.Mesh(connectionsGeometry,
    new THREE.MeshBasicMaterial({ color: "#fa882b", transparent: true, opacity: 0, depthWrite: false }));
  connections.name = "hometown-business-connections";
  const pulses = new THREE.InstancedMesh(new THREE.SphereGeometry(0.18, 10, 8),
    new THREE.MeshBasicMaterial({ color: "#ffc06b" }), paths.length * 2);
  pulses.name = "business-connection-lights";
  pulses.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  pulses.frustumCulled = false;
  root.add(connections, pulses);
  return { root, groundMechanic, satelliteMechanic, shutters, fronts, birds, wings, trail, trailSegments,
    connections, paths, pulses, vanRoute: vanRoute() };
}
export type Cinema = ReturnType<typeof createCinema>;

export function updateCinema(cinema: Cinema, pose: FlightPose, time: number) {
  cinema.groundMechanic.arm.rotation.z = -0.27 + Math.sin(time * 3) * 0.32;
  cinema.satelliteMechanic.getObjectByName("mechanic-wave")!.rotation.z = -0.2 + Math.sin(time * 2.6 + 1) * 0.35;
  cinema.fronts.forEach((front, i) => {
    const opening = smoothRange(i * 0.04, 0.64 + i * 0.03, pose.shutters);
    dummy.position.copy(front.position).add(vector.set(0, opening * 0.44, 0));
    dummy.rotation.set(0, front.rotation, 0);
    dummy.scale.set(front.width, 0.94 * (1 - opening) + 0.025, 1);
    dummy.updateMatrix(); cinema.shutters.setMatrixAt(i, dummy.matrix);
  });
  cinema.shutters.instanceMatrix.needsUpdate = true;

  for (let i = 0; i < cinema.birds.count; i++) {
    const angle = i * 0.64 + 0.3;
    const scatter = pose.birds * (3 + seed(i) * 8);
    dummy.position.set(-1.2 + i * 0.29 + Math.sin(angle) * scatter,
      2.76 + pose.birds * (3.5 + seed(i + 12) * 8) + Math.sin(time * 3 + i) * pose.birds * 0.09,
      8.1 + Math.cos(angle) * scatter);
    dummy.rotation.set(0, angle, 0);
    dummy.scale.set(0.065, 0.075, 0.18);
    dummy.updateMatrix(); cinema.birds.setMatrixAt(i, dummy.matrix);
    for (const side of [-1, 1]) {
      dummy.scale.set(1, 1, 1);
      dummy.quaternion.setFromEuler(new THREE.Euler(-Math.PI / 2, 0, -angle));
      wingRotation.setFromAxisAngle(axis, (side < 0 ? Math.PI : 0) + side * Math.sin(time * 10 + i) * 0.55 * pose.birds);
      dummy.quaternion.multiply(wingRotation);
      dummy.updateMatrix(); cinema.wings.setMatrixAt(i * 2 + (side === 1 ? 1 : 0), dummy.matrix);
    }
  }
  cinema.birds.instanceMatrix.needsUpdate = true;
  cinema.wings.instanceMatrix.needsUpdate = true;

  const trailProgress = THREE.MathUtils.clamp((pose.progress - 0.19) / 0.795, 0, 1);
  const segments = Math.floor(trailProgress * cinema.trailSegments);
  cinema.trail.forEach((object, i) => {
    object.visible = pose.lift > 1;
    object.geometry.setDrawRange(0, segments * 6 * 6);
    object.material.opacity = (i ? 0.55 : 0.32) * (1 - pose.overlook * 0.45);
  });
  const network = pose.network;
  cinema.connections.visible = cinema.pulses.visible = network > 0.005;
  cinema.connections.material.opacity = 0.88 * network;
  const indexCount = cinema.connections.geometry.index!.count;
  cinema.connections.geometry.setDrawRange(0, Math.floor(indexCount * network / 3) * 3);
  cinema.paths.forEach((path, i) => {
    const arrived = THREE.MathUtils.clamp(network * cinema.paths.length - i, 0, 1);
    for (let light = 0; light < 2; light++) {
      path.getPoint(light ? 1 : (time * 0.15 + i * 0.11) % 1, dummy.position);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.setScalar(arrived * (light ? 1.8 : 1));
      dummy.updateMatrix(); cinema.pulses.setMatrixAt(i * 2 + light, dummy.matrix);
    }
  });
  cinema.pulses.instanceMatrix.needsUpdate = true;
}
