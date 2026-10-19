'use client';

import { useState, useRef, useCallback } from 'react';
import { getBestMimeType, FORMAT_EXTENSION_MAP } from '@/lib/export-utils';
import type { ExportFormat, ExportQuality } from '@/types/export';

interface UseCanvasRecorderOptions {
  format: ExportFormat;
  quality: ExportQuality;
  fps: number;
  includeAudio: boolean;
}

interface RecorderState {
  isRecording: boolean;
  progress: number; // 0-100
  elapsed: number; // seconds
  error: string | null;
}

export function useCanvasRecorder({
  format,
  quality,
  fps,
  includeAudio,
}: UseCanvasRecorderOptions) {
  const [state, setState] = useState<RecorderState>({
    isRecording: false,
    progress: 0,
    elapsed: 0,
    error: null,
  });

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const stop = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const recorder = recorderRef.current;
      if (!recorder || recorder.state === 'inactive') {
        resolve(null);
        return;
      }

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: getBestMimeType(format),
        });
        chunksRef.current = [];
        setState((prev) => ({ ...prev, isRecording: false, progress: 100 }));
        resolve(blob);
      };

      recorder.stop();

      // Stop all tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }

      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    });
  }, [format]);

  const start = useCallback(
    async (sourceCanvas: HTMLCanvasElement, totalDurationSeconds: number) => {
      if (typeof window === 'undefined') return;
      if (!window.MediaRecorder) {
        setState((prev) => ({
          ...prev,
          error: 'MediaRecorder is not supported in this browser',
        }));
        return;
      }

      setState({
        isRecording: true,
        progress: 0,
        elapsed: 0,
        error: null,
      });

      try {
        // Capture stream from canvas
        const stream = sourceCanvas.captureStream(fps);
        streamRef.current = stream;

        // If we want audio and canvas has audio tracks, they're already included
        // For now, we skip external audio merging (Phase 10)

        const mimeType = getBestMimeType(format);
        const recorder = new MediaRecorder(stream, {
          mimeType,
          videoBitsPerSecond: quality === 'ultra' ? 20_000_000 : 8_000_000,
        });

        chunksRef.current = [];

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunksRef.current.push(e.data);
          }
        };

        recorder.onerror = () => {
          setState((prev) => ({
            ...prev,
            error: 'Recording failed',
            isRecording: false,
          }));
        };

        recorderRef.current = recorder;
        recorder.start(100); // chunk every 100ms

        startTimeRef.current = performance.now();

        // Progress ticker
        const tick = () => {
          const elapsed = (performance.now() - startTimeRef.current) / 1000;
          const progress = Math.min(100, (elapsed / totalDurationSeconds) * 100);

          setState((prev) => ({ ...prev, elapsed, progress }));

          if (elapsed < totalDurationSeconds) {
            rafRef.current = requestAnimationFrame(tick);
          } else {
            // Auto-stop when duration reached
            void stop();
          }
        };

        rafRef.current = requestAnimationFrame(tick);
      } catch (err) {
        setState({
          isRecording: false,
          progress: 0,
          elapsed: 0,
          error: err instanceof Error ? err.message : 'Failed to start recording',
        });
      }
    },
    [format, quality, fps, includeAudio, stop]
  );

  const getExtension = useCallback(() => FORMAT_EXTENSION_MAP[format], [format]);

  return {
    ...state,
    start,
    stop,
    getExtension,
  };
}