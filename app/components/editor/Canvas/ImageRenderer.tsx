'use client';

import Image from 'next/image';
import type { TrackClip } from '@/types/editor';

interface ImageRendererProps {
  clip: TrackClip;
  sourceUrl: string;
}

export default function ImageRenderer({ clip, sourceUrl }: ImageRendererProps) {
  const opacity = (clip.opacity ?? 100) / 100;
  const scale = (clip.scale ?? 100) / 100;
  const rotation = clip.rotation ?? 0;
  const posX = clip.positionX ?? 0;
  const posY = clip.positionY ?? 0;

  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        opacity,
        transform: `translate(${posX}px, ${posY}px) scale(${scale}) rotate(${rotation}deg)`,
        transformOrigin: 'center center',
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