'use client';

interface SliderFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  onPointerDown?: () => void;
  onPointerUp?: () => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

export default function SliderField({
  label,
  value,
  onChange,
  onPointerDown,
  onPointerUp,
  min = 0,
  max = 100,
  step = 1,
  unit = '%',
}: SliderFieldProps) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[10px] font-medium text-slate-400">{label}</span>
        <span className="text-[10px] font-semibold text-white tabular-nums">
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        className="w-full accent-violet-500"
      />
    </div>
  );
}