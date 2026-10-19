'use client';

import {
  Monitor,
  Film,
  Gauge,
  Volume2,
  Info,
  FileVideo,
  Image as ImageIcon,
} from 'lucide-react';
import type { ExportFormat, ExportQuality, ExportSettings as ExportSettingsType } from '@/types/export';
import { estimateFileSize, formatBytes } from '@/lib/export-utils';

interface ExportSettingsProps {
  settings: ExportSettingsType;
  onChange: (settings: ExportSettingsType) => void;
  duration: number;
}

const FORMAT_OPTIONS: Array<{ id: ExportFormat; label: string; description: string; icon: typeof Film }> = [
  { id: 'mp4', label: 'MP4', description: 'Best compatibility', icon: FileVideo },
  { id: 'webm', label: 'WebM', description: 'Smaller size', icon: Film },
  { id: 'gif', label: 'GIF', description: 'Animated image', icon: ImageIcon },
];

const RESOLUTION_OPTIONS = [
  { id: '720p', label: '720p HD', dimensions: '1280×720' },
  { id: '1080p', label: '1080p Full HD', dimensions: '1920×1080' },
  { id: '2K', label: '2K QHD', dimensions: '2560×1440' },
  { id: '4K', label: '4K Ultra HD', dimensions: '3840×2160' },
] as const;

const QUALITY_OPTIONS: Array<{ id: ExportQuality; label: string; description: string }> = [
  { id: 'draft', label: 'Draft', description: 'Fastest, lowest quality' },
  { id: 'standard', label: 'Standard', description: 'Balanced' },
  { id: 'high', label: 'High', description: 'Recommended' },
  { id: 'ultra', label: 'Ultra', description: 'Best quality' },
];

const FPS_OPTIONS: Array<{ id: 24 | 30 | 60; label: string }> = [
  { id: 24, label: '24 fps' },
  { id: 30, label: '30 fps' },
  { id: 60, label: '60 fps' },
];

export default function ExportSettings({ settings, onChange, duration }: ExportSettingsProps) {
  const estimatedSize = estimateFileSize(duration, settings.quality, settings.includeAudio);

  const update = <K extends keyof ExportSettingsType>(
    key: K,
    value: ExportSettingsType[K]
  ) => {
    onChange({ ...settings, [key]: value });
  };

  return (
    <div className="space-y-6">
      {/* Format */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <Film className="h-3.5 w-3.5 text-violet-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Format
          </h3>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {FORMAT_OPTIONS.map((format) => {
            const Icon = format.icon;
            const isActive = settings.format === format.id;
            return (
              <button
                key={format.id}
                onClick={() => update('format', format.id)}
                className={`rounded-xl border p-3 text-left transition-all ${
                  isActive
                    ? 'border-violet-500/60 bg-violet-500/10'
                    : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                }`}
              >
                <Icon
                  className={`mb-2 h-5 w-5 ${
                    isActive ? 'text-violet-400' : 'text-slate-500'
                  }`}
                />
                <div className="text-sm font-semibold text-white">{format.label}</div>
                <div className="text-[10px] text-slate-500">{format.description}</div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Resolution */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <Monitor className="h-3.5 w-3.5 text-violet-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Resolution
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {RESOLUTION_OPTIONS.map((res) => {
            const isActive = settings.resolution === res.id;
            return (
              <button
                key={res.id}
                onClick={() => update('resolution', res.id)}
                className={`rounded-xl border p-2.5 text-center transition-all ${
                  isActive
                    ? 'border-violet-500/60 bg-violet-500/10'
                    : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                }`}
              >
                <div className="text-xs font-bold text-white">{res.id}</div>
                <div className="mt-0.5 text-[9px] text-slate-500">{res.dimensions}</div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Quality */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <Gauge className="h-3.5 w-3.5 text-violet-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Quality
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {QUALITY_OPTIONS.map((q) => {
            const isActive = settings.quality === q.id;
            return (
              <button
                key={q.id}
                onClick={() => update('quality', q.id)}
                className={`rounded-xl border p-2.5 text-left transition-all ${
                  isActive
                    ? 'border-violet-500/60 bg-violet-500/10'
                    : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                }`}
              >
                <div className="text-xs font-bold text-white">{q.label}</div>
                <div className="mt-0.5 text-[9px] leading-tight text-slate-500">
                  {q.description}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* FPS */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <Gauge className="h-3.5 w-3.5 text-violet-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Frame Rate
          </h3>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {FPS_OPTIONS.map((f) => {
            const isActive = settings.fps === f.id;
            return (
              <button
                key={f.id}
                onClick={() => update('fps', f.id)}
                className={`rounded-xl border p-2.5 text-center transition-all ${
                  isActive
                    ? 'border-violet-500/60 bg-violet-500/10'
                    : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                }`}
              >
                <div className="text-sm font-bold text-white">{f.label}</div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Audio toggle */}
      <section>
        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-3">
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-violet-400" />
            <div>
              <div className="text-xs font-semibold text-white">Include Audio</div>
              <div className="text-[10px] text-slate-500">
                Export with audio tracks mixed
              </div>
            </div>
          </div>
          <button
            onClick={() => update('includeAudio', !settings.includeAudio)}
            className={`relative h-6 w-11 rounded-full transition-colors ${
              settings.includeAudio ? 'bg-violet-600' : 'bg-white/10'
            }`}
            aria-label="Toggle audio"
          >
            <div
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                settings.includeAudio ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>
      </section>

      {/* Estimated size */}
      <div className="flex items-start gap-2 rounded-xl border border-violet-500/20 bg-violet-500/5 p-3">
        <Info className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-violet-400" />
        <div className="text-[11px] leading-relaxed text-violet-200">
          <div className="font-semibold">Estimated file size</div>
          <div className="text-violet-300/80">
            ~{formatBytes(estimatedSize)} · {Math.floor(duration)}s duration
          </div>
        </div>
      </div>
    </div>
  );
}