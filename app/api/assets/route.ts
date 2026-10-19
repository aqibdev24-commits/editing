import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Asset } from '@/models/asset';

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const projectId = searchParams.get('projectId');
    const limit = parseInt(searchParams.get('limit') ?? '50', 10);

    await connectDB();

    const query: Record<string, unknown> = { userId: session.user.email };
    if (type) query.type = type;
    if (projectId) query.projectId = projectId;

    const assets = await Asset.find(query)
      .sort({ createdAt: -1 })
      .limit(Math.min(limit, 100))
      .lean();

    return NextResponse.json({ success: true, data: assets });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch assets';
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

    const asset = await Asset.create({
      userId: session.user.email,
      name: body.name,
      url: body.url,
      fileId: body.fileId,
      thumbnailUrl: body.thumbnailUrl,
      type: body.type,
      mimeType: body.mimeType,
      size: body.size,
      width: body.width,
      height: body.height,
      duration: body.duration,
      projectId: body.projectId,
    });

    return NextResponse.json({ success: true, data: asset }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create asset';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}