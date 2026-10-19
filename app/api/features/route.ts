import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Feature } from '@/models/feature';

export async function GET() {
  try {
    await connectDB();

    const features = await Feature.find({ isActive: true }).sort({ order: 1 }).lean();

    return NextResponse.json({ success: true, data: features }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch features';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}