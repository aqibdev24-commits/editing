'use client';

import { useMemo } from 'react';
import { useEditorStore } from '@/store/editor-store';

interface TimelineRulerProps {
  totalDuration: number;
  onSeek: (time: number) => void;
}

export default function TimelineRuler({ totalDuration, onSeek }: TimelineRulerProps) {
  const zoom = useEditorStore((s) => s.zoom);

  const markers = useMemo(() => {
    // Adaptive step based on zoom — more zoom = more detail
    let step = 1;
    if (zoom < 0.5) step = 5;
    else if (zoom < 1) step = 2;
    else if (zoom < 1.5) step = 1;
    else if (zoom < 2.5) step = 0.5;
    else step = 0.25;

    const count = Math.ceil(totalDuration / step) + 1;
    const result: Array<{ time: number; isMajor: boolean }> = [];

    for (let i = 0; i < count; i++) {
      const time = i * step;
      // Major every 5s (or every 1s if zoomed in)
      const isMajor = step < 1 ? time % 1 === 0 : time % 5 === 0;
      result.push({ time, isMajor });
    }
    return result;
  }, [totalDuration, zoom]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(1, x / rect.width));
    onSeek(percent * totalDuration);
  };

  return (
    <div
      className="relative h-6 cursor-pointer select-none border-b border-white/5 bg-slate-950/95 backdrop-blur-sm"
      onClick={handleClick}
    >
      <div className="relative h-full w-full">
        {markers.map((marker) => {
          const leftPercent = (marker.time / totalDuration) * 100;
          const label = marker.isMajor
            ? `${Math.floor(marker.time)}s`
            : '';

          return (
            <div
              key={marker.time}
              className="absolute bottom-0 flex flex-col items-center"
              style={{ left: `${leftPercent}%` }}
            >
              {label && (
                <span className="mb-0.5 text-[9px] font-medium text-slate-400">
                  {label}
                </span>
              )}
              <div
                className={`w-px ${
                  marker.isMajor
                    ? 'h-2.5 bg-slate-500'
                    : 'h-1.5 bg-slate-700'
                }`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}