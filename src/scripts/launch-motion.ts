/** The flight is a pure function of scroll, so returning to a section retraces it. */
export interface FlightPose {
  lift: number;
  ignition: number;
  smoke: number;
  orbit: number;
  distance: number;
  elevation: number;
  lookHeight: number;
}

export const chapterLabels = [
  "Your hometown",
  "Your website",
  "Get found",
  "Keep growing",
  "Your plan",
  "Good questions",
  "Let’s launch",
];

export const clamp = (value: number, min = 0, max = 1) =>
  Math.max(min, Math.min(max, Number.isFinite(value) ? value : min));

const smooth = (value: number) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};

const stops: { at: number; pose: FlightPose }[] = [
  {
    at: 0,
    pose: {
      lift: 0,
      ignition: 0,
      smoke: 0,
      orbit: 0.53,
      distance: 21,
      elevation: 8,
      lookHeight: 3.5,
    },
  },
  {
    at: 0.09,
    pose: {
      lift: 0,
      ignition: 0.15,
      smoke: 0.1,
      orbit: 0.53,
      distance: 20,
      elevation: 7.2,
      lookHeight: 3.7,
    },
  },
  {
    at: 1 / 6,
    pose: {
      lift: 0,
      ignition: 0.9,
      smoke: 0.9,
      orbit: 0.5,
      distance: 18.7,
      elevation: 6.5,
      lookHeight: 3.9,
    },
  },
  {
    at: 2 / 6,
    pose: {
      lift: 5,
      ignition: 1,
      smoke: 1,
      orbit: 0.45,
      distance: 18.4,
      elevation: 6.3,
      lookHeight: 4.2,
    },
  },
  {
    at: 0.5,
    pose: {
      lift: 22,
      ignition: 1,
      smoke: 0,
      orbit: 0.38,
      distance: 18,
      elevation: 5,
      lookHeight: 4.1,
    },
  },
  // A long, steady climb behind plans and questions keeps the content easy to read.
  {
    at: 4 / 6,
    pose: {
      lift: 33,
      ignition: 0.85,
      smoke: 0,
      orbit: 0.35,
      distance: 19,
      elevation: 4.5,
      lookHeight: 4,
    },
  },
  {
    at: 5 / 6,
    pose: {
      lift: 35,
      ignition: 0.8,
      smoke: 0,
      orbit: 0.35,
      distance: 19,
      elevation: 4.5,
      lookHeight: 4,
    },
  },
  {
    at: 1,
    pose: {
      lift: 48,
      ignition: 1,
      smoke: 0,
      orbit: 0.43,
      distance: 18.4,
      elevation: 4.7,
      lookHeight: 4.1,
    },
  },
];

export function sampleFlight(progress: number): FlightPose {
  const p = clamp(progress);
  const right = stops.findIndex((stop) => stop.at >= p);
  if (right <= 0) return { ...stops[0].pose };
  const start = stops[right - 1],
    end = stops[right];
  const t = smooth((p - start.at) / (end.at - start.at));
  const result = { ...start.pose };
  for (const key of Object.keys(result) as (keyof FlightPose)[])
    result[key] = start.pose[key] + (end.pose[key] - start.pose[key]) * t;
  return result;
}

/** Each content section owns an equal chapter, even when mobile cards are taller. */
export function progressFromAnchors(
  scroll: number,
  anchors: readonly number[],
) {
  if (anchors.length < 2 || !Number.isFinite(scroll)) return 0;
  if (scroll <= anchors[0]) return 0;
  for (let i = 1; i < anchors.length; i++) {
    if (scroll <= anchors[i]) {
      const span = Math.max(1, anchors[i] - anchors[i - 1]);
      return clamp(
        (i - 1 + clamp((scroll - anchors[i - 1]) / span)) /
          (anchors.length - 1),
      );
    }
  }
  return 1;
}

/** Time-based easing behaves consistently at 30, 60, or 120 Hz. */
export function approachProgress(
  current: number,
  target: number,
  elapsed: number,
) {
  const next =
    current + (target - current) * (1 - Math.exp(-clamp(elapsed, 0, 0.1) * 10));
  return Math.abs(target - next) < 0.00008 ? target : next;
}
