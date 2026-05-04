// useProfile — all profile management for any logged-in user.
//
// The email change is a 2-step flow:
//   Step 1: requestEmailChange(newEmail)
//           → backend sends OTP to the new email address
//           → emailChangePending flips to true
//           → UI switches to the OTP input form
//   Step 2: confirmEmailChange(otp)
//           → backend verifies OTP and updates the email
//           → we call useAuthStore.setAuth to update the stored user object
//             so the navbar/header reflects the new email immediately

import { useState, useCallback } from 'react';
import ProfileService from '../services/profile.service';
import { useAuthStore } from '../store/authStore';
import { useUiStore } from '../store/uiStore';

export function useProfile() {
  const setAuth      = useAuthStore((state) => state.setAuth);
  const token        = useAuthStore((state) => state.token);
  const isVerified   = useAuthStore((state) => state.isVerified);
  const toastSuccess = useUiStore((state) => state.toastSuccess);
  const toastError   = useUiStore((state) => state.toastError);

  // ── Profile data ──────────────────────────────────────────────
  const [profile,        setProfile]        = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError,   setProfileError]   = useState(null);

  // ── Mutation state (shared across update/password/email actions) ──
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  // ── Email change flow ─────────────────────────────────────────
  // True after step 1 succeeds — tells the UI to show the OTP input
  const [emailChangePending, setEmailChangePending] = useState(false);

  // ── Activity / history ────────────────────────────────────────
  const [bookings,        setBookings]        = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [tickets,         setTickets]         = useState([]);
  const [ticketsLoading,  setTicketsLoading]  = useState(false);
  const [activity,        setActivity]        = useState([]);
  const [activityLoading, setActivityLoading] = useState(false);

  // ── Helpers ───────────────────────────────────────────────────
  function resetErrors() {
    setError(null);
    setFieldErrors({});
  }

  function extractError(err) {
    const data = err?.response?.data;
  
    if (data?.errors) {
      setFieldErrors(data.errors);
  
      // Extract real messages
      const messages = Object.values(data.errors);
      const combined = messages.join("\n");
  
      setError(combined);
      return combined;
    }
  
    const msg =
      data?.message ??
      'Something went wrong. Please try again.';
  
    setError(msg);
    return msg;
  }

  // ── Fetch full profile ────────────────────────────────────────
  const fetchProfile = useCallback(async () => {
    setProfileLoading(true);
    setProfileError(null);
    try {
      const data = await ProfileService.getProfile();
      setProfile(data.profile);
    } catch (err) {
      const msg = err?.response?.data?.message ?? 'Failed to load profile.';
      setProfileError(msg);
      toastError(msg);
    } finally {
      setProfileLoading(false);
    }
  }, []);

  // ── Update name / avatar ──────────────────────────────────────
  const updateProfile = useCallback(async ({ name, avatar } = {}) => {
    setLoading(true);
    resetErrors();
    try {
      const data = await ProfileService.updateProfile({ name, avatar });
      // Update the profile page data
      setProfile((prev) => prev ? { ...prev, ...data.user } : data.user);
      // Keep the auth store in sync so the navbar shows the new name
      setAuth({ user: data.user, token, isVerified });
      toastSuccess('Profile updated.');
    } catch (err) {
      toastError(extractError(err));
    } finally {
      setLoading(false);
    }
  }, [token, isVerified]);

  // ── Change password ───────────────────────────────────────────
  const changePassword = useCallback(async ({ currentPassword, newPassword, confirmPassword }) => {
    setLoading(true);
    resetErrors();
    try {
      await ProfileService.changePassword({ currentPassword, newPassword, confirmPassword });
      toastSuccess('Password changed successfully.');
    } catch (err) {
      toastError(extractError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Email change step 1 ───────────────────────────────────────
  const requestEmailChange = useCallback(async (newEmail) => {
    setLoading(true);
    resetErrors();
    try {
      await ProfileService.requestEmailChange(newEmail);
      setEmailChangePending(true);
      toastSuccess(`A verification code was sent to ${newEmail}.`);
    } catch (err) {
      toastError(extractError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Email change step 2 ───────────────────────────────────────
  const confirmEmailChange = useCallback(async (otp) => {
    setLoading(true);
    resetErrors();
    try {
      await ProfileService.confirmEmailChange(otp);
      setEmailChangePending(false);
      // Re-fetch profile to get the updated email reflected everywhere
      await fetchProfile();
      toastSuccess('Email address updated.');
    } catch (err) {
      toastError(extractError(err));
    } finally {
      setLoading(false);
    }
  }, [fetchProfile]);

  function cancelEmailChange() {
    setEmailChangePending(false);
    resetErrors();
  }

  // ── Booking history ───────────────────────────────────────────
  const fetchBookings = useCallback(async (params = {}) => {
    setBookingsLoading(true);
    try {
      const data = await ProfileService.getBookings(params);
      setBookings(data.bookings);
    } catch (err) {
      toastError(err?.response?.data?.message ?? 'Failed to load bookings.');
    } finally {
      setBookingsLoading(false);
    }
  }, []);

  // ── Ticket history ────────────────────────────────────────────
  const fetchTickets = useCallback(async (params = {}) => {
    setTicketsLoading(true);
    try {
      const data = await ProfileService.getTickets(params);
      setTickets(data.tickets);
    } catch (err) {
      toastError(err?.response?.data?.message ?? 'Failed to load tickets.');
    } finally {
      setTicketsLoading(false);
    }
  }, []);

  // ── Activity log ──────────────────────────────────────────────
  const fetchActivity = useCallback(async (params = {}) => {
    setActivityLoading(true);
    try {
      const data = await ProfileService.getActivity(params);
      setActivity(data.activity);
    } catch (err) {
      toastError(err?.response?.data?.message ?? 'Failed to load activity.');
    } finally {
      setActivityLoading(false);
    }
  }, []);

  return {
    // ── Profile data
    profile,
    profileLoading,
    profileError,
    fetchProfile,

    // ── Mutations
    loading,
    error,
    fieldErrors,
    updateProfile,
    changePassword,

    // ── Email change flow
    emailChangePending,
    requestEmailChange,
    confirmEmailChange,
    cancelEmailChange,

    // ── History
    bookings,
    bookingsLoading,
    fetchBookings,

    tickets,
    ticketsLoading,
    fetchTickets,

    activity,
    activityLoading,
    fetchActivity,
  };
}