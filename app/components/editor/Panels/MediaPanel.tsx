'use client';

import { useState, useMemo, useCallback, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Search, X, Film, Image as ImageIcon, Music, Plus, Loader2 } from 'lucide-react';
import { useEditorStore } from '@/store/editor-store';
import { useToast } from '@/app/components/ui/Toast';
import EmptyPanel from './EmptyPanel';
import type { EditorAsset } from '@/types/editor';

interface MediaPanelProps {
  assets: EditorAsset[];
}

type MediaFilter = 'all' | 'video' | 'image' | 'audio';

const FILTERS: Array<{ id: MediaFilter; label: string; icon: typeof Film }> = [
  { id: 'all', label: 'All', icon: Film },
  { id: 'video', label: 'Videos', icon: Film },
  { id: 'image', label: 'Images', icon: ImageIcon },
  { id: 'audio', label: 'Audio', icon: Music },
];

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

export default function MediaPanel({ assets: initialAssets }: MediaPanelProps) {
  const [assets, setAssets] = useState<EditorAsset[]>(initialAssets);
  const [filter, setFilter] = useState<MediaFilter>('all');
  const [search, setSearch] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const addClip = useEditorStore((s) => s.addClip);
  const tracks = useEditorStore((s) => s.tracks);
  const currentTime = useEditorStore((s) => s.currentTime);

  const { addToast } = useToast();

  const filtered = useMemo(() => {
    let result = assets;
    if (filter !== 'all') result = result.filter((a) => a.type === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((a) => a.name.toLowerCase().includes(q));
    }
    return result;
  }, [assets, filter, search]);

  const handleDragStart = useCallback(
    (e: React.DragEvent<HTMLDivElement>, asset: EditorAsset) => {
      e.dataTransfer.setData('application/x-vexora-asset', JSON.stringify(asset));
      e.dataTransfer.setData('application/x-vexora-asset-type', asset.type);
      e.dataTransfer.effectAllowed = 'copy';
    },
    []
  );

  const handleAddToTimeline = useCallback(
    (asset: EditorAsset) => {
      const targetType =
        asset.type === 'video' ? 'video' : asset.type === 'audio' ? 'audio' : 'overlay';
      const track = tracks.find((t) => t.type === targetType);
      if (!track) {
        addToast({
          type: 'error',
          title: 'No compatible track',
          description: `Add a ${targetType} track first`,
        });
        return;
      }

      const clipId =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? `clip-${crypto.randomUUID()}`
          : `clip-${Math.random().toString(36).slice(2, 11)}`;

      addClip(track.id, {
        id: clipId,
        name: asset.name,
        startTime: currentTime,
        duration: asset.duration ?? 5,
        color:
          asset.type === 'video'
            ? 'from-violet-600 to-violet-700'
            : asset.type === 'audio'
              ? 'from-emerald-600 to-emerald-700'
              : 'from-fuchsia-600 to-fuchsia-700',
        type: asset.type === 'video' ? 'video' : asset.type === 'audio' ? 'audio' : 'image',
        opacity: 100,
        scale: 100,
        rotation: 0,
        assetUrl: asset.url,
        assetId: asset._id,
      });
    },
    [addClip, tracks, currentTime, addToast]
  );

  // ✅ Real file upload
  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      if (fileArray.length === 0) return;

      setIsUploading(true);
      const uploaded: EditorAsset[] = [];

      for (const file of fileArray) {
        try {
          // Determine folder based on type
          let folder = 'uploads';
          let type: 'video' | 'image' | 'audio' = 'image';
          if (file.type.startsWith('video/')) {
            folder = 'videos';
            type = 'video';
          } else if (file.type.startsWith('audio/')) {
            folder = 'audio';
            type = 'audio';
          } else if (file.type.startsWith('image/')) {
            folder = 'images';
            type = 'image';
          }

          const formData = new FormData();
          formData.append('file', file);
          formData.append('folder', folder);
          formData.append('fileName', file.name);

          const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });

          const data = await res.json();

          if (!res.ok || !data.success) {
            addToast({
              type: 'error',
              title: `Failed to upload ${file.name}`,
              description: data.error ?? 'Please try again',
            });
            continue;
          }

          // Save asset record in DB
          const assetRes = await fetch('/api/assets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: file.name,
              url: data.data.url,
              fileId: data.data.fileId,
              thumbnailUrl: data.data.thumbnailUrl,
              type,
              mimeType: file.type,
              size: data.data.size ?? file.size,
              width: data.data.width,
              height: data.data.height,
              duration: data.data.duration,
            }),
          });

          const assetData = await assetRes.json();

          if (assetRes.ok && assetData.success) {
            uploaded.push(assetData.data);
          }
        } catch (err) {
          addToast({
            type: 'error',
            title: `Upload failed: ${file.name}`,
            description: err instanceof Error ? err.message : 'Unknown error',
          });
        }
      }

      if (uploaded.length > 0) {
        setAssets((prev) => [...uploaded, ...prev]);
        addToast({
          type: 'success',
          title: `${uploaded.length} file${uploaded.length > 1 ? 's' : ''} uploaded`,
        });
      }

      setIsUploading(false);
    },
    [addToast]
  );

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      void handleFiles(e.target.files);
      e.target.value = ''; // reset for same file reselect
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="video/*,image/*,audio/*"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Search */}
      <div className="mb-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search assets..."
            className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-8 pr-8 text-xs text-white placeholder-slate-500 outline-none focus:border-violet-500/50"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="mb-3 flex gap-0.5 rounded-lg border border-white/5 bg-white/[0.02] p-0.5">
        {FILTERS.map((f) => {
          const Icon = f.icon;
          return (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`flex flex-1 items-center justify-center gap-1 rounded-md px-1.5 py-1.5 text-[10px] font-semibold transition-colors ${
                filter === f.id
                  ? 'bg-violet-600 text-white'
                  : 'text-slate-500 hover:text-white'
              }`}
            >
              <Icon className="h-3 w-3" />
              <span className="hidden sm:inline">{f.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <EmptyPanel
            message={
              assets.length === 0
                ? 'No media yet. Click Upload to add files.'
                : search
                  ? `No results for "${search}"`
                  : `No ${filter} files found.`
            }
          />
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <AnimatePresence mode="popLayout">
              {filtered.map((asset) => (
                <motion.div
                  key={asset._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  draggable
                  onDragStart={(e) =>
                    handleDragStart(e as unknown as React.DragEvent<HTMLDivElement>, asset)
                  }
                  className="group relative aspect-square cursor-grab overflow-hidden rounded-lg border border-white/5 bg-slate-900 transition-all hover:border-violet-500/40 active:cursor-grabbing"
                >
                  {asset.thumbnailUrl ? (
                    <Image
                      src={asset.thumbnailUrl}
                      alt={asset.name}
                      fill
                      className="object-cover"
                      sizes="128px"
                      draggable={false}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                      {asset.type === 'video' && <Film className="h-6 w-6 text-slate-600" />}
                      {asset.type === 'image' && <ImageIcon className="h-6 w-6 text-slate-600" />}
                      {asset.type === 'audio' && <Music className="h-6 w-6 text-slate-600" />}
                    </div>
                  )}

                  <div className="absolute right-1 top-1 rounded bg-black/70 px-1 py-0.5 text-[8px] font-bold uppercase text-white backdrop-blur-sm">
                    {asset.type}
                  </div>

                  {asset.duration && (
                    <div className="absolute bottom-1 right-1 rounded bg-black/70 px-1 py-0.5 text-[8px] text-white backdrop-blur-sm">
                      {asset.duration.toFixed(0)}s
                    </div>
                  )}

                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/70 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                    <button
                      onClick={() => handleAddToTimeline(asset)}
                      className="flex h-7 items-center gap-1 rounded-md bg-violet-600 px-2 text-[10px] font-semibold text-white hover:bg-violet-500"
                    >
                      <Plus className="h-3 w-3" />
                      Add
                    </button>
                    <div className="px-1 text-center text-[9px] text-white/80">
                      <div className="truncate font-medium">{asset.name}</div>
                      <div className="text-white/50">{formatSize(asset.size)}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Upload button */}
      <div className="mt-3 border-t border-white/5 pt-3">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 px-3 py-2 text-xs font-semibold text-white transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-3.5 w-3.5" />
              Upload Files
            </>
          )}
        </button>
      </div>
    </div>
  );
}