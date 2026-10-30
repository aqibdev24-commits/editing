'use client';

import { useEffect, useRef } from 'react';
import { useEditorStore } from '@/store/editor-store';

export function usePlayback(totalDuration: number) {
  const isPlaying = useEditorStore((s) => s.isPlaying);
  const playbackRate = useEditorStore((s) => s.playbackRate);
  const isLooping = useEditorStore((s) => s.isLooping);
  const seek = useEditorStore((s) => s.seek);
  const pause = useEditorStore((s) => s.pause);

  const rafRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(0);
  const currentTimeRef = useRef<number>(0);
  const totalDurationRef = useRef<number>(totalDuration);
  const rateRef = useRef<number>(playbackRate);
  const loopingRef = useRef<boolean>(isLooping);

  // Subscribe to store changes
  useEffect(() => {
    const unsubscribe = useEditorStore.subscribe((state) => {
      currentTimeRef.current = state.currentTime;
      rateRef.current = state.playbackRate;
      loopingRef.current = state.isLooping;
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    totalDurationRef.current = totalDuration;
  }, [totalDuration]);

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
      const delta = ((now - lastTickRef.current) / 1000) * rateRef.current;
      lastTickRef.current = now;

      const next = currentTimeRef.current + delta;
      const max = totalDurationRef.current;

      if (next >= max) {
        if (loopingRef.current) {
          seek(0);
          lastTickRef.current = now;
          rafRef.current = requestAnimationFrame(tick);
          return;
        } else {
          seek(max);
          pause();
          return;
        }
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