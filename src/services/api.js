import axios from 'axios';
import { useLoaderStore } from '../store/loaderStore';

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
//  1. Reads the JWT from localStorage and attaches it as Bearer token.
//     This means you never have to think about auth headers in your
//     service files — they just call api.get() and the token is there.
//
//  2. Starts the top bar loader immediately (fast feedback for the user).
//
//  3. Starts a 800ms timer. If the request is still pending when the
//     timer fires, it switches from the top bar to the 3-bar center loader
//     because this is clearly a slow API.
//
//  4. Stores the timer ID and the request start time on the config object
//     so the response interceptor can clean up correctly.
// ─────────────────────────────────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    // 1. Attach JWT if it exists
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 2. Start top bar loader immediately
    const { startTopBar, stopTopBar, startCenter, stopCenter } =
      useLoaderStore.getState();
    startTopBar();
    stopCenter();

    // 3. Record when the request started
    config._startTime = Date.now();

    // 4. Set a timer — if request takes longer than SLOW_THRESHOLD_MS,
    //    kill the top bar and show the 3-bar center loader instead
    config._slowTimer = setTimeout(() => {
      stopTopBar();
      startCenter(); // 3-bar center loader appears
      config._isSlowRequest = true;
    }, SLOW_THRESHOLD_MS);

    return config;
  },
  (error) => {
    // Request failed before it even left — clean up loaders
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
//  1. Cancels the slow-request timer so the loader doesn't switch
//     after the request already finished.
//
//  2. Stops whichever loader is currently active:
//     - If the request was fast (timer never fired) → stop top bar
//     - If the request was slow (timer fired, center is showing) → stop center
//
//  3. On 401 errors: clears localStorage and redirects to /login.
//     This handles expired JWT tokens automatically across your whole app.
//
//  4. On any other error: passes it through so your service files and
//     components can handle it with their own try/catch.
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
