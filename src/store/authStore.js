import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEY } from '../config/constants';

// NOTE: `token` here is NOT the real JWT anymore — the real JWT lives only
// in the httpOnly cookie set by the backend and is never touched by JS.
// `token` is kept as a lightweight boolean flag ("am I authenticated?")
// purely so every existing `Boolean(token)` check across the app
// (ProtectedRoute, GuestOnly, Navbar, Sidebar, the 401 handler in api.js,
// etc.) keeps working without having to touch every one of those files.
export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isVerified: false,
      isLoggingOut: false,
      _hasHydrated: false,

      setHasHydrated: (val) => set({ _hasHydrated: val }),

      setAuth: ({ user, isVerified }) =>
        set({
          user,
          token: true,
          isVerified: Boolean(isVerified),
          isLoggingOut: false,
        }),

      setEmailVerified: () =>
        set((state) => ({
          isVerified: true,
          user: state.user ? { ...state.user, email_verified: 1 } : null,
        })),

      clearAuth: () => {
        localStorage.removeItem(STORAGE_KEY.AUTH);
        set({ user: null, token: null, isVerified: false });
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
