'use client';

import { Copy, Trash2, Scissors, Split, Layers } from 'lucide-react';
import { useEditorStore } from '@/store/editor-store';
import type { TrackClip } from '@/types/editor';

interface ClipActionsProps {
  clip: TrackClip;
}

export default function ClipActions({ clip }: ClipActionsProps) {
  const duplicateClip = useEditorStore((s) => s.duplicateClip);
  const removeClip = useEditorStore((s) => s.removeClip);
  const currentTime = useEditorStore((s) => s.currentTime);
  const updateClip = useEditorStore((s) => s.updateClip);
  const selectClip = useEditorStore((s) => s.selectClip);

  const handleDuplicate = () => {
    duplicateClip(clip.id);
  };

  const handleDelete = () => {
    removeClip(clip.id);
  };

   const handleSplit = () => {
    const endTime = clip.startTime + clip.duration;
    if (currentTime <= clip.startTime || currentTime >= endTime) return;

    const firstDuration = currentTime - clip.startTime;

    updateClip(clip.id, { duration: firstDuration });
    duplicateClip(clip.id);
    // Real split implemented in Phase 6
  };

  return (
    <section>
      <h3 className="mb-3 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
        <Layers className="h-3 w-3" />
        Actions
      </h3>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={handleDuplicate}
          className="flex items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/5 py-2 text-[10px] font-semibold text-white transition-all hover:border-white/20 hover:bg-white/10"
          title="Duplicate (⌘D)"
        >
          <Copy className="h-3 w-3" />
          Duplicate
        </button>

        <button
          onClick={handleSplit}
          className="flex items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/5 py-2 text-[10px] font-semibold text-white transition-all hover:border-white/20 hover:bg-white/10"
          title="Split at playhead"
        >
          <Split className="h-3 w-3" />
          Split
        </button>

        <button
          onClick={() => selectClip(null, null)}
          className="flex items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/5 py-2 text-[10px] font-semibold text-white transition-all hover:border-white/20 hover:bg-white/10"
          title="Deselect clip"
        >
          <Scissors className="h-3 w-3" />
          Deselect
        </button>

        <button
          onClick={handleDelete}
          className="flex items-center justify-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 py-2 text-[10px] font-semibold text-red-400 transition-all hover:border-red-500/40 hover:bg-red-500/20"
          title="Delete clip (⌫)"
        >
          <Trash2 className="h-3 w-3" />
          Delete
        </button>
      </div>
    </section>
  );
}