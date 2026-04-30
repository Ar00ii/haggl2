'use client';

import { motion } from 'framer-motion';
import React from 'react';

import { cn } from '@/lib/utils';

interface AtlasEmptyProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  /** Optional CTA — pass <Link> or <button>. */
  action?: React.ReactNode;
  /** Compact = ~64px icon, regular = ~80px. */
  size?: 'sm' | 'md';
  className?: string;
}

/**
 * AtlasEmpty — the canonical "nothing here yet" surface. Replaces the dozens
 * of one-off empty states each section invented. Animated in with a soft
 * fade+rise, brand-tinted icon plate, optional CTA below the copy.
 */
export function AtlasEmpty({
  icon,
  title,
  description,
  action,
  size = 'md',
  className,
}: AtlasEmptyProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
      className={cn(
        'mx-auto flex flex-col items-center text-center',
        'rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg-card)]/40',
        size === 'sm' ? 'py-8 px-6' : 'py-14 px-8',
        className,
      )}
    >
      {icon && (
        <div
          className={cn(
            'grid place-items-center rounded-xl mb-4 text-[var(--brand)]',
            size === 'sm' ? 'w-12 h-12' : 'w-16 h-16',
          )}
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(20,241,149,0.16), rgba(20,241,149,0.04))',
            border: '1px solid rgba(20,241,149,0.20)',
          }}
        >
          {icon}
        </div>
      )}
      <h3
        className={cn(
          'font-light text-[var(--text)]',
          size === 'sm' ? 'text-[14px]' : 'text-[17px]',
        )}
      >
        {title}
      </h3>
      {description && (
        <p
          className={cn(
            'mt-1.5 text-[var(--text-muted)] font-light max-w-md',
            size === 'sm' ? 'text-[12px]' : 'text-[13px]',
          )}
        >
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </motion.div>
  );
}

export default AtlasEmpty;
