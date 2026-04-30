'use client';

import React from 'react';

import { cn } from '@/lib/utils';

type BadgeTone = 'neutral' | 'brand' | 'success' | 'warn' | 'error' | 'info' | 'mono';
type BadgeSize = 'sm' | 'md';

interface AtlasBadgeProps {
  tone?: BadgeTone;
  size?: BadgeSize;
  /** Outline style (transparent fill). */
  outline?: boolean;
  /** Show a leading dot. */
  dot?: boolean;
  className?: string;
  children: React.ReactNode;
}

const toneStyle: Record<BadgeTone, { bg: string; fg: string; bd: string }> = {
  neutral: {
    bg: 'rgba(255,255,255,0.04)',
    fg: 'var(--text-secondary)',
    bd: 'var(--border)',
  },
  brand: {
    bg: 'rgba(20,241,149,0.10)',
    fg: 'var(--brand)',
    bd: 'rgba(20,241,149,0.32)',
  },
  success: {
    bg: 'rgba(34,197,94,0.10)',
    fg: '#22c55e',
    bd: 'rgba(34,197,94,0.32)',
  },
  warn: {
    bg: 'rgba(245,158,11,0.10)',
    fg: '#f59e0b',
    bd: 'rgba(245,158,11,0.30)',
  },
  error: {
    bg: 'rgba(239,68,68,0.10)',
    fg: '#ef4444',
    bd: 'rgba(239,68,68,0.32)',
  },
  info: {
    bg: 'rgba(56,189,248,0.10)',
    fg: '#38bdf8',
    bd: 'rgba(56,189,248,0.32)',
  },
  mono: {
    bg: 'var(--bg-card2)',
    fg: 'var(--text)',
    bd: 'var(--border)',
  },
};

/**
 * AtlasBadge — pill / status chip. Replaces the dozens of one-off span
 * chains using `bg-emerald-500/10 text-emerald-400 border-emerald-500/30`.
 */
export function AtlasBadge({
  tone = 'neutral',
  size = 'sm',
  outline = false,
  dot = false,
  className,
  children,
}: AtlasBadgeProps) {
  const t = toneStyle[tone];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium whitespace-nowrap',
        size === 'sm' ? 'h-5 px-2 text-[10.5px]' : 'h-6 px-2.5 text-[11.5px]',
        className,
      )}
      style={{
        background: outline ? 'transparent' : t.bg,
        color: t.fg,
        border: `1px solid ${t.bd}`,
      }}
    >
      {dot && (
        <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: t.fg }} />
      )}
      {children}
    </span>
  );
}

export default AtlasBadge;
