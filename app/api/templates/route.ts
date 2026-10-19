import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Template } from '@/models/template';

export async function GET() {
  try {
    await connectDB();

    const templates = await Template.find({})
      .sort({ downloads: -1 })
      .limit(12)
      .lean();

    return NextResponse.json({ success: true, data: templates }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch templates';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}