import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';
import {
  formatShortDate,
  formatTime,
  isEventPast,
} from '../../utils/formatDate';
import { Clock, MapPin } from 'lucide-react';
import { GRADIENTS } from '../../constants';

export default function UpcomingEventCard({ booking, index }) {
  const event = booking?.event ?? booking;
  const isPast = event?.start_date ? isEventPast(event.start_date) : false;

  return (
    <Link
      to={`/events/${event?.id ?? booking?.event_id}`}
      className="group flex flex-col bg-card border border-border rounded-card overflow-hidden hover:shadow-lg hover:boder-accent/30 transition-all duration-200 active:scale-[.99]"
    >
      <div
        className={`relative h-28 bg-gradient-to-br ${GRADIENTS[index % GRADIENTS.length]} overflow-hidden`}
      >
        {event?.banner_image && (
          <img
            src={event.banner_image}
            alt={event.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to transparent" />
        <div className="absolute bottom-2.5 left-3 right-3">
          <p className="text-white text-xs font-semibold leading-snug line-clamp-2">
            {event?.title ?? 'Event'}
          </p>
        </div>

        {isPast && (
          <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/50 backdrop-blur-sm rounded-full text-white text-[10px] font-semibold">
            Past
          </div>
        )}
      </div>

      <div className="p-3 flex flex-col gap-1.5">
        {event?.start_date && (
          <div className="flex item-center gap-1.5 text-xs text-secondary">
            <Clock className="text-muted shrink-0" size={11} />
            <span>
              {formatShortDate(event.start_date)} .{' '}
              {formatTime(event.start_date)}
            </span>
          </div>
        )}

        {event?.location && (
          <div className="flex items-center gap-1.5 text-xs text-secondary">
            <MapPin className="text-muted shrink-0" size={11} />
            <span className="truncate">{event.location}</span>
          </div>
        )}
        <div className="mt-1 flex items-center justify-between">
          <Badge
            status={booking?.payment_status ?? booking?.status ?? 'confirmed'}
            size="sm"
          />
          <span className="text-[10px] text-muted">
            {booking?.quantity ?? 1} ticket
            {(booking?.quantity ?? 1) !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </Link>
  );
}
