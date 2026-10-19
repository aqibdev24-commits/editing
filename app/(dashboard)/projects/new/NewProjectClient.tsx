'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Video,
  Film,
  Smartphone,
  Square,
  Music,
  GraduationCap,
  Gamepad2,
  Plane,
  Heart,
  Palette,
  Sparkles,
  Wand2,
  Zap,
  Play,
  Loader2,
  AlertCircle,
  Layout,
  FileVideo,
} from 'lucide-react';
import { APP_NAME } from '@/lib/constants';
import {   FaYoutube as Youtube,
  FaInstagram as Instagram, } from 'react-icons/fa';


// ============================================================================
// TYPES
// ============================================================================

interface User {
  name: string;
  email: string;
  image?: string;
}

interface NewProjectClientProps {
  user: User;
}

interface FormData {
  title: string;
  description: string;
  category: string;
  aspectRatio: string;
  resolution: string;
  fps: number;
  template: string;
}

type Step = 1 | 2 | 3;

// ============================================================================
// CONFIG
// ============================================================================

const CATEGORIES = [
  { id: 'youtube', label: 'YouTube Video', icon: Youtube, color: 'from-red-500 to-rose-600' },
  { id: 'reels', label: 'Reels & Shorts', icon: Instagram, color: 'from-pink-500 to-fuchsia-600' },
  { id: 'cinematic', label: 'Cinematic', icon: Film, color: 'from-violet-500 to-purple-600' },
  { id: 'vlog', label: 'Vlog', icon: Video, color: 'from-blue-500 to-cyan-600' },
  { id: 'tutorial', label: 'Tutorial', icon: GraduationCap, color: 'from-emerald-500 to-teal-600' },
  { id: 'gaming', label: 'Gaming', icon: Gamepad2, color: 'from-orange-500 to-amber-600' },
  { id: 'travel', label: 'Travel', icon: Plane, color: 'from-sky-500 to-blue-600' },
  { id: 'wedding', label: 'Wedding', icon: Heart, color: 'from-rose-500 to-pink-600' },
  { id: 'music', label: 'Music Video', icon: Music, color: 'from-indigo-500 to-violet-600' },
];

const ASPECT_RATIOS = [
  { id: '16:9', label: 'Landscape 16:9', icon: Video, description: 'YouTube, TV' },
  { id: '9:16', label: 'Portrait 9:16', icon: Smartphone, description: 'Reels, Shorts, TikTok' },
  { id: '1:1', label: 'Square 1:1', icon: Square, description: 'Instagram feed' },
  { id: '4:5', label: 'Portrait 4:5', icon: Smartphone, description: 'Instagram post' },
  { id: '21:9', label: 'Cinema 21:9', icon: Film, description: 'Widescreen film' },
];

const RESOLUTIONS = [
  { id: '720p', label: '720p HD', width: 1280, height: 720, description: 'Faster render, smaller files' },
  { id: '1080p', label: '1080p Full HD', width: 1920, height: 1080, description: 'Best for most platforms' },
  { id: '2K', label: '2K QHD', width: 2560, height: 1440, description: 'Sharper on large screens' },
  { id: '4K', label: '4K Ultra HD', width: 3840, height: 2160, description: 'Cinema quality (larger files)' },
];

const TEMPLATES = [
  { id: 'blank', label: 'Blank Canvas', icon: Palette, description: 'Start from scratch', color: 'from-slate-600 to-slate-700' },
  { id: 'youtube-intro', label: 'YouTube Intro', icon: Youtube, description: '10-second branded intro', color: 'from-red-500 to-rose-600' },
  { id: 'product-promo', label: 'Product Promo', icon: Sparkles, description: '30-second ad template', color: 'from-violet-500 to-fuchsia-600' },
  { id: 'social-story', label: 'Social Story', icon: Instagram, description: 'Vertical story template', color: 'from-pink-500 to-fuchsia-600' },
  { id: 'tutorial', label: 'Tutorial', icon: GraduationCap, description: 'Screen recording + voiceover', color: 'from-emerald-500 to-teal-600' },
  { id: 'ai-generated', label: 'AI Generated', icon: Wand2, description: 'Describe it and let AI build', color: 'from-cyan-500 to-blue-600' },
];

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
};

const stagger: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function NewProjectClient({ user }: NewProjectClientProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const [form, setForm] = useState<FormData>({
    title: '',
    description: '',
    category: 'youtube',
    aspectRatio: '16:9',
    resolution: '1080p',
    fps: 30,
    template: 'blank',
  });

  const updateForm = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const canProceedFromStep1 = (): boolean => {
    return form.title.trim().length >= 2;
  };

  const canProceedFromStep2 = (): boolean => {
    return form.category !== '' && form.aspectRatio !== '' && form.resolution !== '';
  };

  const handleNext = () => {
    if (step === 1 && !canProceedFromStep1()) {
      setError('Please enter a project title (at least 2 characters).');
      return;
    }
    if (step === 2 && !canProceedFromStep2()) {
      setError('Please select all project settings.');
      return;
    }
    setError('');
    setStep((s) => (s < 3 ? ((s + 1) as Step) : s));
  };

  const handleBack = () => {
    setError('');
    setStep((s) => (s > 1 ? ((s - 1) as Step) : s));
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim(),
          category: form.category,
          resolution: form.resolution,
          tags: [`aspect-${form.aspectRatio}`, `${form.fps}fps`],
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error ?? 'Failed to create project. Please try again.');
        setLoading(false);
        return;
      }

      router.push(`/editor/${data.data._id}`);
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const steps = [
    { id: 1, label: 'Basics' },
    { id: 2, label: 'Settings' },
    { id: 3, label: 'Template' },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back link */}
      <Link
        href="/projects"
        className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Projects
      </Link>

      {/* Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="mb-8 text-center"
      >
        <motion.div variants={fadeUp} className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-300">
          <Sparkles className="h-4 w-4" />
          <span>New Project</span>
        </motion.div>
        <motion.h1 variants={fadeUp} className="text-3xl font-bold text-white sm:text-4xl">
          Create your next{' '}
          <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
            masterpiece
          </span>
        </motion.h1>
        <motion.p variants={fadeUp} className="mx-auto mt-3 max-w-lg text-sm text-slate-400">
          Hi {user.name.split(' ')[0]}! Let&apos;s set up your new project in just a few steps.
        </motion.p>
      </motion.div>

      {/* Stepper */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8 flex items-center justify-center gap-2 sm:gap-4"
      >
        {steps.map((s, idx) => {
          const isActive = step === s.id;
          const isCompleted = step > s.id;
          return (
            <div key={s.id} className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-all ${
                    isCompleted
                      ? 'bg-emerald-500 text-white'
                      : isActive
                        ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-600/30'
                        : 'border border-white/10 bg-white/5 text-slate-400'
                  }`}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : s.id}
                </div>
                <span
                  className={`hidden text-sm font-medium sm:block ${
                    isActive ? 'text-white' : 'text-slate-400'
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={`h-px w-8 transition-colors sm:w-16 ${
                    step > s.id ? 'bg-emerald-500' : 'bg-white/10'
                  }`}
                />
              )}
            </div>
          );
        })}
      </motion.div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Steps content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-8"
      >
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <StepBasics form={form} updateForm={updateForm} />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <StepSettings form={form} updateForm={updateForm} />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <StepTemplate form={form} updateForm={updateForm} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Navigation */}
      <div className="mt-6 flex items-center justify-between gap-4">
        <button
          onClick={handleBack}
          disabled={step === 1}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition-all hover:border-white/20 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        {step < 3 ? (
          <button
            onClick={handleNext}
            className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/30 transition-all hover:scale-[1.02]"
          >
            Continue
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/30 transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Create & Open Editor
              </>
            )}
          </button>
        )}
      </div>

      {/* Free badge */}
      <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-500">
        <Zap className="h-3.5 w-3.5 text-emerald-400" />
        <span>
          {APP_NAME} is 100% free — no watermarks, no limits, no credit card
        </span>
      </div>
    </div>
  );
}

// ============================================================================
// STEP 1: BASICS
// ============================================================================

interface StepProps {
  form: FormData;
  updateForm: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
}

function StepBasics({ form, updateForm }: StepProps) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">Project Basics</h2>
        <p className="mt-1 text-sm text-slate-400">
          Give your project a name and description. You can change this later.
        </p>
      </div>

      <div className="space-y-5">
        {/* Title */}
        <div>
          <label htmlFor="title" className="mb-2 block text-sm font-medium text-slate-300">
            Project Title <span className="text-red-400">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={form.title}
            onChange={(e) => updateForm('title', e.target.value)}
            placeholder="e.g., Summer Travel Vlog 2026"
            autoFocus
            maxLength={100}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-colors focus:border-violet-500/50 focus:bg-white/[0.07]"
          />
          <div className="mt-1.5 flex justify-between text-xs text-slate-500">
            <span>Choose something memorable</span>
            <span>{form.title.length}/100</span>
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="mb-2 block text-sm font-medium text-slate-300">
            Description <span className="text-slate-500">(optional)</span>
          </label>
          <textarea
            id="description"
            value={form.description}
            onChange={(e) => updateForm('description', e.target.value)}
            placeholder="A short description of your project..."
            rows={4}
            maxLength={500}
            className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-colors focus:border-violet-500/50 focus:bg-white/[0.07]"
          />
          <div className="mt-1.5 flex justify-between text-xs text-slate-500">
            <span>Helps you organize later</span>
            <span>{form.description.length}/500</span>
          </div>
        </div>

        {/* Preview card */}
        {form.title && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-4"
          >
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-violet-300">
              <Layout className="h-3.5 w-3.5" />
              Preview
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600/30 to-fuchsia-600/30">
                <FileVideo className="h-5 w-5 text-violet-300" />
              </div>
              <div className="min-w-0">
                <div className="truncate font-semibold text-white">{form.title}</div>
                {form.description && (
                  <div className="mt-0.5 line-clamp-2 text-xs text-slate-400">
                    {form.description}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// STEP 2: SETTINGS
// ============================================================================

function StepSettings({ form, updateForm }: StepProps) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">Project Settings</h2>
        <p className="mt-1 text-sm text-slate-400">
          Choose the format that fits your content and platform.
        </p>
      </div>

      {/* Category */}
      <div className="mb-8">
        <label className="mb-3 block text-sm font-medium text-slate-300">
          Category <span className="text-red-400">*</span>
        </label>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {CATEGORIES.map((cat) => {
            const isActive = form.category === cat.id;
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => updateForm('category', cat.id)}
                className={`group relative overflow-hidden rounded-xl border p-3 text-left transition-all ${
                  isActive
                    ? 'border-violet-500/50 bg-violet-500/10'
                    : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
                }`}
              >
                <div
                  className={`mb-2 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${cat.color}`}
                >
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <div className="text-sm font-medium text-white">{cat.label}</div>
                {isActive && (
                  <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-violet-500">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Aspect Ratio */}
      <div className="mb-8">
        <label className="mb-3 block text-sm font-medium text-slate-300">
          Aspect Ratio <span className="text-red-400">*</span>
        </label>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
          {ASPECT_RATIOS.map((ar) => {
            const isActive = form.aspectRatio === ar.id;
            const Icon = ar.icon;
            return (
              <button
                key={ar.id}
                onClick={() => updateForm('aspectRatio', ar.id)}
                className={`rounded-xl border p-3 text-center transition-all ${
                  isActive
                    ? 'border-violet-500/50 bg-violet-500/10'
                    : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
                }`}
              >
                <div className="mb-2 flex justify-center">
                  <Icon
                    className={`h-6 w-6 ${
                      isActive ? 'text-violet-400' : 'text-slate-500'
                    }`}
                  />
                </div>
                <div className="text-xs font-bold text-white">{ar.id}</div>
                <div className="mt-0.5 text-[10px] leading-tight text-slate-500">
                  {ar.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Resolution */}
      <div className="mb-8">
        <label className="mb-3 block text-sm font-medium text-slate-300">
          Resolution <span className="text-red-400">*</span>
        </label>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {RESOLUTIONS.map((res) => {
            const isActive = form.resolution === res.id;
            return (
              <button
                key={res.id}
                onClick={() => updateForm('resolution', res.id)}
                className={`rounded-xl border p-3 text-center transition-all ${
                  isActive
                    ? 'border-violet-500/50 bg-violet-500/10'
                    : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
                }`}
              >
                <div className="text-sm font-bold text-white">{res.id}</div>
                <div className="mt-0.5 text-[10px] text-slate-500">
                  {res.width}×{res.height}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* FPS */}
      <div>
        <label className="mb-3 block text-sm font-medium text-slate-300">
          Frame Rate
        </label>
        <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
          {[24, 30, 60, 120].map((fps) => (
            <button
              key={fps}
              onClick={() => updateForm('fps', fps)}
              className={`rounded-xl border p-3 text-center transition-all ${
                form.fps === fps
                  ? 'border-violet-500/50 bg-violet-500/10'
                  : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
              }`}
            >
              <div className="text-sm font-bold text-white">{fps}</div>
              <div className="mt-0.5 text-[10px] text-slate-500">fps</div>
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-slate-500">
          24fps = cinematic · 30fps = standard · 60fps = smooth · 120fps = ultra slow-mo
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// STEP 3: TEMPLATE
// ============================================================================

function StepTemplate({ form, updateForm }: StepProps) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">Choose a Template</h2>
        <p className="mt-1 text-sm text-slate-400">
          Start with a blank canvas or pick a template to speed things up.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {TEMPLATES.map((template) => {
          const isActive = form.template === template.id;
          const Icon = template.icon;
          return (
            <button
              key={template.id}
              onClick={() => updateForm('template', template.id)}
              className={`group relative overflow-hidden rounded-2xl border p-4 text-left transition-all ${
                isActive
                  ? 'border-violet-500/50 bg-violet-500/10'
                  : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${template.color}`}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-white">{template.label}</h3>
                    {template.id === 'ai-generated' && (
                      <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cyan-300">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">{template.description}</p>
                </div>
                {isActive && (
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-violet-500">
                    <Check className="h-3.5 w-3.5 text-white" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-8 rounded-2xl border border-white/5 bg-white/[0.02] p-5">
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
          <Sparkles className="h-3.5 w-3.5" />
          Project Summary
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
          <SummaryItem label="Title" value={form.title || '—'} />
          <SummaryItem
            label="Category"
            value={CATEGORIES.find((c) => c.id === form.category)?.label ?? '—'}
          />
          <SummaryItem label="Aspect" value={form.aspectRatio} />
          <SummaryItem label="Quality" value={`${form.resolution} · ${form.fps}fps`} />
        </div>
      </div>

      {/* Hint */}
      <div className="mt-6 flex items-start gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-xs text-emerald-300">
        <Zap className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
        <span>
          Everything is free. 4K export, AI tools, effects — all included, no watermark, no
          credit card needed.
        </span>
      </div>
    </div>
  );
}

interface SummaryItemProps {
  label: string;
  value: string;
}

function SummaryItem({ label, value }: SummaryItemProps) {
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </div>
      <div className="mt-0.5 truncate text-sm font-medium text-white">{value}</div>
    </div>
  );
}