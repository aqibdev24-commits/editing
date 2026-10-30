'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useEditorStore } from '@/store/editor-store';
import type { Track } from '@/types/editor';


interface UseProjectSyncOptions {
  projectId: string;
  autoSaveInterval?: number;
  enabled?: boolean;
}

interface SyncResult {
  isSaving: boolean;
  lastSavedAt: Date | null;
  saveError: string | null;
  saveNow: () => Promise<boolean>;
}

export function useProjectSync({
  projectId,
  autoSaveInterval = 30000,
  enabled = true,
}: UseProjectSyncOptions): SyncResult {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const isDirty = useEditorStore((s) => s.isDirty);
  const markClean = useEditorStore((s) => s.markClean);
  const setSaving = useEditorStore((s) => s.setSaving);

  const savingRef = useRef(false);

  const saveNow = useCallback(async (): Promise<boolean> => {
    if (savingRef.current) return false;
    if (!isDirty) return false;

    savingRef.current = true;
    setIsSaving(true);
    setSaving(true);
    setSaveError(null);

    try {
      const state = useEditorStore.getState();
      const payload = {
        timeline: {
          tracks: state.tracks,
          totalDuration: state.totalDuration,
          version: 1,
        },
      };

      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        const errMsg = data.error ?? 'Save failed';
        setSaveError(errMsg);
        return false;
      }

      markClean();
      setLastSavedAt(new Date());
      return true;
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Network error';
      setSaveError(msg);
      return false;
    } finally {
      savingRef.current = false;
      setIsSaving(false);
      setSaving(false);
    }
  }, [projectId, isDirty, markClean, setSaving]);

  // Auto-save loop
  useEffect(() => {
    if (!enabled) return;

    const timer = setInterval(() => {
      if (isDirty && !savingRef.current) {
        void saveNow();
      }
    }, autoSaveInterval);

    return () => clearInterval(timer);
  }, [enabled, autoSaveInterval, isDirty, saveNow]);

  // Warn on unload
  useEffect(() => {
    if (!isDirty) return;

    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  return { isSaving, lastSavedAt, saveError, saveNow };
}

// ============================================================================
// LOAD PROJECT INTO STORE
// ============================================================================


interface RawProject {
  timeline?: {
    tracks?: Track[];
    totalDuration?: number;
  };
}

export function useLoadProject(project: RawProject) {
  const setTracks = useEditorStore((s) => s.setTracks);
  const setTotalDuration = useEditorStore((s) => s.setTotalDuration);
  const clearHistory = useEditorStore((s) => s.clearHistory);
  const markClean = useEditorStore((s) => s.markClean);

  useEffect(() => {
    const rawTracks = project.timeline?.tracks;
    if (!rawTracks || rawTracks.length === 0) {
      return;
    }

    const seenTrackIds = new Set<string>();
    const tracks = rawTracks.filter((t) => {
      if (seenTrackIds.has(t.id)) return false;
      seenTrackIds.add(t.id);
      return true;
    });

    const cleanedTracks = tracks.map((track) => {
      const seenClipIds = new Set<string>();
      const clips = track.clips.filter((c) => {
        if (seenClipIds.has(c.id)) return false;
        seenClipIds.add(c.id);
        return true;
      });
      return { ...track, clips };
    });

    setTracks(cleanedTracks);
    if (project.timeline?.totalDuration) {
      setTotalDuration(project.timeline.totalDuration);
    }

    clearHistory();
    markClean();
  }, [project.timeline, setTracks, setTotalDuration, clearHistory, markClean]);
}