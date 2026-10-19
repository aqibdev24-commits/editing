'use client';

import { useState } from 'react';
import {
  Sun,
  Contrast,
  Droplet,
  Thermometer,
  Palette,
  Gauge,
  RotateCcw,
} from 'lucide-react';
import { useEditorStore } from '@/store/editor-store';

interface ColorControl {
  id: string;
  label: string;
  icon: typeof Sun;
  value: number;
  min: number;
  max: number;
  unit?: string;
}

const INITIAL_CONTROLS: ColorControl[] = [
  { id: 'brightness', label: 'Brightness', icon: Sun, value: 0, min: -100, max: 100 },
  { id: 'contrast', label: 'Contrast', icon: Contrast, value: 0, min: -100, max: 100 },
  { id: 'saturation', label: 'Saturation', icon: Droplet, value: 0, min: -100, max: 100 },
  { id: 'temperature', label: 'Temperature', icon: Thermometer, value: 0, min: -100, max: 100 },
  { id: 'tint', label: 'Tint', icon: Palette, value: 0, min: -100, max: 100 },
  { id: 'sharpness', label: 'Sharpness', icon: Gauge, value: 0, min: 0, max: 100 },
];

const COLOR_PRESETS = [
  { name: 'None', gradient: 'from-slate-700 to-slate-800' },
  { name: 'Cinematic', gradient: 'from-violet-600 to-indigo-800' },
  { name: 'Vintage', gradient: 'from-amber-500 to-yellow-700' },
  { name: 'Neon', gradient: 'from-fuchsia-500 to-pink-700' },
  { name: 'B&W', gradient: 'from-slate-400 to-slate-700' },
  { name: 'Sunset', gradient: 'from-orange-500 to-rose-700' },
  { name: 'Cool Blue', gradient: 'from-cyan-500 to-blue-700' },
  { name: 'Warm Gold', gradient: 'from-yellow-500 to-amber-700' },
];

export default function ColorPanel() {
  const [controls, setControls] = useState<ColorControl[]>(INITIAL_CONTROLS);
  const [selectedPreset, setSelectedPreset] = useState<string>('None');
  const selectedClipId = useEditorStore((s) => s.selectedClipId);

  const updateControl = (id: string, value: number) => {
    setControls((prev) =>
      prev.map((c) => (c.id === id ? { ...c, value } : c))
    );
  };

  const resetAll = () => {
    setControls(INITIAL_CONTROLS.map((c) => ({ ...c, value: 0 })));
    setSelectedPreset('None');
  };

  const hasChanges = controls.some((c) => c.value !== 0) || selectedPreset !== 'None';

  return (
    <div className="flex h-full flex-col">
      {/* Warning if no clip selected */}
      {!selectedClipId && (
        <div className="mb-3 rounded-lg border border-amber-500/20 bg-amber-500/5 p-2 text-[10px] text-amber-300">
          Select a clip to apply color adjustments
        </div>
      )}

      {/* Reset button */}
      {hasChanges && (
        <button
          onClick={resetAll}
          className="mb-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-[10px] font-semibold text-white transition-colors hover:bg-white/10"
        >
          <RotateCcw className="h-3 w-3" />
          Reset All
        </button>
      )}

      {/* Color presets */}
      <div className="mb-4">
        <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          Presets
        </div>
        <div className="grid grid-cols-4 gap-2">
          {COLOR_PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => setSelectedPreset(preset.name)}
              title={preset.name}
              className={`group relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                selectedPreset === preset.name
                  ? 'border-violet-500 ring-2 ring-violet-500/30'
                  : 'border-white/10 hover:border-white/30'
              }`}
            >
              <div className={`h-full w-full bg-gradient-to-br ${preset.gradient}`} />
            </button>
          ))}
        </div>
      </div>

      {/* Manual controls */}
      <div className="flex-1 space-y-3 overflow-y-auto">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          Adjustments
        </div>
        {controls.map((control) => {
          const Icon = control.icon;
          return (
            <div key={control.id}>
              <div className="mb-1.5 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Icon className="h-3 w-3 text-slate-500" />
                  <span className="text-[10px] font-medium text-slate-400">
                    {control.label}
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-white">
                  {control.value > 0 ? '+' : ''}
                  {control.value}
                  {control.unit ?? ''}
                </span>
              </div>
              <input
                type="range"
                min={control.min}
                max={control.max}
                value={control.value}
                onChange={(e) => updateControl(control.id, Number(e.target.value))}
                className="w-full accent-violet-500"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}