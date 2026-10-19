'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEditorStore } from '@/store/editor-store';
import PropertiesHeader from '../Properties/PropertiesHeader';
import TransformSection from '../Properties/TransformSection';
import PositionSection from '../Properties/PositionSection';
import AudioSection from '../Properties/AudioSection';
import TimingSection from '../Properties/TimingSection';
import ClipActions from '../Properties/ClipActions';
import EmptyPanel from './EmptyPanel';

export default function PropertiesPanel() {
  const selectedClipId = useEditorStore((s) => s.selectedClipId);
  const tracks = useEditorStore((s) => s.tracks);

  const selectedClip = (() => {
    if (!selectedClipId) return null;
    for (const track of tracks) {
      const clip = track.clips.find((c) => c.id === selectedClipId);
      if (clip) return clip;
    }
    return null;
  })();

  const showAudio = selectedClip?.type === 'audio' || selectedClip?.type === 'video';
  const showTransform = selectedClip?.type !== 'audio';

  return (
    <aside className="hidden w-72 flex-shrink-0 flex-col border-l border-white/5 bg-slate-950/50 xl:flex">
      <AnimatePresence mode="wait">
        {selectedClip ? (
          <motion.div
            key={selectedClip.id}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.15 }}
            className="flex h-full flex-col"
          >
            <PropertiesHeader clip={selectedClip} />

            <div className="flex-1 space-y-6 overflow-y-auto p-4">
              {showTransform && (
                <TransformSection key={`t-${selectedClip.id}`} clip={selectedClip} />
              )}
              {showTransform && (
                <PositionSection key={`p-${selectedClip.id}`} clip={selectedClip} />
              )}
              {showAudio && (
                <AudioSection key={`a-${selectedClip.id}`} clip={selectedClip} />
              )}
              <TimingSection key={`ti-${selectedClip.id}`} clip={selectedClip} />
              <ClipActions clip={selectedClip} />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex h-full flex-col"
          >
            <div className="flex h-12 flex-shrink-0 items-center border-b border-white/5 px-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Properties
              </span>
            </div>
            <div className="flex flex-1 items-center justify-center p-6">
              <EmptyPanel message="Select a clip on the timeline to edit its properties." />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
}