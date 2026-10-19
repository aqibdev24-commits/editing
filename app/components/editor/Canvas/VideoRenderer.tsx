'use client';

import { useEffect, useRef } from 'react';
import { useEditorStore } from '@/store/editor-store';
import type { TrackClip } from '@/types/editor';

interface VideoRendererProps {
  clip: TrackClip;
  sourceUrl: string;
}

export default function VideoRenderer({ clip, sourceUrl }: VideoRendererProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isPlaying = useEditorStore((s) => s.isPlaying);
  const currentTime = useEditorStore((s) => s.currentTime);
  const volume = useEditorStore((s) => s.volume);
  const muted = useEditorStore((s) => s.muted);

  // Local clip time = global time - clip start
  const localTime = Math.max(0, currentTime - clip.startTime);

  // Sync playback state
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Browser autoplay policy might block — ignore
        });
      }
    } else {
      video.pause();
    }
  }, [isPlaying]);

  // Sync currentTime (when user seeks)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Only sync if difference is significant (> 0.3s) to avoid fighting playback
    if (Math.abs(video.currentTime - localTime) > 0.3) {
      video.currentTime = localTime;
    }
  }, [localTime]);

  // Sync volume
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = Math.min(1, (muted ? 0 : volume) / 100);
  }, [volume, muted]);

  // Compute transform styles
  const opacity = (clip.opacity ?? 100) / 100;
  const scale = (clip.scale ?? 100) / 100;
  const rotation = clip.rotation ?? 0;
  const posX = clip.positionX ?? 0;
  const posY = clip.positionY ?? 0;

  return (
    <video
      ref={videoRef}
      src={sourceUrl}
      playsInline
      preload="auto"
      className="pointer-events-none absolute inset-0 h-full w-full object-contain"
      style={{
        opacity,
        transform: `translate(${posX}px, ${posY}px) scale(${scale}) rotate(${rotation}deg)`,
        transformOrigin: 'center center',
      }}
    />
  );
}