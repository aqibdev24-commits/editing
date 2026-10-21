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
  const ghostTimeRef = useRef<number>(clip.startTime);
  const isDraggingRef = useRef<boolean>(false);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      if (e.button !== 0) return;

      e.preventDefault();
      e.stopPropagation();

      startXRef.current = e.clientX;
      startTimeRef.current = clip.startTime;
      ghostTimeRef.current = clip.startTime;
      isDraggingRef.current = false;

      const onMove = (ev: PointerEvent) => {
        const deltaX = ev.clientX - startXRef.current;

        // Only start dragging after 4px movement (avoid accidental drags on click)
        if (!isDraggingRef.current && Math.abs(deltaX) < 4) {
          return;
        }

        if (!isDraggingRef.current) {
          isDraggingRef.current = true;
          // ⚠️ setState OUTSIDE the store call — safe
          setDragState({
            isDragging: true,
            dragOffsetX: 0,
            ghostStartTime: startTimeRef.current,
          });
        }

        const deltaSeconds = deltaX / pixelsPerSecond;
        const newStartTime = Math.max(
          0,
          Math.min(totalDuration - clip.duration, startTimeRef.current + deltaSeconds)
        );

        ghostTimeRef.current = newStartTime;

        setDragState((prev) => ({
          ...prev,
          dragOffsetX: deltaX,
          ghostStartTime: newStartTime,
        }));
      };

      const onUp = () => {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);

        const wasDragging = isDraggingRef.current;
        const finalTime = ghostTimeRef.current;
        const originalTime = startTimeRef.current;

        // ⚠️ CRITICAL: Reset local drag state FIRST (component-local)
        setDragState({
          isDragging: false,
          dragOffsetX: 0,
          ghostStartTime: finalTime,
        });
        isDraggingRef.current = false;

        // ⚠️ Then commit to store — but only if actually moved
        if (wasDragging && Math.abs(finalTime - originalTime) > 0.001) {
          // ✅ moveClip is inside pointerup handler — NOT render phase
          moveClip(clip.id, finalTime);
        }
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