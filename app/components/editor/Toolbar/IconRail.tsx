'use client';

import { motion } from 'framer-motion';
import {
  Film,
  Sparkles,
  Type,
  Music,
  Palette,
  Sliders,
  Upload,
  type LucideIcon,
} from 'lucide-react';
import { useEditorStore } from '@/store/editor-store';
import type { PanelTab } from '@/types/editor';

interface RailItem {
  id: PanelTab;
  icon: LucideIcon;
  label: string;
}

const RAIL_ITEMS: RailItem[] = [
  { id: 'media', icon: Film, label: 'Media' },
  { id: 'effects', icon: Sparkles, label: 'Effects' },
  { id: 'text', icon: Type, label: 'Text' },
  { id: 'audio', icon: Music, label: 'Audio' },
  { id: 'color', icon: Palette, label: 'Color' },
  { id: 'properties', icon: Sliders, label: 'Properties' },
];

export default function IconRail() {
  const activePanel = useEditorStore((s) => s.activePanel);
  const setActivePanel = useEditorStore((s) => s.setActivePanel);

  return (
    <aside className="flex w-14 flex-shrink-0 flex-col items-center gap-1 border-r border-white/5 bg-slate-950 py-3">
      {RAIL_ITEMS.map((item) => {
        const isActive = activePanel === item.id;
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => setActivePanel(item.id)}
            title={item.label}
            className={`group relative flex h-11 w-11 items-center justify-center rounded-xl transition-all ${
              isActive
                ? 'bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 text-violet-300'
                : 'text-slate-500 hover:bg-white/5 hover:text-white'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="rail-active"
                className="absolute -left-1 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-violet-500 to-fuchsia-500"
              />
            )}
            <Icon className="h-5 w-5" />
          </button>
        );
      })}

      <div className="mt-auto">
        <button
          title="Upload"
          className="flex h-11 w-11 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-white/5 hover:text-white"
        >
          <Upload className="h-5 w-5" />
        </button>
      </div>
    </aside>
  );
}