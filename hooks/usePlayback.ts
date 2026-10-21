'use client';

import { useEffect, useRef } from 'react';
import { useEditorStore } from '@/store/editor-store';

export function usePlayback(totalDuration: number) {
  const isPlaying = useEditorStore((s) => s.isPlaying);
  const seek = useEditorStore((s) => s.seek);
  const pause = useEditorStore((s) => s.pause);

  const rafRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(0);
  const currentTimeRef = useRef<number>(0);
  const totalDurationRef = useRef<number>(totalDuration);

  // Keep refs fresh WITHOUT re-triggering effect
  useEffect(() => {
    currentTimeRef.current = useEditorStore.getState().currentTime;
  });

  useEffect(() => {
    totalDurationRef.current = totalDuration;
  }, [totalDuration]);

  // Subscribe to store changes OUTSIDE React render cycle
  useEffect(() => {
    const unsubscribe = useEditorStore.subscribe((state) => {
      currentTimeRef.current = state.currentTime;
    });
    return unsubscribe;
  }, []);

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

      const next = currentTimeRef.current + delta;
      const max = totalDurationRef.current;

      if (next >= max) {
        seek(max);
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
        rafRef.current = null;
      }
    };
  }, [isPlaying, seek, pause]); 
}