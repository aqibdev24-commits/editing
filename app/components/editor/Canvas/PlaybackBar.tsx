'use client';

import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Repeat,
  Gauge,
  Check,
} from 'lucide-react';
import { useRef, useCallback, useState, useEffect } from 'react';
import { useEditorStore } from '@/store/editor-store';

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 100);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms
    .toString()
    .padStart(2, '0')}`;
}

const SPEED_OPTIONS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3, 4];

export default function PlaybackBar() {
  const isPlaying = useEditorStore((s) => s.isPlaying);
  const currentTime = useEditorStore((s) => s.currentTime);
  const totalDuration = useEditorStore((s) => s.totalDuration);
  const volume = useEditorStore((s) => s.volume);
  const muted = useEditorStore((s) => s.muted);
  const playbackRate = useEditorStore((s) => s.playbackRate);
  const isLooping = useEditorStore((s) => s.isLooping);
  const isFullscreen = useEditorStore((s) => s.isFullscreen);

  const togglePlay = useEditorStore((s) => s.togglePlay);
  const seek = useEditorStore((s) => s.seek);
  const setVolume = useEditorStore((s) => s.setVolume);
  const toggleMute = useEditorStore((s) => s.toggleMute);
  const setPlaybackRate = useEditorStore((s) => s.setPlaybackRate);
  const toggleLooping = useEditorStore((s) => s.toggleLooping);
  const setFullscreen = useEditorStore((s) => s.setFullscreen);

  const scrubberRef = useRef<HTMLDivElement>(null);
  const [speedMenuOpen, setSpeedMenuOpen] = useState<boolean>(false);
  const speedMenuRef = useRef<HTMLDivElement>(null);

  const progress = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;

  // Close speed menu on outside click
  useEffect(() => {
    if (!speedMenuOpen) return;
    const handler = (e: MouseEvent) => {
      if (speedMenuRef.current && !speedMenuRef.current.contains(e.target as Node)) {
        setSpeedMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [speedMenuOpen]);

  // ✅ Fullscreen sync with browser state
  useEffect(() => {
    const onFsChange = () => {
      setFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, [setFullscreen]);

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

  // ✅ FULLSCREEN TOGGLE
  const handleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setFullscreen(true);
      } else {
        await document.exitFullscreen();
        setFullscreen(false);
      }
    } catch (err) {
      console.error('Fullscreen failed:', err);
    }
  }, [setFullscreen]);

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
        <div className="relative h-1.5 rounded-full bg-white/10">
          <div
            className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
            style={{ width: `${progress}%` }}
          />
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

        {/* ✅ Speed button — popup menu */}
        <div className="relative" ref={speedMenuRef}>
          <button
            onClick={() => setSpeedMenuOpen((v) => !v)}
            className={`flex h-8 items-center gap-1 rounded-lg px-1.5 transition-colors ${
              playbackRate !== 1
                ? 'bg-violet-500/15 text-violet-300'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
            title="Playback speed"
          >
            <Gauge className="h-4 w-4" />
            <span className="text-[10px] font-semibold tabular-nums">
              {playbackRate}×
            </span>
          </button>

          {speedMenuOpen && (
            <div className="absolute bottom-full right-0 z-50 mb-2 w-32 overflow-hidden rounded-xl border border-white/10 bg-slate-900/95 p-1 shadow-2xl backdrop-blur-xl">
              <div className="mb-1 border-b border-white/5 px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-slate-500">
                Speed
              </div>
              {SPEED_OPTIONS.map((rate) => (
                <button
                  key={rate}
                  onClick={() => {
                    setPlaybackRate(rate);
                    setSpeedMenuOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-[11px] transition-colors ${
                    playbackRate === rate
                      ? 'bg-violet-500/15 text-violet-300'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span>{rate}×</span>
                  {playbackRate === rate && <Check className="h-3 w-3" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ✅ Loop button */}
        <button
          onClick={toggleLooping}
          className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
            isLooping
              ? 'bg-violet-500/15 text-violet-300'
              : 'text-slate-400 hover:bg-white/5 hover:text-white'
          }`}
          title={isLooping ? 'Loop enabled' : 'Loop disabled'}
        >
          <Repeat className="h-4 w-4" />
        </button>

        {/* ✅ Fullscreen button */}
        <button
          onClick={handleFullscreen}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
          title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
        >
          {isFullscreen ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}