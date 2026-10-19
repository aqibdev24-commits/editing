'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  Undo2,
  Redo2,
  Scissors,
  Copy,
  Trash2,
  Save,
  Share2,
  Download,
  Loader2,
  PanelLeft,
  PanelRight,
  Check,
} from 'lucide-react';
import { useEditorStore } from '@/store/editor-store';
import { useToast } from '@/app/components/ui/Toast';
import type { EditorProject, EditorUser } from '@/types/editor';
import ToolbarButton from './ToolbarButton';

interface TopToolbarProps {
  project: EditorProject;
  user: EditorUser;
  onSave: () => void;
  onToggleLeftPanel?: () => void;
  onToggleRightPanel?: () => void;
}

export default function TopToolbar({
  project,
  user,
  onSave,
  onToggleLeftPanel,
  onToggleRightPanel,
}: TopToolbarProps) {
  const isSaving = useEditorStore((s) => s.isSaving);
  const isDirty = useEditorStore((s) => s.isDirty);
  const lastSavedAt = useEditorStore((s) => s.lastSavedAt);
  const selectedClipId = useEditorStore((s) => s.selectedClipId);
  const removeClip = useEditorStore((s) => s.removeClip);
  const duplicateClip = useEditorStore((s) => s.duplicateClip);

  // History state
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);
  const canUndo = useEditorStore((s) => s.past.length > 0);
  const canRedo = useEditorStore((s) => s.future.length > 0);
  const pastCount = useEditorStore((s) => s.past.length);
  const futureCount = useEditorStore((s) => s.future.length);

  const { addToast } = useToast();

  const savedLabel = lastSavedAt
    ? `Saved ${lastSavedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    : 'Not saved yet';

  const handleDuplicate = () => {
    if (!selectedClipId) return;
    duplicateClip(selectedClipId);
    addToast({ type: 'success', title: 'Clip duplicated' });
  };

  const handleDelete = () => {
    if (!selectedClipId) return;
    removeClip(selectedClipId);
    addToast({ type: 'info', title: 'Clip deleted', description: 'Press ⌘Z to undo' });
  };

  return (
    <header className="flex h-14 flex-shrink-0 items-center justify-between gap-2 border-b border-white/5 bg-slate-950 px-2 sm:px-4">
      {/* Left */}
      <div className="flex min-w-0 items-center gap-2">
        {onToggleLeftPanel && (
          <button
            onClick={onToggleLeftPanel}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/5 hover:text-white lg:hidden"
            aria-label="Toggle left panel"
          >
            <PanelLeft className="h-4 w-4" />
          </button>
        )}

        <Link
          href="/projects"
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
          aria-label="Back to projects"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>

        <div className="hidden h-6 w-px bg-white/10 sm:block" />

        <div className="hidden min-w-0 sm:block">
          <div className="flex items-center gap-2">
            <h1 className="truncate text-sm font-semibold text-white">{project.title}</h1>
            <span className="hidden rounded-md bg-violet-500/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-violet-300 md:inline-block">
              {project.resolution}
            </span>
            {isDirty ? (
              <span className="hidden rounded-md bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-300 md:inline-block">
                Unsaved
              </span>
            ) : (
              <Check className="hidden h-3 w-3 text-emerald-400 md:block" />
            )}
          </div>
          <p className="truncate text-[11px] text-slate-500">
            {project.category} · {savedLabel}
          </p>
        </div>
      </div>

      {/* Center: tools */}
      <div className="hidden items-center gap-1 md:flex">
        <ToolbarButton
          icon={Undo2}
          label={`Undo (${pastCount})`}
          shortcut="⌘Z"
          onClick={undo}
          disabled={!canUndo}
        />
        <ToolbarButton
          icon={Redo2}
          label={`Redo (${futureCount})`}
          shortcut="⌘⇧Z"
          onClick={redo}
          disabled={!canRedo}
        />
        <div className="mx-2 h-6 w-px bg-white/10" />
        <ToolbarButton icon={Scissors} label="Cut" shortcut="C" />
        <ToolbarButton
          icon={Copy}
          label="Duplicate"
          shortcut="⌘D"
          onClick={handleDuplicate}
          disabled={!selectedClipId}
        />
        <ToolbarButton
          icon={Trash2}
          label="Delete"
          shortcut="⌫"
          onClick={handleDelete}
          disabled={!selectedClipId}
        />
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <button
          onClick={onSave}
          disabled={isSaving || !isDirty}
          className="hidden items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white transition-all hover:border-white/20 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40 sm:inline-flex"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-3.5 w-3.5" />
              Save
            </>
          )}
        </button>

        <button
          className="hidden h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/5 hover:text-white md:flex"
          aria-label="Share"
        >
          <Share2 className="h-4 w-4" />
        </button>

        <Link
          href={`/projects/${project._id}/export`}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-violet-600/30 transition-all hover:scale-[1.02] sm:px-4"
        >
          <Download className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Export</span>
        </Link>

        <div className="hidden h-8 w-8 overflow-hidden rounded-lg bg-violet-600 md:block">
          {user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.image} alt={user.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs font-bold text-white">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {onToggleRightPanel && (
          <button
            onClick={onToggleRightPanel}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/5 hover:text-white lg:hidden"
            aria-label="Toggle right panel"
          >
            <PanelRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </header>
  );
}