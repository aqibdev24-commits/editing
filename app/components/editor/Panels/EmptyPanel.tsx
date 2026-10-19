'use client';

import { FileVideo, type LucideIcon } from 'lucide-react';

interface EmptyPanelProps {
  message: string;
  icon?: LucideIcon;
}

export default function EmptyPanel({ message, icon: Icon = FileVideo }: EmptyPanelProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-white/5 px-4 py-8 text-center">
      <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-slate-600">
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-[11px] leading-relaxed text-slate-500">{message}</p>
    </div>
  );
}