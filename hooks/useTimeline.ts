'use client';

import { useMemo, useEffect } from 'react';
import { useEditorStore } from '@/store/editor-store';

export function useTimeline() {
  const tracks = useEditorStore((s) => s.tracks);
  const currentTime = useEditorStore((s) => s.currentTime);
  const zoom = useEditorStore((s) => s.zoom);
  const setTotalDuration = useEditorStore((s) => s.setTotalDuration);

  // Compute duration from clips (min 10s so empty timeline still works)
  const computedDuration = useMemo(() => {
    let max = 0;
    for (const track of tracks) {
      for (const clip of track.clips) {
        const end = clip.startTime + clip.duration;
        if (end > max) max = end;
      }
    }
    return Math.max(max + 2, 10);
  }, [tracks]);

  useEffect(() => {
    setTotalDuration(computedDuration);
  }, [computedDuration, setTotalDuration]);

  const pixelsPerSecond = zoom * 60;

  return {
    tracks,
    currentTime,
    totalDuration: computedDuration,
    pixelsPerSecond,
  };
}