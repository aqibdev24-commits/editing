'use client';

import { useEffect, useRef } from 'react';
import { useEditorStore } from '@/store/editor-store';

export function usePlayback(totalDuration: number) {
  const isPlaying = useEditorStore((s) => s.isPlaying);
  const currentTime = useEditorStore((s) => s.currentTime);
  const seek = useEditorStore((s) => s.seek);
  const pause = useEditorStore((s) => s.pause);

  const rafRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(0);

  useEffect(() => {
    if (!isPlaying) {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      return;
    }

    lastTickRef.current = performance.now();

    const tick = (now: number) => {
      const delta = (now - lastTickRef.current) / 1000;
      lastTickRef.current = now;

      const next = currentTime + delta;

      if (next >= totalDuration) {
        seek(totalDuration);
        pause();
        return;
      }

      seek(next);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isPlaying, totalDuration, seek, pause, currentTime]);
}