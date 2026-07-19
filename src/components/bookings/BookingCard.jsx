import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../../components/ui/Badge';
import { formatShortDate } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';
import EventsService from '../../services/events.service';
import {
  CreditCard,
  ArrowUpRight,
  Calendar,
  MapPin,
  Ticket,
  CheckCircle2,
  XCircle,
  Clock,
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
  const eventData = booking?.event ?? {};
  const isPaid = booking?.payment_status === 'paid';
  const isFailed = booking?.payment_status === 'failed';
  const bannerImage = booking?.banner_image ?? '';
  const totalAmount = booking?.total_amount;

  const eventId = eventData?.id ?? booking?.event_id;
  const bookingId = booking?.id;

  // The booking payload doesn't include a slug, so fetch the single
  // event to get it. Falls back to eventId if the fetch hasn't
  // resolved yet or fails.
  const [eventSlug, setEventSlug] = useState(eventData?.slug ?? null);

  useEffect(() => {
    if (eventData?.slug) {
      setEventSlug(eventData.slug);
      return;
    }
    if (!eventId) return;

    let active = true;
    EventsService.getEvent(eventId)
      .then((data) => {
        if (active) setEventSlug(data?.event?.slug ?? null);
      })
      .catch(() => {
        if (active) setEventSlug(null);
      });

    return () => {
      active = false;
    };
  }, [eventId, eventData?.slug]);

  const eventLinkTarget = eventSlug ?? eventId;

  return (
    <div className="relative bg-card border border-border rounded-card overflow-hidden hover:border-accent/30 hover:shadow-md transition-all duration-200 group">
      {eventLinkTarget && (
        <Link
          to={`/events/${eventLinkTarget}`}
          className="absolute inset-0 z-10"
          aria-label={`View details for ${booking?.event_title ?? 'event'}`}
        />
      )}
      {/* Color accent strip */}
      <div
        className={`h-1 w-full ${isPaid ? 'bg-success' : isFailed ? 'bg-error' : 'bg-warning'}`}
      />

      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Event thumbnail */}
          <div className="w-16 h-16 rounded-btn overflow-hidden bg-linear-to-br from-blue-500 to-indigo-700 shrink-0 flex items-center justify-center">
            {bannerImage ? (
              <img
                src={bannerImage}
                alt={eventData.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xl font-black text-white/60">
                {(booking?.event_title ?? eventData.title ?? 'E')?.charAt(0)}
              </span>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="font-bold text-primary text-sm leading-snug line-clamp-1">
                  {booking?.event_title ?? eventData.title ?? 'Event booking'}
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
                    {totalAmount === '0.00' || Number(totalAmount) === 0
                      ? 'FREE'
                      : formatCurrency(totalAmount)}
                  </span>
                )}
              </div>
            </div>

            {/* Details row */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3">
              {(eventData.start_date ?? booking?.event_start_date) && (
                <div className="flex items-center gap-1.5 text-xs text-secondary">
                  <Calendar size={11} className="text-muted shrink-0" />
                  <span>
                    {formatShortDate(
                      eventData.start_date ?? booking?.event_start_date
                    )}
                  </span>
                </div>
              )}
              {(eventData.location ?? booking?.event_location) && (
                <div className="flex items-center gap-1.5 text-xs text-secondary">
                  <MapPin size={11} className="text-muted shrink-0" />
                  <span className="truncate max-w-35">
                    {eventData.location ?? booking?.event_location}
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
          <div className="relative z-20 flex items-center gap-3">
            {isPaid && bookingId && (
              <Link
                to={`/my-tickets?booking=${bookingId}`}
                className="flex items-center gap-1 text-xs font-semibold text-accent hover:text-accent-hover transition-colors"
              >
                <Ticket size={12} strokeWidth={2.5} />
                View tickets
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
