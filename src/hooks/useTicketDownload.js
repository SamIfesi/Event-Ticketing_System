// Handles downloading the server-generated PDF ticket for a booking.
// The backend queues PDF generation after payment — the worker picks
// it up within 30 seconds. This hook polls until ready, then triggers
// the browser download.

import { useState, useCallback } from 'react';
import TicketsService from '../services/tickets.service';
import { useUiStore } from '../store/uiStore';

export function useTicketDownload() {
  const toastSuccess = useUiStore((s) => s.toastSuccess);
  const toastError   = useUiStore((s) => s.toastError);
  const toastInfo    = useUiStore((s) => s.toastInfo);

  const [downloading, setDownloading] = useState(false);
  const [checking,    setChecking]    = useState(false);
  const [isReady,     setIsReady]     = useState(null); // null = unknown, true/false

  // ── Check if PDF has been generated yet ───────────────────
  const checkStatus = useCallback(async (bookingId) => {
    setChecking(true);
    try {
      const data = await TicketsService.getTicketStatus(bookingId);
      setIsReady(data.ticket_generated);
      return data.ticket_generated;
    } catch {
      return false;
    } finally {
      setChecking(false);
    }
  }, []);

  // ── Poll until ready, then download ───────────────────────
  // Useful right after payment when the worker hasn't finished yet.
  const waitAndDownload = useCallback(
    async (bookingId, maxWaitSeconds = 60) => {
      setDownloading(true);
      toastInfo('Preparing your ticket PDF…');

      const interval = 3000; // check every 3 seconds
      const maxTries = (maxWaitSeconds * 1000) / interval;
      let   tries    = 0;

      const poll = async () => {
        const ready = await checkStatus(bookingId);

        if (ready) {
          try {
            await TicketsService.downloadTicket(bookingId);
            toastSuccess('Ticket downloaded!');
            setIsReady(true);
          } catch {
            toastError('Download failed. Please try again.');
          } finally {
            setDownloading(false);
          }
          return;
        }

        tries++;
        if (tries >= maxTries) {
          toastError('Ticket is still being generated. Try again in a moment.');
          setDownloading(false);
          return;
        }

        setTimeout(poll, interval);
      };

      await poll();
    },
    [checkStatus]
  );

  // ── Direct download (PDF already exists) ──────────────────
  const download = useCallback(
    async (bookingId) => {
      setDownloading(true);
      try {
        await TicketsService.downloadTicket(bookingId);
        toastSuccess('Ticket downloaded!');
      } catch (err) {
        // If 404/400 the PDF isn't generated yet — poll instead
        if (err?.response?.status === 404 || err?.response?.status === 400) {
          await waitAndDownload(bookingId);
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

  return {
    downloading,
    checking,
    isReady,
    checkStatus,
    download,
    waitAndDownload,
  };
}
