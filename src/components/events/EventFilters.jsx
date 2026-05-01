// Filter sidebar / pill row used on EventsPage.
// Works with URL-based filter state from useEvents().
//
// Two render modes:
//   sidebar  — vertical list for the desktop sidebar (default)
//   pills    — horizontal wrapping pill row for the mobile panel
//
// Usage:
//   <EventFilters
//     mode="sidebar"
//     categories={categories}
//     search={search}
//     category={category}
//     date={date}
//     setSearch={setSearch}
//     setCategory={setCategory}
//     setDateFilter={setDateFilter}
//     clearFilters={clearFilters}
//   />

import { X } from 'lucide-react';

const DATE_OPTIONS = [
  { value: '', label: 'All dates' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'past', label: 'Past' },
];

// ── Sidebar mode ──────────────────────────────────────────────
function SidebarFilters({
  categories,
  category,
  date,
  setCategory,
  setDateFilter,
  hasFilters,
  onClear,
}) {
  return (
    <div className="flex flex-col gap-5">
      {/* Category */}
      <div>
        <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-3">
          Category
        </h3>
        <div className="flex flex-col gap-0.5">
          <button
            onClick={() => setCategory('')}
            className={`text-left px-3 py-2 rounded-btn text-sm transition-colors duration-150 ${
              !category
                ? 'bg-accent-text text-accent font-semibold'
                : 'text-secondary hover:text-primary hover:bg-border'
            }`}
          >
            All categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(String(cat.id))}
              className={`text-left px-3 py-2 rounded-btn text-sm transition-colors duration-150 flex items-center justify-between ${
                category === String(cat.id)
                  ? 'bg-accent-text text-accent font-semibold'
                  : 'text-secondary hover:text-primary hover:bg-border'
              }`}
            >
              <span>{cat.name}</span>
              {cat.event_count > 0 && (
                <span className="text-xs text-muted">{cat.event_count}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Date */}
      <div>
        <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-3">
          When
        </h3>
        <div className="flex flex-col gap-0.5">
          {DATE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setDateFilter(opt.value)}
              className={`text-left px-3 py-2 rounded-btn text-sm transition-colors duration-150 ${
                date === opt.value
                  ? 'bg-accent-text text-accent font-semibold'
                  : 'text-secondary hover:text-primary hover:bg-border'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {hasFilters && (
        <button
          onClick={onClear}
          className="flex items-center gap-2 text-sm font-semibold text-error hover:opacity-80 transition-opacity"
        >
          <X size={13} /> Clear all filters
        </button>
      )}
    </div>
  );
}

// ── Pills mode ────────────────────────────────────────────────
function PillFilters({
  categories,
  category,
  date,
  setCategory,
  setDateFilter,
  hasFilters,
  onClear,
}) {
  return (
    <div className="flex flex-col gap-4">
      {/* Category pills */}
      <div>
        <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-2">
          Category
        </h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategory('')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              !category ? 'bg-accent text-white' : 'bg-border text-secondary'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(String(cat.id))}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                category === String(cat.id)
                  ? 'bg-accent text-white'
                  : 'bg-border text-secondary'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Date pills */}
      <div>
        <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-2">
          When
        </h3>
        <div className="flex flex-wrap gap-2">
          {DATE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setDateFilter(opt.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                date === opt.value
                  ? 'bg-accent text-white'
                  : 'bg-border text-secondary'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {hasFilters && (
        <button
          onClick={onClear}
          className="text-sm font-semibold text-error flex items-center gap-1.5"
        >
          <X size={13} /> Clear all
        </button>
      )}
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────
export default function EventFilters({
  mode = 'sidebar',
  categories = [],
  category = '',
  date = '',
  setCategory,
  setDateFilter,
  clearFilters,
}) {
  const hasFilters = Boolean(category || date);

  const props = {
    categories,
    category,
    date,
    setCategory,
    setDateFilter,
    hasFilters,
    onClear: clearFilters,
  };

  return mode === 'pills' ? (
    <PillFilters {...props} />
  ) : (
    <SidebarFilters {...props} />
  );
}