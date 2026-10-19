'use client';

import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  variant?: 'line' | 'circle' | 'rect';
  width?: string | number;
  height?: string | number;
}

export default function Skeleton({
  className = '',
  variant = 'rect',
  width,
  height,
}: SkeletonProps) {
  const base =
    variant === 'circle' ? 'rounded-full' : variant === 'line' ? 'rounded-md h-3' : 'rounded-lg';

  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-white/5 via-white/10 to-white/5 bg-[length:200%_100%] ${base} ${className}`}
      style={{ width, height }}
    />
  );
}

export function PanelSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton height={32} />
      <div className="grid grid-cols-2 gap-2">
        <Skeleton height={80} />
        <Skeleton height={80} />
        <Skeleton height={80} />
        <Skeleton height={80} />
      </div>
      <Skeleton height={120} />
      <Skeleton height={32} />
    </div>
  );
}

export function TimelineSkeleton() {
  return (
    <div className="space-y-2 p-4">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="flex gap-2">
          <Skeleton width={176} height={48} />
          <Skeleton height={48} className="flex-1" />
        </div>
      ))}
    </div>
  );
}

export function EditorSkeleton() {
  return (
    <div className="flex h-full w-full flex-col bg-slate-950">
      {/* Top toolbar */}
      <div className="flex h-14 items-center justify-between border-b border-white/5 px-4">
        <Skeleton width={200} height={32} />
        <Skeleton width={300} height={32} />
        <Skeleton width={200} height={32} />
      </div>

      {/* Main area */}
      <div className="flex flex-1 overflow-hidden">
        <div className="w-14 border-r border-white/5 p-2">
          <Skeleton width={40} height={40} className="mb-2" />
          <Skeleton width={40} height={40} className="mb-2" />
          <Skeleton width={40} height={40} />
        </div>
        <div className="w-64 border-r border-white/5 p-4">
          <PanelSkeleton />
        </div>
        <div className="flex flex-1 flex-col p-6">
          <Skeleton height={400} />
          <div className="mt-4">
            <Skeleton height={48} />
          </div>
        </div>
        <div className="w-72 border-l border-white/5 p-4">
          <PanelSkeleton />
        </div>
      </div>

      {/* Timeline */}
      <div className="h-72 border-t border-white/5">
        <TimelineSkeleton />
      </div>
    </div>
  );
}

interface PulseProps {
  label?: string;
}

export function InlineLoader({ label = 'Loading...' }: PulseProps) {
  return (
    <div className="flex items-center justify-center gap-2 py-8 text-sm text-slate-400">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="h-4 w-4 rounded-full border-2 border-violet-500/30 border-t-violet-500"
      />
      <span>{label}</span>
    </div>
  );
}