'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  type Variants,
} from 'framer-motion';
import {
  Video,
  Scissors,
  Wand2,
  Layers,
  Music,
  Type,
  Sparkles,
  Play,
  Pause,
  Upload,
  Download,
  Settings,
  Zap,
  Clock,
  Users,
  Star,
  Check,
  ChevronDown,
  ArrowRight,
  Globe,
  Shield,
  Cpu,
  Palette,
  Film,
  Mic,
  Image as ImageIcon,
  Volume2,
  Cloud,
  Rocket,
  MousePointer2,
  RotateCcw,
  RotateCw,
  Save,
  Folder,
  FileVideo,
  Layout,
  Sliders,
  Eye,
  Contrast,
  Droplet,
  Repeat,
  Maximize,
  Captions,
  Star as StarIcon,
  Quote,
  Mail,
  Keyboard,
  Grid3x3,
  TrendingUp as TrendingUpIcon,   // ← add kar yaha
  type LucideIcon,
} from 'lucide-react';

import {
  FaTwitter as Twitter,
  FaYoutube as Youtube,
  FaInstagram as Instagram,
  FaGithub as Github,
  FaLinkedin as Linkedin,
} from 'react-icons/fa';

import Navbar from '@/app/components/layout/Navbar';
import Footer from '@/app/components/layout/Footer';
import Loader from '@/app/components/ui/Loader';
import SectionHeading from '@/app/components/common/SectionHeading';
import { APP_NAME } from '@/lib/constants';

// ============================================================================
// LOCAL TYPES
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
}

interface TemplateDTO {
  _id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  category: string;
  duration: number;
  aspectRatio: string;
  downloads: number;
  rating: number;
  isFeatured: boolean;
  isNewProduct: boolean;
  tags: string[];
}

interface FeatureDTO {
  _id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  order: number;
}

interface TestimonialDTO {
  _id: string;
  name: string;
  role: string;
  avatar: string;
  content: string;
  rating: number;
}

interface FAQDTO {
  _id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}

interface StatDTO {
  _id: string;
  label: string;
  value: number;
  suffix: string;
  icon: string;
  order: number;
}

interface IconMapItem {
  Icon: LucideIcon;
  label: string;
  color: string;
}

// ============================================================================
// STATIC CONFIG
// ============================================================================

const ICON_MAP: Record<string, IconMapItem> = {
  scissors: { Icon: Scissors, label: 'Cut & Trim', color: 'text-violet-400' },
  wand: { Icon: Wand2, label: 'AI Magic', color: 'text-fuchsia-400' },
  layers: { Icon: Layers, label: 'Multi-track', color: 'text-blue-400' },
  music: { Icon: Music, label: 'Audio Sync', color: 'text-emerald-400' },
  type: { Icon: Type, label: 'Text & Titles', color: 'text-amber-400' },
  sparkles: { Icon: Sparkles, label: 'Effects', color: 'text-pink-400' },
  cpu: { Icon: Cpu, label: 'AI Powered', color: 'text-cyan-400' },
  cloud: { Icon: Cloud, label: 'Cloud Storage', color: 'text-sky-400' },
  palette: { Icon: Palette, label: 'Color Grading', color: 'text-rose-400' },
  film: { Icon: Film, label: 'Cinematic', color: 'text-orange-400' },
  captions: { Icon: Captions, label: 'Auto Captions', color: 'text-teal-400' },
  shield: { Icon: Shield, label: 'Secure', color: 'text-indigo-400' },
  rocket: { Icon: Rocket, label: 'Fast Render', color: 'text-red-400' },
  globe: { Icon: Globe, label: 'Browser Based', color: 'text-lime-400' },
  mic: { Icon: Mic, label: 'Voice Over', color: 'text-purple-400' },
  image: { Icon: ImageIcon, label: 'Images', color: 'text-yellow-400' },
};

const TRUSTED_BRANDS = [
  { name: 'YouTube', icon: Youtube },
  { name: 'Instagram', icon: Instagram },
  { name: 'TikTok', icon: Video },
  { name: 'LinkedIn', icon: Linkedin },
  { name: 'Twitter', icon: Twitter },
  { name: 'GitHub', icon: Github },
];

const FEATURE_TABS = [
  { id: 'all', label: 'All Features' },
  { id: 'editing', label: 'Editing' },
  { id: 'ai', label: 'AI Tools' },
  { id: 'effects', label: 'Effects' },
  { id: 'collaboration', label: 'Collaboration' },
];

const EFFECT_CATEGORIES = [
  { name: 'Transitions', count: 120, icon: Repeat, color: 'from-violet-500 to-purple-600' },
  { name: 'Filters', count: 85, icon: Palette, color: 'from-fuchsia-500 to-pink-600' },
  { name: 'Overlays', count: 64, icon: Layers, color: 'from-blue-500 to-cyan-600' },
  { name: 'Text Styles', count: 92, icon: Type, color: 'from-amber-500 to-orange-600' },
  { name: 'Audio FX', count: 48, icon: Volume2, color: 'from-emerald-500 to-teal-600' },
  { name: 'Motion Presets', count: 76, icon: MousePointer2, color: 'from-rose-500 to-red-600' },
];

const HOW_IT_WORKS_STEPS = [
  {
    step: '01',
    title: 'Upload Your Media',
    description:
      'Drag and drop videos, images, and audio files directly into your browser. No installation needed — everything runs in the cloud.',
    icon: Upload,
  },
  {
    step: '02',
    title: 'Edit on Timeline',
    description:
      'Trim, split, and rearrange clips with frame-perfect precision. Add transitions, effects, text, and music with a single click.',
    icon: Scissors,
  },
  {
    step: '03',
    title: 'Apply AI Magic',
    description:
      'Auto-generate captions, remove backgrounds, enhance audio, and color-grade your footage with our built-in AI tools.',
    icon: Wand2,
  },
  {
    step: '04',
    title: 'Export in 4K',
    description:
      'Render your final video in up to 4K resolution at 60fps. Download or share directly to YouTube, Instagram, and TikTok.',
    icon: Download,
  },
];

const EDITOR_TOOLS = [
  { icon: Scissors, label: 'Cut' },
  { icon: Layers, label: 'Split' },
  { icon: RotateCcw, label: 'Undo' },
  { icon: RotateCw, label: 'Redo' },
  { icon: Type, label: 'Text' },
  { icon: Music, label: 'Audio' },
  { icon: Sparkles, label: 'FX' },
  { icon: Palette, label: 'Color' },
  { icon: Contrast, label: 'Adjust' },
  { icon: Droplet, label: 'Blur' },
  { icon: Repeat, label: 'Transition' },
  { icon: Save, label: 'Save' },
];

const AI_TOOLS = [
  {
    icon: Captions,
    title: 'Auto Captions',
    description: 'Generate accurate subtitles in 30+ languages with 99% precision using Whisper AI.',
    color: 'from-cyan-500 to-blue-600',
  },
  {
    icon: Wand2,
    title: 'Background Remover',
    description: 'Remove or replace backgrounds instantly without a green screen. Works on every frame.',
    color: 'from-fuchsia-500 to-pink-600',
  },
  {
    icon: Mic,
    title: 'Audio Enhancer',
    description: 'Eliminate background noise, balance levels, and polish voice-overs with one click.',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    icon: Palette,
    title: 'AI Color Grading',
    description: 'Match cinematic LUTs to your footage automatically. Presets for every mood and style.',
    color: 'from-orange-500 to-red-600',
  },
  {
    icon: Film,
    title: 'Scene Detection',
    description: 'Automatically split long footage into clean scenes and remove silent gaps.',
    color: 'from-violet-500 to-purple-600',
  },
  {
    icon: Sparkles,
    title: 'Text to Video',
    description: 'Describe the video you want and let AI generate B-roll, transitions, and sound design.',
    color: 'from-amber-500 to-yellow-600',
  },
];

const FREE_FEATURES = [
  'Unlimited 4K exports',
  'No watermarks, ever',
  'All AI tools included',
  'Unlimited project storage',
  'No credit card required',
  'Commercial use allowed',
];

// ============================================================================
// ANIMATION VARIANTS (module-level, not recreated)
// ============================================================================

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};


// ============================================================================
// HELPER FUNCTIONS (module-level)
// ============================================================================

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function formatViews(views: number): string {
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K`;
  return views.toString();
}

// ============================================================================
// SECTION COMPONENTS (module-level, receive props)
// ============================================================================



function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 pt-24"
    >
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-[600px] w-[600px] rounded-full bg-violet-600/20 blur-3xl" />
        <div className="absolute top-1/3 right-0 h-[500px] w-[500px] rounded-full bg-fuchsia-600/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />
      </div>

      <motion.div
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.08, delayChildren: 0.1 },
            },
          }}
          className="mx-auto max-w-4xl text-center"
        >
          {/* Free badge */}
          <motion.div variants={fadeUp} className="mb-6 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-300 backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              <span>100% Free Forever — No Credit Card Required</span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            Edit videos like a
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
              {' '}
              pro studio
            </span>
            <br />
            right in your browser
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeUp}
            className="mx-auto mt-6 max-w-2xl text-lg text-slate-300 sm:text-xl"
          >
            {APP_NAME} is a powerful, free video editor with AI captions, multi-track timeline,
            cinematic effects, and 4K export. No downloads. No watermarks. No limits.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              href="/editor/new"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-violet-600/30 transition-all hover:scale-[1.02] hover:shadow-violet-500/50"
            >
              <Play className="h-5 w-5" />
              Start Editing Free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/templates"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:border-white/30 hover:bg-white/10"
            >
              <Layout className="h-5 w-5" />
              Browse Templates
            </Link>
          </motion.div>

          {/* Small trust row */}
          <motion.div
            variants={fadeUp}
            className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-400"
          >
            <span className="inline-flex items-center gap-1.5">
              <Check className="h-4 w-4 text-emerald-400" /> No watermarks
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="h-4 w-4 text-emerald-400" /> 4K export
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="h-4 w-4 text-emerald-400" /> Unlimited projects
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="h-4 w-4 text-emerald-400" /> Works offline
            </span>
          </motion.div>
        </motion.div>

        {/* Editor mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="relative mx-auto mt-20 max-w-6xl"
        >
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-violet-600/20 to-transparent blur-3xl" />
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 shadow-2xl backdrop-blur-xl">
            {/* Window bar */}
            <div className="flex items-center gap-2 border-b border-white/10 bg-slate-950/60 px-4 py-3">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-500/80" />
                <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
              </div>
              <div className="mx-auto flex items-center gap-2 rounded-md bg-white/5 px-3 py-1 text-xs text-slate-400">
                <Video className="h-3 w-3" />
                vexora.app/editor/my-project
              </div>
            </div>

            {/* Editor body */}
            <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_280px]">
              {/* Left panel */}
              <div className="hidden border-r border-white/10 bg-slate-950/40 p-4 lg:block">
                <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <Folder className="h-3.5 w-3.5" /> Media Library
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div
                      key={i}
                      className="aspect-video rounded-md bg-gradient-to-br from-slate-800 to-slate-700"
                    />
                  ))}
                </div>
                <div className="mt-6 mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <Sparkles className="h-3.5 w-3.5" /> Effects
                </div>
                <div className="space-y-2">
                  {['Cinematic', 'Vintage', 'Neon', 'B&W'].map((name) => (
                    <div
                      key={name}
                      className="flex items-center gap-2 rounded-md bg-white/5 px-3 py-2 text-xs text-slate-300"
                    >
                      <Palette className="h-3.5 w-3.5 text-violet-400" />
                      {name}
                    </div>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="flex flex-col bg-slate-950/60">
                <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2">
                  {EDITOR_TOOLS.slice(0, 8).map((tool, idx) => (
                    <button
                      key={idx}
                      className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
                    >
                      <tool.icon className="h-3.5 w-3.5" />
                    </button>
                  ))}
                </div>

                <div className="relative flex-1 p-6">
                  <div className="relative aspect-video overflow-hidden rounded-lg bg-gradient-to-br from-violet-900/60 via-slate-900 to-fuchsia-900/60">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                        <Play className="h-6 w-6 text-white" fill="currentColor" />
                      </div>
                    </div>
                    <div className="absolute bottom-3 left-3 rounded-md bg-black/60 px-2 py-1 text-[10px] text-white">
                      00:00 / 02:45
                    </div>
                    <div className="absolute right-3 top-3 rounded-md bg-black/60 px-2 py-1 text-[10px] text-white">
                      4K · 60fps
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-center gap-3 text-slate-400">
                    <RotateCcw className="h-4 w-4" />
                    <Play className="h-5 w-5 text-white" />
                    <Pause className="h-4 w-4" />
                    <RotateCw className="h-4 w-4" />
                    <Volume2 className="h-4 w-4" />
                    <Maximize className="h-4 w-4" />
                  </div>
                </div>

                {/* Timeline */}
                <div className="border-t border-white/10 bg-slate-950/80 p-4">
                  <div className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-wider text-slate-500">
                    <Clock className="h-3 w-3" /> Timeline
                  </div>
                  <div className="space-y-1.5">
                    {[0, 1, 2, 3].map((row) => (
                      <div key={row} className="flex items-center gap-2">
                        <div className="w-12 text-[10px] text-slate-500">
                          {row === 0 ? 'Video' : row === 1 ? 'Audio' : row === 2 ? 'Text' : 'FX'}
                        </div>
                        <div className="flex flex-1 gap-1 overflow-hidden">
                          {[0, 1, 2, 3, 4].map((i) => (
                            <div
                              key={i}
                              className={`h-6 rounded ${row === 0
                                  ? 'bg-violet-500/70'
                                  : row === 1
                                    ? 'bg-emerald-500/60'
                                    : row === 2
                                      ? 'bg-amber-500/60'
                                      : 'bg-fuchsia-500/60'
                                }`}
                              style={{ flex: i % 2 === 0 ? 1.5 : 1 }}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-[10px] text-slate-500">
                    <div className="h-px flex-1 bg-red-500/60" />
                    <div className="rounded bg-red-500/20 px-1.5 py-0.5 text-red-400">00:42</div>
                    <div className="h-px flex-1 bg-red-500/60" />
                  </div>
                </div>
              </div>

              {/* Right panel */}
              <div className="hidden border-l border-white/10 bg-slate-950/40 p-4 lg:block">
                <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <Settings className="h-3.5 w-3.5" /> Inspector
                </div>
                <div className="space-y-3">
                  {['Opacity', 'Scale', 'Rotation', 'Position X', 'Position Y'].map((label) => (
                    <div key={label}>
                      <div className="mb-1 flex justify-between text-[10px] text-slate-400">
                        <span>{label}</span>
                        <span className="text-slate-300">100%</span>
                      </div>
                      <div className="h-1 rounded-full bg-white/10">
                        <div className="h-full w-2/3 rounded-full bg-violet-500" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <Palette className="h-3.5 w-3.5" /> Color
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    'from-slate-700 to-slate-900',
                    'from-amber-500 to-orange-600',
                    'from-blue-500 to-cyan-600',
                    'from-pink-500 to-rose-600',
                  ].map((grad, i) => (
                    <div
                      key={i}
                      className={`aspect-square rounded-md bg-gradient-to-br ${grad}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function TrustedBrands() {
  return (
    <section className="border-y border-white/5 bg-slate-950 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-8 text-center text-sm font-medium uppercase tracking-wider text-slate-500">
          Trusted by creators on every platform
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-60 grayscale transition-opacity hover:opacity-100 hover:grayscale-0">
          {TRUSTED_BRANDS.map((brand) => (
            <div key={brand.name} className="flex items-center gap-2 text-slate-400">
              <brand.icon className="h-6 w-6" />
              <span className="text-lg font-semibold">{brand.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

interface FeaturesSectionProps {
  features: FeatureDTO[];
  activeFeatureTab: string;
  setActiveFeatureTab: (tab: string) => void;
  loading: boolean;
}

function FeaturesSection({
  features,
  activeFeatureTab,
  setActiveFeatureTab,
  loading,
}: FeaturesSectionProps) {
  const filteredFeatures = useMemo<FeatureDTO[]>(() => {
    if (activeFeatureTab === 'all') return features;
    return features.filter((f) => f.category === activeFeatureTab);
  }, [features, activeFeatureTab]);

  return (
    <section className="relative bg-slate-950 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Features"
          badgeIcon={Zap}
          badgeColor="violet"
          title="Everything you need to"
          highlight="create stunning videos"
          description="A full professional editor in your browser. Free. Forever. No hidden costs."
        />

        <div className="mt-12 flex flex-wrap justify-center gap-2">
          {FEATURE_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFeatureTab(tab.id)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${activeFeatureTab === tab.id
                ? 'bg-white text-slate-900 shadow-lg'
                : 'border border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <motion.div
          layout
          className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filteredFeatures.map((feature) => {
              const iconData = ICON_MAP[feature.icon] ?? ICON_MAP.sparkles;
              const IconComponent = iconData.Icon;
              return (
                <motion.div
                  key={feature._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-white/[0.01] p-6 transition-all hover:border-violet-500/30"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-600/0 to-fuchsia-600/0 opacity-0 transition-opacity group-hover:from-violet-600/5 group-hover:to-fuchsia-600/5 group-hover:opacity-100" />
                  <div
                    className={`relative mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 ${iconData.color}`}
                  >
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <h3 className="relative mb-2 text-lg font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="relative text-sm leading-relaxed text-slate-400">
                    {feature.description}
                  </p>
                  <div className="relative mt-4 inline-flex items-center gap-1 text-sm font-medium text-violet-400 opacity-0 transition-opacity group-hover:opacity-100">
                    Learn more <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {filteredFeatures.length === 0 && !loading && (
          <div className="mt-12 text-center text-slate-500">
            <p>No features available in this category.</p>
          </div>
        )}
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="relative overflow-hidden bg-slate-950 py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="How It Works"
          badgeIcon={Rocket}
          badgeColor="blue"
          title="From raw footage to"
          highlight="final cut in minutes"
          description="Four simple steps. No learning curve. No installation."
          titleGradient="from-blue-400 to-cyan-400"
        />

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {HOW_IT_WORKS_STEPS.map((step, idx) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="relative"
            >
              {idx < HOW_IT_WORKS_STEPS.length - 1 && (
                <div className="absolute left-full top-8 hidden h-px w-full bg-gradient-to-r from-violet-500/40 to-transparent lg:block" />
              )}
              <div className="relative rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-600/30">
                    <step.icon className="h-6 w-6" />
                  </div>
                  <span className="text-3xl font-bold text-white/10">{step.step}</span>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">{step.title}</h3>
                <p className="text-sm leading-relaxed text-slate-400">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function EditorPreviewSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 to-slate-900 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 px-4 py-1.5 text-sm font-medium text-fuchsia-300">
              <Sliders className="h-4 w-4" />
              <span>Studio Editor</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
              A timeline that feels{' '}
              <span className="bg-gradient-to-r from-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                like butter
              </span>
            </h2>
            <p className="mt-4 text-lg text-slate-400">
              Drag clips, ripple edits, magnetic snapping, and frame-accurate scrubbing. Our
              timeline is built from scratch for speed and precision.
            </p>

            <div className="mt-8 space-y-4">
              {[
                { icon: Layers, label: 'Unlimited video, audio, and text tracks' },
                { icon: MousePointer2, label: 'Magnetic snapping with frame precision' },
                { icon: RotateCcw, label: 'Unlimited undo/redo history' },
                { icon: Keyboard, label: 'Full keyboard shortcut support' },
                { icon: Zap, label: 'Real-time GPU-accelerated preview' },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="flex items-center gap-3"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <span className="text-slate-300">{item.label}</span>
                </motion.div>
              ))}
            </div>

            <div className="mt-8">
              <Link
                href="/editor/new"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-base font-semibold text-slate-900 transition-all hover:scale-[1.02] hover:bg-slate-100"
              >
                <Play className="h-5 w-5" />
                Open Editor
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-fuchsia-600/20 to-transparent blur-3xl" />
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 shadow-2xl backdrop-blur-sm">
              <div className="border-b border-white/10 bg-slate-950/60 px-4 py-2">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <FileVideo className="h-3.5 w-3.5" />
                  <span>Timeline — project_001.vex</span>
                </div>
              </div>
              <div className="p-4">
                <div className="mb-4 flex items-center gap-2 overflow-x-auto">
                  {EDITOR_TOOLS.map((tool, idx) => (
                    <button
                      key={idx}
                      className="group flex flex-col items-center gap-1 rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
                    >
                      <tool.icon className="h-4 w-4" />
                      <span className="text-[9px]">{tool.label}</span>
                    </button>
                  ))}
                </div>

                <div className="relative aspect-video overflow-hidden rounded-lg bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-900">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="rounded-full bg-black/40 p-4 backdrop-blur-sm">
                      <Play className="h-6 w-6 text-white" fill="currentColor" />
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-1.5">
                  {[0, 1, 2, 3, 4].map((row) => (
                    <div key={row} className="flex items-center gap-2">
                      <div className="w-14 text-[10px] text-slate-500">
                        {row === 0
                          ? 'Video'
                          : row === 1
                            ? 'Overlay'
                            : row === 2
                              ? 'Text'
                              : row === 3
                                ? 'Audio'
                                : 'Music'}
                      </div>
                      <div className="flex flex-1 gap-0.5 overflow-hidden">
                        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                          <div
                            key={i}
                            className={`h-5 rounded-sm ${row === 0
                              ? 'bg-violet-500/70'
                              : row === 1
                                ? 'bg-fuchsia-500/70'
                                : row === 2
                                  ? 'bg-amber-500/70'
                                  : row === 3
                                    ? 'bg-emerald-500/70'
                                    : 'bg-blue-500/70'
                              }`}
                            style={{ flex: (i % 3) + 1 }}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between text-[10px] text-slate-500">
                  <div className="flex items-center gap-3">
                    <Play className="h-3 w-3 text-white" />
                    <span>00:00:42 / 00:02:45</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span>4K</span>
                    <span>60fps</span>
                    <Maximize className="h-3 w-3" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function AIToolsSection() {
  return (
    <section className="relative bg-slate-950 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="AI Tools — Free"
          badgeIcon={Cpu}
          badgeColor="cyan"
          title="Superpowers powered by"
          highlight="AI"
          description="Do in seconds what used to take hours. All AI tools are free, unlimited, and private."
          titleGradient="from-cyan-400 to-blue-400"
        />

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {AI_TOOLS.map((tool, idx) => (
            <motion.div
              key={tool.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-all hover:border-white/20 hover:bg-white/[0.04]"
            >
              <div
                className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${tool.color} shadow-lg`}
              >
                <tool.icon className="h-7 w-7 text-white" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">{tool.title}</h3>
              <p className="text-sm leading-relaxed text-slate-400">{tool.description}</p>
              <div className="mt-4 flex items-center gap-1 text-sm font-medium text-cyan-400">
                <span>Try it free</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function EffectsShowcase() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Effects Library"
          badgeIcon={Sparkles}
          badgeColor="amber"
          title="Hundreds of cinematic"
          highlight="effects and transitions"
          description="From subtle overlays to dramatic transitions. All free, always."
          titleGradient="from-amber-400 to-orange-400"
        />

        <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {EFFECT_CATEGORIES.map((cat, idx) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-center transition-all hover:border-white/20 hover:bg-white/[0.04]"
            >
              <div
                className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${cat.color}`}
              >
                <cat.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-white">{cat.name}</h3>
              <p className="mt-1 text-xs text-slate-500">{cat.count}+ presets</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <Link
            href="/effects"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-base font-semibold text-white transition-all hover:border-white/30 hover:bg-white/10"
          >
            <Grid3x3 className="h-5 w-5" />
            Explore Full Library
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

interface TemplatesShowcaseProps {
  templates: TemplateDTO[];
  loading: boolean;
  activeTemplateCategory: string;
  setActiveTemplateCategory: (cat: string) => void;
}

function TemplatesShowcase({
  templates,
  loading,
  activeTemplateCategory,
  setActiveTemplateCategory,
}: TemplatesShowcaseProps) {
  const templateCategories = useMemo<string[]>(() => {
    const cats = new Set<string>(templates.map((t) => t.category));
    return ['all', ...Array.from(cats)];
  }, [templates]);

  const filteredTemplates = useMemo<TemplateDTO[]>(() => {
    if (activeTemplateCategory === 'all') return templates.slice(0, 8);
    return templates.filter((t) => t.category === activeTemplateCategory).slice(0, 8);
  }, [templates, activeTemplateCategory]);

  return (
    <section className="relative bg-slate-950 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Templates"
          badgeIcon={Layout}
          badgeColor="violet"
          title="Start with a"
          highlight="pro template"
          description="Pick a template, drop your clips, and export. It's that simple."
        />

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {templateCategories.slice(0, 6).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTemplateCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-all ${activeTemplateCategory === cat
                ? 'bg-white text-slate-900'
                : 'border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredTemplates.map((template, idx) => (
            <motion.div
              key={template._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, delay: idx * 0.06 }}
              className="group cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition-all hover:-translate-y-1 hover:border-violet-500/30"
            >
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={template.thumbnail}
                  alt={template.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                {template.isNewProduct && (
                  <div className="absolute left-2 top-2 rounded-md bg-emerald-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                    New
                  </div>
                )}
                <div className="absolute bottom-2 right-2 rounded-md bg-black/70 px-2 py-0.5 text-[10px] text-white backdrop-blur-sm">
                  {formatDuration(template.duration)}
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="rounded-full bg-white/20 p-3 backdrop-blur-sm">
                    <Play className="h-5 w-5 text-white" fill="currentColor" />
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="mb-1 truncate text-sm font-semibold text-white">
                  {template.title}
                </h3>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="capitalize">{template.category}</span>
                  <span className="inline-flex items-center gap-1">
                    <StarIcon className="h-3 w-3 fill-amber-400 text-amber-400" />
                    {template.rating.toFixed(1)}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                  <span>{formatViews(template.downloads)} downloads</span>
                  <span className="rounded-md border border-white/10 px-1.5 py-0.5">
                    {template.aspectRatio}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredTemplates.length === 0 && !loading && (
          <div className="mt-12 text-center text-slate-500">
            <p>No templates in this category yet.</p>
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            href="/templates"
            className="inline-flex items-center gap-2 text-base font-semibold text-violet-400 transition-colors hover:text-violet-300"
          >
            Browse all templates <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

interface RecentProjectsShowcaseProps {
  recentProjects: ProjectDTO[];
  loading: boolean;
}

function RecentProjectsShowcase({ recentProjects, loading }: RecentProjectsShowcaseProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 to-slate-900 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge={`Made with ${APP_NAME}`}
          badgeIcon={TrendingUpIcon}
          badgeColor="pink"
          title="Fresh from the"
          highlight="community"
          description={`Real projects made by real creators using ${APP_NAME}. Zero watermarks.`}
          titleGradient="from-pink-400 to-rose-400"
        />

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {recentProjects.map((project, idx) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, delay: idx * 0.06 }}
              className="group cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition-all hover:-translate-y-1 hover:border-pink-500/30"
            >
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={project.thumbnail || "/images/project-placeholder.png"}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
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
                <h3 className="mb-2 truncate text-sm font-semibold text-white">
                  {project.title}
                </h3>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 overflow-hidden rounded-full bg-slate-700">
                    {project.authorAvatar && (
                      <Image
                        src={project.authorAvatar}
                        alt={project.author}
                        width={24}
                        height={24}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <span className="truncate text-xs text-slate-400">{project.author}</span>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    <Eye className="h-3 w-3" /> {formatViews(project.views)}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <StarIcon className="h-3 w-3" /> {formatViews(project.likes)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {recentProjects.length === 0 && !loading && (
          <div className="mt-12 text-center text-slate-500">
            <p>No recent projects yet. Be the first to create one!</p>
          </div>
        )}
      </div>
    </section>
  );
}


interface StatsSectionProps {
  stats: StatDTO[];
  loading: boolean;
}

function StatsSection({ stats, loading }: StatsSectionProps) {
  const statIcons: Record<string, LucideIcon> = {
    users: Users,
    video: Video,
    star: Star,
    globe: Globe,
    download: Download,
    zap: Zap,
  };

  return (
    <section className="relative border-y border-white/5 bg-slate-950 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, idx) => {
            const IconComp = statIcons[stat.icon] ?? Users;
            return (
              <motion.div
                key={stat._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 text-violet-400">
                  <IconComp className="h-6 w-6" />
                </div>
                <div className="text-3xl font-bold text-white sm:text-4xl">
                  {stat.value.toLocaleString()}
                  <span className="text-violet-400">{stat.suffix}</span>
                </div>
                <div className="mt-1 text-sm text-slate-400">{stat.label}</div>
              </motion.div>
            );
          })}
          {stats.length === 0 && !loading && (
            <div className="col-span-full text-center text-slate-500">
              Statistics will appear here soon.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function FreeForeverBanner() {
  return (
    <section className="relative overflow-hidden bg-slate-950 py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-600/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/60 via-slate-900 to-emerald-950/60 p-10 sm:p-14"
        >
          <div className="mb-6 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-300">
              <Shield className="h-4 w-4" />
              <span>Free Forever. Period.</span>
            </div>
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
            No paywalls. No upgrades.{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              No surprises.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
            We believe creative tools should be accessible to everyone. {APP_NAME} gives you every
            feature, every effect, every export option — completely free. No hidden fees, no locked
            features, no watermarks.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-4 text-left sm:grid-cols-2">
            {FREE_FEATURES.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
                className="flex items-center gap-3"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                  <Check className="h-4 w-4" />
                </div>
                <span className="text-slate-200">{item}</span>
              </motion.div>
            ))}
          </div>

          <div className="mt-10">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02]"
            >
              <Play className="h-5 w-5" />
              Get Started — It&apos;s Free
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

interface TestimonialsSectionProps {
  testimonials: TestimonialDTO[];
  loading: boolean;
}

function TestimonialsSection({ testimonials, loading }: TestimonialsSectionProps) {
  return (
    <section className="relative bg-gradient-to-b from-slate-950 to-slate-900 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Testimonials"
          badgeIcon={Quote}
          badgeColor="amber"
          title="Loved by"
          highlight="creators worldwide"
          description={`Join thousands of YouTubers, vloggers, and filmmakers using ${APP_NAME} daily.`}
          titleGradient="from-amber-400 to-orange-400"
        />

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.slice(0, 6).map((testimonial, idx) => (
            <motion.div
              key={testimonial._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm"
            >
              <div className="mb-4 flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < testimonial.rating
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-600'
                      }`}
                  />
                ))}
              </div>
              <p className="mb-6 text-sm leading-relaxed text-slate-300">
                &ldquo;{testimonial.content}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-700">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{testimonial.name}</div>
                  <div className="text-xs text-slate-500">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {testimonials.length === 0 && !loading && (
          <div className="mt-12 text-center text-slate-500">
            <p>Testimonials coming soon.</p>
          </div>
        )}
      </div>
    </section>
  );
}

interface FAQSectionProps {
  faqs: FAQDTO[];
  loading: boolean;
}

function FAQSection({ faqs, loading }: FAQSectionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  return (
    <section className="relative bg-slate-950 py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="FAQ"
          badgeIcon={Settings}
          badgeColor="blue"
          title="Frequently asked"
          highlight="questions"
          titleGradient="from-blue-400 to-cyan-400"
        />

        <div className="mt-12 space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = activeIndex === idx;
            return (
              <motion.div
                key={faq._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: idx * 0.04 }}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]"
              >
                <button
                  onClick={() => setActiveIndex(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-white/[0.02]"
                >
                  <span className="text-base font-medium text-white">{faq.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 flex-shrink-0 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''
                      }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-white/5 px-6 py-5 text-sm leading-relaxed text-slate-400">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
          {faqs.length === 0 && !loading && (
            <div className="text-center text-slate-500">
              <p>FAQs coming soon.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 to-slate-900 py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Ready to make your{' '}
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
              next viral video?
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
            Start editing in seconds. No downloads. No credit card. No limits. Just open your
            browser and create.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/editor/new"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-violet-600/30 transition-all hover:scale-[1.02]"
            >
              <Play className="h-5 w-5" />
              Launch Editor
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/templates"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:border-white/30 hover:bg-white/10"
            >
              <Layout className="h-5 w-5" />
              Browse Templates
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function NewsletterSection() {
  const [email, setEmail] = useState<string>('');
  const [subscribed, setSubscribed] = useState<boolean>(false);

  const handleSubscribe = () => {
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <section className="relative border-t border-white/5 bg-slate-950 py-16">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-4 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
              <Mail className="h-6 w-6" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white sm:text-3xl">Stay in the loop</h3>
          <p className="mt-3 text-slate-400">
            Get product updates, tutorials, and creator tips. No spam, ever.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 outline-none transition-colors focus:border-violet-500/50 sm:max-w-xs"
            />
            <button
              onClick={handleSubscribe}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-slate-900 transition-all hover:bg-slate-100"
            >
              {subscribed ? (
                <>
                  <Check className="h-4 w-4" /> Subscribed
                </>
              ) : (
                <>
                  Subscribe <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================================================
// HOMEPAGE
// ============================================================================

export default function HomePage() {
  const [featuredProjects, setFeaturedProjects] = useState<ProjectDTO[]>([]);
  const [recentProjects, setRecentProjects] = useState<ProjectDTO[]>([]);
  const [templates, setTemplates] = useState<TemplateDTO[]>([]);
  const [features, setFeatures] = useState<FeatureDTO[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialDTO[]>([]);
  const [faqs, setFaqs] = useState<FAQDTO[]>([]);
  const [stats, setStats] = useState<StatDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeFeatureTab, setActiveFeatureTab] = useState<string>('all');
  const [activeTemplateCategory, setActiveTemplateCategory] = useState<string>('all');

  const currentYear = new Date().getFullYear();

  // Reserved for future use (Featured section)
  void featuredProjects;
  void setFeaturedProjects;

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const [
          featuredRes,
          recentRes,
          templatesRes,
          featuresRes,
          testimonialsRes,
          faqsRes,
          statsRes,
        ] = await Promise.all([
          fetch('/api/projects/featured'),
          fetch('/api/projects/recent'),
          fetch('/api/templates'),
          fetch('/api/features'),
          fetch('/api/testimonials'),
          fetch('/api/faqs'),
          fetch('/api/stats'),
        ]);

        const featuredData = await featuredRes.json();
        const recentData = await recentRes.json();
        const templatesData = await templatesRes.json();
        const featuresData = await featuresRes.json();
        const testimonialsData = await testimonialsRes.json();
        const faqsData = await faqsRes.json();
        const statsData = await statsRes.json();

        if (featuredData.success) setFeaturedProjects(featuredData.data);
        if (recentData.success) setRecentProjects(recentData.data);
        if (templatesData.success) setTemplates(templatesData.data);
        if (featuresData.success) setFeatures(featuresData.data);
        if (testimonialsData.success) setTestimonials(testimonialsData.data);
        if (faqsData.success) setFaqs(faqsData.data);
        if (statsData.success) setStats(statsData.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Navbar />
      <main className="relative bg-slate-950">
        <HeroSection />
        <TrustedBrands />
        <FeaturesSection
          features={features}
          activeFeatureTab={activeFeatureTab}
          setActiveFeatureTab={setActiveFeatureTab}
          loading={loading}
        />
        <HowItWorks />
        <EditorPreviewSection />
        <AIToolsSection />
        <EffectsShowcase />
        <TemplatesShowcase
          templates={templates}
          loading={loading}
          activeTemplateCategory={activeTemplateCategory}
          setActiveTemplateCategory={setActiveTemplateCategory}
        />
        <RecentProjectsShowcase recentProjects={recentProjects} loading={loading} />
        <StatsSection stats={stats} loading={loading} />
        <FreeForeverBanner />
        <TestimonialsSection testimonials={testimonials} loading={loading} />
        <FAQSection faqs={faqs} loading={loading} />
        <CTASection />
        <NewsletterSection />
        <div className="border-t border-white/5 bg-slate-950 py-6 text-center text-xs text-slate-500">
          <p>
            &copy; {currentYear} {APP_NAME}. All rights reserved. Made with passion for creators.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}