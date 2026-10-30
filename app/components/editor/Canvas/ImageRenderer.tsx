'use client';

import Image from 'next/image';
import { useEditorStore } from '@/store/editor-store';
import { computeAnimatedValues, buildFilterString } from '@/lib/animation';
import type { TrackClip } from '@/types/editor';

interface ImageRendererProps {
  clip: TrackClip;
  sourceUrl: string;
}

export default function ImageRenderer({ clip, sourceUrl }: ImageRendererProps) {
  const currentTime = useEditorStore((s) => s.currentTime);
  const localTime = Math.max(0, currentTime - clip.startTime);

  const animated = computeAnimatedValues(clip, localTime);
  const filterCss = buildFilterString(animated);

  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        opacity: animated.opacity / 100,
        transform: `translate(${animated.x}px, ${animated.y}px) scale(${animated.scale / 100}) rotate(${animated.rotation}deg)`,
        transformOrigin: 'center center',
        filter: filterCss,
      }}
    >
      <Image
        src={sourceUrl}
        alt={clip.name}
        fill
        className="object-contain"
        sizes="100vw"
      />
    </div>
  );
}