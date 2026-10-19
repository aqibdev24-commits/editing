'use client';

import { useState } from 'react';
import { Sparkles, Film, Wand2 } from 'lucide-react';
import EffectCard from './EffectCard';

type Tab = 'filters' | 'transitions' | 'animations';

const FILTERS = [
  { name: 'Cinematic', gradient: 'from-violet-500 to-purple-700' },
  { name: 'Vintage', gradient: 'from-amber-500 to-orange-700' },
  { name: 'Neon', gradient: 'from-fuchsia-500 to-pink-700' },
  { name: 'B&W', gradient: 'from-slate-500 to-slate-700' },
  { name: 'Warm', gradient: 'from-rose-500 to-red-700' },
  { name: 'Cool', gradient: 'from-cyan-500 to-blue-700' },
  { name: 'Sepia', gradient: 'from-yellow-600 to-amber-800' },
  { name: 'Dreamy', gradient: 'from-pink-500 to-violet-700' },
  { name: 'Vibrant', gradient: 'from-lime-500 to-emerald-700' },
  { name: 'Moody', gradient: 'from-indigo-600 to-slate-800' },
  { name: 'Sunset', gradient: 'from-orange-500 to-rose-700' },
  { name: 'Frost', gradient: 'from-sky-400 to-cyan-600' },
];

const TRANSITIONS = [
  { name: 'Fade', icon: Sparkles },
  { name: 'Slide', icon: Film },
  { name: 'Zoom', icon: Wand2 },
  { name: 'Wipe', icon: Sparkles },
  { name: 'Dissolve', icon: Wand2 },
  { name: 'Glitch', icon: Sparkles },
  { name: 'Spin', icon: Film },
  { name: 'Blur', icon: Wand2 },
  { name: 'Slide Up', icon: Film },
];

const ANIMATIONS = [
  { name: 'Bounce In' },
  { name: 'Fade In' },
  { name: 'Slide Left' },
  { name: 'Slide Right' },
  { name: 'Zoom In' },
  { name: 'Rotate' },
  { name: 'Pulse' },
  { name: 'Shake' },
  { name: 'Flip' },
];

export default function EffectsPanel() {
  const [tab, setTab] = useState<Tab>('filters');

  return (
    <div className="flex h-full flex-col">
      {/* Tabs */}
      <div className="mb-3 flex gap-0.5 rounded-lg border border-white/5 bg-white/[0.02] p-0.5">
        {(
          [
            { id: 'filters', label: 'Filters' },
            { id: 'transitions', label: 'Transitions' },
            { id: 'animations', label: 'Animations' },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 rounded-md px-2 py-1.5 text-[10px] font-semibold transition-colors ${
              tab === t.id
                ? 'bg-violet-600 text-white'
                : 'text-slate-500 hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {tab === 'filters' && (
          <div className="grid grid-cols-3 gap-2">
            {FILTERS.map((filter) => (
              <EffectCard
                key={filter.name}
                name={filter.name}
                gradient={filter.gradient}
                size="sm"
              />
            ))}
          </div>
        )}

        {tab === 'transitions' && (
          <div className="grid grid-cols-2 gap-2">
            {TRANSITIONS.map((transition) => (
              <EffectCard
                key={transition.name}
                name={transition.name}
                icon={transition.icon}
                size="md"
              />
            ))}
          </div>
        )}

        {tab === 'animations' && (
          <div className="grid grid-cols-2 gap-2">
            {ANIMATIONS.map((anim) => (
              <EffectCard
                key={anim.name}
                name={anim.name}
                icon={Sparkles}
                size="md"
              />
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mt-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2 text-[10px] text-emerald-300">
        <div className="font-semibold">All effects are free</div>
        <div className="mt-0.5 text-emerald-300/70">No watermark, no limits</div>
      </div>
    </div>
  );
}