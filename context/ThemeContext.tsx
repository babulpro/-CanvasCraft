'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'canvascraft_theme';

function applyDOMTheme(isDark: boolean) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const body = document.body;

  if (isDark) {
    root.classList.add('dark');
    if (body) body.classList.add('dark');
    root.setAttribute('data-theme', 'dark');
    root.style.colorScheme = 'dark';
  } else {
    root.classList.remove('dark');
    if (body) body.classList.remove('dark');
    root.setAttribute('data-theme', 'light');
    root.style.colorScheme = 'light';
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  // Read saved theme from localStorage on mount and apply immediately
  useEffect(() => {
    let initialTheme: Theme = 'system';
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system')) {
        initialTheme = savedTheme;
        setThemeState(savedTheme);
      }
    } catch {
      // Fallback if localStorage is inaccessible
    }

    const isDark =
      initialTheme === 'dark' ||
      (initialTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    applyDOMTheme(isDark);
    setResolvedTheme(isDark ? 'dark' : 'light');
    setMounted(true);
  }, []);

  // Update document class and resolvedTheme whenever theme changes or system media query triggers
  useEffect(() => {
    if (!mounted) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const updateFromCurrent = () => {
      const isDark =
        theme === 'dark' ||
        (theme === 'system' && mediaQuery.matches);
      applyDOMTheme(isDark);
      setResolvedTheme(isDark ? 'dark' : 'light');
    };

    updateFromCurrent();

    // Listen for OS system theme changes if set to 'system'
    const handleMediaChange = () => {
      if (theme === 'system') {
        updateFromCurrent();
      }
    };

    mediaQuery.addEventListener('change', handleMediaChange);
    return () => mediaQuery.removeEventListener('change', handleMediaChange);
  }, [theme, mounted]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);

    // Compute and apply to DOM synchronously without waiting for React cycle
    const isDark =
      newTheme === 'dark' ||
      (newTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    applyDOMTheme(isDark);
    setResolvedTheme(isDark ? 'dark' : 'light');

    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch {
      // Ignore localStorage errors
    }

    // Friendly luxury feedback
    if (newTheme === 'dark') {
      toast.success('Switched to Night Mode 🌙', { id: 'theme-toast' });
    } else if (newTheme === 'light') {
      toast.success('Switched to Day Mode ☀️', { id: 'theme-toast' });
    } else {
      toast.success(`Device Mode Active (${isDark ? 'Night' : 'Day'}) 💻`, { id: 'theme-toast' });
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
