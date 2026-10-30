import type { AnimationEasing, ClipKeyframe, TrackClip } from '@/types/editor';

// ─────────────────────────────────────────────────────────────
// Easing
// ─────────────────────────────────────────────────────────────

export function easeLinear(t: number): number { return t; }
export function easeIn(t: number): number { return t * t; }
export function easeOut(t: number): number { return 1 - (1 - t) * (1 - t); }
export function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}
export function easeOutBack(t: number): number {
  const c1 = 1.70158, c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}
export function easeOutElastic(t: number): number {
  const c4 = (2 * Math.PI) / 3;
  return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
}

const EASING_MAP: Record<AnimationEasing, (t: number) => number> = {
  linear: easeLinear,
  easeIn, easeOut, easeInOut, easeOutBack, easeOutElastic,
};

// ─────────────────────────────────────────────────────────────
// Animated values at time T
// ─────────────────────────────────────────────────────────────

export interface AnimatedValues {
  x: number;
  y: number;
  scale: number;
  rotation: number;
  opacity: number;
  blur: number;
  brightness: number;
  contrast: number;
  saturate: number;
  fontSize: number;
  letterSpacing: number;
  volume: number;
  color?: string;
  backgroundColor?: string;
}

/** Base values from the clip (used as fallback when a property is not in a keyframe). */
function getBaseValues(clip: TrackClip): AnimatedValues {
  return {
    x: clip.positionX ?? 0,
    y: clip.positionY ?? 0,
    scale: clip.scale ?? 100,
    rotation: clip.rotation ?? 0,
    opacity: clip.opacity ?? 100,
    blur: clip.filters?.blur ?? 0,
    brightness: clip.filters?.brightness ?? 100,
    contrast: clip.filters?.contrast ?? 100,
    saturate: clip.filters?.saturate ?? 100,
    fontSize: clip.textStyle?.fontSize ?? 32,
    letterSpacing: clip.textStyle?.letterSpacing ?? 0,
    volume: clip.volume ?? 100,
    color: clip.textStyle?.color,
    backgroundColor: clip.textStyle?.background,
  };
}

/**
 * Given a keyframe (which may have partial values), return full AnimatedValues
 * by filling missing fields from the base.
 */
function keyframeToValues(kf: ClipKeyframe, base: AnimatedValues): AnimatedValues {
  return {
    x: kf.x ?? base.x,
    y: kf.y ?? base.y,
    scale: kf.scale ?? base.scale,
    rotation: kf.rotation ?? base.rotation,
    opacity: kf.opacity ?? base.opacity,
    blur: kf.blur ?? base.blur,
    brightness: kf.brightness ?? base.brightness,
    contrast: kf.contrast ?? base.contrast,
    saturate: kf.saturate ?? base.saturate,
    fontSize: kf.fontSize ?? base.fontSize,
    letterSpacing: kf.letterSpacing ?? base.letterSpacing,
    volume: kf.volume ?? base.volume,
    color: kf.color ?? base.color,
    backgroundColor: kf.backgroundColor ?? base.backgroundColor,
  };
}

/** Lerp helper for numbers. */
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Blend hex colors. */
function lerpColor(a: string, b: string, t: number): string {
  const pa = hexToRgb(a), pb = hexToRgb(b);
  if (!pa || !pb) return t < 0.5 ? a : b;
  const r = Math.round(lerp(pa.r, pb.r, t));
  const g = Math.round(lerp(pa.g, pb.g, t));
  const bl = Math.round(lerp(pa.b, pb.b, t));
  return `#${[r, g, bl].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return null;
  const num = parseInt(clean, 16);
  if (isNaN(num)) return null;
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function lerpValues(a: AnimatedValues, b: AnimatedValues, t: number): AnimatedValues {
  return {
    x: lerp(a.x, b.x, t),
    y: lerp(a.y, b.y, t),
    scale: lerp(a.scale, b.scale, t),
    rotation: lerp(a.rotation, b.rotation, t),
    opacity: lerp(a.opacity, b.opacity, t),
    blur: lerp(a.blur, b.blur, t),
    brightness: lerp(a.brightness, b.brightness, t),
    contrast: lerp(a.contrast, b.contrast, t),
    saturate: lerp(a.saturate, b.saturate, t),
    fontSize: lerp(a.fontSize, b.fontSize, t),
    letterSpacing: lerp(a.letterSpacing, b.letterSpacing, t),
    volume: lerp(a.volume, b.volume, t),
    color: a.color && b.color ? lerpColor(a.color, b.color, t) : a.color ?? b.color,
    backgroundColor:
      a.backgroundColor && b.backgroundColor
        ? lerpColor(a.backgroundColor, b.backgroundColor, t)
        : a.backgroundColor ?? b.backgroundColor,
  };
}

/**
 * Compute animated values at a given local time.
 * - No keyframes → returns base values
 * - Before first keyframe → returns first keyframe values
 * - After last keyframe → returns last keyframe values
 * - Between → interpolated with easing
 */
export function computeAnimatedValues(clip: TrackClip, localTime: number): AnimatedValues {
  const base = getBaseValues(clip);
  const keyframes = clip.keyframes;
  if (!keyframes || keyframes.length === 0) {
    return base;
  }

  const sorted = [...keyframes].sort((a, b) => a.time - b.time);

  if (localTime <= sorted[0].time) {
    return keyframeToValues(sorted[0], base);
  }
  if (localTime >= sorted[sorted.length - 1].time) {
    return keyframeToValues(sorted[sorted.length - 1], base);
  }

  for (let i = 0; i < sorted.length - 1; i++) {
    const from = sorted[i];
    const to = sorted[i + 1];
    if (localTime >= from.time && localTime <= to.time) {
      const span = to.time - from.time;
      const rawT = span === 0 ? 0 : (localTime - from.time) / span;
      const easing = EASING_MAP[to.easing ?? 'easeInOut'];
      const easedT = easing(rawT);

      const fromVals = keyframeToValues(from, base);
      const toVals = keyframeToValues(to, base);
      return lerpValues(fromVals, toVals, easedT);
    }
  }

  return base;
}

export function buildFilterString(values: AnimatedValues): string {
  const parts: string[] = [];
  if (values.blur > 0) parts.push(`blur(${values.blur}px)`);
  if (values.brightness !== 100) parts.push(`brightness(${values.brightness}%)`);
  if (values.contrast !== 100) parts.push(`contrast(${values.contrast}%)`);
  if (values.saturate !== 100) parts.push(`saturate(${values.saturate}%)`);
  return parts.join(' ') || 'none';
}