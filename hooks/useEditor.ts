'use client';

import { useEditorStore } from '@/store/editor-store';
import { usePlayback } from '@/hooks/usePlayback';
import { useEditorKeyboard } from '@/hooks/useEditorKeyboard';
import { useTimeline } from '@/hooks/useTimeline';

/**
 * Core editor hook — bundles state + playback + keyboard + timeline.
 * Use this inside editor pages to wire everything in one call.
 */
export function useEditor() {
  const tracks = useEditorStore((s) => s.tracks);
  const currentTime = useEditorStore((s) => s.currentTime);
  const isPlaying = useEditorStore((s) => s.isPlaying);
  const isDirty = useEditorStore((s) => s.isDirty);
  const isSaving = useEditorStore((s) => s.isSaving);
  const selectedClipId = useEditorStore((s) => s.selectedClipId);
  const activePanel = useEditorStore((s) => s.activePanel);
  const toolMode = useEditorStore((s) => s.toolMode);
  const zoom = useEditorStore((s) => s.zoom);
  const volume = useEditorStore((s) => s.volume);
  const muted = useEditorStore((s) => s.muted);

  const { totalDuration, pixelsPerSecond } = useTimeline();

  // Wire playback loop + keyboard shortcuts
  usePlayback(totalDuration);
  useEditorKeyboard();

  return {
    // State
    tracks,
    currentTime,
    isPlaying,
    isDirty,
    isSaving,
    selectedClipId,
    activePanel,
    toolMode,
    zoom,
    volume,
    muted,

    // Computed
    totalDuration,
    pixelsPerSecond,
  };
}