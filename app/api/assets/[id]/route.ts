import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Asset } from '@/models/asset';
import { imagekit } from '@/lib/imagekit';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const asset = await Asset.findOne({ _id: id, userId: session.user.email });
    if (!asset) {
      return NextResponse.json({ success: false, error: 'Asset not found' }, { status: 404 });
    }

    // Delete from ImageKit
    try {
      await imagekit.deleteFile(asset.fileId);
    } catch (ikError) {
      console.warn('ImageKit delete failed:', ikError);
    }

    await Asset.deleteOne({ _id: id });

    return NextResponse.json({ success: true, message: 'Asset deleted' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete asset';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}