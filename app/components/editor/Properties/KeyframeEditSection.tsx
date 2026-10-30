'use client';

import { motion } from 'framer-motion';
import {
  Move3d, Sun, Type, Palette, Volume2, Diamond,
} from 'lucide-react';
import { useEditorStore } from '@/store/editor-store';
import type { ClipKeyframe, TrackClip, AnimationEasing } from '@/types/editor';
import NumberField from './NumberField';
import SliderField from './SliderField';

interface KeyframeEditSectionProps {
  clip: TrackClip;
}

const EASINGS: Array<{ id: AnimationEasing; label: string }> = [
  { id: 'linear', label: 'Linear' },
  { id: 'easeIn', label: 'Ease In' },
  { id: 'easeOut', label: 'Ease Out' },
  { id: 'easeInOut', label: 'Ease In-Out' },
  { id: 'easeOutBack', label: 'Back' },
  { id: 'easeOutElastic', label: 'Elastic' },
];

const COLORS = ['#ffffff', '#000000', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#3b82f6', '#ef4444'];

export default function KeyframeEditSection({ clip }: KeyframeEditSectionProps) {
  const selectedKeyframeId = useEditorStore((s) => s.selectedKeyframeId);
  const updateKeyframe = useEditorStore((s) => s.updateKeyframe);
  const updateClip = useEditorStore((s) => s.updateClip);

  const selectedKeyframe: ClipKeyframe | null =
    (clip.keyframes ?? []).find((kf) => kf.id === selectedKeyframeId) ?? null;

  const isEditingKeyframe = !!selectedKeyframe;

  // Values source: keyframe if selected, else clip base
  const values = isEditingKeyframe
    ? selectedKeyframe
    : {
        x: clip.positionX ?? 0,
        y: clip.positionY ?? 0,
        scale: clip.scale ?? 100,
        rotation: clip.rotation ?? 0,
        opacity: clip.opacity ?? 100,
        blur: clip.filters?.blur ?? 0,
        brightness: clip.filters?.brightness ?? 100,
        contrast: clip.filters?.contrast ?? 100,
        saturate: clip.filters?.saturate ?? 100,
        fontSize: clip.textStyle?.fontSize ?? 32,
        letterSpacing: clip.textStyle?.letterSpacing ?? 0,
        color: clip.textStyle?.color,
        volume: clip.volume ?? 100,
      };

  // Update helper — routes to keyframe or to base
  const update = (updates: Partial<ClipKeyframe>) => {
    if (isEditingKeyframe && selectedKeyframe) {
      updateKeyframe(clip.id, selectedKeyframe.id, updates);
    } else {
      // Apply to base clip
      const clipUpdates: Record<string, unknown> = {};
      if (updates.x !== undefined) clipUpdates.positionX = updates.x;
      if (updates.y !== undefined) clipUpdates.positionY = updates.y;
      if (updates.scale !== undefined) clipUpdates.scale = updates.scale;
      if (updates.rotation !== undefined) clipUpdates.rotation = updates.rotation;
      if (updates.opacity !== undefined) clipUpdates.opacity = updates.opacity;
      if (updates.volume !== undefined) clipUpdates.volume = updates.volume;
      if (updates.fontSize !== undefined || updates.letterSpacing !== undefined || updates.color !== undefined) {
        clipUpdates.textStyle = {
          ...(clip.textStyle ?? {
            fontSize: 32, fontFamily: 'sans', fontWeight: 'bold', italic: false,
            color: '#ffffff', align: 'center', backgroundOpacity: 40,
          }),
          ...(updates.fontSize !== undefined && { fontSize: updates.fontSize }),
          ...(updates.letterSpacing !== undefined && { letterSpacing: updates.letterSpacing }),
          ...(updates.color !== undefined && { color: updates.color }),
        };
      }
      if (updates.blur !== undefined || updates.brightness !== undefined || updates.contrast !== undefined || updates.saturate !== undefined) {
        clipUpdates.filters = {
          ...(clip.filters ?? {}),
          ...(updates.blur !== undefined && { blur: updates.blur }),
          ...(updates.brightness !== undefined && { brightness: updates.brightness }),
          ...(updates.contrast !== undefined && { contrast: updates.contrast }),
          ...(updates.saturate !== undefined && { saturate: updates.saturate }),
        };
      }
      updateClip(clip.id, clipUpdates);
    }
  };

  const header = isEditingKeyframe ? (
    <div className="mb-3 flex items-center gap-1.5 rounded-lg border border-yellow-500/30 bg-yellow-500/5 px-2 py-1.5">
      <Diamond className="h-3 w-3 fill-yellow-400 text-yellow-400" />
      <span className="text-[10px] font-semibold text-yellow-300">
        Editing keyframe @ {selectedKeyframe?.time.toFixed(2)}s
      </span>
    </div>
  ) : (
    <div className="mb-3 rounded-lg border border-white/5 bg-white/[0.02] px-2 py-1.5 text-[9px] text-slate-500">
      Editing base clip values. Select a keyframe to edit it instead.
    </div>
  );

  return (
    <section>
      <h3 className="mb-3 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-violet-400">
        <Diamond className="h-3 w-3" />
        Edit
      </h3>

      {header}

      <motion.div
        key={selectedKeyframe?.id ?? 'base'}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
        className="space-y-4"
      >
        {/* ─── Transform ─── */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-wider text-slate-600">
            <Move3d className="h-2.5 w-2.5" /> Transform
          </div>
          <div className="grid grid-cols-2 gap-2">
            <NumberField
              label="X"
              value={values.x ?? 0}
              onChange={(v) => update({ x: v })}
              unit="px"
            />
            <NumberField
              label="Y"
              value={values.y ?? 0}
              onChange={(v) => update({ y: v })}
              unit="px"
            />
          </div>
          <SliderField
            label="Scale"
            value={values.scale ?? 100}
            onChange={(v) => update({ scale: v })}
            min={10}
            max={300}
          />
          <SliderField
            label="Rotation"
            value={values.rotation ?? 0}
            onChange={(v) => update({ rotation: v })}
            min={-180}
            max={180}
            unit="°"
          />
          <SliderField
            label="Opacity"
            value={values.opacity ?? 100}
            onChange={(v) => update({ opacity: v })}
            min={0}
            max={100}
          />
        </div>

        {/* ─── Filters ─── */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-wider text-slate-600">
            <Sun className="h-2.5 w-2.5" /> Filters
          </div>
          <SliderField
            label="Blur"
            value={values.blur ?? 0}
            onChange={(v) => update({ blur: v })}
            min={0}
            max={20}
            unit="px"
          />
          <SliderField
            label="Brightness"
            value={values.brightness ?? 100}
            onChange={(v) => update({ brightness: v })}
            min={0}
            max={200}
          />
          <SliderField
            label="Contrast"
            value={values.contrast ?? 100}
            onChange={(v) => update({ contrast: v })}
            min={0}
            max={200}
          />
          <SliderField
            label="Saturation"
            value={values.saturate ?? 100}
            onChange={(v) => update({ saturate: v })}
            min={0}
            max={200}
          />
        </div>

        {/* ─── Text (only for text clips) ─── */}
        {clip.type === 'text' && (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-wider text-slate-600">
              <Type className="h-2.5 w-2.5" /> Text
            </div>
            <SliderField
              label="Font Size"
              value={values.fontSize ?? 32}
              onChange={(v) => update({ fontSize: v })}
              min={8}
              max={200}
              unit="px"
            />
            <SliderField
              label="Letter Spacing"
              value={values.letterSpacing ?? 0}
              onChange={(v) => update({ letterSpacing: v })}
              min={-10}
              max={30}
              unit="px"
            />
            <div>
              <label className="mb-1 flex items-center gap-1 text-[10px] font-medium text-slate-500">
                <Palette className="h-2.5 w-2.5" /> Color
              </label>
              <div className="grid grid-cols-8 gap-1">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => update({ color: c })}
                    className={`aspect-square rounded border-2 transition-all ${
                      values.color === c
                        ? 'border-violet-500 ring-2 ring-violet-500/30'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── Audio ─── */}
        {(clip.type === 'audio' || clip.type === 'video') && (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-wider text-slate-600">
              <Volume2 className="h-2.5 w-2.5" /> Audio
            </div>
            <SliderField
              label="Volume"
              value={values.volume ?? 100}
              onChange={(v) => update({ volume: v })}
              min={0}
              max={200}
            />
          </div>
        )}

        {/* ─── Easing (only for keyframes) ─── */}
        {isEditingKeyframe && (
          <div>
            <label className="mb-1 block text-[10px] font-medium text-slate-500">
              Easing → next keyframe
            </label>
            <select
              value={selectedKeyframe?.easing ?? 'easeInOut'}
              onChange={(e) =>
                update({ easing: e.target.value as AnimationEasing })
              }
              className="w-full rounded border border-white/10 bg-slate-900 px-2 py-1.5 text-[11px] text-white outline-none focus:border-violet-500/50"
            >
              {EASINGS.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </motion.div>
    </section>
  );
}