'use client';

import type { ReactNode } from 'react';

interface EditorShellProps {
  toolbar?: ReactNode;
  leftRail?: ReactNode;
  leftPanel?: ReactNode;
  canvas?: ReactNode;
  playbackBar?: ReactNode;
  rightPanel?: ReactNode;
  timeline?: ReactNode;
  statusBar?: ReactNode;
  mobileDrawers?: ReactNode;
}

/**
 * Editor layout shell — pure structural wrapper.
 * Renders editor grid: toolbar (top) → rail | left | canvas | right → timeline → status.
 */
export default function EditorShell({
  toolbar,
  leftRail,
  leftPanel,
  canvas,
  playbackBar,
  rightPanel,
  timeline,
  statusBar,
  mobileDrawers,
}: EditorShellProps) {
  return (
    <div className="flex h-full w-full flex-col">
      {toolbar}

      <div className="flex flex-1 overflow-hidden">
        <div className="hidden lg:block">{leftRail}</div>
        <div className="lg:hidden">{leftRail}</div>

        <div className="hidden lg:flex">{leftPanel}</div>

        <div className="flex flex-1 flex-col overflow-hidden bg-slate-950">
          {canvas}
          {playbackBar}
        </div>

        <div className="hidden lg:flex">{rightPanel}</div>
      </div>

      {timeline}
      {statusBar}
      {mobileDrawers}
    </div>
  );
}