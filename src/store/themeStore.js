// themeStore — supports three modes:
//   'light'  → always light
//   'dark'   → always dark
//   'system' → follows prefers-color-scheme media query

import { create } from 'zustand';

function getSystemPreference() {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function resolve(mode) {
  return mode === 'system' ? getSystemPreference() : mode;
}

function applyResolved(resolved) {
  if (resolved === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
}

// Apply on page load before React mounts (instant, no flash)
const savedMode = localStorage.getItem('theme') || 'system';
applyResolved(resolve(savedMode));

export const useThemeStore = create((set, get) => {
  // Listen for system preference changes (fires when user changes OS setting)
  if (typeof window !== 'undefined') {
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', () => {
        const { theme } = get();
        if (theme === 'system') {
          const resolved = getSystemPreference();
          applyResolved(resolved);
          set({ resolvedTheme: resolved });
        }
      });
  }

  return {
    // 'light' | 'dark' | 'system'  — what the user chose
    theme: savedMode,

    // 'light' | 'dark' — what is actually applied right now
    resolvedTheme: resolve(savedMode),

    setTheme(mode) {
      const resolved = resolve(mode);
      localStorage.setItem('theme', mode);
      applyResolved(resolved);
      set({ theme: mode, resolvedTheme: resolved });
    },

    // Quick toggle used by the sidebar (cycles light → dark → light, ignores system)
    toggleTheme() {
      const { resolvedTheme } = get();
      const next = resolvedTheme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', next);
      applyResolved(next);
      set({ theme: next, resolvedTheme: next });
    },
  };
});
