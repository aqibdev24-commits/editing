'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Maximize2, RotateCw, Eye, Move3d } from 'lucide-react';
import SliderField from './SliderField';
import { useEditorStore } from '@/store/editor-store';
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback';
import type { TrackClip } from '@/types/editor';

interface TransformSectionProps {
  clip: TrackClip;
}

export default function TransformSection({ clip }: TransformSectionProps) {
  const updateClip = useEditorStore((s) => s.updateClip);
  const pushHistory = useEditorStore((s) => s.pushHistory);

  const [opacity, setOpacity] = useState<number>(clip.opacity ?? 100);
  const [scale, setScale] = useState<number>(clip.scale ?? 100);
  const [rotation, setRotation] = useState<number>(clip.rotation ?? 0);

  // Debounced store update (fires 300ms after user stops dragging)
  const debouncedUpdate = useDebouncedCallback(
    (updates: Partial<TrackClip>) => {
      updateClip(clip.id, updates);
    },
    300
  );

  // Track drag start to push single history entry
  const handleChangeStart = useCallback(() => {
    pushHistory('Transform change');
  }, [pushHistory]);

  const commitOpacity = (value: number) => {
    setOpacity(value);
    debouncedUpdate.call({ opacity: value });
  };

  const commitScale = (value: number) => {
    setScale(value);
    debouncedUpdate.call({ scale: value });
  };

  const commitRotation = (value: number) => {
    setRotation(value);
    debouncedUpdate.call({ rotation: value });
  };

  const resetAll = () => {
    setOpacity(100);
    setScale(100);
    setRotation(0);
    updateClip(clip.id, { opacity: 100, scale: 100, rotation: 0 });
  };

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          <Move3d className="h-3 w-3" />
          Transform
        </h3>
        <button
          onClick={resetAll}
          className="text-[10px] font-medium text-violet-400 transition-colors hover:text-violet-300"
        >
          Reset
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
        className="space-y-4"
      >
        <div className="flex items-start gap-2">
          <div className="flex-1">
            <SliderField
              label="Opacity"
              value={opacity}
              onChange={commitOpacity}
              onPointerDown={handleChangeStart}
              min={0}
              max={100}
            />
          </div>
          <Eye className="mt-4 h-3 w-3 flex-shrink-0 text-slate-600" />
        </div>

        <div className="flex items-start gap-2">
          <div className="flex-1">
            <SliderField
              label="Scale"
              value={scale}
              onChange={commitScale}
              onPointerDown={handleChangeStart}
              min={10}
              max={300}
            />
          </div>
          <Maximize2 className="mt-4 h-3 w-3 flex-shrink-0 text-slate-600" />
        </div>

        <div className="flex items-start gap-2">
          <div className="flex-1">
            <SliderField
              label="Rotation"
              value={rotation}
              onChange={commitRotation}
              onPointerDown={handleChangeStart}
              min={-180}
              max={180}
              unit="°"
            />
          </div>
          <RotateCw className="mt-4 h-3 w-3 flex-shrink-0 text-slate-600" />
        </div>
      </motion.div>
    </section>
  );
}