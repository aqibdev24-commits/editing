'use client';

import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Mic, Music } from 'lucide-react';
import SliderField from './SliderField';
import { useEditorStore } from '@/store/editor-store';
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback';
import type { TrackClip } from '@/types/editor';

interface AudioSectionProps {
  clip: TrackClip;
}

export default function AudioSection({ clip }: AudioSectionProps) {
  const updateClip = useEditorStore((s) => s.updateClip);
  const pushHistory = useEditorStore((s) => s.pushHistory);

  const initialVolume = clip.volume ?? 100;
  const [volume, setVolume] = useState<number>(initialVolume);
  const [muted, setMuted] = useState<boolean>(initialVolume === 0);

  const historyPushedRef = useRef<boolean>(false);

  const debouncedUpdate = useDebouncedCallback(
    (updates: Partial<TrackClip>) => {
      updateClip(clip.id, updates);
      historyPushedRef.current = false;
    },
    300
  );

  const ensureHistory = useCallback(() => {
    if (!historyPushedRef.current) {
      pushHistory('Audio change');
      historyPushedRef.current = true;
    }
  }, [pushHistory]);

  const commitVolume = (value: number) => {
    setVolume(value);
    setMuted(value === 0);
    ensureHistory();
    debouncedUpdate.call({ volume: value });
  };

  const handleChangeStart = useCallback(() => {
    pushHistory('Audio volume change');
  }, [pushHistory]);

  const toggleMute = () => {
    if (muted) {
      setMuted(false);
      setVolume(100);
      updateClip(clip.id, { volume: 100 });
    } else {
      setMuted(true);
      setVolume(0);
      updateClip(clip.id, { volume: 0 });
    }
  };

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          <Volume2 className="h-3 w-3" />
          Audio
        </h3>
        <button
          onClick={toggleMute}
          className={`flex items-center gap-1 text-[10px] font-medium transition-colors ${
            muted
              ? 'text-red-400 hover:text-red-300'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {muted ? (
            <>
              <VolumeX className="h-3 w-3" />
              Muted
            </>
          ) : (
            <>
              <Volume2 className="h-3 w-3" />
              Mute
            </>
          )}
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
        className="space-y-4"
      >
        <SliderField
          label="Volume"
          value={volume}
          onChange={commitVolume}
          onPointerDown={handleChangeStart}
          min={0}
          max={200}
        />

        <div className="rounded-lg border border-white/5 bg-white/[0.02] p-2.5">
          <div className="mb-2 flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-wider text-slate-500">
            <Music className="h-2.5 w-2.5" />
            Audio Track Info
          </div>
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div>
              <div className="text-slate-500">Format</div>
              <div className="font-medium text-white">AAC 320kbps</div>
            </div>
            <div>
              <div className="text-slate-500">Sample Rate</div>
              <div className="font-medium text-white">48 kHz</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            className="flex items-center justify-center gap-1.5 rounded-lg border border-white/5 bg-white/[0.02] py-2 text-[10px] font-medium text-slate-400 transition-colors hover:border-emerald-500/40 hover:text-emerald-300"
            title="Enhance voice clarity"
          >
            <Mic className="h-3 w-3" />
            Voice
          </button>
          <button
            className="flex items-center justify-center gap-1.5 rounded-lg border border-white/5 bg-white/[0.02] py-2 text-[10px] font-medium text-slate-400 transition-colors hover:border-violet-500/40 hover:text-violet-300"
            title="Auto normalize levels"
          >
            <Volume2 className="h-3 w-3" />
            Normalize
          </button>
        </div>
      </motion.div>
    </section>
  );
}