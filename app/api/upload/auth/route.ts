import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { imagekit } from '@/lib/imagekit';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const authParams = imagekit.getAuthenticationParameters();

    return NextResponse.json({ success: true, data: authParams });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to get auth params';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}