'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Diamond, Copy } from 'lucide-react';
import { useEditorStore } from '@/store/editor-store';
import type { TrackClip } from '@/types/editor';

interface KeyframesSectionProps {
    clip: TrackClip;
}

export default function KeyframesSection({ clip }: KeyframesSectionProps) {
    const currentTime = useEditorStore((s) => s.currentTime);
    const selectedKeyframeId = useEditorStore((s) => s.selectedKeyframeId);
    const selectKeyframe = useEditorStore((s) => s.selectKeyframe);
    const seek = useEditorStore((s) => s.seek);
    const pause = useEditorStore((s) => s.pause);
    const addKeyframe = useEditorStore((s) => s.addKeyframe);
    const removeKeyframe = useEditorStore((s) => s.removeKeyframe);
    const updateKeyframe = useEditorStore((s) => s.updateKeyframe);
    const pushHistory = useEditorStore((s) => s.pushHistory);

    const keyframes = [...(clip.keyframes ?? [])].sort((a, b) => a.time - b.time);
    const localTime = Math.max(0, currentTime - clip.startTime);

    const handleAdd = () => {
        addKeyframe(clip.id, localTime);
    };

    const handleDuplicate = (kfId: string) => {
        const kf = keyframes.find((k) => k.id === kfId);
        if (!kf) return;
        pushHistory('Duplicate keyframe');
        // Add a copy at +1s
        const newTime = Math.min(clip.duration, kf.time + 1);
        const id = addKeyframe(clip.id, newTime);
        // Copy all values
        updateKeyframe(clip.id, id, {
            x: kf.x, y: kf.y, scale: kf.scale, rotation: kf.rotation, opacity: kf.opacity,
            blur: kf.blur, brightness: kf.brightness, contrast: kf.contrast, saturate: kf.saturate,
            fontSize: kf.fontSize, letterSpacing: kf.letterSpacing, color: kf.color,
            backgroundColor: kf.backgroundColor, volume: kf.volume,
            easing: kf.easing,
        });
    };

    return (
        <section>
            <div className="mb-3 flex items-center justify-between">
                <h3 className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-yellow-400">
                    <Diamond className="h-3 w-3" />
                    Keyframes
                </h3>
                <span className="text-[9px] text-slate-600">{keyframes.length}</span>
            </div>

            <button
                onClick={handleAdd}
                className="mb-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-yellow-500/30 bg-yellow-500/10 py-1.5 text-[10px] font-semibold text-yellow-400 transition-colors hover:bg-yellow-500/20"
            >
                <Plus className="h-3 w-3" />
                Add at {localTime.toFixed(2)}s
            </button>

            <div className="space-y-1">
                <AnimatePresence>
                    {keyframes.map((kf) => {
                        const isSelected = selectedKeyframeId === kf.id;
                        return (
                            <motion.div
                                key={kf.id}
                                layout
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 8 }}
                                className={`group flex items-center gap-1.5 rounded-lg border px-2 py-1.5 transition-all ${isSelected
                                    ? 'border-yellow-500/60 bg-yellow-500/10'
                                    : 'border-white/5 bg-white/[0.02] hover:border-white/20'
                                    }`}
                            >
                                <button
                                    onClick={() => {
                                        pause();
                                        seek(clip.startTime + kf.time);
                                        selectKeyframe(isSelected ? null : kf.id);
                                    }} 
                                    className="flex flex-1 items-center gap-2 text-left"
                                >
                                    <Diamond
                                        className={`h-2.5 w-2.5 flex-shrink-0 ${isSelected ? 'fill-yellow-400 text-yellow-400' : 'text-slate-500'
                                            }`}
                                    />
                                    <span className="text-[11px] font-medium text-white tabular-nums">
                                        {kf.time.toFixed(2)}s
                                    </span>
                                    {isSelected && (
                                        <span className="ml-auto rounded bg-yellow-500/20 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-yellow-400">
                                            Editing
                                        </span>
                                    )}
                                </button>

                                <button
                                    onClick={() => handleDuplicate(kf.id)}
                                    className="flex h-5 w-5 items-center justify-center rounded text-slate-600 opacity-0 transition-opacity hover:bg-white/5 hover:text-white group-hover:opacity-100"
                                    title="Duplicate"
                                >
                                    <Copy className="h-2.5 w-2.5" />
                                </button>

                                <button
                                    onClick={() => removeKeyframe(clip.id, kf.id)}
                                    className="flex h-5 w-5 items-center justify-center rounded text-slate-600 opacity-0 transition-opacity hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
                                    title="Delete"
                                >
                                    <Trash2 className="h-2.5 w-2.5" />
                                </button>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {keyframes.length === 0 && (
                    <div className="rounded-lg border border-dashed border-white/5 py-3 text-center">
                        <p className="text-[10px] text-slate-600">
                            No keyframes yet.
                        </p>
                        <p className="mt-0.5 text-[9px] text-slate-700">
                            {`Click "Add" to create one at the playhead.`}
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}