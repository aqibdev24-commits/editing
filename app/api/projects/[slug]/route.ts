import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Project } from '@/models/project';
import { ProjectUpdateSchema } from '@/lib/validations';

// ============================================================================
// GET — fetch project by slug or _id
// ============================================================================

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { success: false, error: 'Project slug or ID is required' },
        { status: 400 }
      );
    }

    if (slug === 'new') {
      return NextResponse.json(
        { success: false, error: 'Invalid project ID' },
        { status: 400 }
      );
    }

    await connectDB();

    // Try by _id first (Mongo ObjectId), then by slug
    let project = null;
    if (/^[a-f\d]{24}$/i.test(slug)) {
      project = await Project.findById(slug).lean();
    }
    if (!project) {
      project = await Project.findOne({ slug }).lean();
    }

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch project';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// ============================================================================
// PATCH — update project (including timeline)
// ============================================================================

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Validate input
    const parsed = ProjectUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          issues: parsed.error.issues,
        },
        { status: 400 }
      );
    }

    await connectDB();

    // Find project first to check ownership
    let project = null;
    if (/^[a-f\d]{24}$/i.test(slug)) {
      project = await Project.findById(slug);
    }
    if (!project) {
      project = await Project.findOne({ slug });
    }

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    // Ownership check
    if (project.author !== session.user.email) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Apply updates
    const updates = parsed.data;

    if (updates.title !== undefined) project.title = updates.title;
    if (updates.description !== undefined) project.description = updates.description;
    if (updates.thumbnail !== undefined) project.thumbnail = updates.thumbnail;
    if (updates.previewUrl !== undefined) project.previewUrl = updates.previewUrl;
    if (updates.duration !== undefined) project.duration = updates.duration;
    if (updates.category !== undefined) project.category = updates.category;
    if (updates.resolution !== undefined) project.resolution = updates.resolution;
    if (updates.tags !== undefined) project.tags = updates.tags;
    if (updates.status !== undefined) project.status = updates.status;

    // Timeline — dedicated handling
    if (updates.timeline) {
      project.timeline = {
        tracks: updates.timeline.tracks,
        totalDuration: updates.timeline.totalDuration,
        version: (project.timeline?.version ?? 0) + 1,
      };
      project.status = 'editing';
    }

    project.lastEditedBy = session.user.email;
    project.lastEditedAt = new Date();

    await project.save();

    return NextResponse.json({ success: true, data: project.toObject() });
  } catch (error) {
    console.error('PATCH project error:', error);
    const message = error instanceof Error ? error.message : 'Failed to update project';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// ============================================================================
// DELETE — remove project
// ============================================================================

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const project = await Project.findOne({ slug });
    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    if (project.author !== session.user.email) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    await Project.deleteOne({ slug });

    return NextResponse.json({ success: true, message: 'Project deleted' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete project';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}