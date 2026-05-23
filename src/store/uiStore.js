import { create } from 'zustand';

let toastId = 0;

export const useUiStore = create((set, get) => ({
  toasts: [],
  /**
   * automatoically remove after 'duration' ms (default 8000).
   *
   * @param {'success' | 'error' | 'info' | 'warning'} type - Type of the toast.
   * @param {string} message - Message to display in the toast.
   * @param {number} [duration] - Defaults to type-specific duration (error=10s, warning=7s, success/info=5s). Set to 0 to disable auto-dismiss.
   */

  toast(type, message, duration) {
    const id = ++toastId;
    set((state) => ({
      toasts: [...state.toasts, { id, type, message }],
    }));

    if (duration > 0) {
      setTimeout(() => {
        useUiStore.getState().dismissToast(id);
      }, duration);
    }
  },

  toastSuccess: (msg, dur) => get().toast('success', msg, dur ?? 5000),
  toastError: (msg, dur) => get().toast('error', msg, dur ?? 10000),
  toastWarning: (msg, dur) => get().toast('warning', msg, dur ?? 7000),
  toastInfo: (msg, dur) => get().toast('info', msg, dur ?? 5000),

  dismissToast(id) {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },

  clearToasts() {
    set({ toasts: [] });
  },

  activeModal: null,
  modalData: null,

  openModal(modalId, data = null) {
    set({ activeModal: modalId, modalData: data });
  },

  closeModal() {
    set({ activeModal: null, modalData: null });
  },

  sidebarOpen: false,

  openSidebar() {
    set({ sidebarOpen: true });
  },

  closeSidebar() {
    set({ sidebarOpen: false });
  },
  toggleSidebar() {
    set((state) => ({ sidebarOpen: !state.sidebarOpen }));
  },
}));
