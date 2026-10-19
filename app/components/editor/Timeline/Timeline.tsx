'use client';

import { useRef, useMemo, useState } from 'react';
import { useEditorStore } from '@/store/editor-store';
import { useTimeline } from '@/hooks/useTimeline';
import TimelineRuler from './TimelineRuler';
import TrackRow from './TrackRow';
import Playhead from './Playhead';
import TimelineControls from './TimelineControls';

const TRACK_HEIGHT = 56;

export default function Timeline() {
const { tracks, totalDuration, pixelsPerSecond } = useTimeline();
  const seek = useEditorStore((s) => s.seek);
  const selectClip = useEditorStore((s) => s.selectClip);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Total timeline width
  const timelineWidth = useMemo(
    () => Math.max(totalDuration * pixelsPerSecond, 1200),
    [totalDuration, pixelsPerSecond]
  );

  const trackAreaHeight = tracks.length * TRACK_HEIGHT;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    const rect = scrollRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left + scrollRef.current.scrollLeft;
    const time = x / pixelsPerSecond;
    setHoverTime(Math.max(0, Math.min(totalDuration, time)));
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Ignore clicks on clips (they call stopPropagation)
    if (!scrollRef.current) return;
    const rect = scrollRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left + scrollRef.current.scrollLeft;
    const time = x / pixelsPerSecond;
    seek(Math.max(0, Math.min(totalDuration, time)));
    selectClip(null, null);
  };

  return (
    <div className="flex h-72 flex-shrink-0 flex-col border-t border-white/5 bg-slate-950">
      {/* Header */}
      <div className="flex h-10 flex-shrink-0 items-center border-b border-white/5 px-4">
        <TimelineControls />
      </div>

      {/* Timeline body */}
      <div
        ref={scrollRef}
        className="relative flex-1 overflow-x-auto overflow-y-hidden"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoverTime(null)}
      >
        <div
          className="relative flex"
          style={{ width: timelineWidth, minWidth: '100%' }}
        >
          {/* Left sticky column: track headers + ruler spacer */}
          <div className="sticky left-0 z-40 flex-shrink-0 bg-slate-950">
            {/* Ruler spacer (aligns with ruler height) */}
            <div className="h-6 w-44 border-b border-r border-white/5 bg-slate-950" />
            {/* Track header placeholders — actual headers are inside TrackRow for layout consistency */}
            {tracks.map((track) => (
              <div
                key={`spacer-${track.id}`}
                className="w-44 border-b border-r border-white/5 bg-slate-950"
                style={{ height: TRACK_HEIGHT }}
              />
            ))}
          </div>

          {/* Right scrollable area */}
          <div className="relative flex-1">
            {/* Ruler */}
            <div onClick={handleTimelineClick}>
              <TimelineRuler totalDuration={totalDuration} onSeek={seek} />
            </div>

            {/* Tracks container */}
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

              {/* Empty state */}
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