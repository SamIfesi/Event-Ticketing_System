// DownloadTicketButton — downloads the server-generated PDF or PNG ticket.
//
// When only one format is needed (variant="link"), it renders as a compact
// inline link that downloads the PDF by default.
//
// When variant="button" (default), it renders a split button:
//   LEFT  — "Download ticket" triggers a dropdown to pick format
//   RIGHT — chevron toggles the dropdown
//
// Both PDF and PNG are generated together on the first backend request,
// so the format picker appears immediately without a second generation step.
//
// Props:
//   bookingId    — booking ID
//   size         — 'sm' | 'md' (default 'md')
//   variant      — 'button' | 'link' (default 'button')
//   checkOnMount — if true, checks status on mount to show ready indicators

import { useEffect, useState } from 'react';
import {
  Download,
  Loader2,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileText,
  ImageIcon,
} from 'lucide-react';
import { useTicketDownload } from '../../hooks/useTicketDownload';

export default function DownloadTicketButton({
  bookingId,
  size = 'md',
  variant = 'button',
  checkOnMount = false,
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const {
    downloading,
    downloadingPng,
    checking,
    isReady,
    checkStatus,
    download,
    downloadPng,
  } = useTicketDownload();

  useEffect(() => {
    if (checkOnMount && bookingId) {
      checkStatus(bookingId);
    }
  }, [bookingId, checkOnMount]);

  const isLoadingPdf = downloading || checking;
  const isLoadingPng = downloadingPng;
  const isAnyLoading = isLoadingPdf || isLoadingPng;

  function handlePdf() {
    if (isAnyLoading) return;
    setMenuOpen(false);
    download(bookingId);
  }

  function handlePng() {
    if (isAnyLoading) return;
    setMenuOpen(false);
    downloadPng(bookingId);
  }

  // ── Link variant (inline, no background) ──────────────────
  // Link variant only downloads PDF (keeps it simple for card lists)
  if (variant === 'link') {
    return (
      <button
        onClick={handlePdf}
        disabled={isAnyLoading}
        className="flex items-center gap-1.5 text-xs font-semibold text-accent hover:text-accent-hover transition-colors disabled:opacity-50 touch-manipulation"
      >
        {isLoadingPdf ? (
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

  // ── Button variant — split button with format dropdown ─────
  const sizeClasses = size === 'sm' ? 'h-9 text-xs' : 'h-11 text-sm';

  const mainLabel = downloading
    ? 'Downloading PDF…'
    : downloadingPng
      ? 'Downloading image…'
      : checking
        ? 'Checking…'
        : 'Download ticket';

  const mainIcon = isAnyLoading ? (
    <Loader2 size={size === 'sm' ? 13 : 15} className="animate-spin shrink-0" />
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
  );

  return (
    <div className="relative w-full">
      {/* Split button */}
      <div
        className={`flex rounded-btn overflow-hidden border border-accent ${sizeClasses}`}
      >
        {/* Left — main action label */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          disabled={isAnyLoading}
          className="flex-1 flex items-center justify-center gap-2 px-4 bg-accent hover:bg-accent-hover text-white font-semibold transition-colors duration-150 disabled:opacity-60 touch-manipulation"
        >
          {mainIcon}
          <span>{mainLabel}</span>
        </button>

        {/* Divider */}
        <div className="w-px bg-white/20 self-stretch" />

        {/* Right — chevron to open format picker */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          disabled={isAnyLoading}
          className="w-11 flex items-center justify-center bg-accent hover:bg-accent-hover text-white transition-colors duration-150 disabled:opacity-60 touch-manipulation"
          aria-label="Choose download format"
        >
          {menuOpen ? (
            <ChevronUp size={15} strokeWidth={2.5} />
          ) : (
            <ChevronDown size={15} strokeWidth={2.5} />
          )}
        </button>
      </div>

      {/* Format picker dropdown */}
      {menuOpen && (
        <>
          {/* Backdrop to close on outside click */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setMenuOpen(false)}
          />

          <div className="absolute top-full left-0 right-0 mt-1 z-20 bg-card border border-border rounded-card shadow-lg overflow-hidden">
            {/* PDF option */}
            <button
              onClick={handlePdf}
              disabled={isAnyLoading}
              className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-main-bg transition-colors duration-150 touch-manipulation text-left disabled:opacity-50"
            >
              <div className="w-9 h-9 rounded-btn bg-error/10 flex items-center justify-center shrink-0">
                <FileText size={16} className="text-error" strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-sm font-semibold text-primary">
                  Save ticket as PDF
                </p>
                <p className="text-xs text-muted mt-0.5">
                  Vector quality · Best for printing
                </p>
              </div>
              {isReady === true && (
                <CheckCircle2
                  size={14}
                  className="text-success ml-auto shrink-0"
                  strokeWidth={2.5}
                />
              )}
            </button>

            <div className="border-t border-border" />

            {/* PNG option */}
            <button
              onClick={handlePng}
              disabled={isAnyLoading}
              className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-main-bg transition-colors duration-150 touch-manipulation text-left disabled:opacity-50"
            >
              <div className="w-9 h-9 rounded-btn bg-accent-text flex items-center justify-center shrink-0">
                <ImageIcon
                  size={16}
                  className="text-accent"
                  strokeWidth={1.75}
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-primary">
                  Save ticket as image
                </p>
                <p className="text-xs text-muted mt-0.5">
                  Best for sharing
                </p>
              </div>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
