// useTransactions — financial audit log for attendee, organizer, and admin.
//
// Usage:
//   const { myTransactions, fetchMyTransactions } = useTransactions();
//   const { organizerTransactions, fetchOrganizerTransactions } = useTransactions();
//   const { adminTransactions, fetchAdminTransactions, summary, fetchSummary } = useTransactions();

import { useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import TransactionService from '../services/transaction.service';
import { useUiStore } from '../store/uiStore';
import { PAGINATION } from '../config/constants';

export function useTransactions() {
  const toastError = useUiStore((s) => s.toastError);

  // ── Attendee: own payment history ─────────────────────────────
  const [myTransactions, setMyTransactions] = useState([]);
  const [myTransactionsPagination, setMyTransactionsPagination] =
    useState(null);
  const [myTransactionsLoading, setMyTransactionsLoading] = useState(false);

  // ── Organizer: revenue ledger ─────────────────────────────────
  const [organizerTransactions, setOrganizerTransactions] = useState([]);
  const [organizerTransactionsPagination, setOrganizerTransactionsPagination] =
    useState(null);
  const [organizerTransactionsLoading, setOrganizerTransactionsLoading] =
    useState(false);
  const [organizerSummary, setOrganizerSummary] = useState(null);

  // ── Admin: platform-wide log ──────────────────────────────────
  const [adminTransactions, setAdminTransactions] = useState([]);
  const [adminTransactionsPagination, setAdminTransactionsPagination] =
    useState(null);
  const [adminTransactionsLoading, setAdminTransactionsLoading] =
    useState(false);

  // ── Admin: financial KPI summary ──────────────────────────────
  const [summary, setSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

  // ── Single booking audit trail ────────────────────────────────
  const [auditTrail, setAuditTrail] = useState([]);
  const [auditTrailLoading, setAuditTrailLoading] = useState(false);

  // ── URL params for filter state ───────────────────────────────
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(
    searchParams.get('page') || PAGINATION.DEFAULT_PAGE,
    10
  );
  const fromDate = searchParams.get('from') || '';
  const toDate = searchParams.get('to') || '';
  const typeFilter = searchParams.get('type') || '';
  const eventFilter = parseInt(searchParams.get('event_id') || '0', 10);

  // ── Fetch attendee's own transactions ─────────────────────────
  const fetchMyTransactions = useCallback(
    async (params = {}) => {
      setMyTransactionsLoading(true);
      try {
        const data = await TransactionService.getMyTransactions({
          page,
          ...params,
        });
        setMyTransactions(data.transactions ?? []);
        setMyTransactionsPagination(data.pagination ?? null);
      } catch (err) {
        toastError(
          err?.response?.data?.message ?? 'Failed to load transaction history.'
        );
      } finally {
        setMyTransactionsLoading(false);
      }
    },
    [page]
  );

  // ── Fetch organizer revenue ledger ────────────────────────────
  const fetchOrganizerTransactions = useCallback(
    async (params = {}) => {
      setOrganizerTransactionsLoading(true);
      try {
        const data = await TransactionService.getOrganizerTransactions({
          page,
          from: fromDate || undefined,
          to: toDate || undefined,
          type: typeFilter || undefined,
          event_id: eventFilter || undefined,
          ...params,
        });
        setOrganizerTransactions(data.transactions ?? []);
        setOrganizerTransactionsPagination(data.pagination ?? null);
        setOrganizerSummary(data.summary ?? null);
      } catch (err) {
        toastError(
          err?.response?.data?.message ?? 'Failed to load revenue ledger.'
        );
      } finally {
        setOrganizerTransactionsLoading(false);
      }
    },
    [page, fromDate, toDate, typeFilter, eventFilter]
  );

  // ── Fetch admin platform-wide transactions ────────────────────
  const fetchAdminTransactions = useCallback(
    async (params = {}) => {
      setAdminTransactionsLoading(true);
      try {
        const data = await TransactionService.getAdminTransactions({
          page,
          from: fromDate || undefined,
          to: toDate || undefined,
          type: typeFilter || undefined,
          ...params,
        });
        setAdminTransactions(data.transactions ?? []);
        setAdminTransactionsPagination(data.pagination ?? null);
      } catch (err) {
        toastError(
          err?.response?.data?.message ?? 'Failed to load transactions.'
        );
      } finally {
        setAdminTransactionsLoading(false);
      }
    },
    [page, fromDate, toDate, typeFilter]
  );

  // ── Fetch admin financial KPI summary ─────────────────────────
  const fetchSummary = useCallback(
    async (params = {}) => {
      setSummaryLoading(true);
      try {
        const data = await TransactionService.getAdminSummary({
          from: fromDate || undefined,
          to: toDate || undefined,
          ...params,
        });
        setSummary(data);
      } catch (err) {
        toastError(
          err?.response?.data?.message ?? 'Failed to load financial summary.'
        );
      } finally {
        setSummaryLoading(false);
      }
    },
    [fromDate, toDate]
  );

  // ── Fetch audit trail for a single booking ────────────────────
  const fetchAuditTrail = useCallback(async (bookingId) => {
    setAuditTrailLoading(true);
    try {
      const data = await TransactionService.getBookingAuditTrail(bookingId);
      setAuditTrail(data.audit_trail ?? []);
    } catch (err) {
      toastError(err?.response?.data?.message ?? 'Failed to load audit trail.');
    } finally {
      setAuditTrailLoading(false);
    }
  }, []);

  // ── URL param setters ─────────────────────────────────────────
  function setPage(newPage) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('page', String(newPage));
      return next;
    });
  }

  function setFromDate(value) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set('from', value);
      else next.delete('from');
      next.set('page', '1');
      return next;
    });
  }

  function setToDate(value) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set('to', value);
      else next.delete('to');
      next.set('page', '1');
      return next;
    });
  }

  function setTypeFilter(value) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set('type', value);
      else next.delete('type');
      next.set('page', '1');
      return next;
    });
  }

  function setEventFilter(value) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set('event_id', String(value));
      else next.delete('event_id');
      next.set('page', '1');
      return next;
    });
  }

  function clearFilters() {
    setSearchParams({ page: '1' });
  }

  return {
    // ── Attendee
    myTransactions,
    myTransactionsPagination,
    myTransactionsLoading,
    fetchMyTransactions,

    // ── Organizer
    organizerTransactions,
    organizerTransactionsPagination,
    organizerTransactionsLoading,
    organizerSummary,
    fetchOrganizerTransactions,

    // ── Admin list
    adminTransactions,
    adminTransactionsPagination,
    adminTransactionsLoading,
    fetchAdminTransactions,

    // ── Admin summary
    summary,
    summaryLoading,
    fetchSummary,

    // ── Audit trail
    auditTrail,
    auditTrailLoading,
    fetchAuditTrail,

    // ── Active filter values (read from URL)
    page,
    fromDate,
    toDate,
    typeFilter,
    eventFilter,

    // ── Filter setters
    setPage,
    setFromDate,
    setToDate,
    setTypeFilter,
    setEventFilter,
    clearFilters,
  };
}
