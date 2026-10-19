'use client';

import { motion } from 'framer-motion';
import { Loader2, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { formatDuration } from '@/lib/export-utils';

interface ExportProgressProps {
  progress: number;
  elapsed: number;
  totalDuration: number;
  status: 'idle' | 'recording' | 'done' | 'error';
  error?: string | null;
  onCancel?: () => void;
}

export default function ExportProgress({
  progress,
  elapsed,
  totalDuration,
  status,
  error,
  onCancel,
}: ExportProgressProps) {
  const isActive = status === 'recording';
  const isDone = status === 'done';
  const isError = status === 'error';

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        {isActive && <Loader2 className="h-5 w-5 animate-spin text-violet-400" />}
        {isDone && <CheckCircle2 className="h-5 w-5 text-emerald-400" />}
        {isError && <AlertCircle className="h-5 w-5 text-red-400" />}
        {!isActive && !isDone && !isError && (
          <XCircle className="h-5 w-5 text-slate-500" />
        )}

        <div>
          <div className="text-sm font-semibold text-white">
            {isActive && 'Recording your video...'}
            {isDone && 'Export complete!'}
            {isError && 'Export failed'}
            {!isActive && !isDone && !isError && 'Ready to export'}
          </div>
          {isActive && (
            <div className="text-[11px] text-slate-500">
              {formatDuration(elapsed)} / {formatDuration(totalDuration)}
            </div>
          )}
          {isError && error && (
            <div className="text-[11px] text-red-400">{error}</div>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="relative h-2 overflow-hidden rounded-full bg-white/5">
          <motion.div
            className={`h-full ${
              isError
                ? 'bg-gradient-to-r from-red-500 to-red-600'
                : isDone
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                  : 'bg-gradient-to-r from-violet-500 to-fuchsia-500'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
          <span>{Math.round(progress)}%</span>
          <span>
            {isActive && 'Do not close this tab'}
            {isDone && 'File ready for download'}
          </span>
        </div>
      </div>

      {/* Actions */}
      {isActive && onCancel && (
        <button
          onClick={onCancel}
          className="w-full rounded-xl border border-red-500/20 bg-red-500/10 py-2.5 text-xs font-semibold text-red-400 transition-colors hover:bg-red-500/20"
        >
          Cancel Export
        </button>
      )}
    </div>
  );
}