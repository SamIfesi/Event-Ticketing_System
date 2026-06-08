// useTicketDownload — all ticket download + management actions.
//
// Attendee:   download()        — PDF
//             downloadPng()     — PNG
//             checkStatus()     — poll PDF + PNG readiness
//             waitAndDownload() — poll then download (right after payment)
//
// Organizer:  fetchCheckinList() — full attendee check-in list + summary
//             checkin()          — submit scanned QR token at the gate
//
// Admin:      adminDownload()    — download any booking's PDF
//             adminDownloadPng() — download any booking's PNG
//             regenerate()       — force-clear cache and regenerate both files
//
// Dev:        devFetchFailed()   — list all failed/pending bookings
//             devForcePay()      — manually mark a booking as paid + issue tickets

import { useState, useCallback } from 'react';
import TicketsService from '../services/tickets.service';
import { useUiStore } from '../store/uiStore';

export function useTicketDownload() {
  const toastSuccess = useUiStore((s) => s.toastSuccess);
  const toastError   = useUiStore((s) => s.toastError);
  const toastInfo    = useUiStore((s) => s.toastInfo);

  // ── Attendee download states ───────────────────────────────
  const [downloading,    setDownloading]    = useState(false);
  const [downloadingPng, setDownloadingPng] = useState(false);
  const [checking,       setChecking]       = useState(false);
  const [isReady,        setIsReady]        = useState(null); // null=unknown true/false
  const [isPngReady, setIsPngReady]         = useState(null);

  // ── Organizer check-in states ──────────────────────────────
  const [checkinList, setCheckinList] = useState(null);
  const [checkinListLoading, setCheckinListLoading] = useState(false);
  const [checkinLoading, setCheckinLoading] = useState(false);
  const [checkinResult, setCheckinResult] = useState(null);
  const [checkinError, setCheckinError] = useState(null);

  // ── Admin states ───────────────────────────────────────────
  const [adminDownloading, setAdminDownloading] = useState(false);
  const [adminDownloadingPng, setAdminDownloadingPng] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [regenerateResult, setRegenerateResult] = useState(null);

  // ── Dev states ─────────────────────────────────────────────
  const [failedBookings, setFailedBookings] = useState([]);
  const [failedBookingsLoading, setFailedBookingsLoading] = useState(false);
  const [forcePayLoading, setForcePayLoading] = useState(false);
  const [forcePayResult, setForcePayResult] = useState(null);

  // ============================================================
  // ATTENDEE
  // ============================================================

  // Check if PDF + PNG have been generated yet.
  // Returns the full status object from the backend.
  const checkStatus = useCallback(async (bookingId) => {
    setChecking(true);
    try {
      const data = await TicketsService.getTicketStatus(bookingId);
      setIsReady(data.ticket_generated);
      setIsPngReady(data.png_generated);
      return data;
    } catch {
      return { ticket_generated: false, png_generated: false };
    } finally {
      setChecking(false);
    }
  }, []);

  // Poll until the file is ready then trigger the download.
  // Used right after payment when the worker may not have finished yet.
  // format: 'pdf' | 'png'
  const waitAndDownload = useCallback(
    async (bookingId, format = 'pdf', maxWaitSeconds = 60) => {
      if (!bookingId) return toastError('Invalid booking ID.');

      const isPng = format === 'png';
      isPng ? setDownloadingPng(true) : setDownloading(true);
      toastInfo(`Preparing your ticket ${isPng ? 'image' : 'PDF'}…`);

      const interval = 3000;
      const maxTries = (maxWaitSeconds * 1000) / interval;
      let tries = 0;

      const poll = async () => {
        const status = await checkStatus(bookingId);
        const ready = isPng ? status.png_generated : status.ticket_generated;

        if (ready) {
          try {
            if (isPng) {
              await TicketsService.downloadTicketPng(bookingId);
            } else {
              await TicketsService.downloadTicket(bookingId);
            }
            toastSuccess('Ticket downloaded!');
            isPng ? setIsPngReady(true) : setIsReady(true);
          } catch {
            toastError('Download failed. Please try again.');
          } finally {
            isPng ? setDownloadingPng(false) : setDownloading(false);
          }
          return;
        }

        tries++;
        if (tries >= maxTries) {
          toastError('Ticket is still being generated. Try again in a moment.');
          isPng ? setDownloadingPng(false) : setDownloading(false);
          return;
        }

        setTimeout(poll, interval);
      };

      await poll();
    },
    [checkStatus]
  );

  // Direct PDF download. Falls back to polling if file not ready yet.
  const download = useCallback(
    async (bookingId) => {
      setDownloading(true);
      try {
        await TicketsService.downloadTicket(bookingId);
        toastSuccess('Ticket downloaded!');
      } catch (err) {
        if (err?.response?.status === 404 || err?.response?.status === 400) {
          await waitAndDownload(bookingId, 'pdf');
        } else {
          toastError(
            err?.response?.data?.message ?? 'Download failed. Please try again.'
          );
        }
      } finally {
        setDownloading(false);
      }
    },
    [waitAndDownload]
  );

  // Direct PNG download. Falls back to polling if file not ready yet.
  const downloadPng = useCallback(
    async (bookingId) => {
      setDownloadingPng(true);
      try {
        await TicketsService.downloadTicketPng(bookingId);
        toastSuccess('Ticket image downloaded!');
      } catch (err) {
        if (err?.response?.status === 404 || err?.response?.status === 400) {
          await waitAndDownload(bookingId, 'png');
        } else {
          toastError(
            err?.response?.data?.message ?? 'Download failed. Please try again.'
          );
        }
      } finally {
        setDownloadingPng(false);
      }
    },
    [waitAndDownload]
  );

  // ============================================================
  // ORGANIZER
  // ============================================================

  // Fetch the full check-in list + summary for an event.
  // Returns { summary: { total, checked_in, remaining }, tickets[] }
  const fetchCheckinList = useCallback(async (eventId) => {
    setCheckinListLoading(true);
    try {
      const data = await TicketsService.getCheckinList(eventId);
      setCheckinList(data);
      return data;
    } catch (err) {
      toastError(
        err?.response?.data?.message ?? 'Could not load check-in list.'
      );
      return null;
    } finally {
      setCheckinListLoading(false);
    }
  }, []);

  // Submit a scanned QR token at the gate.
  // Stores result or error so the scanner UI can display it.
  const checkin = useCallback(async (qrToken) => {
    setCheckinLoading(true);
    setCheckinResult(null);
    setCheckinError(null);
    try {
      const data = await TicketsService.checkin(qrToken);
      setCheckinResult(data);
      toastSuccess(`✓ ${data.attendee_name} checked in.`);
      return data;
    } catch (err) {
      const msg = err?.response?.data?.message ?? 'Invalid ticket.';
      setCheckinError(msg);
      toastError(msg);
      return null;
    } finally {
      setCheckinLoading(false);
    }
  }, []);

  function resetCheckin() {
    setCheckinResult(null);
    setCheckinError(null);
  }

  // ============================================================
  // ADMIN
  // ============================================================

  // Download any booking's PDF ticket (no ownership check).
  const adminDownload = useCallback(async (bookingId) => {
    setAdminDownloading(true);
    try {
      await TicketsService.adminDownloadTicket(bookingId);
      toastSuccess('Ticket downloaded.');
    } catch (err) {
      toastError(
        err?.response?.data?.message ?? 'Download failed. Please try again.'
      );
    } finally {
      setAdminDownloading(false);
    }
  }, []);

  // Download any booking's PNG ticket (no ownership check).
  const adminDownloadPng = useCallback(async (bookingId) => {
    setAdminDownloadingPng(true);
    try {
      await TicketsService.adminDownloadTicketPng(bookingId);
      toastSuccess('Ticket image downloaded.');
    } catch (err) {
      toastError(
        err?.response?.data?.message ?? 'Download failed. Please try again.'
      );
    } finally {
      setAdminDownloadingPng(false);
    }
  }, []);

  // Force-clear the cached PDF + PNG and regenerate both.
  // Returns { booking_id, ticket_url, ticket_png_url, file_size }
  const regenerate = useCallback(async (bookingId) => {
    setRegenerating(true);
    setRegenerateResult(null);
    try {
      const data = await TicketsService.regenerateTicket(bookingId);
      setRegenerateResult(data);
      toastSuccess('Ticket regenerated successfully.');
      // Reset readiness so UI reflects the fresh files
      setIsReady(true);
      setIsPngReady(true);
      return data;
    } catch (err) {
      toastError(
        err?.response?.data?.message ?? 'Regeneration failed. Please try again.'
      );
      return null;
    } finally {
      setRegenerating(false);
    }
  }, []);

  // ============================================================
  // DEV
  // ============================================================

  // Fetch all failed and pending bookings for debugging.
  // Returns { bookings[] }
  const devFetchFailed = useCallback(async () => {
    setFailedBookingsLoading(true);
    try {
      const data = await TicketsService.devGetFailedBookings();
      setFailedBookings(data.bookings ?? []);
      return data;
    } catch (err) {
      toastError(
        err?.response?.data?.message ?? 'Could not load failed bookings.'
      );
      return null;
    } finally {
      setFailedBookingsLoading(false);
    }
  }, []);

  // Manually mark a booking as paid and issue tickets.
  // No real Paystack transaction — dev tool only.
  // Returns { booking_id, tickets[] }
  const devForcePay = useCallback(async (bookingId) => {
    setForcePayLoading(true);
    setForcePayResult(null);
    try {
      const data = await TicketsService.devForcePay(bookingId);
      setForcePayResult(data);
      toastSuccess(`Booking #${bookingId} force-paid. Tickets issued.`);
      return data;
    } catch (err) {
      toastError(
        err?.response?.data?.message ?? 'Force pay failed. Please try again.'
      );
      return null;
    } finally {
      setForcePayLoading(false);
    }
  }, []);

  // ============================================================
  // RETURN
  // ============================================================
  return {
    // ── Attendee ─────────────────────────────────────────────
    downloading,
    downloadingPng,
    checking,
    isReady,
    isPngReady,
    checkStatus,
    download,
    downloadPng,
    waitAndDownload,

    // ── Organizer ─────────────────────────────────────────────
    checkinList,
    checkinListLoading,
    fetchCheckinList,
    checkinLoading,
    checkinResult,
    checkinError,
    checkin,
    resetCheckin,

    // ── Admin ─────────────────────────────────────────────────
    adminDownloading,
    adminDownloadingPng,
    adminDownload,
    adminDownloadPng,
    regenerating,
    regenerateResult,
    regenerate,

    // ── Dev ───────────────────────────────────────────────────
    failedBookings,
    failedBookingsLoading,
    devFetchFailed,
    forcePayLoading,
    forcePayResult,
    devForcePay,
  };
}
