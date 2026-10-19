'use client';

import { useCallback, useState } from 'react';
import { useEditorStore } from '@/store/editor-store';
import type { EditorAsset, TrackType } from '@/types/editor';

interface UseDropZoneOptions {
  trackId: string;
  trackType: TrackType;
  pixelsPerSecond: number;
  totalDuration: number;
}

export function useDropZone({
  trackId,
  trackType,
  pixelsPerSecond,
  totalDuration,
}: UseDropZoneOptions) {
  const addClip = useEditorStore((s) => s.addClip);
  const [isOver, setIsOver] = useState<boolean>(false);

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';

      // Check if asset type is compatible with track type
      const assetType = e.dataTransfer.types.includes('application/x-vexora-asset-type');
      if (assetType) {
        setIsOver(true);
      }
    },
    []
  );

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsOver(false);

      const assetJson = e.dataTransfer.getData('application/x-vexora-asset');
      if (!assetJson) return;

      let asset: EditorAsset;
      try {
        asset = JSON.parse(assetJson) as EditorAsset;
      } catch {
        return;
      }

      // Check compatibility
      const compatible =
        (trackType === 'video' && asset.type === 'video') ||
        (trackType === 'audio' && asset.type === 'audio') ||
        (trackType === 'overlay' && (asset.type === 'image' || asset.type === 'video')) ||
        (trackType === 'text' && false); // text clips are added via panel

      if (!compatible) return;

      // Compute drop time from pointer position
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const dropTime = Math.max(0, Math.min(totalDuration, x / pixelsPerSecond));

      const clipId =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? `clip-${crypto.randomUUID()}`
          : `clip-${Math.random().toString(36).slice(2, 11)}`;

      const clipType =
        asset.type === 'video' ? 'video' : asset.type === 'audio' ? 'audio' : 'image';

      addClip(trackId, {
        id: clipId,
        name: asset.name,
        startTime: dropTime,
        duration: asset.duration ?? (asset.type === 'image' ? 3 : 5),
        color:
          clipType === 'video'
            ? 'from-violet-600 to-violet-700'
            : clipType === 'audio'
              ? 'from-emerald-600 to-emerald-700'
              : 'from-fuchsia-600 to-fuchsia-700',
        type: clipType,
        opacity: 100,
        scale: 100,
        rotation: 0,
        volume: clipType === 'audio' ? 100 : undefined,
      });
    },
    [addClip, trackId, trackType, pixelsPerSecond, totalDuration]
  );

  return { isOver, handleDragOver, handleDragLeave, handleDrop };
}