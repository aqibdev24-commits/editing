import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Export as ExportModel } from '@/models/export';

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const limit = parseInt(searchParams.get('limit') ?? '50', 10);

    await connectDB();

    const query: Record<string, unknown> = { userId: session.user.email };
    if (projectId) query.projectId = projectId;

    const exports = await ExportModel.find(query)
      .sort({ createdAt: -1 })
      .limit(Math.min(limit, 100))
      .lean();

    return NextResponse.json({ success: true, data: exports });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch exports';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    await connectDB();

    const exportRecord = await ExportModel.create({
      projectId: body.projectId,
      userId: session.user.email,
      format: body.format,
      resolution: body.resolution,
      quality: body.quality,
      fps: body.fps,
      size: body.size ?? 0,
      duration: body.duration ?? 0,
      status: body.status ?? 'completed',
      url: body.url,
      progress: body.progress ?? 100,
      completedAt: new Date(),
    });

    return NextResponse.json({ success: true, data: exportRecord }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to save export';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}