'use client';

import { useRef, useState, useEffect } from 'react';
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
  const updateClip = useEditorStore((s) => s.updateClip);
  const pushHistory = useEditorStore((s) => s.pushHistory);
  const seek = useEditorStore((s) => s.seek);
  const pause = useEditorStore((s) => s.pause);
  const selectKeyframe = useEditorStore((s) => s.selectKeyframe);
  const selectedKeyframeId = useEditorStore((s) => s.selectedKeyframeId);

  const pointerDownTimeRef = useRef<number>(0);

  const [isEditingText, setIsEditingText] = useState<boolean>(false);
  const [draft, setDraft] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const { isDragging, ghostStartTime, handlePointerDown } = useClipDrag({
    clip,
    pixelsPerSecond,
    totalDuration,
  });

  const displayStartTime = isDragging ? ghostStartTime : clip.startTime;
  const leftPercent = (displayStartTime / totalDuration) * 100;
  const widthPercent = (clip.duration / totalDuration) * 100;

  useEffect(() => {
    if (isEditingText && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingText]);

  const startEditing = () => {
    if (clip.type !== 'text') return;
    setDraft(clip.textContent || clip.name);
    setIsEditingText(true);
  };

  const saveEdit = () => {
    const trimmed = draft.trim();
    if (trimmed.length === 0) {
      cancelEdit();
      return;
    }
    if (trimmed === (clip.textContent || clip.name)) {
      cancelEdit();
      return;
    }
    pushHistory('Edit text content');
    updateClip(clip.id, {
      textContent: trimmed,
      name: trimmed.length > 24 ? `${trimmed.slice(0, 24)}…` : trimmed,
    });
    setIsEditingText(false);
  };

  const cancelEdit = () => {
    setIsEditingText(false);
    setDraft('');
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    startEditing();
  };

  const handleKeyframeMarkerClick = (
    e: React.MouseEvent,
    keyframeId: string,
    keyframeTime: number
  ) => {
    e.stopPropagation();
    e.preventDefault();
    pause();
    seek(clip.startTime + keyframeTime);
    selectClip(clip.id, null);
    selectKeyframe(keyframeId);
  };

  if (isEditingText) {
    return (
      <div
        className="absolute top-1 bottom-1 z-40 overflow-hidden rounded-md border-2 border-violet-500 bg-slate-900 shadow-2xl"
        style={{ left: `${leftPercent}%`, width: `${widthPercent}%` }}
      >
        <input
          ref={inputRef}
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              saveEdit();
            } else if (e.key === 'Escape') {
              e.preventDefault();
              cancelEdit();
            }
          }}
          onBlur={saveEdit}
          className="h-full w-full bg-transparent px-2 text-[11px] font-semibold text-white outline-none"
        />
      </div>
    );
  }

  const keyframes = clip.keyframes ?? [];
  const sortedKeyframes = [...keyframes].sort((a, b) => a.time - b.time);

  return (
    // ✅ OUTER: motion.div — not button (allows nested buttons)
    <motion.div
      role="button"
      tabIndex={0}
      onPointerDown={
        trackLocked
          ? undefined
          : (e) => {
              pointerDownTimeRef.current = Date.now();
              handlePointerDown(e as unknown as React.PointerEvent<HTMLButtonElement>);
            }
      }
      onClick={(e) => {
        e.stopPropagation();
        const elapsed = Date.now() - pointerDownTimeRef.current;
        if (!isDragging && elapsed < 300) {
          selectClip(clip.id, null);
        }
      }}
      onDoubleClick={handleDoubleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
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
      title={clip.type === 'text' ? 'Double-click to edit text' : clip.name}
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
          {clip.type === 'text' && clip.textContent ? clip.textContent : clip.name}
        </div>
        <div className="truncate text-[8px] font-medium text-white/70">
          {clip.duration.toFixed(1)}s
          {isDragging && ` · ${displayStartTime.toFixed(2)}s`}
          {keyframes.length > 0 && ` · ${keyframes.length} kf`}
        </div>
      </div>

      {clip.type === 'text' && !isDragging && (
        <div className="absolute right-1 top-1 rounded bg-black/40 px-1 py-0.5 text-[8px] font-bold uppercase text-white opacity-0 transition-opacity group-hover:opacity-100">
          T
        </div>
      )}

      {/* KEYFRAME MARKERS — buttons are valid inside <div>, not <button> */}
      {!isDragging && sortedKeyframes.length > 0 && (
        <div className="pointer-events-none absolute bottom-0.5 left-0 right-0 h-3">
          {sortedKeyframes.map((kf) => {
            const kfLeftPercent =
              clip.duration > 0 ? (kf.time / clip.duration) * 100 : 0;
            const isKfSelected = selectedKeyframeId === kf.id;

            return (
              <button
                key={kf.id}
                type="button"
                onClick={(e) => handleKeyframeMarkerClick(e, kf.id, kf.time)}
                onPointerDown={(e) => {
                  e.stopPropagation();
                }}
                className={`pointer-events-auto absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-sm transition-transform ${
                  isKfSelected
                    ? 'scale-125 bg-yellow-400 shadow-lg shadow-yellow-400/60'
                    : 'bg-white/80 hover:scale-110 hover:bg-yellow-300'
                }`}
                style={{
                  left: `${kfLeftPercent}%`,
                  transform: 'translate(-50%, -50%) rotate(45deg)',
                }}
                title={`Keyframe @ ${kf.time.toFixed(2)}s — Click to jump`}
                aria-label={`Keyframe at ${kf.time.toFixed(2)} seconds`}
              />
            );
          })}
        </div>
      )}

      {isDragging && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-violet-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-lg">
          {displayStartTime.toFixed(2)}s → {(displayStartTime + clip.duration).toFixed(2)}s
        </div>
      )}
    </motion.div>
  );
}