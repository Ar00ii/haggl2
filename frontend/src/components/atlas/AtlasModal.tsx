'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import React, { useEffect } from 'react';

import { cn } from '@/lib/utils';

interface AtlasModalProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Right-side header slot (e.g. step indicator). */
  toolbar?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  hideClose?: boolean;
  /** Block close-on-backdrop. */
  static?: boolean;
  className?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
}

const sizeClass: Record<string, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
};

/**
 * AtlasModal — backdrop-blurred dialog with smooth fade+scale entry. Replaces
 * the bespoke modal stacks scattered across the app (verification, payment
 * consent, wallet picker etc).
 */
export function AtlasModal({
  open,
  onClose,
  title,
  description,
  toolbar,
  size = 'md',
  hideClose = false,
  static: isStatic = false,
  className,
  children,
  footer,
}: AtlasModalProps) {
  // Lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Esc to close.
  useEffect(() => {
    if (!open || isStatic) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, isStatic, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={isStatic ? undefined : onClose}
            className="fixed inset-0 z-[200] bg-black/65 backdrop-blur-md"
            aria-hidden
          />
          <div className="fixed inset-0 z-[201] grid place-items-center px-4 py-8 pointer-events-none">
            <motion.div
              role="dialog"
              aria-modal="true"
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.22, ease: [0.22, 0.61, 0.36, 1] }}
              className={cn(
                'w-full pointer-events-auto relative rounded-2xl overflow-hidden',
                'bg-[var(--bg-card)] border border-[var(--border)]',
                'shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]',
                sizeClass[size],
                className,
              )}
            >
              {/* Top hairline accent. */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-px"
                style={{
                  background:
                    'linear-gradient(90deg, transparent 0%, var(--brand) 50%, transparent 100%)',
                  opacity: 0.55,
                }}
              />

              {(title || toolbar || !hideClose) && (
                <header className="flex items-start gap-3 px-5 pt-5 pb-3 border-b border-[var(--border)]">
                  <div className="flex-1 min-w-0">
                    {title && (
                      <h3 className="text-[16px] font-light text-[var(--text)] leading-tight">
                        {title}
                      </h3>
                    )}
                    {description && (
                      <p className="mt-1 text-[12.5px] text-[var(--text-muted)] leading-relaxed">
                        {description}
                      </p>
                    )}
                  </div>
                  {toolbar}
                  {!hideClose && (
                    <button
                      type="button"
                      onClick={onClose}
                      aria-label="Close"
                      className="grid place-items-center w-7 h-7 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-card2)] transition-colors"
                    >
                      <X className="w-3.5 h-3.5" strokeWidth={2} />
                    </button>
                  )}
                </header>
              )}

              <div className="p-5">{children}</div>

              {footer && (
                <footer className="px-5 pb-5 pt-3 border-t border-[var(--border)] flex items-center justify-end gap-2 bg-[var(--bg-card2)]/40">
                  {footer}
                </footer>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

export default AtlasModal;
