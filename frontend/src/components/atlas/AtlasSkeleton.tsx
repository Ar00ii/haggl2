'use client';

import React from 'react';

import { cn } from '@/lib/utils';

interface AtlasSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Pre-shaped variants. Use `card` for full-card placeholders, `text`
   * for line stand-ins, `avatar` for circular profile shapes. Or pass
   * className to override. */
  variant?: 'rect' | 'text' | 'avatar' | 'card';
  /** Width override (number = px, string = any CSS unit). */
  w?: number | string;
  /** Height override. */
  h?: number | string;
  /** Disable the shimmer, use a solid wash instead. Useful for static
   * placeholders that don't need animation. */
  static?: boolean;
}

/**
 * AtlasSkeleton — shimmer placeholder. Replaces every "Loading..." text
 * across the app. Uses CSS variables so it adapts to light + dark
 * automatically. The shimmer keyframe is in globals.css (`atlas-shimmer`).
 */
export function AtlasSkeleton({
  variant = 'rect',
  w,
  h,
  static: isStatic = false,
  className,
  style,
  ...rest
}: AtlasSkeletonProps) {
  const variantClass: Record<NonNullable<AtlasSkeletonProps['variant']>, string> = {
    rect: 'rounded-md h-4 w-full',
    text: 'rounded h-3 w-3/4',
    avatar: 'rounded-full w-10 h-10',
    card: 'rounded-2xl h-44 w-full',
  };

  return (
    <div
      aria-hidden
      className={cn(
        'atlas-skeleton',
        !isStatic && 'atlas-skeleton--animated',
        variantClass[variant],
        className,
      )}
      style={{
        ...(w != null ? { width: typeof w === 'number' ? `${w}px` : w } : null),
        ...(h != null ? { height: typeof h === 'number' ? `${h}px` : h } : null),
        ...style,
      }}
      {...rest}
    />
  );
}

/**
 * AtlasListingCardSkeleton — drop-in placeholder matching the real
 * AtlasListingCard layout. Use as the children of the same grid so the
 * page doesn't reflow once data arrives.
 */
export function AtlasListingCardSkeleton() {
  return (
    <div className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] p-5 flex flex-col h-full">
      <div className="flex items-start gap-4 mb-4">
        <AtlasSkeleton variant="avatar" w={64} h={64} className="!rounded-2xl" />
        <div className="flex-1 min-w-0 space-y-2">
          <AtlasSkeleton w={48} h={14} className="!rounded" />
          <AtlasSkeleton h={18} w="80%" />
          <AtlasSkeleton h={11} w="40%" />
        </div>
      </div>
      <div className="flex gap-1.5 mb-4">
        <AtlasSkeleton w={48} h={20} className="!rounded" />
        <AtlasSkeleton w={56} h={20} className="!rounded" />
        <AtlasSkeleton w={42} h={20} className="!rounded" />
      </div>
      <div className="mt-auto flex items-center justify-between pt-3 border-t border-[var(--border)]">
        <AtlasSkeleton w={80} h={14} />
        <AtlasSkeleton w={64} h={18} />
      </div>
    </div>
  );
}

/**
 * AtlasTableRowSkeleton — placeholder for screener-style table rows.
 */
export function AtlasTableRowSkeleton() {
  return (
    <div className="grid grid-cols-[28px_minmax(0,1fr)_88px_60px_72px_56px_120px_32px] items-center gap-3 px-5 py-4 border-b border-[var(--border)]/50">
      <AtlasSkeleton w={16} h={12} />
      <div className="flex items-center gap-3 min-w-0">
        <AtlasSkeleton variant="avatar" w={28} h={28} />
        <div className="flex-1 min-w-0 space-y-1.5">
          <AtlasSkeleton h={13} w="70%" />
          <AtlasSkeleton h={10} w="35%" />
        </div>
      </div>
      <AtlasSkeleton w={56} h={12} />
      <AtlasSkeleton w={36} h={12} />
      <AtlasSkeleton w={48} h={12} />
      <AtlasSkeleton w={32} h={12} />
      <AtlasSkeleton w={88} h={12} />
      <AtlasSkeleton w={20} h={20} className="!rounded" />
    </div>
  );
}

export default AtlasSkeleton;
