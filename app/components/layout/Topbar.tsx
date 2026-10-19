'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { signOut } from 'next-auth/react';
import {
  Search,
  Bell,
  Plus,
  Menu,
  X,
  LogOut,
  User,
  Settings,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { APP_NAME } from '@/lib/constants';
// Icons needed in NAV_SECTIONS_MOBILE — import here to keep it above
import {
  LayoutDashboard,
  FolderKanban,
  Video,
  Upload,
  Film,
  Image as ImageIcon,
  Music,
  Download,
} from 'lucide-react';

interface TopbarProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/projects': 'Projects',
  '/assets': 'Assets Library',
  '/templates': 'Templates',
  '/effects': 'Effects',
  '/exports': 'Exports',
  '/settings': 'Settings',
  '/ai': 'AI Studio',
};

export default function Topbar({ user }: TopbarProps) {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [profileOpen, setProfileOpen] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  const title =
    Object.entries(PAGE_TITLES).find(([key]) => pathname?.startsWith(key))?.[1] ??
    'Dashboard';

  const handleSignOut = () => {
    void signOut({ callbackUrl: '/' });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
        {/* Left — mobile menu + title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-white/5 hover:text-white lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold text-white">{title}</h1>
        </div>

        {/* Middle — search */}
        <div className="hidden flex-1 justify-center md:flex">
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search projects, assets, templates..."
              className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition-colors focus:border-violet-500/50 focus:bg-white/[0.07]"
            />
            <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-slate-500 lg:block">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right — actions */}
        <div className="flex items-center gap-2">
          {/* Search toggle (mobile) */}
          <button
            onClick={() => setSearchOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-white/5 hover:text-white md:hidden"
            aria-label="Search"
          >
            <Search className="h-4.5 w-4.5" />
          </button>

          {/* Notifications */}
          <button
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-white/5 hover:text-white"
            aria-label="Notifications"
          >
            <Bell className="h-4.5 w-4.5" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-violet-500" />
          </button>

          {/* New project */}
          <Link
            href="/projects/new"
            className="hidden items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition-all hover:scale-[1.02] sm:inline-flex"
          >
            <Plus className="h-4 w-4" />
            New Project
          </Link>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen((v) => !v)}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 py-1.5 pl-1.5 pr-3 transition-colors hover:bg-white/10"
            >
              <div className="h-7 w-7 flex-shrink-0 overflow-hidden rounded-lg bg-violet-600">
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
              <span className="hidden max-w-[100px] truncate text-sm font-medium text-white sm:block">
                {user.name?.split(' ')[0] ?? 'User'}
              </span>
              <ChevronDown
                className={`hidden h-3.5 w-3.5 text-slate-400 transition-transform sm:block ${
                  profileOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            <AnimatePresence>
              {profileOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setProfileOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/95 p-2 shadow-2xl backdrop-blur-xl"
                  >
                    <div className="mb-1 border-b border-white/5 px-3 py-2">
                      <div className="truncate text-sm font-medium text-white">
                        {user.name}
                      </div>
                      <div className="truncate text-xs text-slate-500">{user.email}</div>
                    </div>
                    <Link
                      href="/settings/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white"
                    >
                      <User className="h-4 w-4" /> Profile
                    </Link>
                    <Link
                      href="/settings/preferences"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white"
                    >
                      <Settings className="h-4 w-4" /> Settings
                    </Link>
                    <Link
                      href="/ai"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white"
                    >
                      <Sparkles className="h-4 w-4" /> AI Studio
                    </Link>
                    <div className="my-1 h-px bg-white/5" />
                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-red-400 hover:bg-red-500/10"
                    >
                      <LogOut className="h-4 w-4" /> Sign out
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile search */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-white/5 px-4 py-3 md:hidden"
          >
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search..."
                autoFocus
                className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none focus:border-violet-500/50"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="fixed inset-y-0 left-0 z-50 w-72 overflow-y-auto border-r border-white/10 bg-slate-950 p-4 lg:hidden"
            >
              <div className="mb-6 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-lg font-bold text-white">{APP_NAME}</span>
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-white/5"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {NAV_SECTIONS_MOBILE.map((section) => (
                <div key={section.title} className="mb-6">
                  <div className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                    {section.title}
                  </div>
                  <div className="space-y-1">
                    {section.links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white"
                      >
                        <link.icon className="h-4.5 w-4.5 text-slate-500" />
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

const NAV_SECTIONS_MOBILE = [
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
    title: 'Output',
    links: [
      { href: '/exports', label: 'Exports', icon: Download },
      { href: '/settings', label: 'Settings', icon: Settings },
    ],
  },
];

