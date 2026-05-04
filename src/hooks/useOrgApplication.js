//  Attendee side:
//   - submitApplication({ org_name, event_types, phone, reason })
//     → POSTs the form, stores the result in myApplication
//   - fetchMyApplication()
//     → GETs the attendee's latest application (pending/approved/rejected)
//
// Admin side:
//   - fetchApplications({ status, page })
//     → GETs the full list for the admin review page
//   - approveApplication(id) / rejectApplication(id)
//     → PUTs the decision, patches local state immediately
//
// The hook also syncs the auth store after approval so the Zustand user
// object reflects the new role without requiring a page refresh.

import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import OrganizerApplicationService from '../services/orgApplication.service';
import { useUiStore } from '../store/uiStore';
import { PAGINATION } from '../config/constants';

export function useOrganizerApplication() {
  const toastSuccess = useUiStore((state) => state.toastSuccess);
  const toastError = useUiStore((state) => state.toastError);

  // ── Attendee: my application ──────────────────────────────────
  const [myApplication, setMyApplication] = useState(null);
  const [myApplicationLoading, setMyApplicationLoading] = useState(true);
  const [myApplicationChecked, setMyApplicationChecked] = useState(false);

  // ── Submission form state ─────────────────────────────────────
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ── Admin: applications list ──────────────────────────────────
  const [applications, setApplications] = useState([]);
  const [applicationsPagination, setApplicationsPagination] = useState(null);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [mutating, setMutating] = useState(false);

  // ── URL params for admin list ─────────────────────────────────
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(
    searchParams.get('page') || PAGINATION.DEFAULT_PAGE,
    10
  );
  const statusFilter = searchParams.get('status') || 'pending';

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
      'Something went wrong. Failed to submit application, please try again.';
  
    setError(msg);
    return msg;
  }

  // ── Fetch attendee's own application ──────────────────────────
  const fetchMyApplication = useCallback(async () => {
    setMyApplicationLoading(true);
    try {
      const data = await OrganizerApplicationService.getMyApplication();
      setMyApplication(data.application ?? null);
    } catch (err) {
      const status = err?.response?.status;
      if (status !== 404) {
        const msg = err?.response?.data?.message ?? 'Failed to load your application.';
        toastError(msg);
      }
      setMyApplication(null);
    } finally {
      setMyApplicationLoading(false);
      setMyApplicationChecked(true);
    }
  }, []);

  // ── Submit application ────────────────────────────────────────
  const submitApplication = useCallback(
    async (formData) => {
      setLoading(true);
      setSubmitting(true);
      resetErrors();
      try {
        const data =
          await OrganizerApplicationService.submitApplication(formData);
        toastSuccess(
          data.message_hint ?? "Application submitted! We'll review it shortly."
        );

        // Re-fetch so the pending state screen appears
        await fetchMyApplication();
        return true;
      } catch (err) {
        toastError(extractError(err));
        return false;
      } finally {
        setSubmitting(false);
        setLoading(false);
      }
    },
    [fetchMyApplication]
  );

  // ── Admin: fetch all applications ─────────────────────────────
  const fetchApplications = useCallback(async () => {
    setApplicationsLoading(true);
    try {
      const data = await OrganizerApplicationService.getApplications({
        page,
        status: statusFilter,
        limit: PAGINATION.DEFAULT_PER_PAGE,
      });
      setApplications(data.applications);
      setApplicationsPagination(data.pagination);
    } catch (err) {
      const msg = err?.response?.data?.message ?? 'Failed to load applications.';
      toastError(msg);
    } finally {
      setApplicationsLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    // Only auto-fetch for admin when params are available
    if (searchParams.has('status') || searchParams.has('page')) {
      fetchApplications();
    }
  }, [fetchApplications]);

  // ── Admin: approve ────────────────────────────────────────────
  const approveApplication = useCallback(async (id) => {
    setLoading(true);
    setMutating(true);
    try {
      const data = await OrganizerApplicationService.approveApplication(id);
      toastSuccess(data.message_hint ?? 'Application approved. User is now an organizer.');
      // Remove from pending list
      setApplications((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      const msg = err?.response?.data?.message ?? 'Failed to approve application.';
      toastError(msg);
    } finally {
      setMutating(false);
      setLoading(false);
    }
  }, []);

  // ── Admin: reject ─────────────────────────────────────────────
  const rejectApplication = useCallback(async (id) => {
    setLoading(true)
    setMutating(true);
    try {
       const data = await OrganizerApplicationService.rejectApplication(id);
      toastSuccess(data.message_hint ?? 'Application rejected.');
      setApplications((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      toastError(
        err?.response?.data?.message ?? 'Failed to reject application.'
      );
    } finally {
      setMutating(false);
      setLoading(false)
    }
  }, []);

  // ── URL param setters (admin) ─────────────────────────────────
  function setStatusFilter(value) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('status', value || 'pending');
      next.set('page', '1');
      return next;
    });
  }

  function setPage(newPage) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('page', String(newPage));
      return next;
    });
  }

  // ── Derived helpers ───────────────────────────────────────────
  const hasPendingApplication = myApplication?.status === 'pending';
  const hasApprovedApplication = myApplication?.status === 'approved';
  const hasRejectedApplication = myApplication?.status === 'rejected';
  const canApply = !myApplication || hasRejectedApplication;

  return {
    // ── Attendee
    myApplication,
    myApplicationLoading,
    myApplicationChecked,
    fetchMyApplication,
    hasPendingApplication,
    hasApprovedApplication,
    hasRejectedApplication,
    canApply,

    // ── Submission
    submitting,
    loading,
    error,
    fieldErrors,
    submitApplication,

    // ── Admin list
    applications,
    applicationsPagination,
    applicationsLoading,
    page,
    statusFilter,
    setPage,
    setStatusFilter,
    fetchApplications,

    // ── Admin mutations
    mutating,
    approveApplication,
    rejectApplication,
  };
}
