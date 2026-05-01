// Renders a responsive grid of EventCards with skeleton loading,
// empty state, and optional pagination.
//
// Usage:
//   <EventGrid
//     events={events}
//     loading={loading}
//     emptyMessage="No events found"
//     cols={3}           // 2 | 3 | 4  (default: 3)
//   />

import EventCard from './EventCard';
import { Music, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

function EventCardSkeleton({ compact }) {
  return (
    <div className="flex flex-col bg-card border border-border rounded-card overflow-hidden animate-pulse">
      <div className={compact ? 'h-32 bg-border' : 'h-44 bg-border'} />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-4 bg-border rounded w-3/4" />
        <div className="h-3 bg-border rounded w-full" />
        <div className="mt-2 pt-2 border-t border-border flex flex-col gap-2">
          <div className="h-3 bg-border rounded w-2/3" />
          <div className="h-3 bg-border rounded w-1/2" />
        </div>
      </div>
    </div>
  );
}

function EmptyState({ message, ctaLabel, ctaTo }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-16 gap-4 text-center">
      <div className="w-14 h-14 rounded-card bg-accent-text border border-accent-border flex items-center justify-center">
        <Music size={24} strokeWidth={1.5} className="text-accent" />
      </div>
      <div>
        <p className="font-semibold text-primary">
          {message ?? 'No events yet'}
        </p>
        <p className="text-sm text-secondary mt-1 max-w-xs">
          Events will appear here once organisers publish them. Check back soon!
        </p>
      </div>
      {ctaTo && (
        <Link
          to={ctaTo}
          className="flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-hover transition-colors"
        >
          <Search size={13} strokeWidth={2.5} />
          {ctaLabel ?? 'Browse events'}
        </Link>
      )}
    </div>
  );
}

const COL_CLASSES = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
};

export default function EventGrid({
  events = [],
  loading = false,
  skeletonCount = 6,
  cols = 3,
  compact = false,
  emptyMessage,
  ctaLabel,
  ctaTo,
  className = '',
}) {
  const colClass = COL_CLASSES[cols] ?? COL_CLASSES[3];

  return (
    <div className={`grid ${colClass} gap-5 ${className}`}>
      {loading ? (
        Array.from({ length: skeletonCount }).map((_, i) => (
          <EventCardSkeleton key={i} compact={compact} />
        ))
      ) : events.length > 0 ? (
        events.map((event, i) => (
          <EventCard key={event.id} event={event} index={i} compact={compact} />
        ))
      ) : (
        <EmptyState
          message={emptyMessage}
          ctaLabel={ctaLabel}
          ctaTo={ctaTo}
        />
      )}
    </div>
  );
}
