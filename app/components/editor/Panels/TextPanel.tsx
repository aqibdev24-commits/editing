'use client';

import { useState } from 'react';
import { Plus, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { useEditorStore } from '@/store/editor-store';

interface TextPreset {
  id: string;
  name: string;
  sample: string;
  className: string;
  description: string;
}

const TEXT_PRESETS: TextPreset[] = [
  { id: 'title', name: 'Title', sample: 'YOUR TITLE', className: 'text-base font-bold tracking-tight', description: 'Bold headline' },
  { id: 'subtitle', name: 'Subtitle', sample: 'Subtitle text', className: 'text-xs font-semibold', description: 'Secondary heading' },
  { id: 'body', name: 'Body', sample: 'Body text goes here', className: 'text-[10px]', description: 'Regular paragraph' },
  { id: 'caption', name: 'Caption', sample: 'CAPTION', className: 'text-[9px] font-bold uppercase tracking-widest', description: 'Uppercase caption' },
  { id: 'quote', name: 'Quote', sample: '"Words of wisdom"', className: 'text-[11px] italic font-serif', description: 'Elegant quote' },
  { id: 'code', name: 'Code', sample: 'const x = 1;', className: 'text-[10px] font-mono', description: 'Monospace text' },
  { id: 'impact', name: 'Impact', sample: 'BOOM', className: 'text-lg font-black', description: 'Big impact text' },
  { id: 'minimal', name: 'Minimal', sample: 'minimal', className: 'text-[10px] font-light tracking-wider', description: 'Light & clean' },
];

const COLORS = [
  { name: 'White', value: '#ffffff' },
  { name: 'Black', value: '#000000' },
  { name: 'Violet', value: '#8b5cf6' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Red', value: '#ef4444' },
];

export default function TextPanel() {
  const [selectedPreset, setSelectedPreset] = useState<string>('title');
  const [selectedColor, setSelectedColor] = useState<string>('#ffffff');
  const addClip = useEditorStore((s) => s.addClip);
  const tracks = useEditorStore((s) => s.tracks);
  const currentTime = useEditorStore((s) => s.currentTime);

  const handleAddText = (preset: TextPreset) => {
    const textTrack = tracks.find((t) => t.type === 'text');
    if (!textTrack) return;

    const clipId =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? `clip-${crypto.randomUUID()}`
        : `clip-${Math.random().toString(36).slice(2, 11)}`;

    addClip(textTrack.id, {
      id: clipId,
      name: preset.name,
      startTime: currentTime,
      duration: 3,
      color: 'from-amber-600 to-amber-700',
      type: 'text',
      opacity: 100,
      scale: 100,
      rotation: 0,
    });
  };

  return (
    <div className="flex h-full flex-col">
      <button
        onClick={() => handleAddText(TEXT_PRESETS[0])}
        className="mb-3 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-2 text-xs font-semibold text-white transition-all hover:scale-[1.02]"
      >
        <Plus className="h-3.5 w-3.5" />
        Add Text
      </button>

      <div className="mb-4">
        <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          Text Presets
        </div>
        <div className="grid grid-cols-2 gap-2">
          {TEXT_PRESETS.map((preset) => (
            <button              key={preset.id}
              onClick={() => {
                setSelectedPreset(preset.id);
                handleAddText(preset);
              }}
              className={`group flex flex-col items-start gap-1.5 rounded-lg border p-2.5 text-left transition-all ${
                selectedPreset === preset.id
                  ? 'border-amber-500/60 bg-amber-500/10'
                  : 'border-white/5 bg-white/[0.02] hover:border-white/20'
              }`}
            >
              <div
                className={`truncate text-white ${preset.className}`}
                style={{ color: selectedPreset === preset.id ? selectedColor : undefined }}
              >
                {preset.sample}
              </div>
              <div className="text-[9px] text-slate-500">{preset.description}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          Text Color
        </div>
        <div className="grid grid-cols-8 gap-1.5">
          {COLORS.map((c) => (
            <button
              key={c.name}
              onClick={() => setSelectedColor(c.value)}
              title={c.name}
              className={`aspect-square rounded-md border-2 transition-all ${
                selectedColor === c.value
                  ? 'border-violet-500 ring-2 ring-violet-500/30'
                  : 'border-white/10 hover:border-white/30'
              }`}
              style={{ backgroundColor: c.value }}
            />
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          Alignment
        </div>
        <div className="flex gap-1 rounded-lg border border-white/5 bg-white/[0.02] p-0.5">
          {[
            { id: 'left', icon: AlignLeft },
            { id: 'center', icon: AlignCenter },
            { id: 'right', icon: AlignRight },
          ].map((align) => {
            const Icon = align.icon;
            return (
              <button
                key={align.id}
                className="flex flex-1 items-center justify-center rounded-md py-1.5 text-slate-500 transition-colors hover:bg-white/5 hover:text-white"
              >
                <Icon className="h-3.5 w-3.5" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}