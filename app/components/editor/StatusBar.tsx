'use client';

import { Grid3x3, Scissors, Type, Layers, type LucideIcon } from 'lucide-react';
import { useEditorStore } from '@/store/editor-store';
import { APP_NAME } from '@/lib/constants';
import type { ToolMode } from '@/types/editor';

interface Tool {
  id: ToolMode;
  icon: LucideIcon;
  label: string;
}

const TOOLS: Tool[] = [
  { id: 'select', icon: Grid3x3, label: 'Select' },
  { id: 'cut', icon: Scissors, label: 'Cut' },
  { id: 'text', icon: Type, label: 'Text' },
  { id: 'shape', icon: Layers, label: 'Shape' },
];

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 100);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms
    .toString()
    .padStart(2, '0')}`;
}

export default function StatusBar() {
  const toolMode = useEditorStore((s) => s.toolMode);
  const setToolMode = useEditorStore((s) => s.setToolMode);
  const currentTime = useEditorStore((s) => s.currentTime);

  return (
    <footer className="flex h-8 flex-shrink-0 items-center justify-between border-t border-white/5 bg-slate-950 px-3 text-[10px]">
      <div className="flex items-center gap-1">
        {TOOLS.map((tool) => {
          const isActive = toolMode === tool.id;
          const Icon = tool.icon;
          return (
            <button
              key={tool.id}
              onClick={() => setToolMode(tool.id)}
              title={tool.label}
              className={`flex items-center gap-1.5 rounded px-2 py-1 transition-colors ${
                isActive
                  ? 'bg-violet-500/15 text-violet-300'
                  : 'text-slate-500 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className="h-3 w-3" />
              <span className="hidden sm:inline">{tool.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3 text-slate-500">
        <span>Time: {formatTime(currentTime)}</span>
        <span className="hidden sm:inline">·</span>
        <span className="hidden sm:inline">{APP_NAME} Studio</span>
      </div>
    </footer>
  );
}