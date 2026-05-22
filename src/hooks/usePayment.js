// usePayouts — admin payout management.
//
// Covers:
//   - Fetching all payouts platform-wide with filters
//   - Fetching pending payouts (admin action queue)
//   - Triggering a manual payout
//   - Freezing / unfreezing a payout
//   - Refunding all attendees for a cancelled event
//   - Clearing an organizer's flag + resetting strike count
//
// Usage:
//   const { payouts, fetchPayouts, triggerPayout, freezePayout } = usePayouts();

import { useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import PayoutService from '../services/payout.service';
import { useUiStore } from '../store/uiStore';
import { PAGINATION } from '../config/constants';

export function usePayouts() {
  const toastSuccess = useUiStore((s) => s.toastSuccess);
  const toastError = useUiStore((s) => s.toastError);

  // ── All payouts list ──────────────────────────────────────────
  const [payouts, setPayouts] = useState([]);
  const [payoutsPagination, setPayoutsPagination] = useState(null);
  const [payoutsLoading, setPayoutsLoading] = useState(false);

  // ── Pending payouts (admin action queue) ──────────────────────
  const [pendingPayouts, setPendingPayouts] = useState([]);
  const [pendingPayoutsLoading, setPendingPayoutsLoading] = useState(false);

  // ── Mutation state ────────────────────────────────────────────
  const [mutating, setMutating] = useState(false);
  const [mutatingId, setMutatingId] = useState(null); // tracks which eventId is being mutated

  // ── URL params ────────────────────────────────────────────────
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(
    searchParams.get('page') || PAGINATION.DEFAULT_PAGE,
    10
  );
  const statusFilter = searchParams.get('status') || '';

  // ── Fetch all payouts ─────────────────────────────────────────
  const fetchPayouts = useCallback(
    async (params = {}) => {
      setPayoutsLoading(true);
      try {
        const data = await PayoutService.getPayouts({
          page,
          status: statusFilter || undefined,
          ...params,
        });
        setPayouts(data.payouts ?? []);
        setPayoutsPagination(data.pagination ?? null);
      } catch (err) {
        toastError(err?.response?.data?.message ?? 'Failed to load payouts.');
      } finally {
        setPayoutsLoading(false);
      }
    },
    [page, statusFilter]
  );

  // ── Fetch pending payouts (action queue) ──────────────────────
  const fetchPendingPayouts = useCallback(async () => {
    setPendingPayoutsLoading(true);
    try {
      const data = await PayoutService.getPendingPayouts();
      setPendingPayouts(data.payouts ?? []);
    } catch (err) {
      toastError(
        err?.response?.data?.message ?? 'Failed to load pending payouts.'
      );
    } finally {
      setPendingPayoutsLoading(false);
    }
  }, []);

  // ── Manually trigger a payout ─────────────────────────────────
  const triggerPayout = useCallback(async (eventId, { onSuccess } = {}) => {
    setMutating(true);
    setMutatingId(eventId);
    try {
      const data = await PayoutService.triggerPayout(eventId);
      toastSuccess(
        `Payout triggered successfully. Transfer code: ${data.transfer_code}`
      );
      // Patch local list so the status updates without a full re-fetch
      setPayouts((prev) =>
        prev.map((p) =>
          p.event_id === eventId ? { ...p, payout_status: 'paid' } : p
        )
      );
      setPendingPayouts((prev) => prev.filter((p) => p.event_id !== eventId));
      onSuccess?.(data);
    } catch (err) {
      toastError(err?.response?.data?.message ?? 'Failed to trigger payout.');
    } finally {
      setMutating(false);
      setMutatingId(null);
    }
  }, []);

  // ── Freeze a payout ───────────────────────────────────────────
  // Use when an attendee reports a scam or dispute
  const freezePayout = useCallback(
    async (eventId, reason, { onSuccess } = {}) => {
      if (!reason?.trim()) {
        toastError('A reason is required to freeze a payout.');
        return;
      }
      setMutating(true);
      setMutatingId(eventId);
      try {
        await PayoutService.freezePayout(eventId, reason);
        toastSuccess('Payout frozen successfully.');
        setPayouts((prev) =>
          prev.map((p) =>
            p.event_id === eventId
              ? { ...p, payout_status: 'frozen', freeze_reason: reason }
              : p
          )
        );
        setPendingPayouts((prev) => prev.filter((p) => p.event_id !== eventId));
        onSuccess?.();
      } catch (err) {
        toastError(err?.response?.data?.message ?? 'Failed to freeze payout.');
      } finally {
        setMutating(false);
        setMutatingId(null);
      }
    },
    []
  );

  // ── Unfreeze a payout ─────────────────────────────────────────
  // Goes back to pending — auto worker will pick it up on next run
  const unfreezePayout = useCallback(async (eventId, { onSuccess } = {}) => {
    setMutating(true);
    setMutatingId(eventId);
    try {
      await PayoutService.unfreezePayout(eventId);
      toastSuccess('Payout unfrozen. It will process in the next worker run.');
      setPayouts((prev) =>
        prev.map((p) =>
          p.event_id === eventId
            ? { ...p, payout_status: 'pending', freeze_reason: null }
            : p
        )
      );
      onSuccess?.();
    } catch (err) {
      toastError(err?.response?.data?.message ?? 'Failed to unfreeze payout.');
    } finally {
      setMutating(false);
      setMutatingId(null);
    }
  }, []);

  // ── Refund all attendees for a cancelled event ────────────────
  // Platform absorbs Paystack charges — organizer gets nothing
  const refundAll = useCallback(
    async (eventId, reason = '', { onSuccess } = {}) => {
      setMutating(true);
      setMutatingId(eventId);
      try {
        const data = await PayoutService.refundAll(eventId, reason);
        toastSuccess(
          `${data.refunded} refund(s) processed.${data.failed > 0 ? ` ${data.failed} failed.` : ''}`
        );
        setPayouts((prev) =>
          prev.map((p) =>
            p.event_id === eventId ? { ...p, payout_status: 'cancelled' } : p
          )
        );
        onSuccess?.(data);
      } catch (err) {
        toastError(
          err?.response?.data?.message ?? 'Failed to process refunds.'
        );
      } finally {
        setMutating(false);
        setMutatingId(null);
      }
    },
    []
  );

  // ── Clear organizer flag + reset strike count ─────────────────
  const clearOrganizerFlag = useCallback(
    async (organizerId, { onSuccess } = {}) => {
      setMutating(true);
      try {
        await PayoutService.clearOrganizerFlag(organizerId);
        toastSuccess('Organizer flag cleared and strike count reset to zero.');
        onSuccess?.();
      } catch (err) {
        toastError(
          err?.response?.data?.message ?? 'Failed to clear organizer flag.'
        );
      } finally {
        setMutating(false);
      }
    },
    []
  );

  // ── URL param setters ─────────────────────────────────────────
  function setPage(newPage) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('page', String(newPage));
      return next;
    });
  }

  function setStatusFilter(value) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set('status', value);
      else next.delete('status');
      next.set('page', '1');
      return next;
    });
  }

  return {
    // ── All payouts
    payouts,
    payoutsPagination,
    payoutsLoading,
    fetchPayouts,

    // ── Pending payouts (action queue)
    pendingPayouts,
    pendingPayoutsLoading,
    fetchPendingPayouts,

    // ── Mutations
    mutating,
    mutatingId,
    triggerPayout,
    freezePayout,
    unfreezePayout,
    refundAll,
    clearOrganizerFlag,

    // ── Filter values (from URL)
    page,
    statusFilter,

    // ── Filter setters
    setPage,
    setStatusFilter,
  };
}
