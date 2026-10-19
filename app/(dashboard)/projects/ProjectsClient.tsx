'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  Grid3x3,
  List,
  Play,
  Clock,
  Eye,
  MoreVertical,
  Edit3,
  Trash2,
  Copy,
  Download,
  Share2,
  FolderKanban,
  Film,
  Video,
  Sparkles,
  ChevronDown,
  X,
  Layout,
  Calendar,
  TrendingUp,
  FileVideo,
} from 'lucide-react';
// import { APP_NAME } from '@/lib/constants';

// ============================================================================
// TYPES
// ============================================================================

interface ProjectDTO {
  _id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  previewUrl: string;
  duration: number;
  resolution: string;
  category: string;
  author: string;
  authorAvatar?: string;
  views: number;
  likes: number;
  isFeatured: boolean;
  isNewProduct: boolean;
  isTrending: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface ProjectsClientProps {
  projects: ProjectDTO[];
  stats: {
    total: number;
    fourK: number;
    fullHD: number;
    reels: number;
  };
}

type SortOption = 'recent' | 'oldest' | 'name' | 'duration';
type ViewMode = 'grid' | 'list';

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

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
    transition: { staggerChildren: 0.05 },
  },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: 'easeOut' as const },
  },
};

// ============================================================================
// HELPERS
// ============================================================================

const CATEGORIES = [
  { id: 'all', label: 'All Categories' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'reels', label: 'Reels & Shorts' },
  { id: 'cinematic', label: 'Cinematic' },
  { id: 'vlog', label: 'Vlog' },
  { id: 'tutorial', label: 'Tutorial' },
  { id: 'gaming', label: 'Gaming' },
  { id: 'travel', label: 'Travel' },
  { id: 'wedding', label: 'Wedding' },
];

const RESOLUTIONS = [
  { id: 'all', label: 'All Resolutions' },
  { id: '720p', label: '720p HD' },
  { id: '1080p', label: '1080p Full HD' },
  { id: '2K', label: '2K' },
  { id: '4K', label: '4K Ultra HD' },
];

const SORT_OPTIONS = [
  { id: 'recent', label: 'Most Recent', icon: Calendar },
  { id: 'oldest', label: 'Oldest First', icon: Clock },
  { id: 'name', label: 'Name (A-Z)', icon: Layout },
  { id: 'duration', label: 'Longest First', icon: Film },
];

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function formatViews(views: number): string {
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K`;
  return views.toString();
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
  return `${Math.floor(diffDays / 365)}y ago`;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ProjectsClient({ projects, stats }: ProjectsClientProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeResolution, setActiveResolution] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Filter + sort
  const filteredProjects = useMemo<ProjectDTO[]>(() => {
    let result = [...projects];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    // Category
    if (activeCategory !== 'all') {
      result = result.filter((p) => p.category === activeCategory);
    }

    // Resolution
    if (activeResolution !== 'all') {
      result = result.filter((p) => p.resolution === activeResolution);
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case 'oldest':
          return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        case 'name':
          return a.title.localeCompare(b.title);
        case 'duration':
          return b.duration - a.duration;
        default:
          return 0;
      }
    });

    return result;
  }, [projects, searchQuery, activeCategory, activeResolution, sortBy]);

  const hasActiveFilters =
    activeCategory !== 'all' ||
    activeResolution !== 'all' ||
    searchQuery.trim() !== '' ||
    sortBy !== 'recent';

  const clearFilters = () => {
    setSearchQuery('');
    setActiveCategory('all');
    setActiveResolution('all');
    setSortBy('recent');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="mb-8"
      >
        <motion.div
          variants={fadeUp}
          className="flex flex-wrap items-end justify-between gap-4"
        >
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-300">
              <FolderKanban className="h-3 w-3" />
              <span>Projects Library</span>
            </div>
            <h1 className="text-3xl font-bold text-white sm:text-4xl">Your Projects</h1>
            <p className="mt-2 text-slate-400">
              {stats.total === 0
                ? 'Create your first project to get started'
                : `${stats.total} project${stats.total === 1 ? '' : 's'} in your library`}
            </p>
          </div>
          <Link
            href="/projects/new"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/30 transition-all hover:scale-[1.02]"
          >
            <Plus className="h-4 w-4" />
            New Project
          </Link>
        </motion.div>

        {/* Stats strip */}
        {stats.total > 0 && (
          <motion.div variants={fadeUp} className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <MiniStat icon={FolderKanban} label="Total" value={stats.total} color="text-violet-400" />
            <MiniStat icon={Sparkles} label="4K Projects" value={stats.fourK} color="text-fuchsia-400" />
            <MiniStat icon={Film} label="Full HD" value={stats.fullHD} color="text-blue-400" />
            <MiniStat icon={Video} label="Reels" value={stats.reels} color="text-emerald-400" />
          </motion.div>
        )}
      </motion.div>

      {/* Controls */}
      {stats.total > 0 && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="mb-6 flex flex-wrap items-center gap-3"
        >
          {/* Search */}
          <motion.div variants={fadeUp} className="relative min-w-[240px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-10 text-sm text-white placeholder-slate-500 outline-none transition-colors focus:border-violet-500/50 focus:bg-white/[0.07]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </motion.div>

          {/* Sort dropdown */}
          <motion.div variants={fadeUp} className="relative">
            <SortDropdown value={sortBy} onChange={setSortBy} />
          </motion.div>

          {/* Filter button */}
          <motion.button
            variants={fadeUp}
            onClick={() => setFilterOpen(true)}
            className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
              activeCategory !== 'all' || activeResolution !== 'all'
                ? 'border-violet-500/40 bg-violet-500/10 text-violet-300'
                : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10'
            }`}
          >
            <Filter className="h-4 w-4" />
            Filters
            {(activeCategory !== 'all' || activeResolution !== 'all') && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-500 text-[10px] font-bold text-white">
                {(activeCategory !== 'all' ? 1 : 0) + (activeResolution !== 'all' ? 1 : 0)}
              </span>
            )}
          </motion.button>

          {/* View toggle */}
          <motion.div
            variants={fadeUp}
            className="flex items-center rounded-xl border border-white/10 bg-white/5 p-1"
          >
            <button
              onClick={() => setViewMode('grid')}
              className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-violet-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
              aria-label="Grid view"
            >
              <Grid3x3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-violet-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </button>
          </motion.div>

          {/* Clear filters */}
          {hasActiveFilters && (
            <motion.button
              variants={fadeUp}
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
              Clear
            </motion.button>
          )}
        </motion.div>
      )}

      {/* Results count */}
      {stats.total > 0 && filteredProjects.length !== projects.length && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-4 text-sm text-slate-500"
        >
          Showing <span className="font-semibold text-white">{filteredProjects.length}</span> of{' '}
          {projects.length} projects
        </motion.p>
      )}

      {/* Empty states */}
      {stats.total === 0 && <EmptyProjects />}

      {stats.total > 0 && filteredProjects.length === 0 && (
        <NoResults onClear={clearFilters} />
      )}

      {/* Grid/List */}
      {filteredProjects.length > 0 && viewMode === 'grid' && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {filteredProjects.map((project, idx) => (
            <ProjectGridCard
              key={project._id}
              project={project}
              index={idx}
              menuOpen={openMenuId === project._id}
              onMenuToggle={() =>
                setOpenMenuId(openMenuId === project._id ? null : project._id)
              }
            />
          ))}
        </motion.div>
      )}

      {filteredProjects.length > 0 && viewMode === 'list' && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]"
        >
          {filteredProjects.map((project, idx) => (
            <ProjectListRow
              key={project._id}
              project={project}
              index={idx}
              isLast={idx === filteredProjects.length - 1}
              menuOpen={openMenuId === project._id}
              onMenuToggle={() =>
                setOpenMenuId(openMenuId === project._id ? null : project._id)
              }
            />
          ))}
        </motion.div>
      )}

      {/* Filter drawer */}
      <AnimatePresence>
        {filterOpen && (
          <FilterDrawer
            activeCategory={activeCategory}
            activeResolution={activeResolution}
            onCategoryChange={setActiveCategory}
            onResolutionChange={setActiveResolution}
            onClose={() => setFilterOpen(false)}
            onClear={() => {
              setActiveCategory('all');
              setActiveResolution('all');
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// SUB COMPONENTS
// ============================================================================

interface MiniStatProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  color: string;
}

function MiniStat({ icon: Icon, label, value, color }: MiniStatProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3">
      <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white/5 ${color}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <div className="text-lg font-bold text-white">{value}</div>
        <div className="truncate text-[11px] text-slate-500">{label}</div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sort Dropdown
// ---------------------------------------------------------------------------

interface SortDropdownProps {
  value: SortOption;
  onChange: (val: SortOption) => void;
}

function SortDropdown({ value, onChange }: SortDropdownProps) {
  const [open, setOpen] = useState<boolean>(false);
  const active = SORT_OPTIONS.find((o) => o.id === value) ?? SORT_OPTIONS[0];
  const ActiveIcon = active.icon;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-300 transition-all hover:border-white/20 hover:bg-white/10"
      >
        <ActiveIcon className="h-4 w-4" />
        {active.label}
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full z-40 mt-2 w-56 overflow-hidden rounded-xl border border-white/10 bg-slate-900/95 p-1.5 shadow-2xl backdrop-blur-xl"
            >
              {SORT_OPTIONS.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.id}
                    onClick={() => {
                      onChange(option.id as SortOption);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                      value === option.id
                        ? 'bg-violet-500/15 text-violet-300'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span>{option.label}</span>
                  </button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Project Grid Card
// ---------------------------------------------------------------------------

interface ProjectGridCardProps {
  project: ProjectDTO;
  index: number;
  menuOpen: boolean;
  onMenuToggle: () => void;
}

function ProjectGridCard({
  project,
  // index,
  menuOpen,
  onMenuToggle,
}: ProjectGridCardProps) {
  return (
    <motion.div variants={scaleIn} className="group relative">
      <Link
        href={`/editor/${project._id}`}
        className="block overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition-all hover:-translate-y-1 hover:border-violet-500/30 hover:bg-white/[0.04]"
      >
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden bg-slate-900">
          {project.thumbnail ? (
            <Image
              src={project.thumbnail}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
              <FileVideo className="h-10 w-10 text-slate-700" />
            </div>
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

          {/* Badges */}
          <div className="absolute left-2 top-2 flex gap-1.5">
            <div className="rounded-md bg-violet-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
              {project.resolution}
            </div>
            {project.isNewProduct && (
              <div className="rounded-md bg-emerald-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                New
              </div>
            )}
          </div>

          {/* Duration */}
          <div className="absolute bottom-2 right-2 rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
            {formatDuration(project.duration)}
          </div>

          {/* Play overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
            <div className="rounded-full bg-white/20 p-3 backdrop-blur-md">
              <Play className="h-6 w-6 text-white" fill="currentColor" />
            </div>
          </div>

          {/* Category tag */}
          <div className="absolute left-2 bottom-2 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-medium capitalize text-white backdrop-blur-sm">
            {project.category}
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="mb-1.5 truncate text-sm font-semibold text-white transition-colors group-hover:text-violet-300">
            {project.title}
          </h3>
          <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-slate-500">
            {project.description || 'No description'}
          </p>

          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatRelativeTime(project.updatedAt)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {formatViews(project.views)}
            </span>
          </div>
        </div>
      </Link>

      {/* Menu button (outside Link to avoid nested link) */}
      <div className="absolute right-3 top-3 z-10">
        <ProjectMenuButton
          project={project}
          open={menuOpen}
          onToggle={onMenuToggle}
        />
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Project Menu Button
// ---------------------------------------------------------------------------

interface ProjectMenuButtonProps {
  project: ProjectDTO;
  open: boolean;
  onToggle: () => void;
}

function ProjectMenuButton({ open, onToggle }: ProjectMenuButtonProps) {
  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggle();
        }}
        className="flex h-8 w-8 items-center justify-center rounded-lg bg-black/40 text-white opacity-0 backdrop-blur-sm transition-opacity hover:bg-black/60 group-hover:opacity-100"
        aria-label="Project menu"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div
              className="fixed inset-0 z-30"
              onClick={(e) => {
                e.preventDefault();
                onToggle();
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -8 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full z-40 mt-2 w-48 overflow-hidden rounded-xl border border-white/10 bg-slate-900/95 p-1.5 shadow-2xl backdrop-blur-xl"
            >
              <MenuAction icon={Play} label="Open" href="/editor/xxx" />
              <MenuAction icon={Edit3} label="Rename" />
              <MenuAction icon={Copy} label="Duplicate" />
              <MenuAction icon={Share2} label="Share" />
              <MenuAction icon={Download} label="Download" />
              <div className="my-1 h-px bg-white/5" />
              <MenuAction icon={Trash2} label="Delete" variant="danger" />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

interface MenuActionProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href?: string;
  variant?: 'default' | 'danger';
}

function MenuAction({ icon: Icon, label, href, variant = 'default' }: MenuActionProps) {
  const cls = `flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
    variant === 'danger'
      ? 'text-red-400 hover:bg-red-500/10'
      : 'text-slate-300 hover:bg-white/5 hover:text-white'
  }`;

  if (href) {
    return (
      <Link href={href} className={cls}>
        <Icon className="h-4 w-4 flex-shrink-0" />
        <span>{label}</span>
      </Link>
    );
  }

  return (
    <button className={cls}>
      <Icon className="h-4 w-4 flex-shrink-0" />
      <span>{label}</span>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Project List Row
// ---------------------------------------------------------------------------

interface ProjectListRowProps {
  project: ProjectDTO;
  index: number;
  isLast: boolean;
  menuOpen: boolean;
  onMenuToggle: () => void;
}

function ProjectListRow({
  project,
  isLast,
  menuOpen,
  onMenuToggle,
}: ProjectListRowProps) {
  return (
    <motion.div
      variants={fadeUp}
      className={`group relative flex items-center gap-4 p-3 transition-colors hover:bg-white/[0.03] ${
        isLast ? '' : 'border-b border-white/5'
      }`}
    >
      <Link
        href={`/editor/${project._id}`}
        className="flex flex-1 items-center gap-4 min-w-0"
      >
        {/* Thumbnail */}
        <div className="relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-slate-900">
          {project.thumbnail ? (
            <Image
              src={project.thumbnail}
              alt={project.title}
              fill
              className="object-cover"
              sizes="96px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <FileVideo className="h-6 w-6 text-slate-700" />
            </div>
          )}
          <div className="absolute bottom-1 right-1 rounded bg-black/70 px-1.5 py-0.5 text-[9px] font-medium text-white">
            {formatDuration(project.duration)}
          </div>
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <h3 className="mb-1 truncate text-sm font-semibold text-white group-hover:text-violet-300">
            {project.title}
          </h3>
          <p className="mb-2 line-clamp-1 text-xs text-slate-500">
            {project.description || 'No description'}
          </p>
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
            <span className="inline-flex items-center gap-1">
              <Film className="h-3 w-3" />
              {project.resolution}
            </span>
            <span className="inline-flex items-center gap-1 capitalize">
              <Sparkles className="h-3 w-3" />
              {project.category}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatRelativeTime(project.updatedAt)}
            </span>
          </div>
        </div>
      </Link>

      {/* Stats */}
      <div className="hidden items-center gap-6 pr-2 md:flex">
        <div className="text-right">
          <div className="text-sm font-semibold text-white">
            {formatViews(project.views)}
          </div>
          <div className="text-[10px] text-slate-500">views</div>
        </div>
        <div className="text-right">
          <div className="text-sm font-semibold text-white">
            {formatViews(project.likes)}
          </div>
          <div className="text-[10px] text-slate-500">likes</div>
        </div>
      </div>

      {/* Menu */}
      <ProjectMenuButton project={project} open={menuOpen} onToggle={onMenuToggle} />
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Filter Drawer
// ---------------------------------------------------------------------------

interface FilterDrawerProps {
  activeCategory: string;
  activeResolution: string;
  onCategoryChange: (val: string) => void;
  onResolutionChange: (val: string) => void;
  onClose: () => void;
  onClear: () => void;
}

function FilterDrawer({
  activeCategory,
  activeResolution,
  onCategoryChange,
  onResolutionChange,
  onClose,
  onClear,
}: FilterDrawerProps) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
      />
      <motion.aside
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 250 }}
        className="fixed inset-y-0 right-0 z-50 w-full max-w-md overflow-y-auto border-l border-white/10 bg-slate-950 p-6 shadow-2xl"
      >
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
              <Filter className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Filters</h2>
              <p className="text-xs text-slate-500">Refine your projects</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-white/5 hover:text-white"
            aria-label="Close filters"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h3 className="mb-3 text-sm font-semibold text-white">Category</h3>
          <div className="space-y-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-violet-500/15 text-violet-300'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span>{cat.label}</span>
                {activeCategory === cat.id && (
                  <div className="h-2 w-2 rounded-full bg-violet-400" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Resolution */}
        <div className="mb-8">
          <h3 className="mb-3 text-sm font-semibold text-white">Resolution</h3>
          <div className="space-y-1">
            {RESOLUTIONS.map((res) => (
              <button
                key={res.id}
                onClick={() => onResolutionChange(res.id)}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                  activeResolution === res.id
                    ? 'bg-violet-500/15 text-violet-300'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span>{res.label}</span>
                {activeResolution === res.id && (
                  <div className="h-2 w-2 rounded-full bg-violet-400" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 -mx-6 -mb-6 mt-8 border-t border-white/5 bg-slate-950 px-6 py-4">
          <div className="flex gap-3">
            <button
              onClick={onClear}
              className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:border-white/20 hover:bg-white/10"
            >
              Clear All
            </button>
            <button
              onClick={onClose}
              className="flex-1 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/30 transition-all hover:scale-[1.02]"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
}

// ---------------------------------------------------------------------------
// Empty States
// ---------------------------------------------------------------------------

function EmptyProjects() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-12 text-center sm:p-16"
    >
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 text-violet-400">
        <FolderKanban className="h-10 w-10" />
      </div>
      <h2 className="text-2xl font-bold text-white">No projects yet</h2>
      <p className="mx-auto mt-3 max-w-md text-slate-400">
        Start your creative journey by creating your first video project. It&apos;s completely
        free — no credit card, no watermarks, no limits.
      </p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          href="/projects/new"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/30 transition-all hover:scale-[1.02]"
        >
          <Plus className="h-4 w-4" />
          Create First Project
        </Link>
        <Link
          href="/templates"
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-all hover:border-white/20 hover:bg-white/10"
        >
          <Layout className="h-4 w-4" />
          Browse Templates
        </Link>
      </div>

      {/* Feature hints */}
      <div className="mx-auto mt-12 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
        <FeatureHint icon={Sparkles} title="AI Editing" desc="Auto captions & effects" />
        <FeatureHint icon={Video} title="4K Export" desc="Cinema-quality output" />
        <FeatureHint icon={TrendingUp} title="Analytics" desc="Track your reach" />
      </div>
    </motion.div>
  );
}

interface FeatureHintProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}

function FeatureHint({ icon: Icon, title, desc }: FeatureHintProps) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-center">
      <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
        <Icon className="h-5 w-5" />
      </div>
      <div className="text-sm font-semibold text-white">{title}</div>
      <div className="mt-1 text-xs text-slate-500">{desc}</div>
    </div>
  );
}

interface NoResultsProps {
  onClear: () => void;
}

function NoResults({ onClear }: NoResultsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-12 text-center"
    >
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-slate-500">
        <Search className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-semibold text-white">No projects found</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm text-slate-400">
        We couldn&apos;t find any projects matching your filters. Try adjusting your search or
        clearing the filters.
      </p>
      <button
        onClick={onClear}
        className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:border-white/20 hover:bg-white/10"
      >
        <X className="h-4 w-4" />
        Clear Filters
      </button>
    </motion.div>
  );
}