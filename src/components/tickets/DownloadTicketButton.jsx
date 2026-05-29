// Reusable button/link that downloads the server-generated PDF for a booking.
// Backend streams a PDF from GET /bookings/:id/ticket.
// If the PDF isn't ready yet it polls until it is (up to 60s).
//
// Props:
//   bookingId    — booking ID (one PDF per booking, not per ticket)
//   size         — 'sm' | 'md' (default 'md')
//   variant      — 'button' | 'link' (default 'button')
//   checkOnMount — if true, checks PDF status on mount to show ready state

import { useEffect } from 'react';
import { Download, Loader2, CheckCircle2 } from 'lucide-react';
import { useTicketDownload } from '../../hooks/useTicketDownload';

export default function DownloadTicketButton({
  bookingId,
  size = 'md',
  variant = 'button',
  checkOnMount = false,
}) {
  const { downloading, checking, isReady, checkStatus, download } =
    useTicketDownload();

  useEffect(() => {
    if (checkOnMount && bookingId) {
      checkStatus(bookingId);
    }
  }, [bookingId, checkOnMount]);

  const isLoading = downloading || checking;

  function handleClick() {
    if (isLoading) return;
    download(bookingId);
  }

  // ── Link variant (inline, no background) ──────────────────
  if (variant === 'link') {
    return (
      <button
        onClick={handleClick}
        disabled={isLoading}
        className="flex items-center gap-1.5 text-xs font-semibold text-accent hover:text-accent-hover transition-colors disabled:opacity-50 touch-manipulation"
      >
        {isLoading ? (
          <Loader2 size={13} className="animate-spin" />
        ) : (
          <Download size={13} strokeWidth={2.5} />
        )}
        {downloading
          ? 'Downloading…'
          : checking
            ? 'Checking…'
            : 'Download Ticket'}
      </button>
    );
  }

  // ── Button variant ─────────────────────────────────────────
  const sizeClasses =
    size === 'sm' ? 'h-9 px-3 text-xs gap-1.5' : 'h-11 px-5 text-sm gap-2';

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`
        inline-flex items-center justify-center font-semibold rounded-btn
        border border-accent-border bg-accent-text text-accent
        hover:bg-accent hover:text-white
        transition-colors duration-150
        disabled:opacity-50 disabled:cursor-not-allowed
        touch-manipulation
        ${sizeClasses}
      `}
    >
      {isLoading ? (
        <Loader2
          size={size === 'sm' ? 13 : 15}
          className="animate-spin shrink-0"
        />
      ) : isReady === true ? (
        <CheckCircle2
          size={size === 'sm' ? 13 : 15}
          className="shrink-0"
          strokeWidth={2.5}
        />
      ) : (
        <Download
          size={size === 'sm' ? 13 : 15}
          className="shrink-0"
          strokeWidth={2.5}
        />
      )}
      <span>
        {downloading
          ? 'Downloading…'
          : checking
            ? 'Checking…'
            : 'Download Ticket'}
      </span>
    </button>
  );
}
