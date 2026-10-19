'use client';

import {
  ZoomIn,
  ZoomOut,
  Layers,
  Plus,
  Video,
  Music,
  Type,
} from 'lucide-react';
import { useEditorStore } from '@/store/editor-store';

export default function TimelineControls() {
  const zoom = useEditorStore((s) => s.zoom);
  const setZoom = useEditorStore((s) => s.setZoom);
  const addTrack = useEditorStore((s) => s.addTrack);
  const tracks = useEditorStore((s) => s.tracks);

  const zoomPresets = [0.5, 1, 1.5, 2, 3];

  return (
    <div className="flex items-center justify-between gap-3">
      {/* Track count */}
      <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
        <Layers className="h-3.5 w-3.5" />
        <span>{tracks.length} track{tracks.length === 1 ? '' : 's'}</span>
      </div>

      {/* Add track buttons */}
      <div className="hidden items-center gap-1 sm:flex">
        <span className="mr-1 text-[10px] uppercase tracking-wider text-slate-600">
          Add:
        </span>
        <button
          onClick={() => addTrack('video')}
          className="flex h-6 items-center gap-1 rounded-md border border-white/5 bg-white/[0.02] px-2 text-[10px] font-medium text-slate-400 transition-colors hover:border-violet-500/40 hover:text-violet-300"
          title="Add video track"
        >
          <Video className="h-3 w-3" />
          Video
        </button>
        <button
          onClick={() => addTrack('audio')}
          className="flex h-6 items-center gap-1 rounded-md border border-white/5 bg-white/[0.02] px-2 text-[10px] font-medium text-slate-400 transition-colors hover:border-emerald-500/40 hover:text-emerald-300"
          title="Add audio track"
        >
          <Music className="h-3 w-3" />
          Audio
        </button>
        <button
          onClick={() => addTrack('text')}
          className="flex h-6 items-center gap-1 rounded-md border border-white/5 bg-white/[0.02] px-2 text-[10px] font-medium text-slate-400 transition-colors hover:border-amber-500/40 hover:text-amber-300"
          title="Add text track"
        >
          <Type className="h-3 w-3" />
          Text
        </button>
      </div>

      {/* Zoom controls */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => setZoom(Math.max(0.25, zoom - 0.25))}
          className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
          title="Zoom out"
        >
          <ZoomOut className="h-3.5 w-3.5" />
        </button>

        {/* Zoom preset pills */}
        <div className="hidden items-center gap-0.5 rounded-md border border-white/5 bg-white/[0.02] p-0.5 md:flex">
          {zoomPresets.map((preset) => (
            <button
              key={preset}
              onClick={() => setZoom(preset)}
              className={`rounded px-1.5 py-0.5 text-[9px] font-medium transition-colors ${
                Math.abs(zoom - preset) < 0.01
                  ? 'bg-violet-600 text-white'
                  : 'text-slate-500 hover:text-white'
              }`}
            >
              {Math.round(preset * 100)}%
            </button>
          ))}
        </div>

        <button
          onClick={() => setZoom(Math.min(4, zoom + 0.25))}
          className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
          title="Zoom in"
        >
          <ZoomIn className="h-3.5 w-3.5" />
        </button>

        <button
          onClick={() => addTrack('overlay')}
          className="ml-2 flex h-7 items-center gap-1 rounded-md bg-violet-500/10 px-2 text-[10px] font-medium text-violet-300 transition-colors hover:bg-violet-500/20"
          title="Add overlay track"
        >
          <Plus className="h-3 w-3" />
          Track
        </button>
      </div>
    </div>
  );
}