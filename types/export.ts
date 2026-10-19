export type ExportFormat = 'mp4' | 'webm' | 'gif';
export type ExportQuality = 'draft' | 'standard' | 'high' | 'ultra';
export type ExportStatus = 'pending' | 'rendering' | 'completed' | 'failed' | 'cancelled';

export interface ExportSettings {
  format: ExportFormat;
  resolution: '720p' | '1080p' | '2K' | '4K';
  quality: ExportQuality;
  fps: 24 | 30 | 60;
  includeAudio: boolean;
}

export interface ExportRecord {
  _id: string;
  projectId: string;
  userId: string;
  format: ExportFormat;
  resolution: string;
  quality: ExportQuality;
  fps: number;
  size: number;
  duration: number;
  status: ExportStatus;
  url?: string;
  progress: number;
  error?: string;
  createdAt: string;
  completedAt?: string;
}