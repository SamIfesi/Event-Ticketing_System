import axios from 'axios';
import { useLoaderStore } from '../store/loaderStore';
import { useAuthStore } from '../store/authStore';

const SLOW_THRESHOLD_MS = 800;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// ─────────────────────────────────────────────────────────────────────────────
// REQUEST INTERCEPTOR
// Runs before every single API call leaves the browser.
//
// What it does:
// 1. Attach JWT from Zustand (not localStorage directly — single source of
//    truth lives in the store).
// 2. Start top bar immediately.
// 3. After 800ms: kill top bar, start 3-bar center loader instead.
// ─────────────────────────────────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const { startTopBar, stopTopBar, startCenter, stopCenter } =
      useLoaderStore.getState();

    startTopBar();
    stopCenter();

    config._slowTimer = setTimeout(() => {
      stopTopBar();
      startCenter();
      config._isSlowRequest = true;
    }, SLOW_THRESHOLD_MS);

    return config;
  },
  (error) => {
    const { stopTopBar, stopCenter } = useLoaderStore.getState();
    stopTopBar();
    stopCenter();
    return Promise.reject(error);
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// RESPONSE INTERCEPTOR
// Runs after every API response (success or error).
//
// What it does:
// 1. Cancel the slow-request timer.
// 2. Stop whichever loader is active.
// 3. On 401: call clearAuth() (wipes Zustand + its persisted localStorage key
//    in one shot) then hard-redirect to /login.
// ─────────────────────────────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => {
    // 1. Cancel the slow-request timer
    if (response.config._slowTimer) {
      clearTimeout(response.config._slowTimer);
    }

    // 2. Stop the correct loader
    const { stopTopBar, stopCenter } = useLoaderStore.getState();
    if (response.config._isSlowRequest) {
      stopCenter();
    } else {
      stopTopBar();
    }

    return response;
  },
  (error) => {
    // Cancel timer even on error
    if (error.config?._slowTimer) {
      clearTimeout(error.config._slowTimer);
    }

    // Stop the correct loader
    const { stopTopBar, stopCenter } = useLoaderStore.getState();
    if (error.config?._isSlowRequest) {
      stopCenter();
    } else {
      stopTopBar();
    }

    // 401 = expired or invalid token → force logout
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Hard redirect so Zustand state is also cleared on mount
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;
