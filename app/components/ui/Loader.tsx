'use client';

import { motion } from 'framer-motion';
import { Video } from 'lucide-react';

interface LoaderProps {
  message?: string;
  fullScreen?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_MAP = {
  sm: { wrapper: 'h-10 w-10', icon: 'h-5 w-5' },
  md: { wrapper: 'h-14 w-14', icon: 'h-6 w-6' },
  lg: { wrapper: 'h-20 w-20', icon: 'h-9 w-9' },
};

export default function Loader({
  message = 'Loading...',
  fullScreen = true,
  size = 'md',
}: LoaderProps) {
  const sizes = SIZE_MAP[size];

  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative">
        {/* Outer pulse ring */}
        <motion.div
          animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className={`absolute inset-0 rounded-2xl bg-violet-500/20 ${sizes.wrapper}`}
        />

        {/* Middle ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className={`absolute inset-0 rounded-2xl border-2 border-transparent border-t-violet-500 border-r-fuchsia-500 ${sizes.wrapper}`}
        />

        {/* Inner icon */}
        <div
          className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-lg shadow-violet-600/30 ${sizes.wrapper}`}
        >
          <Video className={`text-white ${sizes.icon}`} />
        </div>
      </div>

      {message && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm font-medium text-slate-400"
        >
          {message}
        </motion.p>
      )}
    </div>
  );

  if (!fullScreen) {
    return <div className="flex items-center justify-center py-12">{content}</div>;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="absolute left-1/3 top-1/3 h-[300px] w-[300px] rounded-full bg-fuchsia-600/10 blur-3xl" />
      </div>
      <div className="relative">{content}</div>
    </div>
  );
}