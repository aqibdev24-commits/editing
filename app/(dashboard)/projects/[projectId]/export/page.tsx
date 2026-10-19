import { notFound, redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Project } from '@/models/project';
import ExportClient from './ExportClient';

interface ExportPageProps {
  params: Promise<{ projectId: string }>;
}

export default async function ExportPage({ params }: ExportPageProps) {
  const { projectId } = await params;

  const session = await auth();
  if (!session?.user?.email) {
    redirect(`/login?callbackUrl=/projects/${projectId}/export`);
  }

  await connectDB();

  const project = await Project.findById(projectId).lean();

  if (!project) {
    notFound();
  }

  if (project.author !== session.user.email) {
    redirect('/dashboard');
  }

  return (
    <ExportClient
      project={JSON.parse(JSON.stringify(project))}
      user={{
        name: session.user.name ?? 'User',
        email: session.user.email,
        image: session.user.image ?? undefined,
      }}
    />
  );
}