'use client';

import { useMemo } from 'react';
import { useEditorStore } from '@/store/editor-store';
import VideoRenderer from './VideoRenderer';
import ImageRenderer from './ImageRenderer';
import TextRenderer from './TextRenderer';
import type { EditorAsset, TrackClip } from '@/types/editor';

interface SceneRendererProps {
  assets: EditorAsset[];
}

interface ActiveClip extends TrackClip {
  resolvedUrl?: string;
}

export default function SceneRenderer({ assets }: SceneRendererProps) {
  const tracks = useEditorStore((s) => s.tracks);
  const currentTime = useEditorStore((s) => s.currentTime);

  const activeClips = useMemo<ActiveClip[]>(() => {
    const result: ActiveClip[] = [];

    for (const track of tracks) {
      if (!track.visible) continue;

      for (const clip of track.clips) {
        const endTime = clip.startTime + clip.duration;
        if (currentTime >= clip.startTime && currentTime < endTime) {
          // ✅ Prefer clip.assetUrl, fallback to asset lookup by assetId or name
          let resolvedUrl = clip.assetUrl;
          if (!resolvedUrl && clip.assetId) {
            const asset = assets.find((a) => a._id === clip.assetId);
            resolvedUrl = asset?.url;
          }
          if (!resolvedUrl) {
            const asset = assets.find((a) => a.name === clip.name);
            resolvedUrl = asset?.url;
          }

          result.push({ ...clip, resolvedUrl });
        }
      }
    }

    return result;
  }, [tracks, currentTime, assets]);

  return (
    <div className="absolute inset-0">
      {activeClips.map((clip) => {
        if (clip.type === 'video' && clip.resolvedUrl) {
          return (
            <VideoRenderer key={clip.id} clip={clip} sourceUrl={clip.resolvedUrl} />
          );
        }
        if (clip.type === 'image' && clip.resolvedUrl) {
          return (
            <ImageRenderer key={clip.id} clip={clip} sourceUrl={clip.resolvedUrl} />
          );
        }
        if (clip.type === 'text') {
          return <TextRenderer key={clip.id} clip={clip} />;
        }
        return null;
      })}
    </div>
  );
}