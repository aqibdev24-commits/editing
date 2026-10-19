'use client';

import type { TrackClip } from '@/types/editor';

interface TextRendererProps {
  clip: TrackClip;
}

export default function TextRenderer({ clip }: TextRendererProps) {
  const opacity = (clip.opacity ?? 100) / 100;
  const scale = (clip.scale ?? 100) / 100;
  const rotation = clip.rotation ?? 0;
  const posX = clip.positionX ?? 0;
  const posY = clip.positionY ?? 0;

  return (
    <div
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
      style={{
        opacity,
        transform: `translate(${posX}px, ${posY}px) scale(${scale}) rotate(${rotation}deg)`,
        transformOrigin: 'center center',
      }}
    >
      <div className="rounded-lg bg-black/40 px-6 py-3 backdrop-blur-sm">
        <span className="text-2xl font-bold text-white drop-shadow-lg sm:text-3xl">
          {clip.name}
        </span>
      </div>
    </div>
  );
}