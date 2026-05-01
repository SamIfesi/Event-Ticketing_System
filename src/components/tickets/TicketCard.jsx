// Renders a single ticket as a styled "physical ticket" card.
// Shows event info, ticket type, holder name, status badge, and QR code.
//
// Props:
//   ticket      — ticket object from the API
//   showQr      — whether to show the QR code (default true)
//   compact     — smaller layout for lists (hides QR, collapses details)

import {
  Calendar,
  MapPin,
  Ticket,
  CheckCircle2,
  XCircle,
  Clock,
} from 'lucide-react';
import Badge from '../ui/Badge';
import { formatShortDate, formatTime } from '../../utils/formatDate';
import QRCodeDisplay from './QRCodeDisplay';

// ── Ticket perforation decoration ─────────────────────────────
function Perforation() {
  return (
    <div className="relative flex items-center my-0">
      <div className="absolute -left-4 w-8 h-8 rounded-full bg-main-bg border border-border" />
      <div className="flex-1 border-t-2 border-dashed border-border mx-4" />
      <div className="absolute -right-4 w-8 h-8 rounded-full bg-main-bg border border-border" />
    </div>
  );
}

// ── Status icon ───────────────────────────────────────────────
function StatusIcon({ status }) {
  switch (status) {
    case 'valid':
      return (
        <CheckCircle2 size={16} className="text-success" strokeWidth={2} />
      );
    case 'used':
      return <CheckCircle2 size={16} className="text-muted" strokeWidth={2} />;
    case 'cancelled':
    case 'expired':
      return <XCircle size={16} className="text-error" strokeWidth={2} />;
    default:
      return <Clock size={16} className="text-warning" strokeWidth={2} />;
  }
}

// ── Full ticket card ──────────────────────────────────────────
function FullTicketCard({ ticket }) {
  const event = ticket?.event ?? {};
  const isUsed = ticket?.status === 'used';
  const isCancelled =
    ticket?.status === 'cancelled' || ticket?.status === 'expired';

  return (
    <div
      className={`relative bg-card border border-border rounded-card overflow-hidden shadow-md transition-all duration-200 ${
        isCancelled ? 'opacity-60' : ''
      }`}
    >
      {/* Header strip — gradient banner */}
      <div className="h-20 bg-gradient-to-r from-blue-600 to-indigo-700 relative overflow-hidden">
        {event.banner_image && (
          <img
            src={event.banner_image}
            alt={event.title}
            className="w-full h-full object-cover opacity-60"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Status badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 bg-black/40 backdrop-blur-sm rounded-full">
          <StatusIcon status={ticket?.status} />
          <Badge
            status={ticket?.status}
            size="sm"
            className="bg-transparent ring-0 text-white"
          />
        </div>

        {/* Ticket type tag */}
        {ticket?.ticket_type_name && (
          <div className="absolute bottom-2 left-3">
            <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest">
              {ticket.ticket_type_name}
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="px-4 pt-3 pb-4">
        {/* Event name */}
        <h3 className="font-black text-primary text-base leading-tight line-clamp-2 mb-2">
          {event.title ?? ticket?.event_title ?? 'Event'}
        </h3>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-3">
          {event.start_date && (
            <div className="flex items-start gap-1.5">
              <Calendar size={12} className="text-muted shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] text-muted uppercase font-semibold tracking-wide">
                  Date
                </p>
                <p className="text-xs font-semibold text-primary">
                  {formatShortDate(event.start_date)}
                </p>
                <p className="text-[11px] text-secondary">
                  {formatTime(event.start_date)}
                </p>
              </div>
            </div>
          )}
          {event.location && (
            <div className="flex items-start gap-1.5">
              <MapPin size={12} className="text-muted shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] text-muted uppercase font-semibold tracking-wide">
                  Venue
                </p>
                <p className="text-xs font-semibold text-primary line-clamp-2">
                  {event.location}
                </p>
              </div>
            </div>
          )}
          {ticket?.holder_name && (
            <div className="col-span-2 flex items-start gap-1.5">
              <Ticket size={12} className="text-muted shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] text-muted uppercase font-semibold tracking-wide">
                  Holder
                </p>
                <p className="text-xs font-semibold text-primary">
                  {ticket.holder_name}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Perforated divider */}
      <div className="px-0">
        <Perforation />
      </div>

      {/* QR stub */}
      <div className="px-4 py-4 flex items-center gap-4">
        <QRCodeDisplay
          url={ticket?.qr_code_url}
          size={80}
          disabled={isUsed || isCancelled}
        />
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-muted uppercase font-bold tracking-wider mb-1">
            Ticket ID
          </p>
          <p className="text-xs font-mono text-primary font-semibold tracking-wide break-all">
            {ticket?.id ? `#${String(ticket.id).padStart(6, '0')}` : '—'}
          </p>
          {isUsed && (
            <p className="text-xs text-muted mt-1">
              Checked in{' '}
              {ticket?.checked_in_at
                ? formatShortDate(ticket.checked_in_at)
                : ''}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Compact ticket row ────────────────────────────────────────
function CompactTicketCard({ ticket }) {
  const event = ticket?.event ?? {};

  return (
    <div className="flex items-center gap-3 p-3 bg-card border border-border rounded-card hover:shadow-sm hover:border-accent/30 transition-all duration-150">
      {/* Color swatch */}
      <div className="w-10 h-10 rounded-btn bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shrink-0 overflow-hidden">
        {event.banner_image ? (
          <img
            src={event.banner_image}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <Ticket size={16} className="text-white" strokeWidth={1.75} />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-primary truncate">
          {event.title ?? ticket?.event_title ?? 'Ticket'}
        </p>
        <p className="text-xs text-muted mt-0.5">
          {ticket?.ticket_type_name ?? 'General'}
          {event.start_date && ` · ${formatShortDate(event.start_date)}`}
        </p>
      </div>

      {/* Status */}
      <Badge status={ticket?.status} size="sm" />
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────
export default function TicketCard({ ticket, compact = false, showQr = true }) {
  if (compact) return <CompactTicketCard ticket={ticket} />;
  return <FullTicketCard ticket={ticket} showQr={showQr} />;
}
