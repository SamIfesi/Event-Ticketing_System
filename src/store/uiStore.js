import { create } from 'zustand';

let toastId = 0;
export const useUiStore = create((set, get) => ({
  toasts: [],

  /**
   * automatoically remove afte 'duration' ms (default 4000).
   *
   * @param {'success' | 'error' | 'info' | 'warning'} type - Type of the toast.
   * @param {string} message - Message to display in the toast.
   * @param {number} [duration=4000]
   */

  toast(type, message, duration = 4000) {
    const id = ++toastId;
    set((state) => ({
      toasts: [...state.toasts, { id, type, message }],
    }));

    if (duration > 0) {
      setTimeout(() => get().dismissToast(id), duration);
    }
  },

  toastSuccess: (msg, dur) => get().toast('success', msg, dur),
  toastError: (msg, dur) => get().toast('error', msg, dur),
  toastWarning: (msg, dur) => get().toast('warning', msg, dur),
  toastInfo: (msg, dur) => get().toast('info', msg, dur),

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
