import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { FAQ } from '@/models/faq';

export async function GET() {
  try {
    await connectDB();

    const faqs = await FAQ.find({ isActive: true }).sort({ order: 1 }).lean();

    return NextResponse.json({ success: true, data: faqs }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch FAQs';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}