'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
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
  const isPlaying = useEditorStore((s) => s.isPlaying);
  const seek = useEditorStore((s) => s.seek);
  const selectClip = useEditorStore((s) => s.selectClip);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const timelineWidth = useMemo(
    () => Math.max(totalDuration * pixelsPerSecond, 1200),
    [totalDuration, pixelsPerSecond]
  );

  const trackAreaHeight = tracks.length * TRACK_HEIGHT;

  useEffect(() => {
    if (!isPlaying || !scrollRef.current) return;

    const container = scrollRef.current;
    const playheadX = HEADER_WIDTH + currentTime * pixelsPerSecond;
    const viewportLeft = container.scrollLeft;
    const viewportRight = viewportLeft + container.clientWidth;

    // Playhead beyond right edge — scroll forward
    if (playheadX > viewportRight - 100) {
      container.scrollLeft = playheadX - container.clientWidth + 100;
    }
    // Playhead before left edge — scroll back
    else if (playheadX < viewportLeft + HEADER_WIDTH + 50) {
      container.scrollLeft = Math.max(0, playheadX - HEADER_WIDTH - 50);
    }
  }, [isPlaying, currentTime, pixelsPerSecond]);

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

      <div
        ref={scrollRef}
        className="relative flex-1 overflow-x-auto overflow-y-hidden"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoverTime(null)}
      >
        <div className="relative flex" style={{ width: timelineWidth, minWidth: '100%' }}>
          {/* Left sticky column */}
          <div className="sticky left-0 z-40 flex-shrink-0 bg-slate-950">
            <div className="h-6 w-44 border-b border-r border-white/5 bg-slate-950" />
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

            <div
              className="pointer-events-none absolute left-0 top-0"
              style={{ width: timelineWidth, height: trackAreaHeight + 24 }}
            >
              <Playhead totalDuration={totalDuration} trackAreaHeight={trackAreaHeight} />
            </div>

            {hoverTime !== null && (
              <div
                className="pointer-events-none absolute top-6 z-10"
                style={{ left: hoverTime * pixelsPerSecond, height: trackAreaHeight }}
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