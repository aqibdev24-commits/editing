'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Upload } from 'lucide-react';
import { useEditorStore } from '@/store/editor-store';
import MediaPanel from './MediaPanel';
import EffectsPanel from './EffectsPanel';
import TextPanel from './TextPanel';
import AudioPanel from './AudioPanel';
import ColorPanel from './ColorPanel';
import EmptyPanel from './EmptyPanel';
import type { EditorAsset, PanelTab } from '@/types/editor';

interface LeftPanelProps {
  assets: EditorAsset[];
}

const PANEL_TITLES: Record<PanelTab, string> = {
  media: 'Media',
  effects: 'Effects',
  text: 'Text',
  audio: 'Audio',
  color: 'Color',
  properties: 'Properties',
};

export default function LeftPanel({ assets }: LeftPanelProps) {
  const activePanel = useEditorStore((s) => s.activePanel);
  const selectedClipId = useEditorStore((s) => s.selectedClipId);

  return (
    <aside className="hidden w-64 flex-shrink-0 flex-col border-r border-white/5 bg-slate-950/50 lg:flex">
      {/* Header */}
      <div className="flex h-12 flex-shrink-0 items-center justify-between border-b border-white/5 px-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {PANEL_TITLES[activePanel]}
        </span>
        <button className="flex h-6 w-6 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-white/5 hover:text-white">
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePanel}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.15 }}
            className="h-full"
          >
            {activePanel === 'media' && <MediaPanel assets={assets} />}
            {activePanel === 'effects' && <EffectsPanel />}
            {activePanel === 'text' && <TextPanel />}
            {activePanel === 'audio' && <AudioPanel />}
            {activePanel === 'color' && <ColorPanel />}
            {activePanel === 'properties' && (
              <div className="space-y-3">
                {selectedClipId ? (
                  <EmptyPanel message="Clip properties will appear in Phase 4 (right panel)." />
                ) : (
                  <EmptyPanel message="Select a clip from the timeline to view its properties." />
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer upload */}
      {(activePanel === 'media' || activePanel === 'audio') && (
        <div className="border-t border-white/5 p-3">
          <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 px-3 py-2 text-xs font-semibold text-white transition-all hover:scale-[1.02]">
            <Upload className="h-3.5 w-3.5" />
            Upload
          </button>
        </div>
      )}
    </aside>
  );
}