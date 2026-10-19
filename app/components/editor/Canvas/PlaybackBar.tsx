'use client';

import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize2,
  Repeat,
  Gauge,
} from 'lucide-react';
import { useRef, useCallback } from 'react';
import { useEditorStore } from '@/store/editor-store';

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 100);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms
    .toString()
    .padStart(2, '0')}`;
}

export default function PlaybackBar() {
  const isPlaying = useEditorStore((s) => s.isPlaying);
  const currentTime = useEditorStore((s) => s.currentTime);
  const totalDuration = useEditorStore((s) => s.totalDuration);
  const volume = useEditorStore((s) => s.volume);
  const muted = useEditorStore((s) => s.muted);
  const togglePlay = useEditorStore((s) => s.togglePlay);
  const seek = useEditorStore((s) => s.seek);
  const setVolume = useEditorStore((s) => s.setVolume);
  const toggleMute = useEditorStore((s) => s.toggleMute);

  const scrubberRef = useRef<HTMLDivElement>(null);
  const progress = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;

  const handleScrub = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      const el = scrubberRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();

      const update = (clientX: number) => {
        const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
        const percent = x / rect.width;
        seek(percent * totalDuration);
      };

      update(e.clientX);

      const onMove = (ev: PointerEvent) => update(ev.clientX);
      const onUp = () => {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
      };
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
    },
    [seek, totalDuration]
  );

  return (
    <div className="flex h-12 flex-shrink-0 items-center gap-4 border-t border-white/5 bg-slate-950 px-4">
      {/* Time display */}
      <div className="flex items-center gap-1.5 text-xs font-medium tabular-nums">
        <span className="text-white">{formatTime(currentTime)}</span>
        <span className="text-slate-600">/</span>
        <span className="text-slate-500">{formatTime(totalDuration)}</span>
      </div>

      {/* Playback controls */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => seek(0)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
          title="Go to start (Home)"
        >
          <SkipBack className="h-4 w-4" />
        </button>

        <button
          onClick={togglePlay}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-600/30 transition-all hover:scale-105"
          title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" fill="currentColor" />
          ) : (
            <Play className="h-4 w-4 translate-x-[1px]" fill="currentColor" />
          )}
        </button>

        <button
          onClick={() => seek(totalDuration)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
          title="Go to end (End)"
        >
          <SkipForward className="h-4 w-4" />
        </button>
      </div>

      {/* Progress scrubber */}
      <div
        ref={scrubberRef}
        onPointerDown={handleScrub}
        className="group relative flex-1 cursor-pointer py-2"
      >
        {/* Track */}
        <div className="relative h-1.5 rounded-full bg-white/10">
          {/* Filled */}
          <div
            className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
            style={{ width: `${progress}%` }}
          />
          {/* Handle */}
          <div
            className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-violet-500 opacity-0 shadow-lg shadow-violet-500/50 transition-opacity group-hover:opacity-100"
            style={{ left: `${progress}%` }}
          />
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-1">
        {/* Volume */}
        <div className="group/volume relative flex items-center">
          <button
            onClick={toggleMute}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
            title={muted ? 'Unmute' : 'Mute'}
          >
            {muted || volume === 0 ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </button>
          <input
            type="range"
            min={0}
            max={100}
            value={muted ? 0 : volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="h-1 w-0 cursor-pointer accent-violet-500 transition-all group-hover/volume:w-20"
          />
        </div>

        <button
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
          title="Playback speed"
        >
          <Gauge className="h-4 w-4" />
        </button>

        <button
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
          title="Loop"
        >
          <Repeat className="h-4 w-4" />
        </button>

        <button
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
          title="Fullscreen"
        >
          <Maximize2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}