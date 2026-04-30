'use client';

import { motion } from 'framer-motion';
import React from 'react';

import { cn } from '@/lib/utils';

export interface AtlasTab {
  value: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  /** Optional count badge to the right of the label. */
  count?: number | string;
  disabled?: boolean;
}

interface AtlasTabsProps {
  tabs: AtlasTab[];
  value: string;
  onChange: (v: string) => void;
  className?: string;
  /** "underline" (default), "pill" rounded chips, "segment" iOS-style. */
  variant?: 'underline' | 'pill' | 'segment';
  /** Stretches the tab strip across full width. */
  fullWidth?: boolean;
}

const layoutId = (variant: string) => `atlas-tabs-indicator-${variant}`;

/**
 * AtlasTabs — single-source tab strip with three visual modes. The active
 * indicator is animated with framer-motion's shared `layoutId`, giving a
 * smooth glide between tabs (the same trick Linear/Vercel use).
 */
export function AtlasTabs({
  tabs,
  value,
  onChange,
  className,
  variant = 'underline',
  fullWidth = false,
}: AtlasTabsProps) {
  const groupId = React.useId();

  if (variant === 'pill') {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-1 p-1 rounded-xl bg-[var(--bg-card2)] border border-[var(--border)]',
          fullWidth && 'w-full',
          className,
        )}
        role="tablist"
      >
        {tabs.map((t) => {
          const active = t.value === value;
          return (
            <button
              key={t.value}
              role="tab"
              aria-selected={active}
              disabled={t.disabled}
              onClick={() => onChange(t.value)}
              className={cn(
                'relative flex-1 inline-flex items-center justify-center gap-2 px-3 h-8 rounded-lg text-[12.5px] font-medium transition-colors',
                active
                  ? 'text-[var(--text)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text)]',
                t.disabled && 'opacity-50 cursor-not-allowed',
              )}
            >
              {active && (
                <motion.span
                  layoutId={`${layoutId('pill')}-${groupId}`}
                  className="absolute inset-0 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] shadow-[var(--shadow-sm)]"
                  transition={{ duration: 0.2, ease: [0.22, 0.61, 0.36, 1] }}
                />
              )}
              <span className="relative z-10 inline-flex items-center gap-1.5">
                {t.icon}
                {t.label}
                {t.count != null && (
                  <span
                    className={cn(
                      'inline-flex h-4 min-w-[18px] px-1 items-center justify-center rounded text-[10px] font-mono',
                      active
                        ? 'bg-[var(--brand)]/15 text-[var(--brand)]'
                        : 'bg-[var(--bg-elevated)] text-[var(--text-muted)]',
                    )}
                  >
                    {t.count}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  if (variant === 'segment') {
    return (
      <div
        className={cn(
          'inline-flex items-stretch p-0.5 rounded-lg bg-[var(--bg-card2)] border border-[var(--border)]',
          fullWidth && 'w-full',
          className,
        )}
        role="tablist"
      >
        {tabs.map((t) => {
          const active = t.value === value;
          return (
            <button
              key={t.value}
              role="tab"
              aria-selected={active}
              disabled={t.disabled}
              onClick={() => onChange(t.value)}
              className={cn(
                'relative flex-1 inline-flex items-center justify-center gap-1.5 px-3 h-7 rounded-md text-[11.5px] font-medium transition-colors',
                active
                  ? 'text-[var(--text)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text)]',
                t.disabled && 'opacity-50 cursor-not-allowed',
              )}
            >
              {active && (
                <motion.span
                  layoutId={`${layoutId('segment')}-${groupId}`}
                  className="absolute inset-0 rounded-md bg-[var(--bg-card)] shadow-[var(--shadow-sm)]"
                  transition={{ duration: 0.18, ease: [0.22, 0.61, 0.36, 1] }}
                />
              )}
              <span className="relative z-10 inline-flex items-center gap-1.5">
                {t.icon}
                {t.label}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  // underline (default)
  return (
    <div
      className={cn(
        'flex items-center gap-1 border-b border-[var(--border)] overflow-x-auto',
        fullWidth && 'w-full',
        className,
      )}
      role="tablist"
    >
      {tabs.map((t) => {
        const active = t.value === value;
        return (
          <button
            key={t.value}
            role="tab"
            aria-selected={active}
            disabled={t.disabled}
            onClick={() => onChange(t.value)}
            className={cn(
              'relative inline-flex items-center gap-2 px-3.5 h-10 text-[13px] font-medium transition-colors whitespace-nowrap',
              active
                ? 'text-[var(--text)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]',
              t.disabled && 'opacity-50 cursor-not-allowed',
            )}
          >
            {t.icon}
            {t.label}
            {t.count != null && (
              <span className="inline-flex h-4 min-w-[18px] px-1 items-center justify-center rounded bg-[var(--bg-card2)] text-[10px] font-mono text-[var(--text-muted)]">
                {t.count}
              </span>
            )}
            {active && (
              <motion.span
                layoutId={`${layoutId('underline')}-${groupId}`}
                className="absolute -bottom-px inset-x-2 h-[2px] rounded-full bg-[var(--brand)]"
                transition={{ duration: 0.22, ease: [0.22, 0.61, 0.36, 1] }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

export default AtlasTabs;
