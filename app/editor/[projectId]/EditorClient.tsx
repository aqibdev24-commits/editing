'use client';

import { useState, useCallback } from 'react';
import { useEditorStore } from '@/store/editor-store';
import { usePlayback } from '@/hooks/usePlayback';
import { useEditorKeyboard } from '@/hooks/useEditorKeyboard';
import { useProjectSync, useLoadProject } from '@/hooks/useProjectSync';
import { useToast } from '@/app/components/ui/Toast';
import TopToolbar from '@/app/components/editor/Toolbar/TopToolbar';
import IconRail from '@/app/components/editor/Toolbar/IconRail';
import StatusBar from '@/app/components/editor/StatusBar';
import CanvasArea from '@/app/components/editor/Canvas/CanvasArea';
import PlaybackBar from '@/app/components/editor/Canvas/PlaybackBar';
import Timeline from '@/app/components/editor/Timeline/Timeline';
import LeftPanel from '@/app/components/editor/Panels/LeftPanel';
import PropertiesPanel from '@/app/components/editor/Panels/PropertiesPanel';
import PanelsDrawer from '@/app/components/editor/Panels/PanelsDrawer';
import type { EditorProject, EditorAsset, EditorUser } from '@/types/editor';
import type { Track } from '@/types/editor';

interface EditorClientProps {
  project: EditorProject & {
    timeline?: {
      tracks: Track[];
      totalDuration: number;
    };
  };
  assets: EditorAsset[];
  user: EditorUser;
}
export default function EditorClient({ project: initialProject, assets, user }: EditorClientProps) {
  const totalDuration = useEditorStore((s) => s.totalDuration);
  const isDirty = useEditorStore((s) => s.isDirty);
  const activePanel = useEditorStore((s) => s.activePanel);

  const [leftDrawerOpen, setLeftDrawerOpen] = useState(false);
  const [rightDrawerOpen, setRightDrawerOpen] = useState(false);
  const [project, setProject] = useState(initialProject);


  const { addToast, updateToast } = useToast();

  // -------------------------------------------------------------------------
  // LOAD PROJECT FROM DB (runs once)
  // -------------------------------------------------------------------------
  useLoadProject({ timeline: project.timeline });

  // -------------------------------------------------------------------------
  // PLAYBACK + KEYBOARD
  // -------------------------------------------------------------------------
  usePlayback(totalDuration);
  useEditorKeyboard();

  // -------------------------------------------------------------------------
  // SAVE SYNC
  // -------------------------------------------------------------------------
  const { saveNow } = useProjectSync({
    projectId: project._id,
    autoSaveInterval: 30000,
    enabled: true,
  });

  const handleSave = useCallback(async () => {
    if (!isDirty) return;

    const toastId = addToast({
      type: 'loading',
      title: 'Saving project...',
      description: 'Please wait',
    });

    const success = await saveNow();

    if (success) {
      updateToast(toastId, {
        type: 'success',
        title: 'Project saved',
        description: 'All changes are safe',
      });
    } else {
      updateToast(toastId, {
        type: 'error',
        title: 'Save failed',
        description: 'Please check your connection and try again',
      });
    }
  }, [isDirty, saveNow, addToast, updateToast]);

  const handleTitleSave = useCallback(
    async (newTitle: string) => {
      // Optimistic update
      const previousTitle = project.title;
      setProject((p) => ({ ...p, title: newTitle }));

      try {
        const res = await fetch(`/api/projects/${project._id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: newTitle }),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          // Revert on failure
          setProject((p) => ({ ...p, title: previousTitle }));
          addToast({
            type: 'error',
            title: 'Failed to rename project',
            description: data.error ?? 'Please try again',
          });
          return;
        }

        addToast({ type: 'success', title: 'Project renamed' });
      } catch {
        setProject((p) => ({ ...p, title: previousTitle }));
        addToast({
          type: 'error',
          title: 'Network error',
          description: 'Could not save new title',
        });
      }
    },
    [project._id, project.title, addToast]
  );

  return (
    <div className="flex h-full w-full flex-col">
      <TopToolbar
        project={project}
        user={user}
        onSave={handleSave}
        onTitleSave={handleTitleSave}         
        onToggleLeftPanel={() => setLeftDrawerOpen((v) => !v)}
        onToggleRightPanel={() => setRightDrawerOpen((v) => !v)}
      />

      <div className="flex flex-1 overflow-hidden">
        <div className="hidden lg:block">
          <IconRail />
        </div>
        <div className="lg:hidden">
          <IconRail />
        </div>

        <div className="hidden lg:flex">
          <LeftPanel assets={assets} />
        </div>

        <div className="flex flex-1 flex-col overflow-hidden bg-slate-950">
          <CanvasArea project={project} assets={assets} />
          <PlaybackBar />
        </div>

        <div className="hidden lg:flex">
          <PropertiesPanel />
        </div>
      </div>

      <Timeline />
      <StatusBar />

      <PanelsDrawer
        open={leftDrawerOpen}
        side="left"
        title={activePanel.charAt(0).toUpperCase() + activePanel.slice(1)}
        onClose={() => setLeftDrawerOpen(false)}
      >
        <LeftPanel assets={assets} />
      </PanelsDrawer>

      <PanelsDrawer
        open={rightDrawerOpen}
        side="right"
        title="Properties"
        onClose={() => setRightDrawerOpen(false)}
      >
        <PropertiesPanel />
      </PanelsDrawer>

      {isDirty && (
        <div className="pointer-events-none absolute right-3 top-16 z-30 lg:hidden">
          <div className="rounded-full bg-amber-500/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
            Unsaved
          </div>
        </div>
      )}
    </div>
  );
}