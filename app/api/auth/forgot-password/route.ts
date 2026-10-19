import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/user';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email: string };
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required.' },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    // Always return success (don't reveal whether email exists)
    if (!user) {
      return NextResponse.json(
        { success: true, message: 'If an account exists, a reset link has been sent.' },
        { status: 200 }
      );
    }

    // TODO: Generate reset token, save to DB with expiry, send email
    // const resetToken = crypto.randomBytes(32).toString('hex');
    // const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    // user.resetToken = hashedToken;
    // user.resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour
    // await user.save();
    // await sendResetEmail(user.email, resetToken);

    return NextResponse.json(
      { success: true, message: 'If an account exists, a reset link has been sent.' },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to process request.';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}