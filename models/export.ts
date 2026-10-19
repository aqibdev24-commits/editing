import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IExport extends Document {
  projectId: string;
  userId: string;
  format: 'mp4' | 'webm' | 'gif';
  resolution: string;
  quality: 'draft' | 'standard' | 'high' | 'ultra';
  fps: number;
  size: number;
  duration: number;
  status: 'pending' | 'rendering' | 'completed' | 'failed' | 'cancelled';
  url?: string;
  progress: number;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

const ExportSchema = new Schema<IExport>(
  {
    projectId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    format: {
      type: String,
      enum: ['mp4', 'webm', 'gif'],
      required: true,
    },
    resolution: { type: String, required: true },
    quality: {
      type: String,
      enum: ['draft', 'standard', 'high', 'ultra'],
      required: true,
    },
    fps: { type: Number, required: true },
    size: { type: Number, default: 0 },
    duration: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['pending', 'rendering', 'completed', 'failed', 'cancelled'],
      default: 'pending',
      index: true,
    },
    url: { type: String },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    error: { type: String },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

ExportSchema.index({ userId: 1, createdAt: -1 });
ExportSchema.index({ projectId: 1, createdAt: -1 });

export const Export: Model<IExport> =
  mongoose.models.Export || mongoose.model<IExport>('Export', ExportSchema);