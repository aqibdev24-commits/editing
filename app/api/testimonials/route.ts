import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Testimonial } from '@/models/testimonial';

export async function GET() {
  try {
    await connectDB();

    const testimonials = await Testimonial.find({ isFeatured: true })
      .sort({ createdAt: -1 })
      .limit(8)
      .lean();

    return NextResponse.json({ success: true, data: testimonials }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch testimonials';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}