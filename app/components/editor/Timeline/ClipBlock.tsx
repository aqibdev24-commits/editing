'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useEditorStore } from '@/store/editor-store';
import { useClipDrag } from '@/hooks/useClipDrag';
import type { TrackClip } from '@/types/editor';

interface ClipBlockProps {
  clip: TrackClip;
  totalDuration: number;
  pixelsPerSecond: number;
  isSelected: boolean;
  trackLocked: boolean;
}

export default function ClipBlock({
  clip,
  totalDuration,
  pixelsPerSecond,
  isSelected,
  trackLocked,
}: ClipBlockProps) {
  const selectClip = useEditorStore((s) => s.selectClip);
  const pointerDownTimeRef = useRef<number>(0);

  const { isDragging, dragOffsetX, ghostStartTime, handlePointerDown } = useClipDrag({
    clip,
    pixelsPerSecond,
    totalDuration,
  });

  const displayStartTime = isDragging ? ghostStartTime : clip.startTime;
  const leftPercent = (displayStartTime / totalDuration) * 100;
  const widthPercent = (clip.duration / totalDuration) * 100;

  return (
    <motion.button
      onPointerDown={
        trackLocked
          ? undefined
          : (e) => {
              pointerDownTimeRef.current = Date.now();
              handlePointerDown(e);
            }
      }
      onClick={(e) => {
        e.stopPropagation();
        // ⚠️ Only select if it was a quick tap (not a drag)
        const elapsed = Date.now() - pointerDownTimeRef.current;
        if (!isDragging && elapsed < 300) {
          selectClip(clip.id, null);
        }
      }}
      whileHover={isDragging ? undefined : { y: -1 }}
      className={`absolute top-1 bottom-1 overflow-hidden rounded-md border text-left transition-shadow ${
        isSelected
          ? 'z-20 border-white/70 ring-2 ring-violet-400/60'
          : 'border-white/5 hover:border-white/25'
      } ${isDragging ? 'z-30 cursor-grabbing shadow-2xl shadow-violet-500/50' : 'cursor-grab'} ${
        trackLocked ? 'cursor-not-allowed opacity-50' : ''
      }`}
      style={{
        left: `${leftPercent}%`,
        width: `${widthPercent}%`,
        transform: isDragging ? 'scale(1.02)' : 'scale(1)',
        transition: isDragging ? 'none' : 'transform 0.15s ease',
      }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${clip.color}`} />
      <div className="absolute inset-0 bg-white/0 transition-colors hover:bg-white/5" />

      {isSelected && !isDragging && (
        <>
          <div className="absolute left-0 top-0 h-full w-1 cursor-ew-resize bg-white/30" />
          <div className="absolute right-0 top-0 h-full w-1 cursor-ew-resize bg-white/30" />
        </>
      )}

      <div className="relative flex h-full flex-col justify-between p-1.5">
        <div className="truncate text-[10px] font-semibold text-white drop-shadow-sm">
          {clip.name}
        </div>
        <div className="truncate text-[8px] font-medium text-white/70">
          {clip.duration.toFixed(1)}s
          {isDragging && ` · ${displayStartTime.toFixed(2)}s`}
        </div>
      </div>

      {isDragging && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-violet-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-lg">
          {displayStartTime.toFixed(2)}s → {(displayStartTime + clip.duration).toFixed(2)}s
        </div>
      )}
    </motion.button>
  );
}