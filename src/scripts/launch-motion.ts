/** Camera, flight, and scene cues share one reversible, scroll-driven timeline. */
export const REST_HEIGHT = 3.6;
export interface FlightPose {
  progress: number;
  lift: number;
  x: number;
  z: number;
  bank: number;
  pitch: number;
  ignition: number;
  smoke: number;
  orbit: number;
  distance: number;
  elevation: number;
  lookHeight: number;
  fov: number;
  cameraRoll: number;
  overlook: number;
  cloud: number;
  sceneOpen: number;
  shutters: number;
  birds: number;
  network: number;
}
export const chapterLabels = [
  "Your hometown", "Your website", "Get found", "Keep growing",
  "Your plan", "Good questions", "Let’s launch",
];
export const chapterProgress = [0, 0.16, 0.37, 0.6, 0.69, 0.82, 1];
export const clamp = (value: number, min = 0, max = 1) =>
  Math.max(min, Math.min(max, Number.isFinite(value) ? value : min));
const smooth = (value: number) => { const t = clamp(value); return t * t * (3 - 2 * t); };
export const smoothRange = (start: number, end: number, value: number) => smooth((value - start) / (end - start));
const ground: FlightPose = {
  progress: 0, lift: 0, x: 0, z: 0, bank: 0, pitch: 0, ignition: 0, smoke: 0,
  orbit: 0.44, distance: 22, elevation: 3.5, lookHeight: 3.8, fov: 43,
  cameraRoll: 0, overlook: 0, cloud: 0, sceneOpen: 0, shutters: 0, birds: 0, network: 0,
};
const shot = (at: number, lift: number, pose: Partial<FlightPose>) => ({
  at, pose: { ...ground, lift, ignition: lift > 0 ? 1 : 0, ...pose },
});
const stops = [
  // Clear the foreground rooftops so the complete tower introduces the story.
  shot(0, 0, {}),
  shot(0.065, 0, { orbit: 0.54, distance: 21, elevation: 5, lookHeight: 3.8, fov: 41 }),
  shot(0.115, 0, { ignition: 0.3, smoke: 0.15, orbit: 0.6, distance: 19, elevation: 4, lookHeight: 3.7, fov: 40 }),
  shot(0.17, 0, { ignition: 0.98, smoke: 0.95, orbit: 0.62, distance: 17.2, elevation: 3, lookHeight: 4, fov: 40 }),
  shot(0.24, 2.4, { smoke: 1, orbit: 0.7, distance: 18.6, elevation: 3.5, lookHeight: 4, fov: 44 }),
  // The S-shaped climb and opposing camera orbit create the balloon fly-by.
  shot(0.33, 7.5, { x: 2.4, z: -1.3, bank: -0.26, pitch: 0.05, smoke: 0.55, orbit: 0.95, distance: 22, elevation: 6.6, lookHeight: 4, fov: 43, cameraRoll: -0.045 }),
  shot(0.41, 16, { x: -2.8, z: -3.6, bank: 0.3, pitch: -0.08, orbit: 0.05, distance: 20, elevation: 2.5, lookHeight: 4, fov: 43, cameraRoll: 0.045 }),
  shot(0.465, 24, { x: -4, z: -1.6, bank: 0.04, orbit: -0.12, distance: 21, elevation: 4.4, lookHeight: 4, fov: 42 }),
  // A cloud curtain opens onto a wide, sunlit view above the town.
  shot(0.51, 34, { x: 0, z: 1.4, bank: -0.2, pitch: 0.05, orbit: 0.35, distance: 21, elevation: 5, lookHeight: 3.8, fov: 45, cloud: 0.97 }),
  shot(0.555, 41, { x: 2.2, z: 3.4, bank: -0.1, orbit: 0.7, distance: 30, elevation: 15, lookHeight: 1.4, fov: 44, cloud: 0.04 }),
  shot(0.6, 44, { x: 3, z: 2.3, orbit: 0.58, distance: 26, elevation: 10, lookHeight: 3, fov: 41 }),
  // Keep the comparison and FAQ stretches steady.
  shot(0.69, 46, { x: 3, z: 2.3, ignition: 0.8, orbit: 0.55, distance: 24, elevation: 8, lookHeight: 3.4, fov: 41 }),
  shot(0.82, 48, { x: 3, z: 2.3, ignition: 0.8, orbit: 0.55, distance: 24, elevation: 8, lookHeight: 3.4, fov: 41 }),
  shot(0.865, 49, { x: 4, z: 3, ignition: 0.85, orbit: 0.56, distance: 27, elevation: 10, lookHeight: 3.2, fov: 42 }),
  // Pull away from the tower and look back at the connected hometown below.
  shot(0.93, 53, { x: 8, z: 2, orbit: 0.56, distance: 44, elevation: 65, lookHeight: -18, fov: 43, overlook: 0.6 }),
  shot(0.985, 56, { x: 14, z: 0, ignition: 0.65, orbit: 0.56, distance: 69, elevation: 105, lookHeight: -46, fov: 43, overlook: 1 }),
  shot(1, 56, { x: 14, z: 0, ignition: 0.65, orbit: 0.56, distance: 69, elevation: 105, lookHeight: -46, fov: 43, overlook: 1 }),
];
export function sampleFlight(progress: number): FlightPose {
  const p = clamp(progress);
  const right = stops.findIndex(stop => stop.at >= p);
  const result = { ...ground };
  if (right > 0) {
    const start = stops[right - 1], end = stops[right];
    const t = smooth((p - start.at) / (end.at - start.at));
    for (const key of Object.keys(result) as (keyof FlightPose)[])
      result[key] = start.pose[key] + (end.pose[key] - start.pose[key]) * t;
  }
  result.progress = p;
  result.shutters = smoothRange(0, 0.075, p);
  result.birds = smoothRange(0.12, 0.25, p);
  result.network = smoothRange(0.9, 0.985, p);
  result.sceneOpen = Math.max(
    smoothRange(0.18, 0.23, p) * (1 - smoothRange(0.27, 0.35, p)),
    smoothRange(0.45, 0.5, p) * (1 - smoothRange(0.56, 0.6, p)),
    smoothRange(0.85, 0.91, p) * (1 - smoothRange(0.96, 1, p)),
  );
  return result;
}
/** Weighted cues keep story moments aligned even when pricing or FAQ content grows. */
export function progressFromAnchors(scroll: number, anchors: readonly number[], cues?: readonly number[]) {
  if (anchors.length < 2 || !Number.isFinite(scroll)) return 0;
  const at = (i: number) => cues?.length === anchors.length ? clamp(cues[i]) : i / (anchors.length - 1);
  if (scroll <= anchors[0]) return at(0);
  for (let i = 1; i < anchors.length; i++) {
    if (scroll <= anchors[i]) {
      const span = Math.max(1, anchors[i] - anchors[i - 1]);
      return clamp(at(i - 1) + (at(i) - at(i - 1)) * clamp((scroll - anchors[i - 1]) / span));
    }
  }
  return at(anchors.length - 1);
}
export function approachProgress(current: number, target: number, elapsed: number) {
  const next = current + (target - current) * (1 - Math.exp(-clamp(elapsed, 0, 0.1) * 10));
  return Math.abs(target - next) < 0.00008 ? target : next;
}
