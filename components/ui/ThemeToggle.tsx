'use client';

import React, { useEffect, useState } from 'react';
import { useTheme, Theme } from '@/context/ThemeContext';
import { Sun, Moon, Laptop } from 'lucide-react';

interface ThemeToggleProps {
  variant?: 'compact' | 'full';
  className?: string;
}

export default function ThemeToggle({ variant = 'compact', className = '' }: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Skeleton placeholder to prevent layout shifts before hydration
    return variant === 'compact' ? (
      <div className={`w-[88px] h-8 rounded-full bg-stone-200/60 dark:bg-stone-800/60 animate-pulse ${className}`} />
    ) : (
      <div className={`w-full h-24 rounded-2xl bg-stone-200/60 dark:bg-stone-800/60 animate-pulse ${className}`} />
    );
  }

  // 1. FULL DRAWER VARIANT (Mobile Drawer / Settings Card)
  if (variant === 'full') {
    return (
      <div className={`p-4 rounded-2xl bg-white dark:bg-[#1c1917] border border-stone-200/90 dark:border-stone-800 shadow-sm space-y-3 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 flex items-center justify-center">
              {resolvedTheme === 'dark' ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
            </div>
            <div>
              <span className="text-xs font-bold text-stone-900 dark:text-stone-100 block">
                Studio Ambience &amp; Mood
              </span>
              <span className="text-[10px] text-stone-500 dark:text-stone-400 block">
                {theme === 'system'
                  ? `Device Custom Mood (${resolvedTheme === 'dark' ? 'Night' : 'Day'})`
                  : theme === 'dark'
                  ? 'Night Lounge Mode'
                  : 'Day Studio Mode'}
              </span>
            </div>
          </div>

          <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
            {theme.toUpperCase()}
          </span>
        </div>

        {/* 3-Button Segmented Selector */}
        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-stone-100 dark:bg-stone-900/90 border border-stone-200/80 dark:border-stone-800">
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-bold transition cursor-pointer ${
              theme === 'light'
                ? 'bg-white dark:bg-stone-800 text-amber-700 dark:text-amber-400 shadow-xs border border-stone-200/80 dark:border-stone-700'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-stone-200'
            }`}
          >
            <Sun className="w-3.5 h-3.5 shrink-0" />
            <span>Day</span>
          </button>

          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-bold transition cursor-pointer ${
              theme === 'dark'
                ? 'bg-white dark:bg-stone-800 text-amber-700 dark:text-amber-400 shadow-xs border border-stone-200/80 dark:border-stone-700'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-stone-200'
            }`}
          >
            <Moon className="w-3.5 h-3.5 shrink-0" />
            <span>Night</span>
          </button>

          <button
            type="button"
            onClick={() => setTheme('system')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-bold transition cursor-pointer ${
              theme === 'system'
                ? 'bg-white dark:bg-stone-800 text-amber-700 dark:text-amber-400 shadow-xs border border-stone-200/80 dark:border-stone-700'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-stone-200'
            }`}
          >
            <Laptop className="w-3.5 h-3.5 shrink-0" />
            <span>Device</span>
          </button>
        </div>
      </div>
    );
  }

  // 2. COMPACT SEGMENTED PILL VARIANT (Desktop Header)
  return (
    <div
      className={`inline-flex items-center p-0.5 rounded-full bg-stone-100/90 dark:bg-stone-900/90 border border-stone-200/80 dark:border-stone-800 shadow-2xs ${className}`}
      role="group"
      aria-label="Theme switcher"
    >
      <button
        type="button"
        onClick={() => setTheme('light')}
        title="Day Mode (Light)"
        aria-label="Day Mode"
        className={`p-1.5 rounded-full transition cursor-pointer ${
          theme === 'light'
            ? 'bg-white dark:bg-stone-800 text-amber-600 shadow-2xs'
            : 'text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100'
        }`}
      >
        <Sun className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        onClick={() => setTheme('system')}
        title="Device Custom Mood (Auto)"
        aria-label="Device Custom Mood"
        className={`p-1.5 rounded-full transition cursor-pointer ${
          theme === 'system'
            ? 'bg-white dark:bg-stone-800 text-amber-600 shadow-2xs'
            : 'text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100'
        }`}
      >
        <Laptop className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        onClick={() => setTheme('dark')}
        title="Night Mode (Dark)"
        aria-label="Night Mode"
        className={`p-1.5 rounded-full transition cursor-pointer ${
          theme === 'dark'
            ? 'bg-white dark:bg-stone-800 text-amber-400 shadow-2xs'
            : 'text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100'
        }`}
      >
        <Moon className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
