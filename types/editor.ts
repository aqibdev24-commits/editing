export type TrackType = 'video' | 'audio' | 'text' | 'overlay';
export type ClipType = 'video' | 'audio' | 'text' | 'image';
export type PanelTab = 'media' | 'effects' | 'text' | 'audio' | 'color' | 'properties';
export type ToolMode = 'select' | 'cut' | 'text' | 'shape';

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