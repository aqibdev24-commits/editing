'use client';

import { useEffect } from 'react';
import { useEditorStore } from '@/store/editor-store';
import { useToast } from '@/app/components/ui/Toast';

export function useEditorKeyboard() {
  const togglePlay = useEditorStore((s) => s.togglePlay);
  const seek = useEditorStore((s) => s.seek);
  const currentTime = useEditorStore((s) => s.currentTime);
  const totalDuration = useEditorStore((s) => s.totalDuration);
  const removeClip = useEditorStore((s) => s.removeClip);
  const duplicateClip = useEditorStore((s) => s.duplicateClip);
  const selectedClipId = useEditorStore((s) => s.selectedClipId);
  const setToolMode = useEditorStore((s) => s.setToolMode);
  const selectClip = useEditorStore((s) => s.selectClip);
  const setZoom = useEditorStore((s) => s.setZoom);
  const zoom = useEditorStore((s) => s.zoom);
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);
  const { addToast } = useToast();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target) {
        const tag = target.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable) {
          return;
        }
      }

      const isMeta = e.metaKey || e.ctrlKey;
      const isShift = e.shiftKey;

      // -------------------------------------------------------------------
      // UNDO / REDO (highest priority)
      // -------------------------------------------------------------------
      if (isMeta && e.key.toLowerCase() === 'z' && !isShift) {
        e.preventDefault();
        undo();
        return;
      }

      if (isMeta && e.key.toLowerCase() === 'z' && isShift) {
        e.preventDefault();
        redo();
        return;
      }

      // Alternative redo: Cmd+Y (Windows style)
      if (isMeta && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
        return;
      }

      // -------------------------------------------------------------------
      // Playback
      // -------------------------------------------------------------------
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
        return;
      }

      if (e.key === 'Home') {
        e.preventDefault();
        seek(0);
        return;
      }

      if (e.key === 'End') {
        e.preventDefault();
        seek(totalDuration);
        return;
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        seek(Math.max(0, currentTime - (isShift ? 1 : 1 / 30)));
        return;
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        seek(Math.min(totalDuration, currentTime + (isShift ? 1 : 1 / 30)));
        return;
      }

      // -------------------------------------------------------------------
      // Clip actions
      // -------------------------------------------------------------------
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedClipId) {
        e.preventDefault();
        removeClip(selectedClipId);
        addToast({
          type: 'info',
          title: 'Clip deleted',
          description: 'Press ⌘Z to undo',
        });
        return;
      }

      if (isMeta && e.key.toLowerCase() === 'd' && selectedClipId) {
        e.preventDefault();
        duplicateClip(selectedClipId);
        addToast({
          type: 'success',
          title: 'Clip duplicated',
        });
        return;
      }

      // -------------------------------------------------------------------
      // Selection
      // -------------------------------------------------------------------
      if (e.key === 'Escape') {
        selectClip(null, null);
        return;
      }

      // -------------------------------------------------------------------
      // Zoom
      // -------------------------------------------------------------------
      if (isMeta && (e.key === '=' || e.key === '+')) {
        e.preventDefault();
        setZoom(Math.min(4, zoom + 0.25));
        return;
      }
      if (isMeta && e.key === '-') {
        e.preventDefault();
        setZoom(Math.max(0.25, zoom - 0.25));
        return;
      }
      if (isMeta && e.key === '0') {
        e.preventDefault();
        setZoom(1);
        return;
      }

      // -------------------------------------------------------------------
      // Tools
      // -------------------------------------------------------------------
      if (!isMeta && !isShift) {
        const key = e.key.toLowerCase();
        if (key === 'v') setToolMode('select');
        if (key === 'c') setToolMode('cut');
        if (key === 't') setToolMode('text');
        if (key === 'r') setToolMode('shape');
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [
    togglePlay,
    seek,
    currentTime,
    totalDuration,
    removeClip,
    duplicateClip,
    selectedClipId,
    setToolMode,
    selectClip,
    setZoom,
    zoom,
    undo,
    redo,
    addToast,
  ]);
}