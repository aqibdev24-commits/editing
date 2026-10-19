'use client';

import { useCallback } from 'react';
import { useEditorStore } from '@/store/editor-store';

export function useUndoRedo() {
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);
  const canUndo = useEditorStore((s) => s.past.length > 0);
  const canRedo = useEditorStore((s) => s.future.length > 0);

  return {
    undo,
    redo,
    canUndo,
    canRedo,
    pushHistory: useEditorStore.getState().pushHistory,
  };
}

/**
 * Manual trigger for history snapshot — use before large operations
 * where the store action doesn't do it automatically.
 */
export function useHistorySnapshot() {
  const pushHistory = useEditorStore((s) => s.pushHistory);

  return useCallback(
    (label: string) => {
      pushHistory(label);
    },
    [pushHistory]
  );
}