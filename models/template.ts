import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITemplate extends Document {
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  category: string;
  duration: number;
  aspectRatio: '16:9' | '9:16' | '1:1' | '4:5';
  downloads: number;
  rating: number;
  isFeatured: boolean;
  isNewProduct: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const TemplateSchema = new Schema<ITemplate>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    thumbnail: { type: String, required: true },
    category: { type: String, required: true },
    duration: { type: Number, required: true },
    aspectRatio: { type: String, enum: ['16:9', '9:16', '1:1', '4:5'], default: '16:9' },
    downloads: { type: Number, default: 0 },
    rating: { type: Number, default: 5, min: 0, max: 5 },
    isFeatured: { type: Boolean, default: false },
    isNewProduct: { type: Boolean, default: true },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

export const Template: Model<ITemplate> =
  mongoose.models.Template || mongoose.model<ITemplate>('Template', TemplateSchema);