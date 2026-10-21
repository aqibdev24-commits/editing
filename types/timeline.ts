export type TimelineTool = 'select' | 'cut' | 'text' | 'shape';

export interface TimelineViewport {
  scrollX: number;
  scrollY: number;
  zoom: number;
  pixelsPerSecond: number;
}

export interface TimelineMarker {
  id: string;
  time: number;
  label: string;
  color: string;
}

export interface TimelineSelection {
  clipId: string | null;
  trackId: string | null;
  rangeStart: number | null;
  rangeEnd: number | null;
}

export interface SnapPoint {
  time: number;
  type: 'clip-start' | 'clip-end' | 'playhead' | 'grid';
  trackId?: string;
  clipId?: string;
}

export interface SnapConfig {
  enabled: boolean;
  thresholdPx: number;
  toGrid: boolean;
  toClips: boolean;
  toPlayhead: boolean;
  gridSize: number;
}

export const DEFAULT_SNAP_CONFIG: SnapConfig = {
  enabled: true,
  thresholdPx: 8,
  toGrid: false,
  toClips: true,
  toPlayhead: true,
  gridSize: 1,
};

export const TIMELINE_CONSTANTS = {
  TRACK_HEIGHT: 56,
  TRACK_HEADER_WIDTH: 176,
  RULER_HEIGHT: 24,
  MIN_ZOOM: 0.25,
  MAX_ZOOM: 4,
  BASE_PIXELS_PER_SECOND: 60,
} as const;