'use client';

interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  unit?: string;
  min?: number;
  max?: number;
}

export default function NumberField({
  label,
  value,
  onChange,
  unit,
  min,
  max,
}: NumberFieldProps) {
  return (
    <div>
      <label className="mb-1 block text-[10px] font-medium text-slate-500">{label}</label>
      <div className="relative">
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full rounded-md border border-white/10 bg-white/5 px-2 py-1.5 text-[11px] text-white outline-none transition-colors focus:border-violet-500/50"
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