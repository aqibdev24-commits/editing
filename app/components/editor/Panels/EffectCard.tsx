'use client';

import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface EffectCardProps {
  name: string;
  icon?: LucideIcon;
  gradient?: string;
  preview?: React.ReactNode;
  description?: string;
  onClick?: () => void;
  selected?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const SIZES = {
  sm: 'aspect-square',
  md: 'aspect-video',
  lg: 'aspect-[4/3]',
};

export default function EffectCard({
  name,
  icon: Icon,
  gradient,
  preview,
  description,
  onClick,
  selected = false,
  size = 'sm',
}: EffectCardProps) {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`group relative w-full overflow-hidden rounded-lg border text-left transition-all ${
        selected
          ? 'border-violet-500/60 ring-2 ring-violet-500/30'
          : 'border-white/5 hover:border-white/20'
      }`}
    >
      {/* Preview area */}
      <div className={`relative w-full ${SIZES[size]} overflow-hidden`}>
        {preview ? (
          preview
        ) : gradient ? (
          <div className={`h-full w-full bg-gradient-to-br ${gradient}`} />
        ) : Icon ? (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
            <Icon className="h-5 w-5 text-slate-600 transition-colors group-hover:text-violet-400" />
          </div>
        ) : null}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      </div>

      {/* Label */}
      <div className="bg-slate-900/80 px-2 py-1.5">
        <div className="truncate text-[10px] font-medium text-slate-300 group-hover:text-white">
          {name}
        </div>
        {description && (
          <div className="truncate text-[8px] text-slate-500">{description}</div>
        )}
      </div>
    </motion.button>
  );
}