'use client';

import { useState } from 'react';
import { useEditorStore } from '@/store/editor-store';
import type { TextClipStyle } from '@/types/editor';
import { Plus, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

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

const FONT_FAMILIES: Array<{
  id: TextClipStyle['fontFamily'];
  label: string;
  preview: string;
}> = [
  { id: 'sans', label: 'Sans', preview: 'Arial' },
  { id: 'serif', label: 'Serif', preview: 'Georgia' },
  { id: 'mono', label: 'Mono', preview: 'Courier' },
];

const FONT_SIZES = [16, 24, 32, 40, 48, 64, 80, 96];

const DEFAULT_STYLE: TextClipStyle = {
  fontSize: 32,
  fontFamily: 'sans',
  fontWeight: 'bold',
  italic: false,
  color: '#ffffff',
  align: 'center',
  background: '#000000',
  backgroundOpacity: 40,
};

export default function TextPanel() {
  const [textInput, setTextInput] = useState<string>('Your text here');
  const [style, setStyle] = useState<TextClipStyle>(DEFAULT_STYLE);
  const addClip = useEditorStore((s) => s.addClip);
  const tracks = useEditorStore((s) => s.tracks);
  const currentTime = useEditorStore((s) => s.currentTime);

  const updateStyle = <K extends keyof TextClipStyle>(
    key: K,
    value: TextClipStyle[K]
  ) => {
    setStyle((s) => ({ ...s, [key]: value }));
  };

  const handleAddText = () => {
    const trimmed = textInput.trim() || 'New Text';
    const textTrack = tracks.find((t) => t.type === 'text');
    if (!textTrack) return;

    const clipId =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? `clip-${crypto.randomUUID()}`
        : `clip-${Math.random().toString(36).slice(2, 11)}`;

    addClip(textTrack.id, {
      id: clipId,
      name: trimmed.length > 24 ? `${trimmed.slice(0, 24)}…` : trimmed,
      startTime: currentTime,
      duration: 3,
      color: 'from-amber-600 to-amber-700',
      type: 'text',
      opacity: 100,
      scale: 100,
      rotation: 0,
      textContent: trimmed,
      textStyle: { ...style },
    });
  };

  return (
    <div className="flex h-full flex-col">
      {/* Text input */}
      <div className="mb-3">
        <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          Text Content
        </label>
        <textarea
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Enter your text..."
          rows={3}
          maxLength={200}
          className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-2.5 py-2 text-xs text-white placeholder-slate-500 outline-none transition-colors focus:border-violet-500/50"
        />
        <div className="mt-1 text-right text-[9px] text-slate-600">
          {textInput.length}/200
        </div>
      </div>

      {/* Font size */}
      <div className="mb-3">
        <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          Font Size
        </label>
        <div className="grid grid-cols-4 gap-1">
          {FONT_SIZES.map((size) => (
            <button
              key={size}
              onClick={() => updateStyle('fontSize', size)}
              className={`rounded-md border py-1.5 text-[10px] font-bold transition-all ${
                style.fontSize === size
                  ? 'border-violet-500/60 bg-violet-500/10 text-violet-300'
                  : 'border-white/5 bg-white/[0.02] text-slate-400 hover:border-white/20'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Font family */}
      <div className="mb-3">
        <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          Font
        </label>
        <div className="grid grid-cols-3 gap-1">
          {FONT_FAMILIES.map((f) => (
            <button
              key={f.id}
              onClick={() => updateStyle('fontFamily', f.id)}
              className={`rounded-md border py-1.5 text-[10px] font-medium transition-all ${
                style.fontFamily === f.id
                  ? 'border-violet-500/60 bg-violet-500/10 text-violet-300'
                  : 'border-white/5 bg-white/[0.02] text-slate-400 hover:border-white/20'
              }`}
              style={{
                fontFamily:
                  f.id === 'sans'
                    ? 'ui-sans-serif, system-ui, sans-serif'
                    : f.id === 'serif'
                      ? 'ui-serif, Georgia, serif'
                      : 'ui-monospace, monospace',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Style toggles */}
      <div className="mb-3 flex gap-1">
        <button
          onClick={() =>
            updateStyle('fontWeight', style.fontWeight === 'bold' ? 'normal' : 'bold')
          }
          className={`flex-1 rounded-md border py-1.5 text-[11px] font-bold transition-all ${
            style.fontWeight === 'bold'
              ? 'border-violet-500/60 bg-violet-500/10 text-violet-300'
              : 'border-white/5 bg-white/[0.02] text-slate-400 hover:border-white/20'
          }`}
        >
          B
        </button>
        <button
          onClick={() => updateStyle('italic', !style.italic)}
          className={`flex-1 rounded-md border py-1.5 text-[11px] italic transition-all ${
            style.italic
              ? 'border-violet-500/60 bg-violet-500/10 text-violet-300'
              : 'border-white/5 bg-white/[0.02] text-slate-400 hover:border-white/20'
          }`}
        >
          I
        </button>
      </div>

      {/* Alignment */}
      <div className="mb-3">
        <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          Alignment
        </label>
        <div className="flex gap-1 rounded-lg border border-white/5 bg-white/[0.02] p-0.5">
          {[
            { id: 'left' as const, icon: AlignLeft },
            { id: 'center' as const, icon: AlignCenter },
            { id: 'right' as const, icon: AlignRight },
          ].map((align) => {
            const Icon = align.icon;
            return (
              <button
                key={align.id}
                onClick={() => updateStyle('align', align.id)}
                className={`flex flex-1 items-center justify-center rounded-md py-1.5 transition-colors ${
                  style.align === align.id
                    ? 'bg-violet-600 text-white'
                    : 'text-slate-500 hover:text-white'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Color */}
      <div className="mb-3">
        <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          Color
        </label>
        <div className="grid grid-cols-8 gap-1.5">
          {COLORS.map((c) => (
            <button
              key={c.name}
              onClick={() => updateStyle('color', c.value)}
              title={c.name}
              className={`aspect-square rounded-md border-2 transition-all ${
                style.color === c.value
                  ? 'border-violet-500 ring-2 ring-violet-500/30'
                  : 'border-white/10 hover:border-white/30'
              }`}
              style={{ backgroundColor: c.value }}
            />
          ))}
        </div>
      </div>

      {/* Add button */}
      <div className="mt-auto border-t border-white/5 pt-3">
        <button
          onClick={handleAddText}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-2 text-xs font-semibold text-white transition-all hover:scale-[1.02]"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Text to Timeline
        </button>
      </div>
    </div>
  );
}