import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Stat } from '@/models/stats';

export async function GET() {
  try {
    await connectDB();

    const stats = await Stat.find({}).sort({ order: 1 }).lean();

    return NextResponse.json({ success: true, data: stats }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch stats';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}