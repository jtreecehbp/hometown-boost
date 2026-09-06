import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
const up = new THREE.Vector3(0, 1, 0);

/** Bake the small parts into vertex-colored meshes: one draw per moving object. */
export function sculpt(material: THREE.Material, compact: boolean) {
  const pieces: THREE.BufferGeometry[] = [];
  const add = (
    source: THREE.BufferGeometry,
    color: string,
    position: [number, number, number] = [0, 0, 0],
    scale: [number, number, number] = [1, 1, 1],
    rotation: [number, number, number] = [0, 0, 0],
  ) => {
    const geometry = source.index ? source.toNonIndexed() : source;
    if (geometry !== source) source.dispose();
    const transform = new THREE.Matrix4().compose(
      new THREE.Vector3(...position),
      new THREE.Quaternion().setFromEuler(new THREE.Euler(...rotation)),
      new THREE.Vector3(...scale),
    );
    geometry.applyMatrix4(transform);
    const shade = new THREE.Color(color);
    const colors = new Float32Array(geometry.getAttribute("position").count * 3);
    for (let i = 0; i < colors.length; i += 3) shade.toArray(colors, i);
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    pieces.push(geometry);
  };
  return {
    add,
    box(w: number, h: number, d: number, color: string, x = 0, y = 0, z = 0) {
      add(new RoundedBoxGeometry(w, h, d, 1, Math.min(0.045, w / 4, h / 4, d / 4)), color, [x, y, z]);
    },
    sphere(color: string, position: [number, number, number], scale: [number, number, number]) {
      add(new THREE.SphereGeometry(1, compact ? 16 : 24, compact ? 12 : 16), color, position, scale);
    },
    rod(a: [number, number, number], b: [number, number, number], radius: number, color: string) {
      const start = new THREE.Vector3(...a), end = new THREE.Vector3(...b);
      const direction = end.clone().sub(start);
      const geometry = new THREE.CylinderGeometry(radius, radius, direction.length(), 6);
      geometry.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(up, direction.normalize()));
      add(geometry, color, start.add(end).multiplyScalar(0.5).toArray());
    },
    finish(name: string) {
      const geometry = mergeGeometries(pieces);
      pieces.forEach(piece => piece.dispose());
      if (!geometry) throw new Error(`Unable to assemble ${name}`);
      geometry.computeBoundingSphere();
      const mesh = new THREE.Mesh(geometry, material);
      // Sky objects are far from the ground and do not need another shadow pass.
      mesh.castShadow = false;
      mesh.receiveShadow = false;
      const group = new THREE.Group();
      group.name = name;
      group.add(mesh);
      return group;
    },
  };
}
