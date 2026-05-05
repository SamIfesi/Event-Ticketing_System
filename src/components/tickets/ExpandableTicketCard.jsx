// ExpandableTicketCard — ticket card with a toggle to reveal the QR code.
// Replaces the old monolithic TicketCard for the MyTicketsPage grid.
//
// Props:
//   ticket — ticket object from the API

import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  QrCode,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  Clock,
} from 'lucide-react';
import Badge from '../../components/ui/Badge';
import QRCodeDisplay from '../../components/tickets/QRCodeDisplay';
import { formatShortDate, formatTime } from '../../utils/formatDate';

function StatusIcon({ status }) {
  if (status === 'valid')
    return (
      <CheckCircle2 size={13} className="text-success" strokeWidth={2.5} />
    );
  if (status === 'used')
    return <CheckCircle2 size={13} className="text-muted" strokeWidth={2.5} />;
  if (status === 'cancelled' || status === 'expired')
    return <XCircle size={13} className="text-error" strokeWidth={2.5} />;
  return <Clock size={13} className="text-warning" strokeWidth={2.5} />;
}

export default function ExpandableTicketCard({ ticket }) {
  const [qrOpen, setQrOpen] = useState(false);

  const event = ticket?.event ?? {};
  const isValid = ticket?.status === 'valid';
  const isUsed = ticket?.status === 'used';
  const isCancelled =
    ticket?.status === 'cancelled' || ticket?.status === 'expired';

  const stripColor = isValid
    ? 'bg-success'
    : isUsed
      ? 'bg-border'
      : isCancelled
        ? 'bg-error'
        : 'bg-warning';

  return (
    <div
      className={`bg-card border border-border rounded-card overflow-hidden transition-all duration-200 hover:shadow-md ${
        isCancelled ? 'opacity-60' : 'hover:border-accent/20'
      }`}
    >
      {/* Status strip */}
      <div className={`h-1 w-full ${stripColor}`} />

      <div className="p-4">
        {/* Header row */}
        <div className="flex items-start gap-3">
          {/* Thumbnail */}
          <div className="w-11 h-11 rounded-btn overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-700 shrink-0 flex items-center justify-center">
            {event.banner_image ? (
              <img
                src={event.banner_image}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm font-black text-white/60">
                {(ticket?.event_title ?? event?.title ?? 'E').charAt(0)}
              </span>
            )}
          </div>

          {/* Title + badge */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm font-bold text-primary line-clamp-1 leading-snug">
                  {ticket?.event_title ?? event?.title ?? 'Event'}
                </p>
                <p className="text-xs text-muted mt-0.5">
                  {ticket?.ticket_type_name ?? 'General'} ·{' '}
                  <span className="font-mono">
                    #{String(ticket?.id ?? 0).padStart(6, '0')}
                  </span>
                </p>
              </div>
              <Badge status={ticket?.status} size="sm" />
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3">
          {event.start_date && (
            <div className="flex items-center gap-1.5 text-xs text-secondary">
              <Calendar size={11} className="text-muted shrink-0" />
              <span>
                {formatShortDate(event.start_date)} ·{' '}
                {formatTime(event.start_date)}
              </span>
            </div>
          )}
          {event.location && (
            <div className="flex items-center gap-1.5 text-xs text-secondary">
              <MapPin size={11} className="text-muted shrink-0" />
              <span className="truncate max-w-[160px]">{event.location}</span>
            </div>
          )}
        </div>

        {/* Checked-in note */}
        {isUsed && ticket?.checked_in_at && (
          <p className="mt-2 text-xs text-muted flex items-center gap-1">
            <CheckCircle2 size={11} className="text-success" />
            Checked in {formatShortDate(ticket.checked_in_at)}
          </p>
        )}

        {/* Perforation divider */}
        <div className="relative my-4 border-t border-dashed border-border">
          <div className="absolute -left-7 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-main-bg border border-border" />
          <div className="absolute -right-7 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-main-bg border border-border" />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <StatusIcon status={ticket?.status} />
            <span className="text-xs font-semibold text-secondary capitalize">
              {ticket?.status ?? 'Unknown'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {isValid && (
              <button
                onClick={() => setQrOpen((v) => !v)}
                className="flex items-center gap-1 text-xs font-semibold text-accent hover:text-accent-hover transition-colors touch-manipulation"
              >
                <QrCode size={13} strokeWidth={2} />
                {qrOpen ? 'Hide QR' : 'Show QR'}
                {qrOpen ? (
                  <ChevronUp size={12} strokeWidth={2.5} />
                ) : (
                  <ChevronDown size={12} strokeWidth={2.5} />
                )}
              </button>
            )}
            <Link
              to={`/events/${event?.id ?? ticket?.event_id}`}
              className="text-xs font-semibold text-secondary hover:text-primary transition-colors"
            >
              View event
            </Link>
          </div>
        </div>

        {/* Expandable QR */}
        {qrOpen && isValid && (
          <div className="mt-4 pt-4 border-t border-border flex flex-col items-center gap-2">
            <p className="text-xs text-muted">
              Show this QR code at the gate for entry
            </p>
            <QRCodeDisplay
              url={ticket?.qr_code_url}
              size={160}
              disabled={false}
            />
            <p className="text-[10px] font-mono text-muted tracking-widest">
              #{String(ticket?.id ?? 0).padStart(8, '0')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
