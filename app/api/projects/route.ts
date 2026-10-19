import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Project } from '@/models/project';

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') ?? '50', 10);

    await connectDB();

    const projects = await Project.find({ author: session.user.email })
      .sort({ updatedAt: -1 })
      .limit(Math.min(limit, 100))
      .lean();

    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch projects';
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


    const slug = `${body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')}-${Date.now().toString(36)}`;

    console.log({
      title: body.title,
      slug,
      description: body.description ?? '',
      thumbnail: body.thumbnail ?? '/placeholder-project.png',
      previewUrl: body.previewUrl ?? '',
      duration: body.duration ?? 0,
      resolution: body.resolution ?? '1080p',
      category: body.category ?? 'youtube',
      author: session.user.email,
      authorAvatar: session.user.image ?? undefined,
      tags: body.tags ?? [],
    })
    const project = await Project.create({
      title: body.title,
      slug,
      description: body.description ?? '',
      thumbnail: body.thumbnail ?? '',
      previewUrl: body.previewUrl ?? '',
      duration: body.duration ?? 0,
      resolution: body.resolution ?? '1080p',
      category: body.category ?? 'youtube',
      author: session.user.email,
      authorAvatar: session.user.image ?? '',
      tags: body.tags ?? [],
    });

    return NextResponse.json({ success: true, data: project }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create project';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}