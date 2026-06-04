// A tiny module-level store for global scroll progress (0..1) and pointer.
// Lenis writes to it on scroll; the R3F render loop reads it every frame.
// Avoids React re-renders for high-frequency values.

type ScrollState = {
  // raw progress 0..1 over the whole page
  progress: number;
  // normalized pointer in -1..1 range, eased
  pointerX: number;
  pointerY: number;
  velocity: number;
};

// Holder so UI (nav) can call lenis.scrollTo without prop drilling.
type LenisLike = { scrollTo: (target: string | number | HTMLElement, opts?: object) => void };
export const lenisRef: { current: LenisLike | null } = { current: null };

export const scrollState: ScrollState = {
  progress: 0,
  pointerX: 0,
  pointerY: 0,
  velocity: 0,
};

export function setProgress(p: number, velocity = 0) {
  scrollState.progress = Math.min(1, Math.max(0, p));
  scrollState.velocity = velocity;
}

export function setPointer(x: number, y: number) {
  scrollState.pointerX = x;
  scrollState.pointerY = y;
}

// Linear interpolation + a frame-rate independent damp helper.
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function damp(current: number, target: number, lambda: number, dt: number) {
  return lerp(current, target, 1 - Math.exp(-lambda * dt));
}

// clamp + remap a value from one range to a 0..1 band, eased.
export function band(p: number, start: number, end: number) {
  if (end === start) return 0;
  return Math.min(1, Math.max(0, (p - start) / (end - start)));
}

export const smooth = (t: number) => t * t * (3 - 2 * t); // smoothstep
export const easeInOut = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
