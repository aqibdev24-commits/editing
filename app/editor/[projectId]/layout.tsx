import type { ReactNode } from 'react';

interface EditorLayoutProps {
  children: ReactNode;
}

export default function EditorLayout({ children }: EditorLayoutProps) {
  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-slate-950 text-white">
      {children}
    </div>
  );
}