'use client';

import { useEffect, useRef } from 'react';
import { useEditorStore } from '@/store/editor-store';

interface UseAutoSaveOptions {
  enabled?: boolean;
  interval?: number; // ms
  onSave: () => Promise<void> | void;
}

export function useAutoSave({
  enabled = true,
  interval = 30000,
  onSave,
}: UseAutoSaveOptions) {
  const isDirty = useEditorStore((s) => s.isDirty);
  const isSaving = useEditorStore((s) => s.isSaving);
  const saveRef = useRef(onSave);

  // Keep saveRef fresh
  useEffect(() => {
    saveRef.current = onSave;
  }, [onSave]);

  useEffect(() => {
    if (!enabled) return;

    const timer = setInterval(() => {
      if (isDirty && !isSaving) {
        void saveRef.current();
      }
    }, interval);

    return () => clearInterval(timer);
  }, [enabled, interval, isDirty, isSaving]);

  // Warn before closing tab with unsaved changes
  useEffect(() => {
    if (!isDirty) return;

    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);
}