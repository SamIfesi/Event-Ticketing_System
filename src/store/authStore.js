import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEY } from '../config/constants';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isVerified: false,
      isLoggingOut: false,
      _hasHydrated: false,

      setHasHydrated: (val) => set({ _hasHydrated: val }),

      setAuth: ({ user, token, isVerified }) =>
        set({ user, token, isVerified: Boolean(isVerified), isLoggingOut: false}),

      setEmailVerified: () =>
        set((state) => ({
          isVerified: true,
          user: state.user ? { ...state.user, email_verified: 1 } : null,
        })),

      clearAuth: () => {
        localStorage.removeItem(STORAGE_KEY.AUTH);
        set({ user: null, token: null, isVerified: false, isLoggingOut: false });
      },

      setLoggingOut: () => set({ isLoggingOut: true }),
    }),
    {
      name: STORAGE_KEY.AUTH,
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isVerified: state.isVerified,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
