'use client';

import { useState } from 'react';

interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
}

export default function NumberField({
  label,
  value,
  onChange,
  unit,
  min = -Infinity,
  max = Infinity,
  placeholder = '0',
}: NumberFieldProps) {
  // Internal string state allows empty / "-" while typing
  const [text, setText] = useState<string>(String(value));
  const [lastExternalValue, setLastExternalValue] = useState<number>(value);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  // ✅ Sync external value during render (uses STATE, not ref)
  if (!isFocused && value !== lastExternalValue) {
    setLastExternalValue(value);
    setText(String(value));
  }

  const commit = (rawText: string) => {
    if (rawText.trim() === '' || rawText === '-') {
      setText('');
      return;
    }
    const parsed = parseFloat(rawText);
    if (isNaN(parsed)) {
      setText(String(value));
      return;
    }
    const clamped = Math.max(min, Math.min(max, parsed));
    onChange(clamped);
    setLastExternalValue(clamped);
    setText(String(clamped));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setText(raw);

    const parsed = parseFloat(raw);
    if (!isNaN(parsed) && raw !== '-') {
      const clamped = Math.max(min, Math.min(max, parsed));
      onChange(clamped);
      setLastExternalValue(clamped);
    }
  };

  const handleFocus = () => setIsFocused(true);

  const handleBlur = () => {
    setIsFocused(false);
    commit(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    } else if (e.key === 'Escape') {
      setText(String(value));
      setLastExternalValue(value);
      e.currentTarget.blur();
    }
  };

  return (
    <div>
      <label className="mb-1 block text-[10px] font-medium text-slate-500">
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          inputMode="decimal"
          value={text}
          placeholder={placeholder}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full rounded-md border border-white/10 bg-white/5 px-2 py-1.5 text-[11px] text-white placeholder-slate-600 outline-none transition-colors focus:border-violet-500/50"
        />
        {unit && (
          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-500">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}