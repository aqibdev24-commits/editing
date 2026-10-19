import Link from 'next/link';
import { ArrowLeft, FileX } from 'lucide-react';

export default function EditorNotFound() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-slate-950 px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-red-500/20 bg-red-500/10 text-red-400">
          <FileX className="h-10 w-10" />
        </div>
        <h1 className="text-2xl font-bold text-white">Project not found</h1>
        <p className="mt-2 text-sm text-slate-400">
          The project you&apos;re looking for doesn&apos;t exist or has been deleted.
        </p>
        <Link
          href="/projects"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/30 transition-all hover:scale-[1.02]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Link>
      </div>
    </div>
  );
}