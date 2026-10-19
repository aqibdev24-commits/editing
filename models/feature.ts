import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFeature extends Document {
  title: string;
  description: string;
  icon: string;
  category: 'editing' | 'ai' | 'effects' | 'collaboration';
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FeatureSchema = new Schema<IFeature>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, required: true },
    category: {
      type: String,
      enum: ['editing', 'ai', 'effects', 'collaboration'],
      required: true,
    },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Feature: Model<IFeature> =
  mongoose.models.Feature || mongoose.model<IFeature>('Feature', FeatureSchema);