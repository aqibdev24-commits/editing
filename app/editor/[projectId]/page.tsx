import { notFound, redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Project } from '@/models/project';
import { Asset } from '@/models/asset';
import EditorClient from './EditorClient';
import { randomBytes } from 'crypto';

interface EditorPageProps {
  params: Promise<{ projectId: string }>;
}

export default async function EditorPage({ params }: EditorPageProps) {
  const { projectId } = await params;

  const session = await auth();
  if (!session?.user?.email) {
    redirect(`/login?callbackUrl=/editor/${projectId}`);
  }

  await connectDB();

  if (projectId === 'new') {
const slug = `untitled-${randomBytes(16).toString('hex')}`;

    const newProject = await Project.create({
      title: 'Untitled Project',
      slug,
      description: '',
      thumbnail: '',
      previewUrl: '',
      duration: 0,
      resolution: '1080p',
      category: 'youtube',
      author: session.user.email,
      authorAvatar: session.user.image ?? '',
      tags: [],
      timeline: {
        tracks: [],
        totalDuration: 10,
        version: 1,
      },
      status: 'draft',
    });

    redirect(`/editor/${newProject._id.toString()}`);
  }

  if (!/^[a-f\d]{24}$/i.test(projectId)) {
    notFound();
  }

  const project = await Project.findById(projectId).lean();

  if (!project) {
    notFound();
  }

  if (project.author !== session.user.email) {
    redirect('/dashboard');
  }

  const assets = await Asset.find({
    userId: session.user.email,
  })
    .sort({ createdAt: -1 })
    .limit(200)
    .lean();

  return (
    <EditorClient
      project={JSON.parse(JSON.stringify(project))}
      assets={JSON.parse(JSON.stringify(assets))}
      user={{
        name: session.user.name ?? 'User',
        email: session.user.email,
        image: session.user.image ?? undefined,
      }}
    />
  );
}