'use client';

import { useEditorStore } from '@/store/editor-store';
import { useDropZone } from '@/hooks/useDropZone';
import ClipBlock from './ClipBlock';
import type { Track } from '@/types/editor';

interface TrackRowProps {
  track: Track;
  totalDuration: number;
  pixelsPerSecond: number;
  rowHeight: number;
  hideHeader?: boolean;
}

export default function TrackRow({
  track,
  totalDuration,
  pixelsPerSecond,
  rowHeight,
}: TrackRowProps) {
  const selectedClipId = useEditorStore((s) => s.selectedClipId);

  const { isOver, handleDragOver, handleDragLeave, handleDrop } = useDropZone({
    trackId: track.id,
    trackType: track.type,
    pixelsPerSecond,
    totalDuration,
  });

  return (
    <div
      className="relative w-full border-b border-white/5"
      style={{ height: rowHeight }}
    >
      {/* Clips area — DROP ZONE */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative h-full transition-colors ${
          isOver ? 'bg-violet-500/10 ring-1 ring-inset ring-violet-500/40' : ''
        }`}
      >
        {/* Grid lines */}
        <div className="pointer-events-none absolute inset-0">
          <div className="h-full w-full bg-[linear-gradient(90deg,transparent_0,transparent_99px,rgba(148,163,184,0.05)_100px)] bg-[length:100px_100%]" />
        </div>

        {/* Drop hint */}
        {isOver && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="rounded-md bg-violet-500/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
              Drop to add
            </span>
          </div>
        )}

        {/* Clips */}
        {track.clips.map((clip) => (
          <ClipBlock
            key={clip.id}
            clip={clip}
            totalDuration={totalDuration}
            pixelsPerSecond={pixelsPerSecond}
            isSelected={selectedClipId === clip.id}
            trackLocked={track.locked}
          />
        ))}

        {/* Empty state */}
        {track.clips.length === 0 && !isOver && (
          <div className="flex h-full items-center justify-center">
            <span className="text-[10px] text-slate-700">Drop assets here</span>
          </div>
        )}
      </div>
    </div>
  );
}