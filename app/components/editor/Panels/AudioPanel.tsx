'use client';

import { useState } from 'react';
import {
  Volume2,
  VolumeX,
  Wand2,
  Music,
  Mic,
  Gauge,
  Plus,
} from 'lucide-react';
import EffectCard from './EffectCard';

const AUDIO_EFFECTS = [
  { name: 'Fade In', icon: Volume2 },
  { name: 'Fade Out', icon: VolumeX },
  { name: 'Noise Reduce', icon: Wand2 },
  { name: 'Bass Boost', icon: Music },
  { name: 'Voice Enhance', icon: Mic },
  { name: 'Auto Duck', icon: Gauge },
  { name: 'Reverb', icon: Music },
  { name: 'Echo', icon: Volume2 },
  { name: 'Normalize', icon: Gauge },
];

const MUSIC_GENRES = [
  { name: 'Cinematic', gradient: 'from-violet-500 to-purple-700' },
  { name: 'Upbeat', gradient: 'from-amber-500 to-orange-700' },
  { name: 'Ambient', gradient: 'from-cyan-500 to-blue-700' },
  { name: 'Electronic', gradient: 'from-fuchsia-500 to-pink-700' },
  { name: 'Lo-fi', gradient: 'from-emerald-500 to-teal-700' },
  { name: 'Dramatic', gradient: 'from-rose-500 to-red-700' },
];

export default function AudioPanel() {
  const [volume, setVolume] = useState<number>(80);
  const [fadeIn, setFadeIn] = useState<number>(0);
  const [fadeOut, setFadeOut] = useState<number>(0);

  return (
    <div className="flex h-full flex-col">
      {/* Volume control */}
      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Volume
          </span>
          <span className="text-[10px] font-semibold text-white">{volume}%</span>
        </div>
        <div className="flex items-center gap-2">
          <VolumeX className="h-3.5 w-3.5 flex-shrink-0 text-slate-500" />
          <input
            type="range"
            min={0}
            max={100}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="flex-1 accent-violet-500"
          />
          <Volume2 className="h-3.5 w-3.5 flex-shrink-0 text-slate-500" />
        </div>
      </div>

      {/* Fade controls */}
      <div className="mb-4 grid grid-cols-2 gap-3">
        <div>
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[10px] font-medium text-slate-400">Fade In</span>
            <span className="text-[10px] font-semibold text-white">{fadeIn}s</span>
          </div>
          <input
            type="range"
            min={0}
            max={5}
            step={0.5}
            value={fadeIn}
            onChange={(e) => setFadeIn(Number(e.target.value))}
            className="w-full accent-violet-500"
          />
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[10px] font-medium text-slate-400">Fade Out</span>
            <span className="text-[10px] font-semibold text-white">{fadeOut}s</span>
          </div>
          <input
            type="range"
            min={0}
            max={5}
            step={0.5}
            value={fadeOut}
            onChange={(e) => setFadeOut(Number(e.target.value))}
            className="w-full accent-violet-500"
          />
        </div>
      </div>

      {/* Audio effects */}
      <div className="mb-4">
        <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          Audio Effects
        </div>
        <div className="grid grid-cols-3 gap-2">
          {AUDIO_EFFECTS.map((effect) => (
            <EffectCard
              key={effect.name}
              name={effect.name}
              icon={effect.icon}
              size="sm"
            />
          ))}
        </div>
      </div>

      {/* Music genres */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Music Library
          </span>
          <button className="text-[10px] font-medium text-violet-400 hover:text-violet-300">
            Browse All
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {MUSIC_GENRES.map((genre) => (
            <EffectCard
              key={genre.name}
              name={genre.name}
              gradient={genre.gradient}
              size="md"
            />
          ))}
        </div>
      </div>

      {/* Upload audio */}
      <div className="mt-3 border-t border-white/5 pt-3">
        <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white transition-all hover:border-white/20 hover:bg-white/10">
          <Plus className="h-3.5 w-3.5" />
          Add Audio File
        </button>
      </div>
    </div>
  );
}