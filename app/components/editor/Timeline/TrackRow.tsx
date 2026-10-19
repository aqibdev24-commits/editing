'use client';

import {
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Volume2,
  VolumeX,
  Trash2,
} from 'lucide-react';
import { useEditorStore } from '@/store/editor-store';
import { useDropZone } from '@/hooks/useDropZone';
import ClipBlock from './ClipBlock';
import type { Track } from '@/types/editor';

interface TrackRowProps {
  track: Track;
  totalDuration: number;
  pixelsPerSecond: number;
  rowHeight: number;
}

export default function TrackRow({
  track,
  totalDuration,
  pixelsPerSecond,
  rowHeight,
}: TrackRowProps) {
  const selectedClipId = useEditorStore((s) => s.selectedClipId);
  const toggleTrackVisibility = useEditorStore((s) => s.toggleTrackVisibility);
  const toggleTrackLock = useEditorStore((s) => s.toggleTrackLock);
  const toggleTrackMute = useEditorStore((s) => s.toggleTrackMute);
  const removeTrack = useEditorStore((s) => s.removeTrack);

  const { isOver, handleDragOver, handleDragLeave, handleDrop } = useDropZone({
    trackId: track.id,
    trackType: track.type,
    pixelsPerSecond,
    totalDuration,
  });

  return (
    <div className="flex border-b border-white/5" style={{ height: rowHeight }}>
      {/* Track header */}
      <div className="sticky left-0 z-20 flex w-44 flex-shrink-0 items-center gap-1 border-r border-white/5 bg-slate-950 px-2">
        <div className="min-w-0 flex-1">
          <div className="truncate text-[11px] font-medium text-white">{track.name}</div>
          <div className="truncate text-[9px] uppercase tracking-wider text-slate-600">
            {track.type}
          </div>
        </div>

        <div className="flex flex-shrink-0 items-center gap-0.5">
          <button
            onClick={() => toggleTrackVisibility(track.id)}
            className={`flex h-6 w-6 items-center justify-center rounded transition-colors ${
              track.visible
                ? 'text-slate-400 hover:bg-white/5 hover:text-white'
                : 'text-slate-700'
            }`}
            title={track.visible ? 'Hide track' : 'Show track'}
          >
            {track.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
          </button>

          {track.type === 'audio' && (
            <button
              onClick={() => toggleTrackMute(track.id)}
              className={`flex h-6 w-6 items-center justify-center rounded transition-colors ${
                !track.muted
                  ? 'text-slate-400 hover:bg-white/5 hover:text-white'
                  : 'text-slate-700'
              }`}
              title={track.muted ? 'Unmute' : 'Mute'}
            >
              {track.muted ? (
                <VolumeX className="h-3 w-3" />
              ) : (
                <Volume2 className="h-3 w-3" />
              )}
            </button>
          )}

          <button
            onClick={() => toggleTrackLock(track.id)}
            className={`flex h-6 w-6 items-center justify-center rounded transition-colors ${
              !track.locked
                ? 'text-slate-400 hover:bg-white/5 hover:text-white'
                : 'text-amber-400'
            }`}
            title={track.locked ? 'Unlock' : 'Lock'}
          >
            {track.locked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
          </button>

          <button
            onClick={() => removeTrack(track.id)}
            className="flex h-6 w-6 items-center justify-center rounded text-slate-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
            title="Delete track"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Clips area — DROP ZONE */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative flex-1 transition-colors ${
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