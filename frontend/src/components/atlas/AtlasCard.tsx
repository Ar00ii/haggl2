'use client';

import { motion, type HTMLMotionProps } from 'framer-motion';
import React from 'react';

import { cn } from '@/lib/utils';

type Variant = 'default' | 'elevated' | 'outline' | 'ghost';
type Tone = 'neutral' | 'brand' | 'success' | 'warn' | 'error';

interface AtlasCardProps extends Omit<HTMLMotionProps<'div'>, 'ref'> {
  variant?: Variant;
  tone?: Tone;
  /** Show animated brand-coloured glow on hover. */
  hoverGlow?: boolean;
  /** Lift card 2px on hover. */
  hoverLift?: boolean;
  /** Gradient hairline along the top edge. */
  topAccent?: boolean;
  /** Add a soft inner highlight gradient (top-left). */
  innerGradient?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const variantClass: Record<Variant, string> = {
  default: 'bg-[var(--bg-card)] border border-[var(--border)] shadow-[var(--shadow-card)]',
  elevated: 'bg-[var(--bg-elevated)] border border-[var(--border)] shadow-[var(--shadow-md)]',
  outline: 'bg-transparent border border-[var(--border)]',
  ghost: 'bg-[var(--bg-card2)] border border-transparent',
};

const toneAccent: Record<Tone, string> = {
  neutral: 'rgba(255,255,255,0.08)',
  brand: 'var(--brand)',
  success: 'var(--success)',
  warn: 'var(--warning)',
  error: 'var(--error)',
};

/**
 * AtlasCard — the canonical surface for any boxed content.
 * Replaces the dozens of bespoke `bg-zinc-900 border-white/10 …` chains
 * scattered across the app. Token-driven so light+dark mode "just work".
 */
export function AtlasCard({
  variant = 'default',
  tone = 'neutral',
  hoverGlow = false,
  hoverLift = false,
  topAccent = false,
  innerGradient = false,
  className,
  children,
  ...rest
}: AtlasCardProps) {
  const accent = toneAccent[tone];
  return (
    <motion.div
      whileHover={hoverLift ? { y: -2 } : undefined}
      transition={{ duration: 0.2, ease: [0.22, 0.61, 0.36, 1] }}
      className={cn(
        'group relative overflow-hidden rounded-2xl transition-all duration-200',
        variantClass[variant],
        hoverGlow && 'hover:border-[var(--border-hover)] hover:shadow-[var(--shadow-card-hover)]',
        className,
      )}
      {...rest}
    >
      {topAccent && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${accent} 50%, transparent 100%)`,
            opacity: 0.6,
          }}
        />
      )}
      {innerGradient && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            background: `radial-gradient(ellipse 60% 60% at 0% 0%, ${accent}1A, transparent 60%)`,
          }}
        />
      )}
      <div className="relative">{children}</div>
    </motion.div>
  );
}

export default AtlasCard;
