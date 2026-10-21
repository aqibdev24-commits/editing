/**
 * Time formatting and calculation utilities.
 * All times are in seconds unless otherwise specified.
 */

/**
 * Format seconds as MM:SS
 */
export function formatTimeShort(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}

/**
 * Format seconds as MM:SS.mmm
 */
export function formatTimePrecise(seconds: number): string {
  const safe = Math.max(0, seconds);
  const m = Math.floor(safe / 60);
  const s = Math.floor(safe % 60);
  const ms = Math.floor((safe % 1) * 1000);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms
    .toString()
    .padStart(3, '0')}`;
}

/**
 * Format seconds as HH:MM:SS
 */
export function formatTimeLong(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds));
  const h = Math.floor(safe / 3600);
  const m = Math.floor((safe % 3600) / 60);
  const s = safe % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s
    .toString()
    .padStart(2, '0')}`;
}

/**
 * Convert time string to seconds
 */
export function parseTime(input: string): number {
  const parts = input.split(':').map((p) => parseFloat(p));
  if (parts.length === 1) return parts[0] || 0;
  if (parts.length === 2) return (parts[0] || 0) * 60 + (parts[1] || 0);
  if (parts.length === 3)
    return (parts[0] || 0) * 3600 + (parts[1] || 0) * 60 + (parts[2] || 0);
  return 0;
}

/**
 * Snap a time to nearest frame at given fps
 */
export function snapToFrame(seconds: number, fps: number = 30): number {
  return Math.round(seconds * fps) / fps;
}

/**
 * Calculate pixels from seconds at given pixels-per-second
 */
export function secondsToPixels(seconds: number, pixelsPerSecond: number): number {
  return seconds * pixelsPerSecond;
}

/**
 * Calculate seconds from pixels at given pixels-per-second
 */
export function pixelsToSeconds(pixels: number, pixelsPerSecond: number): number {
  return pixels / pixelsPerSecond;
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}