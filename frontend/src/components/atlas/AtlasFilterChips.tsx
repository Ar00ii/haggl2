'use client';

import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import React from 'react';

import { cn } from '@/lib/utils';

export interface AtlasChipOption<T extends string> {
  value: T;
  label: React.ReactNode;
  /** Optional small count shown after the label, e.g. tag occurrences. */
  count?: number;
  icon?: React.ReactNode;
}

interface AtlasFilterChipsProps<T extends string> {
  label?: string;
  options: AtlasChipOption<T>[];
  /** Currently selected value(s). Pass null/[] for none. */
  value: T | T[] | null;
  onChange: (next: T | null) => void;
  /** Multi-select instead of radio. */
  multi?: boolean;
  /** Allow clearing the selection via an X chip at the end. */
  clearable?: boolean;
  className?: string;
}

/**
 * AtlasFilterChips — horizontal chip rail for fast filtering. Replaces
 * the bespoke `<button>`-with-style chains across the marketplace.
 * Active chips animate to brand-tinted, inactive stay quiet so the
 * selected state reads at a glance.
 *
 * - Single-select: clicking the active chip deselects it.
 * - Multi-select: pass `value` as an array; chips toggle individually.
 */
export function AtlasFilterChips<T extends string>({
  label,
  options,
  value,
  onChange,
  multi = false,
  clearable = false,
  className,
}: AtlasFilterChipsProps<T>) {
  const isActive = (v: T): boolean => {
    if (Array.isArray(value)) return value.includes(v);
    return value === v;
  };

  const handleClick = (v: T) => {
    if (multi) {
      // Multi-select: caller handles the array merge in onChange.
      onChange(v);
      return;
    }
    onChange(isActive(v) ? null : v);
  };

  const hasSelection = Array.isArray(value) ? value.length > 0 : value != null;

  return (
    <div className={cn('flex items-center gap-1.5 flex-wrap', className)}>
      {label && (
        <span className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-[var(--text-muted)] mr-1">
          {label}
        </span>
      )}
      {options.map((opt) => {
        const active = isActive(opt.value);
        return (
          <motion.button
            key={String(opt.value)}
            type="button"
            onClick={() => handleClick(opt.value)}
            whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.12 }}
            className={cn(
              'inline-flex items-center gap-1.5 px-2.5 h-7 rounded-full text-[11.5px] font-medium tracking-tight transition-all',
              active
                ? 'bg-[var(--brand-dim)] text-[var(--brand)] border border-[var(--brand)]/40 shadow-[0_0_18px_-6px_rgba(20,241,149,0.45)]'
                : 'bg-[var(--bg-card2)] text-[var(--text-secondary)] border border-[var(--border)] hover:border-[var(--border-hover)] hover:text-[var(--text)]',
            )}
          >
            {opt.icon && <span className="inline-flex">{opt.icon}</span>}
            {opt.label}
            {opt.count != null && (
              <span
                className={cn(
                  'ml-0.5 font-mono text-[10px] tabular-nums',
                  active ? 'text-[var(--brand)]/80' : 'text-[var(--text-muted)]',
                )}
              >
                {opt.count}
              </span>
            )}
          </motion.button>
        );
      })}
      {clearable && hasSelection && (
        <button
          type="button"
          onClick={() => onChange(null)}
          aria-label="Clear filter"
          className="inline-flex items-center gap-1 px-2 h-7 rounded-full text-[11px] font-medium text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-card2)] transition-colors"
        >
          <X className="w-3 h-3" strokeWidth={2.25} />
          Clear
        </button>
      )}
    </div>
  );
}

export default AtlasFilterChips;
