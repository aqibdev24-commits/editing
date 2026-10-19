'use client';

import { useRef, useCallback, useState } from 'react';
import { useEditorStore } from '@/store/editor-store';
import type { TrackClip } from '@/types/editor';

interface UseClipDragOptions {
  clip: TrackClip;
  pixelsPerSecond: number;
  totalDuration: number;
}

interface DragState {
  isDragging: boolean;
  dragOffsetX: number;
  ghostStartTime: number;
}

export function useClipDrag({
  clip,
  pixelsPerSecond,
  totalDuration,
}: UseClipDragOptions) {
  const moveClip = useEditorStore((s) => s.moveClip);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    dragOffsetX: 0,
    ghostStartTime: clip.startTime,
  });

  const startXRef = useRef<number>(0);
  const startTimeRef = useRef<number>(clip.startTime);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      // Ignore right-click
      if (e.button !== 0) return;

      e.preventDefault();
      e.stopPropagation();

      startXRef.current = e.clientX;
      startTimeRef.current = clip.startTime;

      setDragState({
        isDragging: true,
        dragOffsetX: 0,
        ghostStartTime: clip.startTime,
      });

      const onMove = (ev: PointerEvent) => {
        const deltaX = ev.clientX - startXRef.current;
        const deltaSeconds = deltaX / pixelsPerSecond;
        const newStartTime = Math.max(
          0,
          Math.min(totalDuration - clip.duration, startTimeRef.current + deltaSeconds)
        );

        setDragState((prev) => ({
          ...prev,
          dragOffsetX: deltaX,
          ghostStartTime: newStartTime,
        }));
      };

      const onUp = () => {
        setDragState((prev) => {
          // Commit final position
          moveClip(clip.id, prev.ghostStartTime);
          return {
            isDragging: false,
            dragOffsetX: 0,
            ghostStartTime: prev.ghostStartTime,
          };
        });

        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
      };

      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
    },
    [clip.id, clip.startTime, clip.duration, pixelsPerSecond, totalDuration, moveClip]
  );

  return {
    isDragging: dragState.isDragging,
    dragOffsetX: dragState.dragOffsetX,
    ghostStartTime: dragState.ghostStartTime,
    handlePointerDown,
  };
}