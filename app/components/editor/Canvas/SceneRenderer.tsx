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
  assetUrl?: string;
}

export default function SceneRenderer({ assets }: SceneRendererProps) {
  const tracks = useEditorStore((s) => s.tracks);
  const currentTime = useEditorStore((s) => s.currentTime);

  // Find all clips active at current time, ordered by track (bottom-up render)
  const activeClips = useMemo<ActiveClip[]>(() => {
    const result: ActiveClip[] = [];

    for (const track of tracks) {
      if (!track.visible) continue;

      for (const clip of track.clips) {
        const endTime = clip.startTime + clip.duration;
        if (currentTime >= clip.startTime && currentTime < endTime) {
          // Match asset by name (fallback — real implementation should have assetId on clip)
          const asset = assets.find((a) => a.name === clip.name);
          result.push({
            ...clip,
            assetUrl: asset?.url,
          });
        }
      }
    }

    return result;
  }, [tracks, currentTime, assets]);

  return (
    <div className="absolute inset-0">
      {activeClips.map((clip) => {
        if (clip.type === 'video' && clip.assetUrl) {
          return (
            <VideoRenderer
              key={clip.id}
              clip={clip}
              sourceUrl={clip.assetUrl}
            />
          );
        }
        if (clip.type === 'image' && clip.assetUrl) {
          return (
            <ImageRenderer
              key={clip.id}
              clip={clip}
              sourceUrl={clip.assetUrl}
            />
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