'use client';

import { useMemo } from 'react';
import { useEditorStore } from '@/store/editor-store';

export function useTimeline() {
  const tracks = useEditorStore((s) => s.tracks);
  const currentTime = useEditorStore((s) => s.currentTime);
  const totalDuration = useEditorStore((s) => s.totalDuration);

  // Auto-compute total duration from clips if it's bigger than current
  const computedDuration = useMemo(() => {
    let max = 0;
    for (const track of tracks) {
      for (const clip of track.clips) {
        const end = clip.startTime + clip.duration;
        if (end > max) max = end;
      }
    }
    return Math.max(max + 2, totalDuration);
  }, [tracks, totalDuration]);

  const pixelsPerSecond = useEditorStore((s) => s.zoom) * 60;

  return {
    tracks,
    currentTime,
    totalDuration: computedDuration,
    pixelsPerSecond,
  };
}