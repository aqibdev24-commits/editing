'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Film, Maximize2, AlertCircle } from 'lucide-react';
import { useEditorStore } from '@/store/editor-store';
import SceneRenderer from './SceneRenderer';
import type { EditorProject, EditorAsset } from '@/types/editor';

interface CanvasAreaProps {
  project: EditorProject;
  assets: EditorAsset[];
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 100);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms
    .toString()
    .padStart(2, '0')}`;
}

export default function CanvasArea({ project, assets }: CanvasAreaProps) {
  const isPlaying = useEditorStore((s) => s.isPlaying);
  const currentTime = useEditorStore((s) => s.currentTime);
  const totalDuration = useEditorStore((s) => s.totalDuration);
  const tracks = useEditorStore((s) => s.tracks);

  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [showSafeArea, setShowSafeArea] = useState<boolean>(false);

  const hasAnyClips = tracks.some((t) => t.clips.length > 0);

  return (
    <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-slate-950 p-6">
      {/* Background grid */}
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* Canvas */}
      <motion.div
        layout
        className="relative aspect-video max-h-full w-full max-w-4xl overflow-hidden rounded-xl border border-white/10 bg-black shadow-2xl"
      >
        {/* Real scene content */}
        <SceneRenderer assets={assets} />

        {/* Empty state overlay */}
        {!hasAnyClips && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-violet-900/30 via-slate-900 to-fuchsia-900/30">
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 backdrop-blur-sm">
                <Film className="h-8 w-8 text-white/60" />
              </div>
              <div className="text-sm font-medium text-white/80">{project.title}</div>
              <div className="mt-1 text-xs text-white/40">
                {formatTime(currentTime)} / {formatTime(totalDuration)}
              </div>
            </div>
          </div>
        )}

        {/* Grid overlay */}
        {showGrid && (
          <div className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="border border-violet-400/20" />
            ))}
          </div>
        )}

        {/* Safe area overlay */}
        {showSafeArea && (
          <div className="pointer-events-none absolute inset-[8%] rounded border-2 border-dashed border-amber-400/40" />
        )}

        {/* Live indicator */}
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-red-500/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
            Live Preview
          </motion.div>
        )}

        {/* Top-right info */}
        <div className="absolute right-3 top-3 flex items-center gap-1.5">
          <button
            onClick={() => setShowGrid((v) => !v)}
            className={`rounded-md px-2 py-1 text-[10px] font-medium backdrop-blur-sm transition-colors ${
              showGrid
                ? 'bg-violet-500/80 text-white'
                : 'bg-black/60 text-white/70 hover:bg-black/80 hover:text-white'
            }`}
            title="Toggle grid"
          >
            Grid
          </button>
          <button
            onClick={() => setShowSafeArea((v) => !v)}
            className={`rounded-md px-2 py-1 text-[10px] font-medium backdrop-blur-sm transition-colors ${
              showSafeArea
                ? 'bg-amber-500/80 text-white'
                : 'bg-black/60 text-white/70 hover:bg-black/80 hover:text-white'
            }`}
            title="Toggle safe area"
          >
            Safe
          </button>
          <div className="rounded-md bg-black/60 px-2 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
            16:9 · {project.resolution}
          </div>
        </div>

        {/* Warning when no clips */}
        {!hasAnyClips && (
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-[11px] text-amber-300 backdrop-blur-sm">
            <AlertCircle className="h-3.5 w-3.5" />
            No clips on timeline — add media to start
          </div>
        )}

        {/* Fullscreen */}
        <button
          className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-md bg-black/60 text-white/70 backdrop-blur-sm transition-colors hover:bg-black/80 hover:text-white"
          title="Fullscreen"
        >
          <Maximize2 className="h-3.5 w-3.5" />
        </button>
      </motion.div>
    </div>
  );
}