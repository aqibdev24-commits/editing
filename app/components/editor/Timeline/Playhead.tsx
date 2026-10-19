'use client';

import { useRef, useState, useCallback } from 'react';
import { useEditorStore } from '@/store/editor-store';

interface PlayheadProps {
  totalDuration: number;
  trackAreaHeight: number;
}

export default function Playhead({ totalDuration, trackAreaHeight }: PlayheadProps) {
  const currentTime = useEditorStore((s) => s.currentTime);
  const seek = useEditorStore((s) => s.seek);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const leftPercent = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);

      const parent = containerRef.current?.parentElement;
      if (!parent) return;

      const rect = parent.getBoundingClientRect();

      const onMove = (ev: PointerEvent) => {
        const x = ev.clientX - rect.left;
        const percent = Math.max(0, Math.min(1, x / rect.width));
        seek(percent * totalDuration);
      };

      const onUp = () => {
        setIsDragging(false);
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
      };

      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
    },
    [seek, totalDuration]
  );

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute top-0 z-30"
      style={{
        left: `${leftPercent}%`,
        height: trackAreaHeight + 24,
      }}
    >
      <div className="relative h-full">
        {/* Head (draggable) */}
        <div
          onPointerDown={handlePointerDown}
          className={`pointer-events-auto absolute -left-1.5 top-0 cursor-ew-resize transition-transform ${
            isDragging ? 'scale-125' : 'hover:scale-110'
          }`}
        >
          <div className="flex h-4 w-3 items-center justify-center">
            <div className="h-3 w-3 rounded-sm bg-red-500 shadow-lg shadow-red-500/50" />
          </div>
        </div>

        {/* Line */}
        <div className="pointer-events-none absolute left-0 top-3 h-full w-px bg-red-500 shadow-lg shadow-red-500/50">
          <div className="absolute -left-1 top-0 h-1.5 w-2.5 rounded-b-sm bg-red-500" />
        </div>
      </div>
    </div>
  );
}