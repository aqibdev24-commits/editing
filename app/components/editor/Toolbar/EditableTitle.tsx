'use client';

import { useState, useRef, useEffect } from 'react';
import { Check, X, Pencil } from 'lucide-react';

interface EditableTitleProps {
  value: string;
  onSave: (newValue: string) => void;
  maxLength?: number;
  className?: string;
}

export default function EditableTitle({
  value,
  onSave,
  maxLength = 100,
  className = '',
}: EditableTitleProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [draft, setDraft] = useState<string>(value);
  const [lastSyncedValue, setLastSyncedValue] = useState<string>(value);
  const inputRef = useRef<HTMLInputElement>(null);

  // ✅ Sync external value during render (not in effect)
  // Only when not editing and value actually changed
  if (!isEditing && value !== lastSyncedValue) {
    setLastSyncedValue(value);
    setDraft(value);
  }

  // Autofocus + select all on edit start
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const startEditing = () => {
    setDraft(value);
    setIsEditing(true);
  };

  const cancel = () => {
    setDraft(value);
    setIsEditing(false);
  };

  const save = () => {
    const trimmed = draft.trim();
    if (trimmed.length === 0) {
      cancel();
      return;
    }
    if (trimmed === value) {
      cancel();
      return;
    }
    onSave(trimmed);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      save();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancel();
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-1">
        <input
          ref={inputRef}
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={save}
          maxLength={maxLength}
          className={`min-w-0 rounded-md border border-violet-500/50 bg-white/5 px-2 py-0.5 text-sm font-semibold text-white outline-none ring-2 ring-violet-500/30 ${className}`}
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            save();
          }}
          className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded text-emerald-400 hover:bg-emerald-500/10"
          aria-label="Save title"
          title="Save"
        >
          <Check className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            cancel();
          }}
          className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded text-slate-400 hover:bg-white/5"
          aria-label="Cancel"
          title="Cancel"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={startEditing}
      title="Click to rename"
      className={`group flex items-center gap-1.5 rounded-md px-1 py-0.5 text-left transition-colors hover:bg-white/5 ${className}`}
    >
      <span className="truncate text-sm font-semibold text-white">{value}</span>
      <Pencil className="h-3 w-3 flex-shrink-0 text-slate-600 opacity-0 transition-opacity group-hover:opacity-100" />
    </button>
  );
}