'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Download,
  Play,
  Film,
  CheckCircle2,
  AlertCircle,
  Upload,
} from 'lucide-react';
import { useToast } from '@/app/components/ui/Toast';
import ExportSettings from '@/app/components/export/ExportSettings';
import ExportProgress from '@/app/components/export/ExportProgress';
import { useCanvasRecorder } from '@/hooks/useCanvasRecorder';
import {
  downloadBlob,
  FORMAT_EXTENSION_MAP,
  formatBytes,
} from '@/lib/export-utils';
import type {
  // ExportFormat,
  // ExportQuality,
  ExportSettings as ExportSettingsType,
} from '@/types/export';

interface ProjectDTO {
  _id: string;
  title: string;
  duration: number;
  resolution: string;
  category: string;
}

interface User {
  name: string;
  email: string;
  image?: string;
}

interface ExportClientProps {
  project: ProjectDTO;
  user: User;
}

type Status = 'idle' | 'recording' | 'done' | 'error';

export default function ExportClient({ project, user }: ExportClientProps) {
  const [settings, setSettings] = useState<ExportSettingsType>({
    format: 'mp4',
    resolution: (project.resolution as ExportSettingsType['resolution']) ?? '1080p',
    quality: 'high',
    fps: 30,
    includeAudio: true,
  });

  const [status, setStatus] = useState<Status>('idle');
  const [exportedBlob, setExportedBlob] = useState<Blob | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { addToast } = useToast();

  const recorder = useCanvasRecorder({
    format: settings.format,
    quality: settings.quality,
    fps: settings.fps,
    includeAudio: settings.includeAudio,
  });

  // Derived status — no setState in effect needed
  const isCompleted =
    status === 'recording' && recorder.progress >= 100 && !recorder.isRecording;
  const displayStatus: Status = isCompleted ? 'done' : status;

  // Draw project preview onto canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set dimensions based on settings
    const dimensions = {
      '720p': [1280, 720],
      '1080p': [1920, 1080],
      '2K': [2560, 1440],
      '4K': [3840, 2160],
    }[settings.resolution] as [number, number] | undefined;

    canvas.width = dimensions?.[0] ?? 1920;
    canvas.height = dimensions?.[1] ?? 1080;

    // Draw placeholder gradient + project title
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#4c1d95');
    gradient.addColorStop(0.5, '#1e1b4b');
    gradient.addColorStop(1, '#701a75');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = `bold ${canvas.width / 20}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(project.title, canvas.width / 2, canvas.height / 2);
  }, [settings.resolution, project.title]);

  const handleStartExport = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setStatus('recording');

    const duration = project.duration || 10;

    try {
      await recorder.start(canvas, duration);
    } catch (error) {
      setStatus('error');
      addToast({
        type: 'error',
        title: 'Export failed',
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }, [recorder, project.duration, addToast]);

  // Watch recorder state transitions
  // useEffect(() => {
  //   if (status === 'recording' && recorder.progress >= 100 && !recorder.isRecording) {
  //     setStatus('done');
  //   }
  // }, [status, recorder.progress, recorder.isRecording]);

  const handleStopAndDownload = useCallback(async () => {
    const blob = await recorder.stop();
    if (!blob) {
      addToast({ type: 'error', title: 'Nothing to download' });
      return;
    }

    setExportedBlob(blob);
    setStatus('done');

    // Save record to DB
    try {
      await fetch('/api/exports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: project._id,
          format: settings.format,
          resolution: settings.resolution,
          quality: settings.quality,
          fps: settings.fps,
          size: blob.size,
          duration: project.duration,
          status: 'completed',
        }),
      });
    } catch (err) {
      console.error('Failed to save export record', err);
    }

    addToast({
      type: 'success',
      title: 'Export complete!',
      description: `File size: ${formatBytes(blob.size)}`,
    });
  }, [recorder, settings, project._id, project.duration, addToast]);

  const handleDownload = useCallback(() => {

    
    if (!exportedBlob) return;
    const ext = FORMAT_EXTENSION_MAP[settings.format];
    const filename = `${project.title.replace(/[^a-zA-Z0-9-_]/g, '_')}.${ext}`;
    downloadBlob(exportedBlob, filename);
    addToast({ type: 'success', title: 'Download started' });
  }, [exportedBlob, settings.format, project.title, addToast]);

  const handleCancel = useCallback(async () => {
    await recorder.stop();
    setStatus('idle');
    addToast({ type: 'info', title: 'Export cancelled' });
  }, [recorder, addToast]);

  const handleReset = useCallback(() => {
    setStatus('idle');
    setExportedBlob(null);
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back link */}
      <Link
        href={`/editor/${project._id}`}
        className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Editor
      </Link>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-300">
          <Download className="h-4 w-4" />
          <span>Export</span>
        </div>
        <h1 className="text-3xl font-bold text-white sm:text-4xl">
          Export your{' '}
          <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
            masterpiece
          </span>
        </h1>
        <p className="mt-2 text-slate-400">
          Choose your settings and render the final video. Free, no watermark.
        </p>
      </motion.div>

      {/* Main grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_400px]"
      >
        {/* Left: Preview + Progress */}
        <div className="space-y-6">
          {/* Preview */}
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/50">
            <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
              <Film className="h-3.5 w-3.5 text-violet-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Preview
              </span>
              <span className="ml-auto rounded-md bg-violet-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-violet-300">
                {settings.resolution}
              </span>
            </div>
            <div className="aspect-video bg-black">
              <canvas
                ref={canvasRef}
                className="h-full w-full"
              />
            </div>
          </div>

          {/* Progress */}
          <ExportProgress
            progress={recorder.progress}
            elapsed={recorder.elapsed}
            totalDuration={project.duration || 10}
            status={displayStatus}
            error={recorder.error}
            onCancel={handleCancel}
          />

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3">
            {displayStatus === 'idle' && (
              <button
                onClick={handleStartExport}
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/30 transition-all hover:scale-[1.02]"
              >
                <Play className="h-4 w-4" />
                Start Export
              </button>
            )}

            {displayStatus === 'recording' && (
              <button
                onClick={handleStopAndDownload}
                className="inline-flex items-center gap-2 rounded-xl border border-violet-500/40 bg-violet-500/10 px-6 py-3 text-sm font-semibold text-violet-300 transition-all hover:bg-violet-500/20"
              >
                Stop Early
              </button>
            )}

            {displayStatus === 'done' && (
              <>
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02]"
                >
                  <Download className="h-4 w-4" />
                  Download
                </button>
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-all hover:border-white/20 hover:bg-white/10"
                >
                  Export Again
                </button>
              </>
            )}

            {displayStatus === 'error' && (
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-all hover:border-white/20 hover:bg-white/10"
              >
                Try Again
              </button>
            )}

            <Link
              href={`/editor/${project._id}`}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-all hover:border-white/20 hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Editor
            </Link>
          </div>
        </div>

        {/* Right: Settings */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-5">
          <div className="mb-4 flex items-center gap-2">
            <Film className="h-3.5 w-3.5 text-violet-400" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Export Settings
            </h2>
          </div>

          <ExportSettings
            settings={settings}
            onChange={setSettings}
            duration={project.duration || 10}
          />
        </div>
      </motion.div>

      {/* Info cards */}
      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <InfoCard
          icon={CheckCircle2}
          title="No watermarks"
          description="Export clean, unbranded video files"
          color="text-emerald-400"
        />
        <InfoCard
          icon={Upload}
          title="100% free"
          description="No credit card, no signup required"
          color="text-violet-400"
        />
        <InfoCard
          icon={AlertCircle}
          title="Local rendering"
          description="Renders in your browser — private"
          color="text-blue-400"
        />
      </div>

      {/* Footer */}
      <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-500">
        <span>Exported as {user.name}</span>
      </div>
    </div>
  );
}

interface InfoCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  color: string;
}

function InfoCard({ icon: Icon, title, description, color }: InfoCardProps) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
      <Icon className={`mb-2 h-4 w-4 ${color}`} />
      <div className="text-sm font-semibold text-white">{title}</div>
      <div className="mt-0.5 text-[11px] text-slate-500">{description}</div>
    </div>
  );
}