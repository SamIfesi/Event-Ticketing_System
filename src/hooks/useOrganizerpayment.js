// useOrganizerPayment — organizer bank details + payout history.
//
// Covers:
//   - Fetching bank list for dropdown
//   - Resolving account number (verify before saving)
//   - Saving bank details for the first time
//   - Updating existing bank details
//   - Fetching own payout history
//
// Usage:
//   const { paymentDetails, fetchPaymentDetails, savePaymentDetails } = useOrganizerPayment();

import { useState, useCallback } from 'react';
import OrganizerPaymentService from '../services/organizerPayment.service';
import { useUiStore } from '../store/uiStore';

export function useOrganizerPayment() {
  const toastSuccess = useUiStore((s) => s.toastSuccess);
  const toastError = useUiStore((s) => s.toastError);

  // ── Bank details ──────────────────────────────────────────────
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [paymentDetailsLoading, setPaymentDetailsLoading] = useState(false);

  // ── Banks dropdown list ───────────────────────────────────────
  const [banks, setBanks] = useState([]);
  const [banksLoading, setBanksLoading] = useState(false);

  // ── Account resolution (verify before saving) ─────────────────
  const [resolvedAccount, setResolvedAccount] = useState(null); // { account_name, account_number }
  const [resolveLoading, setResolveLoading] = useState(false);
  const [resolveError, setResolveError] = useState(null);

  // ── Mutation (save / update) ──────────────────────────────────
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  // ── Payout history ────────────────────────────────────────────
  const [payouts, setPayouts] = useState([]);
  const [payoutsPagination, setPayoutsPagination] = useState(null);
  const [payoutsLoading, setPayoutsLoading] = useState(false);

  // ── Helpers ───────────────────────────────────────────────────
  function resetErrors() {
    setSaveError(null);
    setFieldErrors({});
  }

  function extractError(err) {
    const data = err?.response?.data;
    if (data?.errors) {
      setFieldErrors(data.errors);
      const msg = Object.values(data.errors).join('\n');
      setSaveError(msg);
      return msg;
    }
    const msg = data?.message ?? 'Something went wrong. Please try again.';
    setSaveError(msg);
    return msg;
  }

  // ── Fetch supported banks ─────────────────────────────────────
  // Call once on mount of the payment details form
  const fetchBanks = useCallback(async () => {
    setBanksLoading(true);
    try {
      const data = await OrganizerPaymentService.getBanks();
      setBanks(data.banks ?? []);
    } catch (err) {
      toastError(err?.response?.data?.message ?? 'Could not load bank list.');
    } finally {
      setBanksLoading(false);
    }
  }, []);

  // ── Resolve account number ────────────────────────────────────
  // Call when user has filled in both account number and bank
  // Shows them their account name before they confirm and save
  const resolveAccount = useCallback(async ({ accountNumber, bankCode }) => {
    setResolveLoading(true);
    setResolveError(null);
    setResolvedAccount(null);
    try {
      const data = await OrganizerPaymentService.resolveAccount({
        accountNumber,
        bankCode,
      });
      setResolvedAccount(data);
      return data;
    } catch (err) {
      const msg =
        err?.response?.data?.message ??
        'Could not verify account. Check the details and try again.';
      setResolveError(msg);
      return null;
    } finally {
      setResolveLoading(false);
    }
  }, []);

  // ── Fetch saved payment details ───────────────────────────────
  const fetchPaymentDetails = useCallback(async () => {
    setPaymentDetailsLoading(true);
    try {
      const data = await OrganizerPaymentService.getPaymentDetails();
      setPaymentDetails(data.payment_details ?? null);
    } catch (err) {
      toastError(
        err?.response?.data?.message ?? 'Failed to load payment details.'
      );
    } finally {
      setPaymentDetailsLoading(false);
    }
  }, []);

  // ── Save bank details for the first time ──────────────────────
  // Automatically creates Paystack subaccount + recipient
  const savePaymentDetails = useCallback(
    async (formData, { onSuccess } = {}) => {
      setSaving(true);
      resetErrors();
      try {
        const data = await OrganizerPaymentService.savePaymentDetails(formData);
        toastSuccess('Bank details saved and verified successfully.');
        // Refresh local state
        await fetchPaymentDetails();
        onSuccess?.(data);
        return true;
      } catch (err) {
        toastError(extractError(err));
        return false;
      } finally {
        setSaving(false);
      }
    },
    [fetchPaymentDetails]
  );

  // ── Update existing bank details ──────────────────────────────
  // Re-verifies account and updates Paystack subaccount automatically
  const updatePaymentDetails = useCallback(
    async (formData, { onSuccess } = {}) => {
      setSaving(true);
      resetErrors();
      try {
        const data =
          await OrganizerPaymentService.updatePaymentDetails(formData);
        toastSuccess('Bank details updated successfully.');
        await fetchPaymentDetails();
        onSuccess?.(data);
        return true;
      } catch (err) {
        toastError(extractError(err));
        return false;
      } finally {
        setSaving(false);
      }
    },
    [fetchPaymentDetails]
  );

  // ── Fetch own payout history ──────────────────────────────────
  const fetchMyPayouts = useCallback(async (params = {}) => {
    setPayoutsLoading(true);
    try {
      const data = await OrganizerPaymentService.getMyPayouts(params);
      setPayouts(data.payouts ?? []);
      setPayoutsPagination(data.pagination ?? null);
    } catch (err) {
      toastError(
        err?.response?.data?.message ?? 'Failed to load payout history.'
      );
    } finally {
      setPayoutsLoading(false);
    }
  }, []);

  // ── Derived helpers ───────────────────────────────────────────
  const hasPaymentDetails = Boolean(paymentDetails);
  const isVerified = Boolean(paymentDetails?.is_verified);
  const isFlagged = Boolean(paymentDetails?.is_flagged);
  const cancellationCount = paymentDetails?.cancellation_count ?? 0;

  return {
    // ── Bank details
    paymentDetails,
    paymentDetailsLoading,
    hasPaymentDetails,
    isVerified,
    isFlagged,
    cancellationCount,
    fetchPaymentDetails,

    // ── Banks dropdown
    banks,
    banksLoading,
    fetchBanks,

    // ── Account resolution
    resolvedAccount,
    resolveLoading,
    resolveError,
    resolveAccount,
    clearResolvedAccount: () => setResolvedAccount(null),

    // ── Save / update
    saving,
    saveError,
    fieldErrors,
    savePaymentDetails,
    updatePaymentDetails,

    // ── Payout history
    payouts,
    payoutsPagination,
    payoutsLoading,
    fetchMyPayouts,
  };
}
