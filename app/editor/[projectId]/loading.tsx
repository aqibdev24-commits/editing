'use client';

import { motion } from 'framer-motion';
import { Loader2, Film } from 'lucide-react';

export default function EditorLoading() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-slate-950">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-2xl bg-violet-500/30"
          />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-2xl shadow-violet-600/40">
            <Film className="h-8 w-8 text-white" />
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-lg font-semibold text-white">Loading Editor</h2>
          <p className="mt-1 text-sm text-slate-400">Preparing your timeline...</p>
        </div>
        <Loader2 className="h-5 w-5 animate-spin text-violet-400" />
      </div>
    </div>
  );
}