import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAsset extends Document {
  userId: string;
  name: string;
  url: string;
  fileId: string;
  thumbnailUrl?: string;
  type: 'image' | 'video' | 'audio';
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  duration?: number;
  projectId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AssetSchema = new Schema<IAsset>(
  {
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true },
    url: { type: String, required: true },
    fileId: { type: String, required: true },
    thumbnailUrl: { type: String },
    type: {
      type: String,
      enum: ['image', 'video', 'audio'],
      required: true,
    },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    width: { type: Number },
    height: { type: Number },
    duration: { type: Number },
    projectId: { type: String, index: true },
  },
  { timestamps: true }
);

AssetSchema.index({ userId: 1, type: 1 });
AssetSchema.index({ userId: 1, createdAt: -1 });

export const Asset: Model<IAsset> =
  mongoose.models.Asset || mongoose.model<IAsset>('Asset', AssetSchema);