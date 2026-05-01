// Reusable event card used in grids across HomePage, EventsPage, and
// any other page that renders a list of events.
//
// Props:
//   event   — event object from the API
//   index   — used to pick a gradient when there's no banner_image
//   compact — optional boolean for a smaller layout (e.g. dashboard widgets)

import { Link } from 'react-router-dom';
import { Calendar, MapPin } from 'lucide-react';
import { formatEventDate } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';
import Badge from '../ui/Badge';

const GRADIENTS = [
  'from-blue-600 to-indigo-800',
  'from-amber-500 to-orange-700',
  'from-emerald-500 to-teal-700',
  'from-rose-500 to-pink-700',
  'from-violet-600 to-purple-800',
  'from-cyan-500 to-sky-700',
];

export function EventCard({ event, index = 0, compact = false }) {
  const hasPrice = event.min_price != null;
  const gradient = GRADIENTS[index % GRADIENTS.length];

  return (
    <Link
      to={`/events/${event.id}`}
      className={`group flex flex-col bg-card border border-border rounded-card overflow-hidden hover:shadow-lg hover:border-accent/30 transition-all duration-200 active:scale-[.99] ${compact ? '' : ''}`}
    >
      {/* Banner */}
      <div
        className={`relative bg-gradient-to-br ${gradient} overflow-hidden ${compact ? 'h-32' : 'h-44'}`}
      >
        {event.banner_image ? (
          <img
            src={event.banner_image}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
          />
        ) : (
          <div className="absolute inset-0 flex items-end p-4">
            <span className="text-white/20 text-6xl font-black leading-none select-none">
              {event.title?.charAt(0)}
            </span>
          </div>
        )}

        {/* Category pill */}
        {event.category_name && (
          <span className="absolute top-3 left-3 px-2.5 py-1 bg-black/40 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
            {event.category_name}
          </span>
        )}

        {/* Price pill */}
        <span className="absolute top-3 right-3 px-2.5 py-1 bg-black/40 backdrop-blur-sm text-white text-xs font-bold rounded-full">
          {hasPrice
            ? event.min_price === 0
              ? 'Free'
              : `From ${formatCurrency(event.min_price)}`
            : 'View tickets'}
        </span>

        {/* Status badge — only if not published */}
        {event.status && event.status !== 'published' && (
          <div className="absolute bottom-2 left-3">
            <Badge status={event.status} size="sm" />
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col gap-2 p-4 flex-1">
        <h3
          className={`font-bold text-primary leading-snug line-clamp-2 group-hover:text-accent transition-colors duration-180 ${compact ? 'text-xs' : 'text-sm'}`}
        >
          {event.title}
        </h3>

        {!compact && event.description && (
          <p className="text-xs text-muted leading-relaxed line-clamp-2">
            {event.description}
          </p>
        )}

        <div className="flex flex-col gap-1.5 mt-auto pt-2 border-t border-border">
          <div className="flex items-center gap-1.5 text-xs text-secondary">
            <Calendar size={11} className="shrink-0 text-muted" />
            <span>{formatEventDate(event.start_date)}</span>
          </div>
          {event.location && (
            <div className="flex items-center gap-1.5 text-xs text-secondary">
              <MapPin size={11} className="shrink-0 text-muted" />
              <span className="truncate">{event.location}</span>
            </div>
          )}
          {!compact && event.organizer_name && (
            <p className="text-xs text-muted">By {event.organizer_name}</p>
          )}
        </div>
      </div>
    </Link>
  );
}

export function EventCardSkeleton() {
  return (
    <div className="flex flex-col bg-card border border-border rounded-card overflow-hidden animate-pulse">
      <div className="h-44 bg-border" />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-4 bg-border rounded w-3/4" />
        <div className="h-3 bg-border rounded w-1/2" />
        <div className="h-3 bg-border rounded w-2/3" />
      </div>
    </div>
  );
}