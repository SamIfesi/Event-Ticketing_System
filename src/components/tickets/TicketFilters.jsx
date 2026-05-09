// TicketFilters — search bar, status pills, and date filter tabs for MyTicketsPage.
//
// Props:
//   search        — current search string
//   onSearch      — (val) => void
//   statusFilter  — current status string
//   onStatus      — (val) => void
//   dateFilter    — 'all' | 'upcoming' | 'past'
//   onDate        — (val) => void

import { Search, X } from 'lucide-react';
import { DATE_OPTIONS, STATUS_OPTIONS } from '../../config/constants';

export default function TicketFilters({
  search,
  onSearch,
  statusFilter,
  onStatus,
  dateFilter,
  onDate,
}) {
  return (
    <div className="flex flex-col gap-3 mb-6">
      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search tickets…"
            className="w-full h-10 pl-9 pr-9 bg-card border border-border rounded-btn text-sm text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
          />
          {search && (
            <button
              onClick={() => onSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Date tabs */}
        <div className="flex items-center gap-2">
          {DATE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onDate(opt.value)}
              className={`h-8 px-3 rounded-btn text-xs font-semibold transition-colors border ${
                dateFilter === opt.value
                  ? 'bg-accent text-white border-accent'
                  : 'bg-card text-secondary border-border hover:text-primary hover:border-accent/40'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Status pills */}
      <div className="flex items-center gap-2 flex-wrap mb-6">
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onStatus(opt.value)}
            className={`h-8 px-3 rounded-full text-xs font-semibold transition-colors border ${
              statusFilter === opt.value
                ? 'bg-accent text-white border-accent'
                : 'bg-card text-secondary border-border hover:text-primary'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
