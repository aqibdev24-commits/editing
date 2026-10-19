'use client';

import { X, Eye, EyeOff } from 'lucide-react';
import { useEditorStore } from '@/store/editor-store';
import type { TrackClip } from '@/types/editor';

interface PropertiesHeaderProps {
  clip: TrackClip;
}

export default function PropertiesHeader({ clip }: PropertiesHeaderProps) {
  const selectClip = useEditorStore((s) => s.selectClip);
  const updateClip = useEditorStore((s) => s.updateClip);

  const isHidden = (clip.opacity ?? 100) === 0;

  const toggleVisibility = () => {
    updateClip(clip.id, { opacity: isHidden ? 100 : 0 });
  };

  const typeColors: Record<string, string> = {
    video: 'text-violet-400',
    audio: 'text-emerald-400',
    text: 'text-amber-400',
    image: 'text-fuchsia-400',
  };

  return (
    <div className="flex h-12 flex-shrink-0 items-center justify-between border-b border-white/5 px-3">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 flex-shrink-0 rounded-full bg-gradient-to-br ${clip.color}`}
          />
          <div className="truncate text-xs font-semibold text-white">{clip.name}</div>
        </div>
        <div
          className={`mt-0.5 truncate text-[10px] uppercase tracking-wider ${
            typeColors[clip.type] ?? 'text-slate-500'
          }`}
        >
          {clip.type} clip
        </div>
      </div>

      <div className="flex items-center gap-0.5">
        <button
          onClick={toggleVisibility}
          className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
          title={isHidden ? 'Show clip' : 'Hide clip'}
        >
          {isHidden ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
        </button>

        <button
          onClick={() => selectClip(null, null)}
          className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
          title="Close properties"
          aria-label="Close properties"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}