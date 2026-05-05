// TicketsEmptyState — shown when no tickets match the current filters.
//
// Props:
//   filtered — true when filters are active (changes copy)

import { Link } from 'react-router-dom';
import { Ticket, Search } from 'lucide-react';

export default function TicketsEmptyState({ filtered = false }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-5 text-center">
      <div className="w-16 h-16 rounded-card bg-accent-text border border-accent-border flex items-center justify-center">
        <Ticket size={28} strokeWidth={1.5} className="text-accent" />
      </div>
      <div>
        <p className="font-bold text-primary text-lg">
          {filtered ? 'No tickets match your filter' : 'No tickets yet'}
        </p>
        <p className="text-sm text-secondary mt-1 max-w-xs">
          {filtered
            ? 'Try changing or clearing your filters.'
            : 'Tickets for events you book will appear here.'}
        </p>
      </div>
      {!filtered && (
        <Link
          to="/events"
          className="flex items-center gap-1.5 h-10 px-5 bg-accent hover:bg-accent-hover text-white text-sm font-semibold rounded-btn transition-colors"
        >
          <Search size={14} strokeWidth={2.5} />
          Browse events
        </Link>
      )}
    </div>
  );
}
