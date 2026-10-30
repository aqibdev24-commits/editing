'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Type, AlignLeft, AlignCenter, AlignRight, Palette } from 'lucide-react';
import { useEditorStore } from '@/store/editor-store';
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback';
import type { TrackClip, TextClipStyle } from '@/types/editor';

interface TextSectionProps {
    clip: TrackClip;
}

const COLORS = [
    { name: 'White', value: '#ffffff' },
    { name: 'Black', value: '#000000' },
    { name: 'Violet', value: '#8b5cf6' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Emerald', value: '#10b981' },
    { name: 'Amber', value: '#f59e0b' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Red', value: '#ef4444' },
];

const FONT_SIZES = [16, 24, 32, 40, 48, 64, 80, 96];

export default function TextSection({ clip }: TextSectionProps) {
    const updateClip = useEditorStore((s) => s.updateClip);
    const pushHistory = useEditorStore((s) => s.pushHistory);

    const [content, setContent] = useState<string>(clip.textContent ?? clip.name);
    const style: TextClipStyle = clip.textStyle ?? {
        fontSize: 32,
        fontFamily: 'sans',
        fontWeight: 'bold',
        italic: false,
        color: '#ffffff',
        align: 'center',
        background: '#000000',
        backgroundOpacity: 40,
    };

    const historyPushedRef = useRef<boolean>(false);

    const debouncedUpdate = useDebouncedCallback(
        (updates: Partial<TrackClip>) => {
            updateClip(clip.id, updates);
            historyPushedRef.current = false;
        },
        300
    );

    const ensureHistory = () => {
        if (!historyPushedRef.current) {
            pushHistory('Edit text');
            historyPushedRef.current = true;
        }
    };

    const handleContentChange = (value: string) => {
        setContent(value);
        ensureHistory();
        debouncedUpdate.call({
            textContent: value,
            name: value.length > 24 ? `${value.slice(0, 24)}…` : value,
        });
    };

    const updateStyle = (updates: Partial<TextClipStyle>) => {
        ensureHistory();
            debouncedUpdate.call({
      textStyle: { ...style, ...updates },
    });
    };

    return (
        <section>
            <div className="mb-3 flex items-center gap-1.5">
                <Type className="h-3 w-3 text-amber-400" />
                <h3 className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Text
                </h3>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15 }}
                className="space-y-3"
            >
                {/* Content */}
                <div>
                    <label className="mb-1 block text-[10px] font-medium text-slate-500">
                        Content
                    </label>
                    <textarea
                        value={content}
                        onChange={(e) => handleContentChange(e.target.value)}
                        rows={3}
                        maxLength={200}
                        placeholder="Enter text..."
                        className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-[11px] text-white placeholder-slate-500 outline-none transition-colors focus:border-violet-500/50"
                    />
                </div>

                {/* Font size */}
                <div>
                    <label className="mb-1 block text-[10px] font-medium text-slate-500">
                        Font Size
                    </label>
                    <div className="grid grid-cols-4 gap-1">
                        {FONT_SIZES.map((size) => (
                            <button
                                key={size}
                                onClick={() => updateStyle({ fontSize: size })}
                                className={`rounded border py-1 text-[10px] font-bold transition-all ${style.fontSize === size
                                        ? 'border-amber-500/60 bg-amber-500/10 text-amber-300'
                                        : 'border-white/5 bg-white/[0.02] text-slate-400 hover:border-white/20'
                                    }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Font weight + italic */}
                <div className="flex gap-1">
                    <button
                        onClick={() =>
                            updateStyle({
                                fontWeight: style.fontWeight === 'bold' ? 'normal' : 'bold',
                            })
                        }
                        className={`flex-1 rounded border py-1.5 text-[11px] font-bold transition-all ${style.fontWeight === 'bold'
                                ? 'border-amber-500/60 bg-amber-500/10 text-amber-300'
                                : 'border-white/5 bg-white/[0.02] text-slate-400'
                            }`}
                    >
                        B
                    </button>
                    <button
                        onClick={() => updateStyle({ italic: !style.italic })}
                        className={`flex-1 rounded border py-1.5 text-[11px] italic transition-all ${style.italic
                                ? 'border-amber-500/60 bg-amber-500/10 text-amber-300'
                                : 'border-white/5 bg-white/[0.02] text-slate-400'
                            }`}
                    >
                        I
                    </button>
                </div>

                {/* Alignment */}
                <div className="flex gap-1 rounded-lg border border-white/5 bg-white/[0.02] p-0.5">
                    {[
                        { id: 'left' as const, icon: AlignLeft },
                        { id: 'center' as const, icon: AlignCenter },
                        { id: 'right' as const, icon: AlignRight },
                    ].map((align) => {
                        const Icon = align.icon;
                        return (
                            <button
                                key={align.id}
                                onClick={() => updateStyle({ align: align.id })}
                                className={`flex flex-1 items-center justify-center rounded-md py-1.5 transition-colors ${style.align === align.id
                                        ? 'bg-amber-600 text-white'
                                        : 'text-slate-500 hover:text-white'
                                    }`}
                            >
                                <Icon className="h-3.5 w-3.5" />
                            </button>
                        );
                    })}
                </div>

                {/* Color */}
                <div>
                    <label className="mb-1 flex items-center gap-1 text-[10px] font-medium text-slate-500">
                        <Palette className="h-2.5 w-2.5" />
                        Color
                    </label>
                    <div className="grid grid-cols-8 gap-1">
                        {COLORS.map((c) => (
                            <button
                                key={c.name}
                                onClick={() => updateStyle({ color: c.value })}
                                title={c.name}
                                className={`aspect-square rounded border-2 transition-all ${style.color === c.value
                                        ? 'border-violet-500 ring-2 ring-violet-500/30'
                                        : 'border-white/10 hover:border-white/30'
                                    }`}
                                style={{ backgroundColor: c.value }}
                            />
                        ))}
                    </div>
                </div>
            </motion.div>
        </section>
    );
}