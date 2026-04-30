'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import React from 'react';

import { useTheme } from '@/lib/theme/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  size?: number;
}

export function ThemeToggle({ className = '', size = 36 }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`relative inline-flex items-center justify-center rounded-xl overflow-hidden transition-all duration-200 ${className}`}
      style={{
        width: size,
        height: size,
        background: 'linear-gradient(180deg, var(--bg-card) 0%, var(--bg-elevated) 100%)',
        boxShadow: '0 0 0 1px var(--border), inset 0 1px 0 rgba(255,255,255,0.04)',
      }}
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.span
          key={theme}
          initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
          transition={{ duration: 0.25, ease: [0.22, 0.61, 0.36, 1] }}
          className="inline-flex"
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-[var(--brand)]" strokeWidth={1.75} />
          ) : (
            <Moon className="w-4 h-4 text-[var(--text-secondary)]" strokeWidth={1.75} />
          )}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

export default ThemeToggle;
