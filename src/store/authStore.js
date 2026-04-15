import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,

      // Called after successful login or register
      setAuth: (user, token) => set({ user, token }),

      // Called on logout or 401 from api.js
      clearAuth: () => set({ user: null, token: null }),

      // Called after email verified so UI updates immediately
      setEmailVerified: () =>
        set((s) => ({
          user: s.user ? { ...s.user, email_verified: 1 } : null,
        })),
    }),
    {
      name: 'auth',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);
