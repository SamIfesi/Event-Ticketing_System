import { create } from 'zustand';

// ─────────────────────────────────────────────────────────────
// The counts (topBarCount / centerCount) handle the case where
// two API calls fire at the same time. Without counting, the
// first response would stop the loader even though the second
// request is still in flight.
// ─────────────────────────────────────────────────────────────
export const useLoaderStore = create((set, get) => ({
  topBarCount: 0,
  centerCount: 0,

  // Derived booleans — your components use these
  get topBarActive() {
    return get().topBarCount > 0;
  },
  get centerActive() {
    return get().centerCount > 0;
  },

  startTopBar: () => set((s) => ({ topBarCount: s.topBarCount + 1 })),
  stopTopBar: () =>
    set((s) => ({ topBarCount: Math.max(0, s.topBarCount - 1) })),

  startCenter: () => set((s) => ({ centerCount: s.centerCount + 1 })),
  stopCenter: () =>
    set((s) => ({ centerCount: Math.max(0, s.centerCount - 1) })),
}));
