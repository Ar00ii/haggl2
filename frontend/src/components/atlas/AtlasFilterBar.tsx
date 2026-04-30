'use client';

import { Search, X } from 'lucide-react';
import React from 'react';

import { cn } from '@/lib/utils';

interface AtlasFilterBarProps {
  search?: string;
  onSearch?: (v: string) => void;
  searchPlaceholder?: string;
  /** Left children — typically <AtlasTabs variant="segment">. */
  leftSlot?: React.ReactNode;
  /** Right children — typically sort chips, view toggles, refresh. */
  rightSlot?: React.ReactNode;
  /** Sticky to top of scroll container. */
  sticky?: boolean;
  className?: string;
}

/**
 * AtlasFilterBar — sticky frosted-glass filter strip. Replaces the bespoke
 * search-tabs-sort triangles on `/market`, `/orders`, `/inventory`, etc.
 * Search field has clear-on-typing button + ⌘K hint.
 */
export function AtlasFilterBar({
  search,
  onSearch,
  searchPlaceholder = 'Search…',
  leftSlot,
  rightSlot,
  sticky = false,
  className,
}: AtlasFilterBarProps) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-2 px-3 py-2.5 rounded-2xl',
        // Solid bg (no /75 alpha + no backdrop-blur) — the hero blobs
        // were bleeding through the translucent surface and turning
        // the bar dark in light mode.
        'bg-[var(--bg-card)] border border-[var(--border)]',
        'shadow-[var(--shadow-card)]',
        sticky && 'sticky top-[64px] z-30',
        className,
      )}
    >
      {onSearch && (
        <div
          className={cn(
            'relative flex-1 min-w-[220px] max-w-md flex items-center rounded-xl',
            'bg-[var(--bg)] border border-[var(--border)]',
            'focus-within:border-[var(--brand)]/55 focus-within:shadow-[0_0_0_3px_rgba(20,241,149,0.14)] transition-all',
          )}
        >
          <Search
            className="absolute left-3 w-4 h-4 text-[var(--text-muted)] pointer-events-none"
            strokeWidth={1.75}
          />
          <input
            type="text"
            value={search ?? ''}
            onChange={(e) => onSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full bg-transparent outline-none pl-9 pr-9 py-2 text-[13.5px] font-light text-[var(--text)] placeholder:text-[var(--text-muted)]"
          />
          {search ? (
            <button
              type="button"
              onClick={() => onSearch('')}
              aria-label="Clear search"
              className="absolute right-2 grid place-items-center w-6 h-6 rounded-md text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-card2)]"
            >
              <X className="w-3 h-3" strokeWidth={2} />
            </button>
          ) : (
            <kbd className="absolute right-2 hidden sm:inline-flex items-center px-1.5 h-5 rounded text-[10px] font-mono text-[var(--text-muted)] bg-[var(--bg-card2)] border border-[var(--border)]">
              ⌘K
            </kbd>
          )}
        </div>
      )}

      {leftSlot}
      <div className="flex-1" />
      {rightSlot}
    </div>
  );
}

export default AtlasFilterBar;
