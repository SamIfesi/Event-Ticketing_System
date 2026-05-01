// src/components/bookings/BookingRow.jsx
//
// A single row / card representing one booking.
// Used in My Bookings page, attendee dashboard, and organizer bookings list.
//
// Two visual modes:
//   row   — horizontal table-style row (default, for lists)
//   card  — vertical card layout (for dashboard widgets)
//
// Props:
//   booking — booking object from the API
//   mode    — 'row' | 'card'
//   onClick — optional override for navigation

import { Link } from 'react-router-dom';
import { ChevronRight, BookOpen, Calendar, Ticket } from 'lucide-react';
import Badge from '../ui/Badge';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatShortDate, formatTime } from '../../utils/formatDate';

// ── Row mode ──────────────────────────────────────────────────
function BookingRowLayout({ booking }) {
  return (
    <Link
      to={`/my-bookings`}
      className="flex items-center gap-4 px-4 py-3.5 hover:bg-main-bg transition-colors duration-150 group touch-manipulation"
    >
      {/* Icon */}
      <div className="w-9 h-9 rounded-btn bg-accent-text flex items-center justify-center shrink-0">
        <BookOpen size={15} className="text-accent" strokeWidth={1.75} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-primary truncate">
          {booking?.event_title ?? booking?.event?.title ?? 'Event booking'}
        </p>
        <p className="text-xs text-muted mt-0.5">
          {booking?.created_at ? formatShortDate(booking.created_at) : '—'}
          {booking?.quantity
            ? ` · ${booking.quantity} ticket${booking.quantity !== 1 ? 's' : ''}`
            : ''}
        </p>
      </div>

      {/* Right side */}
      <div className="flex flex-col items-end gap-1 shrink-0">
        <Badge
          status={booking?.payment_status ?? booking?.status ?? 'pending'}
          size="sm"
        />
        {booking?.total_amount != null && (
          <span className="text-xs font-semibold text-primary">
            {formatCurrency(booking.total_amount)}
          </span>
        )}
      </div>

      <ChevronRight
        size={14}
        className="text-muted group-hover:text-primary transition-colors shrink-0"
      />
    </Link>
  );
}

// ── Card mode ─────────────────────────────────────────────────
function BookingCardLayout({ booking }) {
  const event = booking?.event;

  return (
    <Link
      to={`/my-bookings`}
      className="flex flex-col bg-card border border-border rounded-card p-4 hover:shadow-md hover:border-accent/30 transition-all duration-200 group touch-manipulation"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <p className="text-sm font-bold text-primary leading-snug line-clamp-2 flex-1">
          {booking?.event_title ?? event?.title ?? 'Event booking'}
        </p>
        <Badge
          status={booking?.payment_status ?? booking?.status ?? 'pending'}
          size="sm"
        />
      </div>

      {/* Details */}
      <div className="flex flex-col gap-1.5 flex-1">
        {event?.start_date && (
          <div className="flex items-center gap-1.5 text-xs text-secondary">
            <Calendar size={11} className="text-muted shrink-0" />
            <span>
              {formatShortDate(event.start_date)} ·{' '}
              {formatTime(event.start_date)}
            </span>
          </div>
        )}
        {booking?.quantity && (
          <div className="flex items-center gap-1.5 text-xs text-secondary">
            <Ticket size={11} className="text-muted shrink-0" />
            <span>
              {booking.quantity} ticket{booking.quantity !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      {/* Footer */}
      {booking?.total_amount != null && (
        <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
          <span className="text-xs text-muted">Total paid</span>
          <span className="text-sm font-bold text-primary">
            {formatCurrency(booking.total_amount)}
          </span>
        </div>
      )}
    </Link>
  );
}

// ── Main export ───────────────────────────────────────────────
export default function BookingRow({ booking, mode = 'row' }) {
  if (mode === 'card') return <BookingCardLayout booking={booking} />;
  return <BookingRowLayout booking={booking} />;
}
