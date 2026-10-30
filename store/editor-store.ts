import { create } from 'zustand';
import type {
  EditorState,
  EditorActions,
  Track,
  TrackClip,
  TrackType,
  PanelTab,
  ToolMode,
  HistorySnapshot,
  ClipKeyframe,

} from '@/types/editor';

// ============================================================================
// INITIAL DATA
// ============================================================================

const INITIAL_TRACKS: Track[] = [
  {
    id: 'track-video',
    name: 'Video 1',
    type: 'video',
    visible: true,
    locked: false,
    muted: false,
    clips: [
      { id: 'clip-1', name: 'intro.mp4', startTime: 0, duration: 5, color: 'from-violet-600 to-violet-700', type: 'video', opacity: 100, scale: 100, rotation: 0, volume: 100 },
      { id: 'clip-2', name: 'main.mp4', startTime: 5, duration: 12, color: 'from-violet-600 to-violet-700', type: 'video', opacity: 100, scale: 100, rotation: 0, volume: 100 },
      { id: 'clip-3', name: 'outro.mp4', startTime: 17, duration: 4, color: 'from-violet-600 to-violet-700', type: 'video', opacity: 100, scale: 100, rotation: 0, volume: 100 },
    ],
  },
  {
    id: 'track-overlay',
    name: 'Overlay',
    type: 'overlay',
    visible: true,
    locked: false,
    muted: false,
    clips: [
      { id: 'clip-4', name: 'logo.png', startTime: 2, duration: 3, color: 'from-fuchsia-600 to-fuchsia-700', type: 'image', opacity: 100, scale: 100, rotation: 0 },
      { id: 'clip-5', name: 'sticker.png', startTime: 14, duration: 2, color: 'from-fuchsia-600 to-fuchsia-700', type: 'image', opacity: 100, scale: 100, rotation: 0 },
    ],
  },
  {
    id: 'track-text',
    name: 'Text',
    type: 'text',
    visible: true,
    locked: false,
    muted: false,
    clips: [
      { id: 'clip-6', name: 'Title', startTime: 0, duration: 4, color: 'from-amber-600 to-amber-700', type: 'text', opacity: 100, scale: 100, rotation: 0 },
      { id: 'clip-7', name: 'Subscribe', startTime: 18, duration: 3, color: 'from-amber-600 to-amber-700', type: 'text', opacity: 100, scale: 100, rotation: 0 },
    ],
  },
  {
    id: 'track-audio',
    name: 'Audio',
    type: 'audio',
    visible: true,
    locked: false,
    muted: false,
    clips: [
      { id: 'clip-8', name: 'music.mp3', startTime: 0, duration: 21, color: 'from-emerald-600 to-emerald-700', type: 'audio', volume: 80 },
    ],
  },
];

// ============================================================================
// HELPERS
// ============================================================================

let clipCounter = 100;
function generateClipId(): string {
  clipCounter += 1;
  return `clip-${Date.now()}-${clipCounter}-${Math.random().toString(36).slice(2, 6)}`;
}

let trackCounter = 10;
function generateTrackId(): string {
  trackCounter += 1;
  return `track-${Date.now()}-${trackCounter}-${Math.random().toString(36).slice(2, 6)}`;
}

let snapshotCounter = 0;
function generateSnapshotId(): string {
  snapshotCounter += 1;
  return `snap-${snapshotCounter}-${Date.now()}`;
}

/**
 * Deep-clone tracks for snapshot (prevents mutation leaks).
 * Uses structuredClone if available, else JSON fallback.
 */
function cloneTracks(tracks: Track[]): Track[] {
  if (typeof structuredClone === 'function') {
    return structuredClone(tracks);
  }
  return JSON.parse(JSON.stringify(tracks)) as Track[];
}

// ============================================================================
// STORE
// ============================================================================

export const useEditorStore = create<EditorState & EditorActions>((set, get) => ({
  // ---------------------------------------------------------------------------
  // Initial state
  // ---------------------------------------------------------------------------
  tracks: INITIAL_TRACKS,
  selectedClipId: 'clip-2',
  selectedTrackId: 'track-video',
  selectedKeyframeId: null,
  currentTime: 5.5,
  isPlaying: false,
  playbackRate: 1,
  isLooping: false,
  isFullscreen: false,
  volume: 100,
  muted: false,
  totalDuration: 24,
  zoom: 1,
  activePanel: 'media',
  toolMode: 'select',
  isDirty: false,
  isSaving: false,
  lastSavedAt: null,
  canvasBackground: null,

  // History
  past: [],
  future: [],
  maxHistory: 50,

  // ---------------------------------------------------------------------------
  // HISTORY ACTIONS
  // ---------------------------------------------------------------------------

  pushHistory: (label) => {
    // ⚠️ Defer to microtask — prevents "setState during render" errors
    // when called from pointer event handlers inside other components
    queueMicrotask(() => {
      const state = get();
      const snapshot: HistorySnapshot = {
        id: generateSnapshotId(),
        label,
        timestamp: Date.now(),
        tracks: cloneTracks(state.tracks),
        selectedClipId: state.selectedClipId,
        selectedTrackId: state.selectedTrackId,
        totalDuration: state.totalDuration,
      };

      set((s) => ({
        past: [...s.past, snapshot].slice(-s.maxHistory),
        future: [],
      }));
    });
  },

  undo: () => {
    const state = get();
    if (state.past.length === 0) return;

    const previous = state.past[state.past.length - 1];
    const newPast = state.past.slice(0, -1);

    // Snapshot current state into future
    const currentSnapshot: HistorySnapshot = {
      id: generateSnapshotId(),
      label: 'Redo point',
      timestamp: Date.now(),
      tracks: cloneTracks(state.tracks),
      selectedClipId: state.selectedClipId,
      selectedTrackId: state.selectedTrackId,
      totalDuration: state.totalDuration,
    };

    set({
      tracks: previous.tracks,
      selectedClipId: previous.selectedClipId,
      selectedTrackId: previous.selectedTrackId,
      totalDuration: previous.totalDuration,
      past: newPast,
      future: [currentSnapshot, ...state.future].slice(0, state.maxHistory),
      isDirty: true,
    });
  },

  redo: () => {
    const state = get();
    if (state.future.length === 0) return;

    const next = state.future[0];
    const newFuture = state.future.slice(1);

    // Snapshot current into past
    const currentSnapshot: HistorySnapshot = {
      id: generateSnapshotId(),
      label: 'Undo point',
      timestamp: Date.now(),
      tracks: cloneTracks(state.tracks),
      selectedClipId: state.selectedClipId,
      selectedTrackId: state.selectedTrackId,
      totalDuration: state.totalDuration,
    };

    set({
      tracks: next.tracks,
      selectedClipId: next.selectedClipId,
      selectedTrackId: next.selectedTrackId,
      totalDuration: next.totalDuration,
      past: [...state.past, currentSnapshot].slice(-state.maxHistory),
      future: newFuture,
      isDirty: true,
    });
  },

  canUndo: () => get().past.length > 0,
  canRedo: () => get().future.length > 0,

  clearHistory: () => set({ past: [], future: [] }),

  // ---------------------------------------------------------------------------
  // TRACK ACTIONS
  // ---------------------------------------------------------------------------

  setTracks: (tracks) => {
    get().pushHistory('Set tracks');
    set({ tracks, isDirty: true });
  },

  addTrack: (type) => {
    get().pushHistory(`Add ${type} track`);
    const id = generateTrackId();
    const nameMap: Record<TrackType, string> = {
      video: 'Video',
      audio: 'Audio',
      text: 'Text',
      overlay: 'Overlay',
    };
    const newTrack: Track = {
      id,
      name: nameMap[type],
      type,
      clips: [],
      visible: true,
      locked: false,
      muted: false,
    };
    set((state) => ({ tracks: [...state.tracks, newTrack], isDirty: true }));
  },

  removeTrack: (trackId) => {
    get().pushHistory('Remove track');
    set((state) => ({
      tracks: state.tracks.filter((t) => t.id !== trackId),
      isDirty: true,
    }));
  },

  toggleTrackVisibility: (trackId) => {
    get().pushHistory('Toggle track visibility');
    set((state) => ({
      tracks: state.tracks.map((t) =>
        t.id === trackId ? { ...t, visible: !t.visible } : t
      ),
      isDirty: true,
    }));
  },

  toggleTrackLock: (trackId) => {
    // Lock toggle doesn't need history (UI-only)
    set((state) => ({
      tracks: state.tracks.map((t) =>
        t.id === trackId ? { ...t, locked: !t.locked } : t
      ),
    }));
  },

  toggleTrackMute: (trackId) => {
    get().pushHistory('Toggle track mute');
    set((state) => ({
      tracks: state.tracks.map((t) =>
        t.id === trackId ? { ...t, muted: !t.muted } : t
      ),
      isDirty: true,
    }));
  },

  // ---------------------------------------------------------------------------
  // CLIP ACTIONS
  // ---------------------------------------------------------------------------

  selectClip: (clipId, trackId) =>
    set({
      selectedClipId: clipId,
      selectedTrackId: trackId ?? null,
    }),

  updateClip: (clipId, updates) => {
    get().pushHistory('Update clip');
    set((state) => ({
      tracks: state.tracks.map((track) => ({
        ...track,
        clips: track.clips.map((clip) =>
          clip.id === clipId ? { ...clip, ...updates } : clip
        ),
      })),
      isDirty: true,
    }));
  },

  addClip: (trackId, clip) => {
    get().pushHistory('Add clip');
    set((state) => ({
      tracks: state.tracks.map((track) =>
        track.id === trackId ? { ...track, clips: [...track.clips, clip] } : track
      ),
      isDirty: true,
    }));
  },

  removeClip: (clipId) => {
    get().pushHistory('Remove clip');
    set((state) => ({
      tracks: state.tracks.map((track) => ({
        ...track,
        clips: track.clips.filter((c) => c.id !== clipId),
      })),
      selectedClipId: state.selectedClipId === clipId ? null : state.selectedClipId,
      isDirty: true,
    }));
  },


  // ═══════════════════════════════════════════════════════════════════
  // KEYFRAME ACTIONS
  // ═══════════════════════════════════════════════════════════════════

  selectKeyframe: (keyframeId) =>
    set({ selectedKeyframeId: keyframeId }),

  addKeyframe: (clipId, time) => {
    const id = `kf-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    get().pushHistory('Add keyframe');

    set((state) => ({
      tracks: state.tracks.map((track) => ({
        ...track,
        clips: track.clips.map((clip) => {
          if (clip.id !== clipId) return clip;

          const existing = clip.keyframes ?? [];

          // Snapshot current static values as the initial keyframe state
          const snapshot: ClipKeyframe = {
            id,
            time,
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
            color: clip.textStyle?.color,
            backgroundColor: clip.textStyle?.background,
            volume: clip.volume ?? 100,
            easing: 'easeInOut',
          };

          return {
            ...clip,
            keyframes: [...existing, snapshot].sort((a, b) => a.time - b.time),
          };
        }),
      })),
      selectedKeyframeId: id,
      isDirty: true,
    }));

    return id;
  },

  updateKeyframe: (clipId, keyframeId, updates) => {
    get().pushHistory('Edit keyframe');

    set((state) => ({
      tracks: state.tracks.map((track) => ({
        ...track,
        clips: track.clips.map((clip) =>
          clip.id === clipId
            ? {
              ...clip,
              keyframes: (clip.keyframes ?? []).map((kf) =>
                kf.id === keyframeId ? { ...kf, ...updates } : kf
              ),
            }
            : clip
        ),
      })),
      isDirty: true,
    }));
  },

  removeKeyframe: (clipId, keyframeId) => {
    get().pushHistory('Remove keyframe');

    set((state) => ({
      tracks: state.tracks.map((track) => ({
        ...track,
        clips: track.clips.map((clip) =>
          clip.id === clipId
            ? {
              ...clip,
              keyframes: (clip.keyframes ?? []).filter((kf) => kf.id !== keyframeId),
            }
            : clip
        ),
      })),
      selectedKeyframeId:
        state.selectedKeyframeId === keyframeId ? null : state.selectedKeyframeId,
      isDirty: true,
    }));
  },

  // ═══════════════════════════════════════════════════════════════════

  duplicateClip: (clipId) => {
    get().pushHistory('Duplicate clip');
    const state = get();
    for (const track of state.tracks) {
      const clip = track.clips.find((c) => c.id === clipId);
      if (clip) {
        const newClip: TrackClip = {
          ...clip,
          id: generateClipId(),
          name: `${clip.name} (copy)`,
          startTime: clip.startTime + clip.duration,
        };
        set((s) => ({
          tracks: s.tracks.map((t) =>
            t.id === track.id ? { ...t, clips: [...t.clips, newClip] } : t
          ),
          selectedClipId: newClip.id,
          isDirty: true,
        }));
        return;
      }
    }
  },

  moveClip: (clipId, newStartTime) => {
    const state = get();

    // Find current clip — skip if no actual change
    let currentClip: TrackClip | null = null;
    for (const track of state.tracks) {
      const found = track.clips.find((c) => c.id === clipId);
      if (found) {
        currentClip = found;
        break;
      }
    }

    if (!currentClip) return;
    if (Math.abs(currentClip.startTime - newStartTime) < 0.001) return;

    get().pushHistory('Move clip');

    set({
      tracks: state.tracks.map((track) => ({
        ...track,
        clips: track.clips.map((clip) =>
          clip.id === clipId ? { ...clip, startTime: Math.max(0, newStartTime) } : clip
        ),
      })),
      isDirty: true,
    });
  },

  // ---------------------------------------------------------------------------
  // PLAYBACK (no history — transient state)
  // ---------------------------------------------------------------------------

  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  seek: (time) =>
    set((state) => ({
      currentTime: Math.max(0, Math.min(state.totalDuration, time)),
    })),
  setVolume: (volume) => set({ volume: Math.max(0, Math.min(100, volume)) }),
  toggleMute: () => set((state) => ({ muted: !state.muted })),
  setPlaybackRate: (rate) => set({ playbackRate: Math.max(0.25, Math.min(4, rate)) }),
  toggleLooping: () => set((state) => ({ isLooping: !state.isLooping })),
  setFullscreen: (fullscreen) => set({ isFullscreen: fullscreen }),
  setTotalDuration: (duration) => set({ totalDuration: Math.max(1, duration) }),

  // ---------------------------------------------------------------------------
  // VIEW (no history — transient state)
  // ---------------------------------------------------------------------------

  setZoom: (zoom) => set({ zoom: Math.max(0.25, Math.min(4, zoom)) }),
  setActivePanel: (activePanel: PanelTab) => set({ activePanel }),
  setToolMode: (toolMode: ToolMode) => set({ toolMode }),

  // ---------------------------------------------------------------------------
  // SAVE
  // ---------------------------------------------------------------------------

  markDirty: () => set({ isDirty: true }),
  markClean: () => {
    set({ isDirty: false, lastSavedAt: new Date() });
    // Clear history on save — new baseline
    get().clearHistory();
  },
  setSaving: (isSaving) => set({ isSaving }),
  setCanvasBackground: (bg) => {
    get().pushHistory('Change background');
    set({ canvasBackground: bg, isDirty: true });
  },
}));

// ============================================================================
// SELECTORS (perf-optimized)
// ============================================================================

export const selectTracks = (state: EditorState & EditorActions) => state.tracks;
export const selectCanUndo = (state: EditorState & EditorActions) => state.past.length > 0;
export const selectCanRedo = (state: EditorState & EditorActions) => state.future.length > 0;
export const selectSelectedClip = (state: EditorState & EditorActions) => {
  if (!state.selectedClipId) return null;
  for (const track of state.tracks) {
    const clip = track.clips.find((c) => c.id === state.selectedClipId);
    if (clip) return clip;
  }
  return null;
};

