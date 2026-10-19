'use client';

import { motion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

interface SectionHeadingProps {
  badge?: string;
  badgeIcon?: LucideIcon;
  badgeColor?: 'violet' | 'blue' | 'emerald' | 'amber' | 'cyan' | 'pink' | 'fuchsia';
  title: string;
  titleGradient?: string;
  highlight?: string;
  description?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
  children?: ReactNode;
}

const BADGE_COLORS = {
  violet: 'border-violet-500/30 bg-violet-500/10 text-violet-300',
  blue: 'border-blue-500/30 bg-blue-500/10 text-blue-300',
  emerald: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  amber: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  cyan: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300',
  pink: 'border-pink-500/30 bg-pink-500/10 text-pink-300',
  fuchsia: 'border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-300',
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const stagger: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

export default function SectionHeading({
  badge,
  badgeIcon: BadgeIcon,
  badgeColor = 'violet',
  title,
  titleGradient = 'from-violet-400 to-fuchsia-400',
  highlight,
  description,
  align = 'center',
  className = '',
  children,
}: SectionHeadingProps) {
  const alignClass =
    align === 'left' ? 'text-left items-start' : align === 'right' ? 'text-right items-end' : 'text-center items-center';

  const containerClass =
    align === 'center' ? 'mx-auto max-w-3xl' : 'max-w-3xl';

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={stagger}
      className={`flex flex-col ${alignClass} ${containerClass} ${className}`}
    >
      {badge && (
        <motion.div variants={fadeUp} className="mb-4">
          <div
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium ${BADGE_COLORS[badgeColor]}`}
          >
            {BadgeIcon && <BadgeIcon className="h-4 w-4" />}
            <span>{badge}</span>
          </div>
        </motion.div>
      )}

      <motion.h2
        variants={fadeUp}
        className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
      >
        {title}
        {highlight && (
          <>
            {' '}
            <span
              className={`bg-gradient-to-r ${titleGradient} bg-clip-text text-transparent`}
            >
              {highlight}
            </span>
          </>
        )}
      </motion.h2>

      {description && (
        <motion.p
          variants={fadeUp}
          className="mt-4 text-base text-slate-400 sm:text-lg"
        >
          {description}
        </motion.p>
      )}

      {children && (
        <motion.div variants={fadeUp} className="mt-8 w-full">
          {children}
        </motion.div>
      )}
    </motion.div>
  );
}