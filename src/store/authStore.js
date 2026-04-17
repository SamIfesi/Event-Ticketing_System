import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isVerified: false,

      // Called after successful login or register
      setAuth: (user, token, isVerified) => set({ user, token, isVerified: Boolean(isVerified) }),

      // Called on logout or 401 from api.js
      clearAuth: () => set({ user: null, token: null, isVerified: false }),

      // Called after email verified so UI updates immediately
      setEmailVerified: () =>
        set((state) => ({
          isVerified: true,
          user: state.user ? { ...state.user, email_verified: 1 } : null,
        })),
    }),
    {
      name: 'auth',
      partialize: (state) => ({ user: state.user, token: state.token, isVerified: state.isVerified }),
    }
  )
);
