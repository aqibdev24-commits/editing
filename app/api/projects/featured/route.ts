import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Project } from '@/models/project';

export async function GET() {
  try {
    await connectDB();

    const projects = await Project.find({ isFeatured: true })
      .sort({ createdAt: -1 })
      .limit(8)
      .lean();

    return NextResponse.json({ success: true, data: projects }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch featured projects';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}