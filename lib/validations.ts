import { z } from 'zod';

// ============================================================================
// TIMELINE VALIDATION
// ============================================================================

export const TrackClipSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(200),
  startTime: z.number().min(0),
  duration: z.number().min(0.1),
  color: z.string(),
  type: z.enum(['video', 'audio', 'text', 'image']),
  volume: z.number().min(0).max(200).optional(),
  opacity: z.number().min(0).max(100).optional(),
  scale: z.number().min(10).max(300).optional(),
  rotation: z.number().min(-180).max(180).optional(),
  positionX: z.number().min(-4000).max(4000).optional(),
  positionY: z.number().min(-4000).max(4000).optional(),
  assetId: z.string().optional(),
  sourceUrl: z.string().optional(),
});

export const TrackSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(100),
  type: z.enum(['video', 'audio', 'text', 'overlay']),
  clips: z.array(TrackClipSchema).max(500),
  visible: z.boolean(),
  locked: z.boolean(),
  muted: z.boolean(),
});

export const TimelineSchema = z.object({
  tracks: z.array(TrackSchema).max(50),
  totalDuration: z.number().min(1).max(36000),
  version: z.number().int().min(1).default(1),
});

// ============================================================================
// PROJECT VALIDATION
// ============================================================================

export const ProjectCreateSchema = z.object({
  title: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
  category: z.enum([
    'vlog',
    'youtube',
    'reels',
    'cinematic',
    'tutorial',
    'gaming',
    'travel',
    'wedding',
    'music',
  ]),
  resolution: z.enum(['720p', '1080p', '2K', '4K']).optional(),
  thumbnail: z.string().optional(),
  previewUrl: z.string().optional(),
  duration: z.number().min(0).optional(),
  tags: z.array(z.string()).max(20).optional(),
});

export const ProjectUpdateSchema = z.object({
  title: z.string().min(2).max(100).optional(),
  description: z.string().max(500).optional(),
  thumbnail: z.string().optional(),
  previewUrl: z.string().optional(),
  duration: z.number().min(0).optional(),
  category: z
    .enum(['vlog', 'youtube', 'reels', 'cinematic', 'tutorial', 'gaming', 'travel', 'wedding', 'music'])
    .optional(),
  resolution: z.enum(['720p', '1080p', '2K', '4K']).optional(),
  tags: z.array(z.string()).max(20).optional(),
  status: z.enum(['draft', 'editing', 'rendering', 'completed', 'archived']).optional(),
  timeline: TimelineSchema.optional(),
});

// ============================================================================
// ASSET VALIDATION
// ============================================================================

export const AssetCreateSchema = z.object({
  name: z.string().min(1).max(200),
  url: z.string().url(),
  fileId: z.string().min(1),
  thumbnailUrl: z.string().url().optional(),
  type: z.enum(['image', 'video', 'audio']),
  mimeType: z.string().min(1),
  size: z.number().min(0),
  width: z.number().optional(),
  height: z.number().optional(),
  duration: z.number().optional(),
  projectId: z.string().optional(),
});

// ============================================================================
// TYPES (inferred from schemas)
// ============================================================================

export type TrackClipInput = z.infer<typeof TrackClipSchema>;
export type TrackInput = z.infer<typeof TrackSchema>;
export type TimelineInput = z.infer<typeof TimelineSchema>;
export type ProjectCreateInput = z.infer<typeof ProjectCreateSchema>;
export type ProjectUpdateInput = z.infer<typeof ProjectUpdateSchema>;
export type AssetCreateInput = z.infer<typeof AssetCreateSchema>;