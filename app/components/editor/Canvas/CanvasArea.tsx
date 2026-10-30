'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Film, Maximize2, AlertCircle, Image as ImageIcon, Palette, Video } from 'lucide-react';
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
  const canvasBackground = useEditorStore((s) => s.canvasBackground);
  const setCanvasBackground = useEditorStore((s) => s.setCanvasBackground);

  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [showSafeArea, setShowSafeArea] = useState<boolean>(false);
  const [bgPickerOpen, setBgPickerOpen] = useState<boolean>(false);

  const hasAnyClips = tracks.some((t) => t.clips.length > 0);

  // Background rendering
  const renderBackground = () => {
    if (!canvasBackground) {
      return (
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/30 via-slate-900 to-fuchsia-900/30" />
      );
    }

    if (canvasBackground.type === 'color') {
      return (
        <div
          className="absolute inset-0"
          style={{ backgroundColor: canvasBackground.value }}
        />
      );
    }

    if (canvasBackground.type === 'image') {
      return (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${canvasBackground.value})` }}
        />
      );
    }

    if (canvasBackground.type === 'video') {
      return (
        <video
          src={canvasBackground.value}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        />
      );
    }

    return null;
  };

  // Video assets for background picker
  const imageAssets = assets.filter((a) => a.type === 'image' || a.type === 'video');

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
        {/* ✅ Background */}
        {renderBackground()}

        {/* Real scene content */}
        <SceneRenderer assets={assets} />

        {/* Empty state overlay */}
        {!hasAnyClips && !canvasBackground && (
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

        {/* Top-right info + Background button */}
        <div className="absolute right-3 top-3 flex items-center gap-1.5">
          <button
            onClick={() => setBgPickerOpen((v) => !v)}
            className="flex items-center gap-1 rounded-md bg-black/60 px-2 py-1 text-[10px] font-medium text-white/70 backdrop-blur-sm transition-colors hover:bg-black/80 hover:text-white"
            title="Set background"
          >
            <Palette className="h-3 w-3" />
            BG
          </button>
          <button
            onClick={() => setShowGrid((v) => !v)}
            className={`rounded-md px-2 py-1 text-[10px] font-medium backdrop-blur-sm transition-colors ${
              showGrid
                ? 'bg-violet-500/80 text-white'
                : 'bg-black/60 text-white/70 hover:bg-black/80 hover:text-white'
            }`}
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
          >
            Safe
          </button>
          <div className="rounded-md bg-black/60 px-2 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
            16:9 · {project.resolution}
          </div>
        </div>

        {/* Background picker popup */}
        {bgPickerOpen && (
          <BackgroundPicker
            currentBg={canvasBackground}
            assets={imageAssets}
            onChange={(bg) => {
              setCanvasBackground(bg);
              setBgPickerOpen(false);
            }}
            onClose={() => setBgPickerOpen(false)}
          />
        )}

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

// ═══════════════════════════════════════════════════════════════════════════
// BACKGROUND PICKER
// ═══════════════════════════════════════════════════════════════════════════

interface BackgroundPickerProps {
  currentBg: { type: 'color' | 'image' | 'video'; value: string } | null;
  assets: EditorAsset[];
  onChange: (bg: { type: 'color' | 'image' | 'video'; value: string } | null) => void;
  onClose: () => void;
}

const BG_COLORS = [
  '#000000', '#ffffff', '#0f172a', '#1e1b4b',
  '#4c1d95', '#7c2d12', '#14532d', '#831843',
  '#1e293b', '#0c4a6e', '#3f3f46', '#713f12',
];

function BackgroundPicker({ currentBg, assets, onChange, onClose }: BackgroundPickerProps) {
  return (
    <>
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute right-3 top-14 z-50 w-72 overflow-hidden rounded-xl border border-white/10 bg-slate-900/95 shadow-2xl backdrop-blur-xl"
      >
        <div className="border-b border-white/5 p-3">
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Canvas Background
          </h3>
        </div>

        <div className="max-h-96 overflow-y-auto p-3">
          {/* Colors */}
          <div className="mb-4">
            <div className="mb-1.5 flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-wider text-slate-600">
              <Palette className="h-2.5 w-2.5" /> Colors
            </div>
            <div className="grid grid-cols-6 gap-1.5">
              {BG_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => onChange({ type: 'color', value: color })}
                  className={`aspect-square rounded-md border-2 transition-all ${
                    currentBg?.type === 'color' && currentBg.value === color
                      ? 'border-violet-500 ring-2 ring-violet-500/30'
                      : 'border-white/10 hover:border-white/30'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Images/Videos from assets */}
          {assets.length > 0 && (
            <div className="mb-4">
              <div className="mb-1.5 flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-wider text-slate-600">
                <ImageIcon className="h-2.5 w-2.5" /> Your Media
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {assets.slice(0, 12).map((asset) => {
                  const isActive =
                    currentBg?.type === asset.type && currentBg.value === asset.url;
                  return (
                    <button
                      key={asset._id}
                      onClick={() =>
                        onChange({
                          type: asset.type === 'video' ? 'video' : 'image',
                          value: asset.url,
                        })
                      }
                      className={`aspect-square overflow-hidden rounded-md border-2 bg-slate-800 transition-all ${
                        isActive
                          ? 'border-violet-500 ring-2 ring-violet-500/30'
                          : 'border-white/10 hover:border-white/30'
                      }`}
                      title={asset.name}
                    >
                      {asset.type === 'video' ? (
                        <div className="flex h-full w-full items-center justify-center text-violet-400">
                          <Video className="h-4 w-4" />
                        </div>
                      ) : asset.thumbnailUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={asset.thumbnailUrl}
                          alt={asset.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-slate-500">
                          <ImageIcon className="h-4 w-4" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Clear */}
          <button
            onClick={() => onChange(null)}
            className="w-full rounded-md border border-white/10 bg-white/5 py-1.5 text-[10px] font-medium text-slate-400 hover:bg-white/10 hover:text-white"
          >
            Clear Background
          </button>
        </div>
      </motion.div>
    </>
  );
}