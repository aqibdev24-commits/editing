export type TrackType = 'video' | 'audio' | 'text' | 'overlay';
export type ClipType = 'video' | 'audio' | 'text' | 'image';
export type PanelTab = 'media' | 'effects' | 'text' | 'audio' | 'color' | 'properties';
export type ToolMode = 'select' | 'cut' | 'text' | 'shape';

export type AnimationProperty =
  // Transform
  | 'x'
  | 'y'
  | 'scale'
  | 'rotation'
  // Appearance
  | 'opacity'
  | 'blur'
  | 'brightness'
  | 'contrast'
  | 'saturate'
  // Text
  | 'fontSize'
  | 'letterSpacing'
  // Volume
  | 'volume';


// ============================================================================
// ANIMATION — keyframe snapshots
// ============================================================================

export type AnimationEasing =
  | 'linear'
  | 'easeIn'
  | 'easeOut'
  | 'easeInOut'
  | 'easeOutBack'
  | 'easeOutElastic';

/**
 * A keyframe is a snapshot of the clip's editable properties at a point in time.
 * User selects a keyframe → Edit section opens → they modify values → 
 * those values are stored on this keyframe.
 * Between two keyframes, values are interpolated.
 */
export interface ClipKeyframe {
  id: string;
  time: number;              // seconds, relative to clip start

  // Transform (all optional; missing values fall back to clip base)
  x?: number;
  y?: number;
  scale?: number;
  rotation?: number;
  opacity?: number;

  // Appearance filters
  blur?: number;
  brightness?: number;
  contrast?: number;
  saturate?: number;

  // Text
  fontSize?: number;
  letterSpacing?: number;
  color?: string;
  backgroundColor?: string;

  // Audio
  volume?: number;

  // Interpolation to NEXT keyframe
  easing?: AnimationEasing;
}

export interface ClipFilters {
  blur?: number;
  brightness?: number;
  contrast?: number;
  saturate?: number;
  hueRotate?: number;
  grayscale?: number;
  sepia?: number;
}

export interface TextClipStyle {
  fontSize: number;
  fontFamily: 'sans' | 'serif' | 'mono';
  fontWeight: 'normal' | 'bold';
  italic: boolean;
  color: string;
  align: 'left' | 'center' | 'right';
  background?: string;
  backgroundOpacity: number;
  letterSpacing?: number;
}

export interface TrackClip {
  id: string;
  name: string;
  startTime: number;
  duration: number;
  color: string;
  type: ClipType;
  volume?: number;
  opacity?: number;
  scale?: number;
  rotation?: number;
  positionX?: number;
  positionY?: number;
  textContent?: string;
  textStyle?: TextClipStyle;
  filters?: ClipFilters;
  keyframes?: ClipKeyframe[];
  assetUrl?: string;
  assetId?: string;
}

// Add at bottom
export interface CanvasBackground {
  type: 'color' | 'image' | 'video';
  value: string;             // hex color OR URL
}

export interface AnimationKeyframe {
  id: string;
  time: number;
  property: AnimationProperty;
  value: number;
  easing?: AnimationEasing;
}





export interface Track {
  id: string;
  name: string;
  type: TrackType;
  clips: TrackClip[];
  visible: boolean;
  locked: boolean;
  muted: boolean;
}

export interface EditorProject {
  _id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  previewUrl: string;
  duration: number;
  resolution: string;
  category: string;
  author: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface EditorAsset {
  _id: string;
  name: string;
  url: string;
  thumbnailUrl?: string;
  type: 'image' | 'video' | 'audio';
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  duration?: number;
}

export interface EditorUser {
  name: string;
  email: string;
  image?: string;
}

export interface EditorState {
  // Tracks & clips
  tracks: Track[];
  selectedClipId: string | null;
  selectedTrackId: string | null;
  selectedKeyframeId: string | null;

  // Playback
  currentTime: number;
  isPlaying: boolean;
  volume: number;
  muted: boolean;
  totalDuration: number;


  // View
  zoom: number;
  activePanel: PanelTab;
  toolMode: ToolMode;

  // Save state
  isDirty: boolean;
  isSaving: boolean;
  lastSavedAt: Date | null;

  // History
  past: HistorySnapshot[];
  future: HistorySnapshot[];
  maxHistory: number;

  canvasBackground: CanvasBackground | null;

  playbackRate: number;
  isLooping: boolean;
  isFullscreen: boolean;

}

export interface EditorActions {
  // Track actions
  setTracks: (tracks: Track[]) => void;
  addTrack: (type: TrackType) => void;
  removeTrack: (trackId: string) => void;
  toggleTrackVisibility: (trackId: string) => void;
  toggleTrackLock: (trackId: string) => void;
  toggleTrackMute: (trackId: string) => void;

  // Clip actions
  selectClip: (clipId: string | null, trackId?: string | null) => void;
  updateClip: (clipId: string, updates: Partial<TrackClip>) => void;
  addClip: (trackId: string, clip: TrackClip) => void;
  removeClip: (clipId: string) => void;
  duplicateClip: (clipId: string) => void;
  moveClip: (clipId: string, newStartTime: number) => void;

  // Playback
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setTotalDuration: (duration: number) => void;

  selectKeyframe: (keyframeId: string | null) => void;
  addKeyframe: (clipId: string, time: number) => string;
  updateKeyframe: (
    clipId: string,
    keyframeId: string,
    updates: Partial<ClipKeyframe>
  ) => void;
  removeKeyframe: (clipId: string, keyframeId: string) => void;




  // View
  setZoom: (zoom: number) => void;
  setActivePanel: (panel: PanelTab) => void;
  setToolMode: (mode: ToolMode) => void;

  // Save
  markDirty: () => void;
  markClean: () => void;
  setSaving: (saving: boolean) => void;

  // History
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  clearHistory: () => void;
  pushHistory: (label: string) => void;
  setCanvasBackground: (bg: CanvasBackground | null) => void;

  setPlaybackRate: (rate: number) => void;
  toggleLooping: () => void;
  setFullscreen: (fullscreen: boolean) => void;
}


// ============================================================================
// HISTORY (Undo/Redo)
// ============================================================================

export interface HistorySnapshot {
  id: string;
  label: string;
  timestamp: number;
  tracks: Track[];
  selectedClipId: string | null;
  selectedTrackId: string | null;
  totalDuration: number;
}

export interface HistoryState {
  past: HistorySnapshot[];
  future: HistorySnapshot[];
  maxHistory: number;
}

