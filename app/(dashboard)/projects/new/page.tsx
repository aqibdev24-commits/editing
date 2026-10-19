import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import NewProjectClient from './NewProjectClient';

export default async function NewProjectPage() {
  const session = await auth();
  if (!session?.user?.email) {
    redirect('/login?callbackUrl=/projects/new');
  }

  return (
    <NewProjectClient
      user={{
        name: session.user.name ?? 'User',
        email: session.user.email,
        image: session.user.image ?? undefined,
      }}
    />
  );
}