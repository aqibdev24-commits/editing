'use client';

import { useRef, useMemo, useState } from 'react';
import { useEditorStore } from '@/store/editor-store';
import { useTimeline } from '@/hooks/useTimeline';
import TimelineRuler from './TimelineRuler';
import TrackRow from './TrackRow';
import Playhead from './Playhead';
import TimelineControls from './TimelineControls';

const TRACK_HEIGHT = 56;
const HEADER_WIDTH = 176; // w-44

export default function Timeline() {
  const { tracks, currentTime, totalDuration, pixelsPerSecond } = useTimeline();
  const seek = useEditorStore((s) => s.seek);
  const selectClip = useEditorStore((s) => s.selectClip);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const timelineWidth = useMemo(
    () => Math.max(totalDuration * pixelsPerSecond, 1200),
    [totalDuration, pixelsPerSecond]
  );

  const trackAreaHeight = tracks.length * TRACK_HEIGHT;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    const rect = scrollRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left + scrollRef.current.scrollLeft - HEADER_WIDTH;
    const time = x / pixelsPerSecond;
    setHoverTime(Math.max(0, Math.min(totalDuration, time)));
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    const rect = scrollRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left + scrollRef.current.scrollLeft - HEADER_WIDTH;
    const time = x / pixelsPerSecond;
    seek(Math.max(0, Math.min(totalDuration, time)));
    selectClip(null, null);
  };

  return (
    <div className="flex h-72 flex-shrink-0 flex-col border-t border-white/5 bg-slate-950">
      <div className="flex h-10 flex-shrink-0 items-center border-b border-white/5 px-4">
        <TimelineControls />
      </div>

      {/*
        ✅ BASS: overflow-auto (horizontal + vertical dono)
        Auto-scroll kuch bhi nahi — sirf user scroll karega
      */}
      <div
        ref={scrollRef}
        className="relative flex-1 overflow-auto"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoverTime(null)}
      >
        <div
          className="relative flex"
          style={{
            width: HEADER_WIDTH + timelineWidth,
            minWidth: '100%',
            minHeight: '100%',
          }}
        >
          {/* ═══ LEFT: Track headers (sticky left) ═══ */}
          <div className="sticky left-0 z-30 flex w-44 flex-shrink-0 flex-col bg-slate-950">
            {/* Ruler spacer */}
            <div className="h-6 flex-shrink-0 border-b border-white/5 bg-slate-950" />

            {/* Track headers */}
            {tracks.map((track) => (
              <div
                key={track.id}
                className="flex-shrink-0 border-b border-white/5"
                style={{ height: TRACK_HEIGHT }}
              >
                <TrackRowHeader track={track} />
              </div>
            ))}
          </div>

          {/* ═══ RIGHT: Ruler + Clips + Playhead ═══ */}
          <div className="relative flex-shrink-0" style={{ width: timelineWidth }}>
            <div onClick={handleTimelineClick}>
              <TimelineRuler totalDuration={totalDuration} onSeek={seek} />
            </div>

            <div className="relative" onClick={handleTimelineClick}>
              {tracks.map((track) => (
                <TrackRow
                  key={track.id}
                  track={track}
                  totalDuration={totalDuration}
                  pixelsPerSecond={pixelsPerSecond}
                  rowHeight={TRACK_HEIGHT}
                />
              ))}

              {tracks.length === 0 && (
                <div className="flex h-24 items-center justify-center text-xs text-slate-500">
                  No tracks yet. Add one above.
                </div>
              )}
            </div>

            {/* Playhead overlay */}
            <div
              className="pointer-events-none absolute left-0 top-0"
              style={{ width: timelineWidth, height: trackAreaHeight + 24 }}
            >
              <Playhead
                totalDuration={totalDuration}
                trackAreaHeight={trackAreaHeight}
              />
            </div>

            {/* Hover indicator */}
            {hoverTime !== null && (
              <div
                className="pointer-events-none absolute top-6 z-10"
                style={{
                  left: hoverTime * pixelsPerSecond,
                  height: trackAreaHeight,
                }}
              >
                <div className="h-full w-px bg-violet-400/30" />
                <div className="absolute -top-1 left-1 whitespace-nowrap rounded bg-black/80 px-1.5 py-0.5 text-[9px] font-medium text-white">
                  {hoverTime.toFixed(2)}s
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TRACK ROW HEADER
// ═══════════════════════════════════════════════════════════════════════════

import {
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Volume2,
  VolumeX,
  Trash2,
} from 'lucide-react';
import type { Track } from '@/types/editor';

function TrackRowHeader({ track }: { track: Track }) {
  const toggleTrackVisibility = useEditorStore((s) => s.toggleTrackVisibility);
  const toggleTrackLock = useEditorStore((s) => s.toggleTrackLock);
  const toggleTrackMute = useEditorStore((s) => s.toggleTrackMute);
  const removeTrack = useEditorStore((s) => s.removeTrack);

  return (
    <div className="flex h-full items-center gap-1 px-2">
      <div className="min-w-0 flex-1">
        <div className="truncate text-[11px] font-medium text-white">
          {track.name}
        </div>
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
          >
            {track.muted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
          </button>
        )}

        <button
          onClick={() => toggleTrackLock(track.id)}
          className={`flex h-6 w-6 items-center justify-center rounded transition-colors ${
            !track.locked
              ? 'text-slate-400 hover:bg-white/5 hover:text-white'
              : 'text-amber-400'
          }`}
        >
          {track.locked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
        </button>

        <button
          onClick={() => removeTrack(track.id)}
          className="flex h-6 w-6 items-center justify-center rounded text-slate-500 hover:bg-red-500/10 hover:text-red-400"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}