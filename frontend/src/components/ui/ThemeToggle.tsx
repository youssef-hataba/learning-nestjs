'use client';

import { useEffect, useState } from 'react';
import { useThemeStore } from '@/store/themeStore';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, toggleTheme } = useThemeStore();

  useEffect(() => {
    setMounted(true);
    // Ensure document element has proper class
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-full bg-[var(--surface-pill)] border border-[var(--border-subtle)] animate-pulse" />
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="relative flex items-center justify-center w-10 h-10 rounded-full bg-[var(--surface-pill)] border border-[var(--border-medium)] text-[var(--text-main)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-all cursor-pointer shadow-sm group"
      title={isDark ? 'Switch to White Mode (Day Oasis)' : 'Switch to Dark Mode (Night Sanctuary)'}
      aria-label="Toggle visual theme"
    >
      {/* Sun Icon (shown when dark, to switch to light) */}
      <svg
        className={`w-4 h-4 transition-transform duration-500 ${
          isDark ? 'rotate-0 scale-100 opacity-100 text-[#b6f076]' : '-rotate-90 scale-0 opacity-0 absolute'
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>

      {/* Moon Icon (shown when light, to switch to dark) */}
      <svg
        className={`w-4 h-4 transition-transform duration-500 ${
          !isDark ? 'rotate-0 scale-100 opacity-100 text-[#15803d]' : 'rotate-90 scale-0 opacity-0 absolute'
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>
    </button>
  );
}
