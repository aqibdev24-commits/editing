'use client';

import { useEditorStore } from '@/store/editor-store';
import { computeAnimatedValues, buildFilterString } from '@/lib/animation';
import type { TrackClip } from '@/types/editor';

interface TextRendererProps {
  clip: TrackClip;
}

const FONT_FAMILY_MAP: Record<string, string> = {
  sans: 'ui-sans-serif, system-ui, sans-serif',
  serif: 'ui-serif, Georgia, serif',
  mono: 'ui-monospace, "Courier New", monospace',
};

export default function TextRenderer({ clip }: TextRendererProps) {
  const currentTime = useEditorStore((s) => s.currentTime);
  const localTime = Math.max(0, currentTime - clip.startTime);

  const animated = computeAnimatedValues(clip, localTime);
  const filterCss = buildFilterString(animated);

  const style = clip.textStyle;
  const content = clip.textContent || clip.name;
  const fontSize = animated.fontSize;        // ✅ use animated
  const fontFamily = FONT_FAMILY_MAP[style?.fontFamily ?? 'sans'];
  const fontWeight = style?.fontWeight === 'bold' ? 700 : 400;
  const italic = style?.italic ?? false;
  const color = style?.color ?? '#ffffff';
  const align = style?.align ?? 'center';
  const bgColor = style?.background;
  const bgOpacity = (style?.backgroundOpacity ?? 60) / 100;
  const letterSpacing = animated.letterSpacing;

  return (
    <div
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
      style={{
        opacity: animated.opacity / 100,
        transform: `translate(${animated.x}px, ${animated.y}px) scale(${animated.scale / 100}) rotate(${animated.rotation}deg)`,
        transformOrigin: 'center center',
        filter: filterCss,
      }}
    >
      <div
        className="rounded-lg px-6 py-3"
        style={{
          backgroundColor: bgColor
            ? `${bgColor}${Math.floor(bgOpacity * 255).toString(16).padStart(2, '0')}`
            : 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(4px)',
          textAlign: align,
          maxWidth: '80%',
        }}
      >
        <span
          style={{
            fontFamily,
            fontSize: `${fontSize}px`,
            fontWeight,
            fontStyle: italic ? 'italic' : 'normal',
            color,
            lineHeight: 1.2,
            whiteSpace: 'pre-wrap',
            display: 'block',
            letterSpacing: `${letterSpacing}px`,
          }}
        >
          {content}
        </span>
      </div>
    </div>
  );
}