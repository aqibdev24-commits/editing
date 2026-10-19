'use client';

import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Clock, Scissors, MoveHorizontal, FastForward } from 'lucide-react';
import NumberField from './NumberField';
import { useEditorStore } from '@/store/editor-store';
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback';
import type { TrackClip } from '@/types/editor';

interface TimingSectionProps {
  clip: TrackClip;
}

export default function TimingSection({ clip }: TimingSectionProps) {
  const updateClip = useEditorStore((s) => s.updateClip);
  const pushHistory = useEditorStore((s) => s.pushHistory);
  const seek = useEditorStore((s) => s.seek);

  const [startTime, setStartTime] = useState<number>(clip.startTime);
  const [duration, setDuration] = useState<number>(clip.duration);

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
      pushHistory('Timing change');
      historyPushedRef.current = true;
    }
  }, [pushHistory]);

  const commitStart = (value: number) => {
    const clamped = Math.max(0, value);
    setStartTime(clamped);
    ensureHistory();
    debouncedUpdate.call({ startTime: clamped });
  };

  const commitDuration = (value: number) => {
    const clamped = Math.max(0.1, value);
    setDuration(clamped);
    ensureHistory();
    debouncedUpdate.call({ duration: clamped });
  };

  const endTime = startTime + duration;

  const jumpToStart = () => seek(startTime);
  const jumpToEnd = () => seek(endTime);
  const jumpToMid = () => seek(startTime + duration / 2);

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          <Clock className="h-3 w-3" />
          Timing
        </h3>
        <span className="text-[10px] font-medium text-slate-400 tabular-nums">
          {startTime.toFixed(2)}s → {endTime.toFixed(2)}s
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
        className="space-y-4"
      >
        <div className="grid grid-cols-2 gap-2">
          <NumberField
            label="Start"
            value={startTime}
            onChange={commitStart}
            unit="s"
            min={0}
            max={3600}
          />
          <NumberField
            label="Duration"
            value={duration}
            onChange={commitDuration}
            unit="s"
            min={0.1}
            max={3600}
          />
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          <button
            onClick={jumpToStart}
            className="flex items-center justify-center gap-1 rounded-md border border-white/5 bg-white/[0.02] py-1.5 text-[9px] font-medium text-slate-400 transition-colors hover:border-violet-500/40 hover:text-violet-300"
            title="Jump to clip start"
          >
            <MoveHorizontal className="h-3 w-3" />
            Start
          </button>
          <button
            onClick={jumpToMid}
            className="flex items-center justify-center gap-1 rounded-md border border-white/5 bg-white/[0.02] py-1.5 text-[9px] font-medium text-slate-400 transition-colors hover:border-violet-500/40 hover:text-violet-300"
            title="Jump to clip middle"
          >
            <FastForward className="h-3 w-3" />
            Mid
          </button>
          <button
            onClick={jumpToEnd}
            className="flex items-center justify-center gap-1 rounded-md border border-white/5 bg-white/[0.02] py-1.5 text-[9px] font-medium text-slate-400 transition-colors hover:border-violet-500/40 hover:text-violet-300"
            title="Jump to clip end"
          >
            <Scissors className="h-3 w-3" />
            End
          </button>
        </div>
      </motion.div>
    </section>
  );
}