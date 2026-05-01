import { Link } from "react-router-dom";
import { BookOpen, Search } from 'lucide-react';

export function BookingSkeleton() {
  return (
    <div className="bg-card border border-border rounded-card p-5 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-btn bg-border shrink-0" />
        <div className="flex-1 flex flex-col gap-2">
          <div className="h-4 bg-border rounded w-2/3" />
          <div className="h-3 bg-border rounded w-1/3" />
          <div className="flex gap-4 mt-1">
            <div className="h-3 bg-border rounded w-24" />
            <div className="h-3 bg-border rounded w-20" />
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <div className="h-5 bg-border rounded w-16" />
          <div className="h-4 bg-border rounded w-12" />
        </div>
      </div>
    </div>
  );
}

export function EmptyState({ filtered }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-5 text-center">
      <div className="w-16 h-16 rounded-card bg-accent-text border border-accent-border flex items-center justify-center">
        <BookOpen size={28} strokeWidth={1.5} className="text-accent" />
      </div>
      <div>
        <p className="font-bold text-primary text-lg">
          {filtered ? 'No bookings match your filter' : 'No bookings yet'}
        </p>
        <p className="text-sm text-secondary mt-1 max-w-xs">
          {filtered
            ? 'Try changing or clearing the filter.'
            : 'Your booking history will appear here once you purchase tickets.'}
        </p>
      </div>
      {!filtered && (
        <Link
          to="/events"
          className="flex items-center gap-1.5 h-10 px-5 bg-accent hover:bg-accent-hover text-white text-sm font-semibold rounded-btn transition-colors duration-180"
        >
          <Search size={14} strokeWidth={2.5} /> Browse events
        </Link>
      )}
      {filtered && (
        <button className="text-sm font-semibold text-accent hover:text-accent-hover transition-colors">
          Clear filter
        </button>
      )}
    </div>
  );
}
