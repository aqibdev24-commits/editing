'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Video,
  LayoutDashboard,
  FolderKanban,
  Film,
  Image as ImageIcon,
  Music,
  Download,
  Settings,
  Sparkles,
  Wand2,
  Layout,
  ChevronLeft,
  ChevronRight,
  Upload,
  Palette,
} from 'lucide-react';
import { useState } from 'react';
import { APP_NAME } from '@/lib/constants';

interface SidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

const NAV_SECTIONS = [
  {
    title: 'Main',
    links: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/projects', label: 'Projects', icon: FolderKanban },
      { href: '/editor/new', label: 'New Project', icon: Video },
    ],
  },
  {
    title: 'Library',
    links: [
      { href: '/assets', label: 'All Assets', icon: Upload },
      { href: '/assets/videos', label: 'Videos', icon: Film },
      { href: '/assets/images', label: 'Images', icon: ImageIcon },
      { href: '/assets/audio', label: 'Audio', icon: Music },
    ],
  },
  {
    title: 'Tools',
    links: [
      { href: '/templates', label: 'Templates', icon: Layout },
      { href: '/effects', label: 'Effects', icon: Sparkles },
      { href: '/ai', label: 'AI Studio', icon: Wand2 },
      { href: '/palette', label: 'Color Grading', icon: Palette },
    ],
  },
  {
    title: 'Output',
    links: [
      { href: '/exports', label: 'Exports', icon: Download },
      { href: '/settings', label: 'Settings', icon: Settings },
    ],
  },
];

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState<boolean>(false);

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="sticky top-0 hidden h-screen flex-shrink-0 flex-col border-r border-white/5 bg-slate-950 lg:flex"
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-white/5 px-4">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600">
              <Video className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white">{APP_NAME}</span>
          </Link>
        )}
        {collapsed && (
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600">
            <Video className="h-5 w-5 text-white" />
          </div>
        )}
        <button
          onClick={() => setCollapsed((v) => !v)}
          className={`flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/5 hover:text-white ${
            collapsed ? 'absolute -right-3 top-4 border border-white/10 bg-slate-950' : ''
          }`}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5" />
          )}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title} className="mb-6">
            {!collapsed && (
              <div className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                {section.title}
              </div>
            )}
            <div className="space-y-1">
              {section.links.map((link) => {
                const active =
                  pathname === link.href ||
                  (link.href !== '/dashboard' && pathname?.startsWith(link.href + '/'));
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    title={collapsed ? link.label : undefined}
                    className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                      active
                        ? 'bg-gradient-to-r from-violet-600/20 to-fuchsia-600/10 text-white'
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {active && (
                      <motion.div
                        layoutId="sidebar-active"
                        className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-violet-500 to-fuchsia-500"
                      />
                    )}
                    <Icon
                      className={`h-4.5 w-4.5 flex-shrink-0 ${
                        active ? 'text-violet-400' : 'text-slate-500 group-hover:text-slate-300'
                      }`}
                    />
                    {!collapsed && <span className="truncate">{link.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User card */}
      {!collapsed && (
        <div className="border-t border-white/5 p-3">
          <Link
            href="/settings/profile"
            className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-2.5 transition-colors hover:bg-white/5"
          >
            <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-lg bg-violet-600">
              {user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.image}
                  alt={user.name ?? 'User'}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs font-bold text-white">
                  {(user.name ?? 'U').charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium text-white">
                {user.name ?? 'User'}
              </div>
              <div className="truncate text-xs text-slate-500">{user.email}</div>
            </div>
          </Link>
        </div>
      )}
    </motion.aside>
  );
}