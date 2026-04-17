// functions:
//   - Expose derived auth state (isLoggedIn, isVerified, role, user)
//   - Wrap AuthService calls with loading/error state
//   - Keep authStore in sync after every mutation
//   - Handle post-login redirect via getDefaultPath()
//   - Boot-time rehydration: if a token exists in the persisted store but
//     the user object is stale, re-fetch /auth/me to get fresh data

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/auth.service';
import { useAuthStore } from '../store/authStore';
import { getDefaultPath } from '../utils/roleGuard';
import { useUiStore } from '../store/uiStore';
import { ROLES } from '../config/constants';

export function useAuth() {
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const isVerified = useAuthStore((state) => state.isVerified);
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const setEmailVerified = useAuthStore((state) => state.setEmailVerified);

  const toastSuccess = useUiStore((state) => state.toastSuccess);
  const toastError = useUiStore((state) => state.toastError);

  const isLoggedIn = Boolean(user) && Boolean(token);
  const role = user?.role || null;
  const isAdmin = role === ROLES.ADMIN || role === ROLES.DEV;
  const isOrganizer =
    role === ROLES.ORGANIZER || role === ROLES.ADMIN || role === ROLES.DEV;
  const isAttendee = role === ROLES.ATTENDEE;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  function resetErrors() {
    setError(null);
    setFieldErrors({});
  }

  function handleApiError(err) {
    const data = err?.response?.data;
    if (data?.errors) {
      setFieldErrors(data.errors);
    }
    const msg = data?.message ?? 'Something went wrong. Please try again.';
    setError(msg);
    toastError(msg);
    return msg;
  }

  const register = useCallback(async ({ name, email, password }) => {
    setLoading(true);
    resetErrors();
    try {
      const data = await AuthService.register({ name, email, password });
      setAuth({
        user: data.user,
        token: data.token,
        isVerified: false,
      });
      toastSuccess(
        data.message_hint ??
          'Account created! Please check your email for the OTP to verify your account.'
      );
      navigate('/verify-email');
    } catch (error) {
      toastError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyEmail = useCallback(
    async (otp) => {
      setLoading(true);
      resetErrors();
      try {
        await AuthService.verifyEmail(otp);
        setEmailVerified();
        toastSuccess('Email verified successfully!');
        navigate(getDefaultPath(role));
      } catch (error) {
        toastError(handleApiError(error));
      } finally {
        setLoading(false);
      }
    },
    [role]
  );

  const resendOtp = useCallback(async () => {
    setLoading(true);
    resetErrors();
    try {
      const data = await AuthService.resendOtp();
      toastSuccess(data.message ?? 'A new OTP has been sent to your email.');
    } catch (error) {
      toastError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async ({ email, password }) => {
    setLoading(true);
    resetErrors();
    try {
      const data = await AuthService.login({ email, password });
      setAuth({
        user: data.user,
        token: data.token,
        isVerified: data.email_verified,
      });

      const isVerified = data.email_verified;
      const message = isVerified
        ? (data.message_hint ?? 'Login successful!')
        : 'logged in successfully! Please verify your email to continue';
      const path = isVerified
        ? getDefaultPath(data.user.role)
        : '/verify-email';

      toastSuccess(message);
      navigate(path);
      return;
    } catch (error) {
      toastError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await AuthService.logout();
    } catch {
    } finally {
      clearAuth();
      navigate('/login');
    }
  }, []);

  const rehydrate = useCallback(async () => {
    if (!token || user) return;
    try {
      const data = await AuthService.me();
      setAuth({
        user: data.user,
        token: data.token,
        isVerified: Boolean(data.user.email_verified),
      });
    } catch {
      clearAuth();
    }
  }, [token, user]);

  useEffect(() => {
    rehydrate();
  }, []);

  return {
    // State
    user,
    token,
    role,
    isLoggedIn,
    isVerified,
    isAdmin,
    isOrganizer,
    isAttendee,
    loading,
    error,
    fieldErrors,

    // Actions
    register,
    verifyEmail,
    resendOtp,
    login,
    logout,
    rehydrate,
    resetErrors,
  };
}
