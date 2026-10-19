import { notFound, redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Project } from '@/models/project';
import { Asset } from '@/models/asset';
import EditorClient from './EditorClient';

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