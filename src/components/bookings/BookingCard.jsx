import Badge from '../../components/ui/Badge';
import { formatShortDate } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';
import {
  CreditCard,
  ArrowUpRight,
  Calendar,
  MapPin,
  Ticket,
} from 'lucide-react';

function StatusIcon({ status }) {
  switch (status) {
    case 'paid':
    case 'confirmed':
      return (
        <CheckCircle2 size={16} className="text-success" strokeWidth={2} />
      );
    case 'failed':
    case 'cancelled':
      return <XCircle size={16} className="text-error" strokeWidth={2} />;
    default:
      return <Clock size={16} className="text-warning" strokeWidth={2} />;
  }
}

export default function BookingCard({ booking }) {
  const event = booking?.event ?? {};
  const isPaid = booking?.payment_status === 'paid';
  const isFailed = booking?.payment_status === 'failed';

  return (
    <div className="bg-card border border-border rounded-card overflow-hidden hover:border-accent/30 hover:shadow-md transition-all duration-200 group">
      {/* Color accent strip */}
      <div
        className={`h-1 w-full ${isPaid ? 'bg-success' : isFailed ? 'bg-error' : 'bg-warning'}`}
      />

      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Event thumbnail */}
          <div className="w-16 h-16 rounded-btn overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-700 shrink-0 flex items-center justify-center">
            {event.banner_image ? (
              <img
                src={event.banner_image}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xl font-black text-white/60">
                {(booking?.event_title ?? event.title ?? 'E')?.charAt(0)}
              </span>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="font-bold text-primary text-sm leading-snug line-clamp-1">
                  {booking?.event_title ?? event.title ?? 'Event booking'}
                </h3>
                <p className="text-xs text-muted mt-0.5">
                  Booking #{String(booking.id).padStart(6, '0')}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <Badge
                  status={
                    booking?.payment_status ?? booking?.status ?? 'pending'
                  }
                  size="sm"
                />
                {booking?.total_amount != null && (
                  <span className="text-sm font-black text-primary">
                    {formatCurrency(booking.total_amount)}
                  </span>
                )}
              </div>
            </div>

            {/* Details row */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3">
              {event.start_date && (
                <div className="flex items-center gap-1.5 text-xs text-secondary">
                  <Calendar size={11} className="text-muted shrink-0" />
                  <span>{formatShortDate(event.start_date)}</span>
                </div>
              )}
              {event.location && (
                <div className="flex items-center gap-1.5 text-xs text-secondary">
                  <MapPin size={11} className="text-muted shrink-0" />
                  <span className="truncate max-w-[140px]">
                    {event.location}
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
              {booking?.created_at && (
                <div className="flex items-center gap-1.5 text-xs text-muted">
                  <CreditCard size={11} className="shrink-0" />
                  <span>Booked {formatShortDate(booking.created_at)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-1.5">
            <StatusIcon status={booking?.payment_status} />
            <span className="text-xs text-secondary">
              {booking?.payment_status === 'paid'
                ? 'Payment confirmed'
                : booking?.payment_status === 'failed'
                  ? 'Payment failed'
                  : booking?.payment_status === 'refunded'
                    ? 'Refunded'
                    : 'Awaiting payment'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {booking?.payment_status === 'paid' && (
              <Link
                to="/my-tickets"
                className="flex items-center gap-1 text-xs font-semibold text-accent hover:text-accent-hover transition-colors"
              >
                <Ticket size={12} strokeWidth={2.5} />
                View tickets
              </Link>
            )}
            <Link
              to={`/events/${event.id ?? booking?.event_id}`}
              className="flex items-center gap-1 text-xs font-semibold text-secondary hover:text-primary transition-colors"
            >
              Event <ArrowUpRight size={12} strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
