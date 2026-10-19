import type { ExportFormat, ExportQuality } from '@/types/export';

export interface ResolutionDimensions {
  width: number;
  height: number;
}

export const RESOLUTION_MAP: Record<string, ResolutionDimensions> = {
  '720p': { width: 1280, height: 720 },
  '1080p': { width: 1920, height: 1080 },
  '2K': { width: 2560, height: 1440 },
  '4K': { width: 3840, height: 2160 },
};

export const QUALITY_BITRATE_MAP: Record<ExportQuality, number> = {
  draft: 2_500_000, // 2.5 Mbps
  standard: 5_000_000, // 5 Mbps
  high: 10_000_000, // 10 Mbps
  ultra: 20_000_000, // 20 Mbps
};

export const FORMAT_MIME_MAP: Record<ExportFormat, string> = {
  mp4: 'video/mp4',
  webm: 'video/webm;codecs=vp9,opus',
  gif: 'image/gif',
};

export const FORMAT_EXTENSION_MAP: Record<ExportFormat, string> = {
  mp4: 'mp4',
  webm: 'webm',
  gif: 'gif',
};

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function estimateFileSize(
  durationSeconds: number,
  quality: ExportQuality,
  includeAudio: boolean
): number {
  const videoBitrate = QUALITY_BITRATE_MAP[quality];
  const audioBitrate = includeAudio ? 128_000 : 0;
  const totalBitrate = videoBitrate + audioBitrate;
  // bytes = bits / 8
  return Math.floor((totalBitrate * durationSeconds) / 8);
}

export function supportsMediaRecorder(): boolean {
  if (typeof window === 'undefined') return false;
  return typeof window.MediaRecorder !== 'undefined';
}

export function getBestMimeType(format: ExportFormat): string {
  const candidates =
    format === 'mp4'
      ? ['video/mp4;codecs=avc1', 'video/mp4', 'video/webm;codecs=vp9,opus']
      : format === 'webm'
        ? ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm']
        : ['image/gif'];

  if (typeof window === 'undefined' || !window.MediaRecorder) {
    return candidates[0];
  }

  for (const mime of candidates) {
    if (window.MediaRecorder.isTypeSupported(mime)) {
      return mime;
    }
  }

  return candidates[0];
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}