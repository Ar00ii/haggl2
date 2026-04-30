'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, Settings, ChevronDown, Search } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { useState, useRef, useEffect } from 'react';

import { NotificationsBell } from '@/components/layout/NotificationsBell';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { useAuth } from '@/lib/auth/AuthProvider';

export function FloatingTopBar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [modKey, setModKey] = useState('Ctrl');
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.platform)) {
      setModKey('⌘');
    }
  }, []);

  const openPalette = () => {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, metaKey: true, bubbles: true }),
    );
  };

  const isHome = pathname === '/';
  const isAuth = pathname.startsWith('/auth');
  const shouldShow = isAuthenticated && !isHome && !isAuth;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setProfileOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

  if (!shouldShow) return null;

  // Token-driven chip surface — adapts light ↔ dark via CSS variables.
  // Previously these were hard-coded zinc/black gradients which made the
  // entire top bar disappear on a white page in light mode.
  const chipStyle: React.CSSProperties = {
    background: 'linear-gradient(180deg, var(--bg-card) 0%, var(--bg-elevated) 100%)',
    backdropFilter: 'blur(16px) saturate(140%)',
    WebkitBackdropFilter: 'blur(16px) saturate(140%)',
    boxShadow:
      '0 0 0 1px var(--border), inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.18)',
  };

  const chipClass =
    'inline-flex items-center justify-center rounded-xl text-[var(--text-secondary)] hover:text-[var(--text)] transition-all duration-200 hover:bg-[var(--bg-card2)]';

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
      className="fixed top-3 right-3 z-40 flex items-center gap-1.5"
      style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.45))' }}
    >
      {/* Command Palette Trigger — desktop */}
      <button
        onClick={openPalette}
        title={`Open command palette (${modKey}K)`}
        className={`${chipClass} hidden md:inline-flex h-9 pl-3 pr-2.5 gap-2`}
        style={chipStyle}
      >
        <Search className="w-3.5 h-3.5 text-[var(--text-muted)]" strokeWidth={1.75} />
        <span className="text-[12px] font-light text-[var(--text-muted)]">Search</span>
        <kbd
          className="text-[10px] font-medium text-[var(--text-muted)] rounded-md px-1.5 py-0.5 leading-none"
          style={{
            background: 'var(--bg-card2)',
            border: '1px solid var(--border)',
          }}
        >
          {modKey}K
        </kbd>
      </button>

      {/* Theme toggle (sun ↔ moon) */}
      <ThemeToggle size={36} />

      {/* Notifications */}
      <div className="rounded-xl flex items-center justify-center w-9 h-9" style={chipStyle}>
        <NotificationsBell isAuthenticated={isAuthenticated} />
      </div>

      {/* Profile Section */}
      <div ref={profileRef} className="relative">
        <button
          onClick={() => setProfileOpen(!profileOpen)}
          className={`${chipClass} h-9 pl-1.5 pr-2.5 gap-2`}
          style={
            profileOpen
              ? {
                  ...chipStyle,
                  boxShadow:
                    '0 0 0 1px rgba(20, 241, 149, 0.35), inset 0 1px 0 rgba(255,255,255,0.06)',
                }
              : chipStyle
          }
          aria-haspopup="menu"
          aria-expanded={profileOpen}
        >
          <UserAvatar
            src={user?.avatarUrl}
            name={user?.displayName || user?.username}
            userId={user?.id}
            size={24}
            className="flex-shrink-0"
          />

          <span className="text-[12px] font-light text-[var(--text)] max-w-[96px] truncate">
            {user?.displayName || user?.username || 'User'}
          </span>

          <motion.div animate={{ rotate: profileOpen ? 180 : 0 }} transition={{ duration: 0.18 }}>
            <ChevronDown className="w-3 h-3 text-[var(--text-muted)]" strokeWidth={2} />
          </motion.div>
        </button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {profileOpen && (
            <motion.div
              role="menu"
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.2, ease: [0.22, 0.61, 0.36, 1] }}
              className="absolute top-full right-0 mt-2 w-56 rounded-2xl overflow-hidden z-50"
              style={{
                background: 'linear-gradient(180deg, var(--bg-card) 0%, var(--bg-elevated) 100%)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                boxShadow:
                  '0 20px 48px -8px rgba(0,0,0,0.45), 0 0 0 1px var(--border), inset 0 1px 0 rgba(255,255,255,0.05)',
              }}
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-px"
                style={{
                  background:
                    'linear-gradient(90deg, transparent 0%, var(--brand) 50%, transparent 100%)',
                  opacity: 0.6,
                }}
              />
              {/* User Info */}
              <div className="px-3.5 py-3 border-b border-[var(--border)] flex items-center gap-2.5">
                <UserAvatar
                  src={user?.avatarUrl}
                  name={user?.displayName || user?.username}
                  userId={user?.id}
                  size={32}
                  className="flex-shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-[13px] font-light text-white truncate">
                    {user?.displayName || user?.username}
                  </p>
                  {user?.email && (
                    <p className="text-[11px] text-zinc-500 truncate">{user.email}</p>
                  )}
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-1">
                <Link
                  href="/profile"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-[13px] font-light text-zinc-300 hover:text-white hover:bg-white/[0.04] transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" strokeWidth={1.75} />
                  My Profile
                </Link>
                <Link
                  href="/profile?tab=security"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-[13px] font-light text-zinc-300 hover:text-white hover:bg-white/[0.04] transition-colors"
                >
                  <Settings
                    className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0"
                    strokeWidth={1.75}
                  />
                  Settings
                </Link>
              </div>

              {/* Divider */}
              <div className="mx-3 h-px bg-white/[0.06]" />

              {/* Logout */}
              <div className="py-1">
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[13px] font-light text-zinc-400 hover:text-red-300 hover:bg-red-500/[0.06] transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={1.75} />
                  Sign out
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
