import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Project } from '@/models/project';
import ProjectsClient from './ProjectsClient';

export default async function ProjectsPage() {
  const session = await auth();
  if (!session?.user?.email) {
    redirect('/login?callbackUrl=/projects');
  }

  await connectDB();

  const [projects, counts] = await Promise.all([
    Project.find({ author: session.user.email })
      .sort({ updatedAt: -1 })
      .limit(100)
      .lean(),
    Promise.all([
      Project.countDocuments({ author: session.user.email }),
      Project.countDocuments({ author: session.user.email, resolution: '4K' }),
      Project.countDocuments({ author: session.user.email, resolution: '1080p' }),
      Project.countDocuments({
        author: session.user.email,
        category: 'reels',
      }),
    ]),
  ]);

  const [total, fourK, fullHD, reels] = counts;

  return (
    <ProjectsClient
      projects={JSON.parse(JSON.stringify(projects))}
      stats={{ total, fourK, fullHD, reels }}
    />
  );
}