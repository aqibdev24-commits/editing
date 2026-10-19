import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Project } from '@/models/project';
import { Asset } from '@/models/asset';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.email) {
    redirect('/login?callbackUrl=/dashboard');
  }

  await connectDB();

  const [projects, assets, stats] = await Promise.all([
    Project.find({ author: session.user.email })
      .sort({ updatedAt: -1 })
      .limit(6)
      .lean(),
    Asset.find({ userId: session.user.email })
      .sort({ createdAt: -1 })
      .limit(8)
      .lean(),
    Promise.all([
      Project.countDocuments({ author: session.user.email }),
      Asset.countDocuments({ userId: session.user.email }),
      Asset.countDocuments({ userId: session.user.email, type: 'video' }),
      Asset.countDocuments({ userId: session.user.email, type: 'image' }),
    ]),
  ]);

  const [projectCount, assetCount, videoCount, imageCount] = stats;

  return (
    <DashboardClient
      user={{
        name: session.user.name ?? 'User',
        email: session.user.email,
        image: session.user.image,
      }}
      projects={JSON.parse(JSON.stringify(projects))}
      assets={JSON.parse(JSON.stringify(assets))}
      stats={{
        projectCount,
        assetCount,
        videoCount,
        imageCount,
      }}
    />
  );
}