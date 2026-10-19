import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IStat extends Document {
  label: string;
  value: number;
  suffix: string;
  icon: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const StatSchema = new Schema<IStat>(
  {
    label: { type: String, required: true },
    value: { type: Number, required: true },
    suffix: { type: String, default: '' },
    icon: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Stat: Model<IStat> =
  mongoose.models.Stat || mongoose.model<IStat>('Stat', StatSchema);