'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, Variants } from 'framer-motion';
import {
  Video,
  FolderKanban,
  Image as ImageIcon,
  Plus,
  Upload,
  Play,
  Clock,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Film,
  HardDrive,
  Zap,
  Wand2,
  Layout,
} from 'lucide-react';
import { APP_NAME } from '@/lib/constants';

interface ProjectDTO {
  _id: string;
  title: string;
  slug: string;
  thumbnail: string;
  duration: number;
  resolution: string;
  category: string;
  updatedAt: string;
  views: number;
}

interface AssetDTO {
  _id: string;
  name: string;
  url: string;
  thumbnailUrl?: string;
  type: 'image' | 'video' | 'audio';
  size: number;
}

interface DashboardClientProps {
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
  projects: ProjectDTO[];
  assets: AssetDTO[];
  stats: {
    projectCount: number;
    assetCount: number;
    videoCount: number;
    imageCount: number;
  };
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
};

const stagger: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// function formatBytes(bytes: number): string {
//   if (bytes < 1024) return `${bytes} B`;
//   if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
//   if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
//   return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
// }

export default function DashboardClient({
  user,
  projects,
  assets,
  stats,
}: DashboardClientProps) {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Welcome header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="mb-8"
      >
        <motion.div variants={fadeUp} className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white sm:text-4xl">
              {greeting}, {user.name.split(' ')[0]}!
            </h1>
            <p className="mt-2 text-slate-400">
              Welcome back to {APP_NAME}. Ready to create something amazing?
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/assets/uploads"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:border-white/20 hover:bg-white/10"
            >
              <Upload className="h-4 w-4" />
              Upload
            </Link>
            <Link
              href="/projects/new"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/30 transition-all hover:scale-[1.02]"
            >
              <Plus className="h-4 w-4" />
              New Project
            </Link>
          </div>
        </motion.div>
      </motion.div>

      {/* Stats grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4"
      >
        <StatCard
          icon={FolderKanban}
          label="Projects"
          value={stats.projectCount}
          color="from-violet-600 to-purple-600"
          href="/projects"
        />
        <StatCard
          icon={Video}
          label="Videos"
          value={stats.videoCount}
          color="from-fuchsia-600 to-pink-600"
          href="/assets/videos"
        />
        <StatCard
          icon={ImageIcon}
          label="Images"
          value={stats.imageCount}
          color="from-blue-600 to-cyan-600"
          href="/assets/images"
        />
        <StatCard
          icon={HardDrive}
          label="Total Assets"
          value={stats.assetCount}
          color="from-emerald-600 to-teal-600"
          href="/assets"
        />
      </motion.div>

      {/* Quick actions */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="mb-8"
      >
        <motion.h2 variants={fadeUp} className="mb-4 text-lg font-semibold text-white">
          Quick Actions
        </motion.h2>
        <motion.div variants={fadeUp} className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <QuickAction href="/projects/new" icon={Plus} label="New Project" color="from-violet-600 to-fuchsia-600" />
          <QuickAction href="/assets/uploads" icon={Upload} label="Upload Media" color="from-blue-600 to-cyan-600" />
          <QuickAction href="/ai" icon={Wand2} label="AI Tools" color="from-emerald-600 to-teal-600" />
          <QuickAction href="/templates" icon={Layout} label="Templates" color="from-amber-600 to-orange-600" />
          <QuickAction href="/effects" icon={Sparkles} label="Effects" color="from-pink-600 to-rose-600" />
          <QuickAction href="/exports" icon={Film} label="Exports" color="from-indigo-600 to-purple-600" />
        </motion.div>
      </motion.div>

      {/* Recent projects */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="mb-8"
      >
        <motion.div variants={fadeUp} className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Recent Projects</h2>
          <Link
            href="/projects"
            className="inline-flex items-center gap-1 text-sm font-medium text-violet-400 hover:text-violet-300"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </motion.div>

        {projects.length === 0 ? (
          <motion.div
            variants={fadeUp}
            className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-12 text-center"
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400">
              <Video className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-white">No projects yet</h3>
            <p className="mx-auto mt-2 max-w-sm text-sm text-slate-400">
              Create your first video project to get started. It&apos;s free and takes seconds.
            </p>
            <Link
              href="/projects/new"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/30 transition-all hover:scale-[1.02]"
            >
              <Plus className="h-4 w-4" /> Create First Project
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.slice(0, 6).map((project, idx) => (
              <motion.div
                key={project._id}
                variants={fadeUp}
                transition={{ delay: idx * 0.05 }}
              >
                <Link
                  href={`/projects/${project._id}`}
                  className="group block overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition-all hover:-translate-y-1 hover:border-violet-500/30"
                >
                  <div className="relative aspect-video overflow-hidden bg-slate-900">
                    {project.thumbnail && (
                      <Image
                        src={project.thumbnail}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute left-2 top-2 rounded-md bg-violet-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                      {project.resolution}
                    </div>
                    <div className="absolute bottom-2 right-2 rounded-md bg-black/70 px-2 py-0.5 text-[10px] text-white backdrop-blur-sm">
                      {formatDuration(project.duration)}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                      <div className="rounded-full bg-white/20 p-3 backdrop-blur-sm">
                        <Play className="h-5 w-5 text-white" fill="currentColor" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="mb-1 truncate text-sm font-semibold text-white">
                      {project.title}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="capitalize">{project.category}</span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(project.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>

      {/* Recent assets */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="mb-8"
      >
        <motion.div variants={fadeUp} className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Recent Uploads</h2>
          <Link
            href="/assets"
            className="inline-flex items-center gap-1 text-sm font-medium text-violet-400 hover:text-violet-300"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </motion.div>

        {assets.length === 0 ? (
          <motion.div
            variants={fadeUp}
            className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center"
          >
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <Upload className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-white">No uploads yet</h3>
            <p className="mt-1 text-sm text-slate-400">
              Upload your videos, images, and audio files to start editing.
            </p>
            <Link
              href="/assets/uploads"
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2 text-sm font-semibold text-white transition-all hover:border-white/20 hover:bg-white/10"
            >
              <Upload className="h-4 w-4" /> Upload Files
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
            {assets.map((asset, idx) => (
              <motion.div
                key={asset._id}
                variants={fadeUp}
                transition={{ delay: idx * 0.03 }}
                className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-slate-900"
              >
                {asset.thumbnailUrl && (
                  <Image
                    src={asset.thumbnailUrl}
                    alt={asset.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 12.5vw"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="absolute bottom-2 left-2 right-2 truncate text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100">
                  {asset.name}
                </div>
                <div className="absolute right-1.5 top-1.5 rounded-md bg-black/60 px-1.5 py-0.5 text-[9px] uppercase text-white backdrop-blur-sm">
                  {asset.type}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>

      {/* AI promo */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="mb-8"
      >
        <motion.div
          variants={fadeUp}
          className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-950/40 via-slate-900 to-fuchsia-950/40 p-8 sm:p-10"
        >
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet-600/20 blur-3xl" />
          <div className="relative flex flex-wrap items-center gap-6">
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-lg shadow-violet-600/30">
              <Zap className="h-7 w-7 text-white" />
            </div>
            <div className="flex-1 min-w-[200px]">
              <h3 className="text-xl font-bold text-white">AI Studio — Free Forever</h3>
              <p className="mt-1 text-sm text-slate-400">
                Auto captions, background removal, voice enhancement, and more. All tools, no
                cost.
              </p>
            </div>
            <Link
              href="/ai"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition-all hover:scale-[1.02]"
            >
              <Sparkles className="h-4 w-4" />
              Explore AI Tools
            </Link>
          </div>
        </motion.div>
      </motion.section>
    </div>
  );
}

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  color: string;
  href: string;
}

function StatCard({ icon: Icon, label, value, color, href }: StatCardProps) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-all hover:-translate-y-0.5 hover:border-white/20"
    >
      <div className="mb-3 flex items-center justify-between">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${color}`}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>
        <TrendingUp className="h-4 w-4 text-slate-600 transition-colors group-hover:text-violet-400" />
      </div>
      <div className="text-2xl font-bold text-white">{value.toLocaleString()}</div>
      <div className="mt-1 text-xs text-slate-500">{label}</div>
    </Link>
  );
}

interface QuickActionProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  color: string;
}

function QuickAction({ href, icon: Icon, label, color }: QuickActionProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-center transition-all hover:-translate-y-0.5 hover:border-white/20"
    >
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${color} transition-transform group-hover:scale-110`}
      >
        <Icon className="h-5 w-5 text-white" />
      </div>
      <span className="text-xs font-medium text-slate-300 group-hover:text-white">
        {label}
      </span>
    </Link>
  );
}