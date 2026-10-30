'use client';

import { useEffect, useRef } from 'react';
import { useEditorStore } from '@/store/editor-store';
import { computeAnimatedValues, buildFilterString } from '@/lib/animation';
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
  const playbackRate = useEditorStore((s) => s.playbackRate);

  const localTime = Math.max(0, currentTime - clip.startTime);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      const p = video.play();
      if (p !== undefined) p.catch(() => {});
    } else {
      video.pause();
    }
  }, [isPlaying]);

  // ✅ Sync playback rate with global speed
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = playbackRate;
  }, [playbackRate]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (Math.abs(video.currentTime - localTime) > 0.3) {
      video.currentTime = localTime;
    }
  }, [localTime]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = Math.min(1, (muted ? 0 : volume) / 100);
  }, [volume, muted]);

  const animated = computeAnimatedValues(clip, localTime);
  const filterCss = buildFilterString(animated);

  return (
    <video
      ref={videoRef}
      src={sourceUrl}
      playsInline
      preload="auto"
      className="pointer-events-none absolute inset-0 h-full w-full object-contain"
      style={{
        opacity: animated.opacity / 100,
        transform: `translate(${animated.x}px, ${animated.y}px) scale(${animated.scale / 100}) rotate(${animated.rotation}deg)`,
        transformOrigin: 'center center',
        filter: filterCss,
      }}
    />
  );
}