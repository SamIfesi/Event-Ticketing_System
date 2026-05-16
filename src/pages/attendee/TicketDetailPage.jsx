// /tickets/:id — Full ticket detail page.
// Shows the complete "physical ticket" with:
//   - Large QR code (hidden if used/cancelled)
//   - Event banner, title, date, location
//   - Ticket type, holder, booking ID
//   - Check-in status and timestamp
//   - Share button (Web Share API → clipboard fallback)
//   - Back navigation

import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Ticket,
  CheckCircle2,
  XCircle,
  Clock,
  Share2,
  AlertCircle,
  User,
  Hash,
  ExternalLink,
} from 'lucide-react';
import { useTickets } from '../../hooks/useTickets';
import { useUiStore } from '../../store/uiStore';
import {
  formatEventDate,
  formatShortDate,
  formatTime,
} from '../../utils/formatDate';
import Badge from '../../components/ui/Badge';
import QRCodeDisplay from '../../components/tickets/QRCodeDisplay';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Footer from '../../components/layout/Footer';

// ── Page skeleton ─────────────────────────────────────────────
function PageSkeleton() {
  return (
    <div className="animate-pulse max-w-lg mx-auto px-6 py-8 flex flex-col gap-6">
      {/* Banner */}
      <div className="h-48 bg-border rounded-card" />
      {/* Title area */}
      <div className="flex flex-col gap-3">
        <div className="h-6 bg-border rounded w-3/4" />
        <div className="h-4 bg-border rounded w-1/3" />
      </div>
      {/* Details */}
      <div className="bg-card border border-border rounded-card p-5 flex flex-col gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-btn bg-border shrink-0" />
            <div className="flex flex-col gap-1.5 flex-1">
              <div className="h-3 bg-border rounded w-16" />
              <div className="h-4 bg-border rounded w-32" />
            </div>
          </div>
        ))}
      </div>
      {/* QR */}
      <div className="bg-card border border-border rounded-card p-6 flex flex-col items-center gap-4">
        <div className="w-48 h-48 bg-border rounded-card" />
        <div className="h-3 bg-border rounded w-40" />
      </div>
    </div>
  );
}

// ── Status banner ─────────────────────────────────────────────
function StatusBanner({ status, usedAt }) {
  if (status === 'valid') return null;

  const config = {
    used: {
      icon: CheckCircle2,
      color: 'text-muted',
      bg: 'bg-border',
      border: 'border-border',
      label: usedAt
        ? `Checked in on ${formatShortDate(usedAt)} at ${formatTime(usedAt)}`
        : 'This ticket has already been used.',
    },
    cancelled: {
      icon: XCircle,
      color: 'text-error',
      bg: 'bg-error/10',
      border: 'border-error/20',
      label: 'This ticket has been cancelled.',
    },
    expired: {
      icon: Clock,
      color: 'text-muted',
      bg: 'bg-border',
      border: 'border-border',
      label: 'This ticket has expired.',
    },
  };

  const c = config[status] ?? config.expired;
  const Icon = c.icon;

  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-card border ${c.bg} ${c.border}`}
    >
      <Icon size={18} className={`${c.color} shrink-0`} strokeWidth={2} />
      <p className={`text-sm font-medium ${c.color}`}>{c.label}</p>
    </div>
  );
}

// ── Detail row ────────────────────────────────────────────────
function DetailRow({ icon: Icon, iconColor, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-3 border-b border-border last:border-0">
      <div
        className="w-8 h-8 rounded-btn flex items-center justify-center shrink-0 mt-0.5"
        style={{ background: `${iconColor}18` }}
      >
        <Icon size={15} strokeWidth={1.75} style={{ color: iconColor }} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold text-muted uppercase tracking-wider">
          {label}
        </p>
        <p className="text-sm font-semibold text-primary mt-0.5 leading-snug">
          {value}
        </p>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────
export default function TicketDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { ticket, ticketLoading, ticketError, fetchTicket } = useTickets();
  // const toastInfo = useUiStore((s) => s.toastInfo);
  const toastSuccess = useUiStore((s) => s.toastSuccess);

  useEffect(() => {
    if (id) fetchTicket(id);
  }, [id]);

  function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      navigator
        .share({
          title: ticket?.event_title ?? 'My Ticket',
          text: `My ticket for ${ticket?.event_title ?? 'this event'}`,
          url,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(url).then(() => {
        toastSuccess('Ticket link copied to clipboard!');
      });
    }
  }

  // Error state
  if (ticketError && !ticketLoading) {
    return (
      <div className="min-h-screen bg-main-bg flex flex-col items-center justify-center gap-5 px-6 text-center">
        <div className="w-14 h-14 rounded-card bg-error/10 border border-error/20 flex items-center justify-center">
          <AlertCircle size={26} className="text-error" strokeWidth={1.5} />
        </div>
        <div>
          <p className="font-bold text-primary text-lg">Ticket not found</p>
          <p className="text-sm text-secondary mt-1">
            This ticket doesn't exist or you don't have access to it.
          </p>
        </div>
        <Link
          to="/my-tickets"
          className="flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-hover transition-colors"
        >
          <ArrowLeft size={15} strokeWidth={2.5} /> My Tickets
        </Link>
      </div>
    );
  }

  const isValid = ticket?.status === 'valid';
  const isUsed = ticket?.status === 'used';
  const isCancelled =
    ticket?.status === 'cancelled' || ticket?.status === 'expired';

  const GRADIENTS = [
    'from-blue-600 to-indigo-800',
    'from-amber-500 to-orange-700',
    'from-emerald-500 to-teal-700',
    'from-rose-500 to-pink-700',
  ];
  const gradientIndex = parseInt(id ?? '0', 10) % GRADIENTS.length;

  return (
    <div className="flex flex-col min-h-screen bg-main-bg">
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 max-w-lg mx-auto w-full px-6 py-8">
        {/* Back + Share header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-secondary hover:text-primary transition-colors"
          >
            <ArrowLeft size={16} strokeWidth={2.5} />
            Back
          </button>

          {!ticketLoading && ticket && (
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 h-9 px-3 border border-border rounded-btn text-xs font-semibold text-secondary hover:text-primary hover:border-accent/40 transition-colors"
            >
              <Share2 size={14} strokeWidth={2} />
              Share
            </button>
          )}
        </div>

        {ticketLoading ? (
          <PageSkeleton />
        ) : ticket ? (
          <div className="flex flex-col gap-5">
            {/* ── Event banner ────────────────────────────────── */}
            <div
              className={`relative h-48 rounded-card overflow-hidden bg-linear-to-br ${GRADIENTS[gradientIndex]}`}
            >
              {ticket.banner_image && (
                <img
                  src={ticket.banner_image}
                  alt={ticket.event_title}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

              {/* Status badge */}
              <div className="absolute top-3 right-3">
                <Badge status={ticket.status} size="sm" />
              </div>

              {/* Title overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h1 className="text-white font-black text-lg leading-tight line-clamp-2">
                  {ticket.event_title ?? 'Event'}
                </h1>
                {ticket.ticket_type && (
                  <p className="text-white/70 text-xs font-semibold mt-1 uppercase tracking-widest">
                    {ticket.ticket_type}
                  </p>
                )}
              </div>
            </div>

            {/* ── Status banner (non-valid only) ────────────────── */}
            <StatusBanner status={ticket.status} usedAt={ticket.used_at} />

            {/* ── Event details card ────────────────────────────── */}
            <div className="bg-card border border-border rounded-card px-5 pt-2 pb-1">
              <DetailRow
                icon={Calendar}
                iconColor="#2563eb"
                label="Date & Time"
                value={
                  ticket.event_start_date
                    ? `${formatEventDate(ticket.event_start_date)}${
                        ticket.event_end_date
                          ? ` · Ends ${formatTime(ticket.event_end_date)}`
                          : ''
                      }`
                    : null
                }
              />
              <DetailRow
                icon={MapPin}
                iconColor="#10b981"
                label="Location"
                value={ticket.event_location}
              />
              <DetailRow
                icon={Ticket}
                iconColor="#f59e0b"
                label="Ticket Type"
                value={ticket.ticket_type}
              />
              <DetailRow
                icon={User}
                iconColor="#8b5cf6"
                label="Ticket Holder"
                value={ticket.attendee_name}
              />
              <DetailRow
                icon={Hash}
                iconColor="#94a3b8"
                label="Booking Reference"
                value={
                  ticket.booking_id
                    ? `#${String(ticket.booking_id).padStart(8, '0')}`
                    : null
                }
              />
            </div>

            {/* ── QR code card ──────────────────────────────────── */}
            <div className="bg-card border border-border rounded-card p-6 flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 self-stretch">
                <div className="flex-1 border-t border-dashed border-border" />
                <span className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">
                  Entry QR Code
                </span>
                <div className="flex-1 border-t border-dashed border-border" />
              </div>

              <QRCodeDisplay
                url={ticket.qr_code_url}
                size={200}
                disabled={isUsed || isCancelled}
              />

              <div className="text-center">
                <p className="text-[11px] font-mono text-muted tracking-widest">
                  #{String(ticket.id).padStart(8, '0')}
                </p>
                {isValid && (
                  <p className="text-xs text-secondary mt-1">
                    Present this QR code at the gate for check-in
                  </p>
                )}
                {isUsed && (
                  <p className="text-xs text-muted mt-1">
                    This ticket has been scanned and is no longer valid
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 self-stretch">
                <div className="flex-1 border-t border-dashed border-border" />
              </div>
            </div>

            {/* ── Actions ───────────────────────────────────────── */}
            <div className="flex flex-col gap-3">
              <Link
                to={`/events/${ticket.event_id}`}
                className="flex items-center justify-center gap-2 h-11 border border-border rounded-btn text-sm font-semibold text-secondary hover:text-primary hover:border-accent/40 transition-colors"
              >
                View event page
                <ExternalLink size={14} strokeWidth={2} />
              </Link>
              <Link
                to="/my-tickets"
                className="flex items-center justify-center gap-2 h-11 bg-accent-text text-accent border border-accent-border rounded-btn text-sm font-semibold hover:bg-accent hover:text-white transition-colors duration-150"
              >
                All my tickets
              </Link>
            </div>

            {/* Fine print */}
            <p className="text-center text-xs text-muted pb-4">
              Ticket ID {String(ticket.id).padStart(8, '0')} · Issued via
              Ticketer
            </p>
          </div>
        ) : null}
      </main>

      <Footer />
    </div>
  );
}
