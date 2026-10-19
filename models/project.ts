import mongoose, { Schema, Document, Model } from 'mongoose';

// ============================================================================
// TIMELINE SUB-SCHEMAS
// ============================================================================

const TrackClipSchema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    startTime: { type: Number, required: true, default: 0 },
    duration: { type: Number, required: true, default: 0 },
    color: { type: String, required: true, default: 'from-violet-600 to-violet-700' },
    type: {
      type: String,
      enum: ['video', 'audio', 'text', 'image'],
      required: true,
    },
    volume: { type: Number, default: 100 },
    opacity: { type: Number, default: 100 },
    scale: { type: Number, default: 100 },
    rotation: { type: Number, default: 0 },
    positionX: { type: Number, default: 0 },
    positionY: { type: Number, default: 0 },
    assetId: { type: String }, // reference to Asset._id
    sourceUrl: { type: String }, // cached URL
  },
  { _id: false }
);

const TrackSchema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ['video', 'audio', 'text', 'overlay'],
      required: true,
    },
    clips: { type: [TrackClipSchema], default: [] },
    visible: { type: Boolean, default: true },
    locked: { type: Boolean, default: false },
    muted: { type: Boolean, default: false },
  },
  { _id: false }
);

// ============================================================================
// MAIN PROJECT
// ============================================================================

export interface IProject extends Document {
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  previewUrl: string;
  duration: number;
  resolution: '720p' | '1080p' | '2K' | '4K';
  category: 'vlog' | 'youtube' | 'reels' | 'cinematic' | 'tutorial' | 'gaming' | 'travel' | 'wedding' | 'music';
  author: string;
  authorAvatar?: string;
  views: number;
  likes: number;
  isFeatured: boolean;
  isNewProduct: boolean;
  isTrending: boolean;
  tags: string[];
  // NEW
  timeline: {
    tracks: unknown[];
    totalDuration: number;
    version: number;
  };
  status: 'draft' | 'editing' | 'rendering' | 'completed' | 'archived';
  lastEditedBy?: string;
  lastEditedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },

    description: { type: String, default: '', trim: true },
    thumbnail: { type: String, default: '' },
    previewUrl: { type: String, default: '' },
    duration: { type: Number, default: 0 },

    resolution: {
      type: String,
      enum: ['720p', '1080p', '2K', '4K'],
      default: '1080p',
    },
    category: {
      type: String,
      enum: ['vlog', 'youtube', 'reels', 'cinematic', 'tutorial', 'gaming', 'travel', 'wedding', 'music'],
      required: true,
    },

    author: { type: String, required: true, index: true },
    authorAvatar: { type: String, default: '' },

    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isNewProduct: { type: Boolean, default: true },
    isTrending: { type: Boolean, default: false },
    tags: [{ type: String }],

    // NEW — timeline data
    timeline: {
      tracks: { type: [TrackSchema], default: [] },
      totalDuration: { type: Number, default: 24 },
      version: { type: Number, default: 1 },
    },

    status: {
      type: String,
      enum: ['draft', 'editing', 'rendering', 'completed', 'archived'],
      default: 'draft',
      index: true,
    },
    lastEditedBy: { type: String },
    lastEditedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

ProjectSchema.index({ slug: 1 });
ProjectSchema.index({ author: 1, updatedAt: -1 });
ProjectSchema.index({ isFeatured: 1 });
ProjectSchema.index({ isNewProduct: 1 });
ProjectSchema.index({ isTrending: 1 });
ProjectSchema.index({ status: 1 });

export const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);