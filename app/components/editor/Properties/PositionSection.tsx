'use client';

import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Move, AlignCenter } from 'lucide-react';
import NumberField from './NumberField';
import { useEditorStore } from '@/store/editor-store';
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback';
import type { TrackClip } from '@/types/editor';

interface PositionSectionProps {
  clip: TrackClip;
}

export default function PositionSection({ clip }: PositionSectionProps) {
  const updateClip = useEditorStore((s) => s.updateClip);
  const pushHistory = useEditorStore((s) => s.pushHistory);

  const [positionX, setPositionX] = useState<number>(clip.positionX ?? 0);
  const [positionY, setPositionY] = useState<number>(clip.positionY ?? 0);

  // Only push history once per "change session"
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
      pushHistory('Position change');
      historyPushedRef.current = true;
    }
  }, [pushHistory]);

  const commitX = (value: number) => {
    setPositionX(value);
    ensureHistory();
    debouncedUpdate.call({ positionX: value });
  };

  const commitY = (value: number) => {
    setPositionY(value);
    ensureHistory();
    debouncedUpdate.call({ positionY: value });
  };

  const centerAll = () => {
    setPositionX(0);
    setPositionY(0);
    updateClip(clip.id, { positionX: 0, positionY: 0 });
  };

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          <Move className="h-3 w-3" />
          Position
        </h3>
        <button
          onClick={centerAll}
          className="flex items-center gap-1 text-[10px] font-medium text-violet-400 transition-colors hover:text-violet-300"
          title="Center on canvas"
        >
          <AlignCenter className="h-3 w-3" />
          Center
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
      >
        <div className="grid grid-cols-2 gap-2">
          <NumberField
            label="X"
            value={positionX}
            onChange={commitX}
            unit="px"
            min={-4000}
            max={4000}
          />
          <NumberField
            label="Y"
            value={positionY}
            onChange={commitY}
            unit="px"
            min={-4000}
            max={4000}
          />
        </div>

        <div className="mt-3 grid grid-cols-3 gap-1.5">
          {[
            { label: 'Top', x: 0, y: -100 },
            { label: 'Mid', x: 0, y: 0 },
            { label: 'Bot', x: 0, y: 100 },
            { label: 'L', x: -100, y: 0 },
            { label: 'C', x: 0, y: 0 },
            { label: 'R', x: 100, y: 0 },
          ].map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setPositionX(preset.x);
                setPositionY(preset.y);
                updateClip(clip.id, { positionX: preset.x, positionY: preset.y });
              }}
              className="rounded-md border border-white/5 bg-white/[0.02] py-1 text-[9px] font-medium text-slate-400 transition-colors hover:border-violet-500/40 hover:text-violet-300"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </motion.div>
    </section>
  );
}