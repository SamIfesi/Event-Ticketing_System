// All filter state (search, category, date, page) lives in the URL so:
//   - Sharing a URL preserves filters
//   - Back/forward navigation restores state
//   - useEvents already reads/writes these URL params for us
//
// The only non-URL state is the local search input — we debounce it
// 500ms before pushing to the URL to avoid an API call per keystroke.

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, X, MapPin, Calendar, Ticket, Filter } from 'lucide-react';
import { useEvents } from '../../hooks/useEvents';
import CategoryService from '../../services/category.service';
import Pagination from '../../components/ui/Pagination';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import EventGrid from '../../components/events/EventGrid';

const DATE_OPTIONS = [
  { value: '', label: 'All dates' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'past', label: 'Past' },
];

export default function EventsPage() {
  const [categories, setCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    CategoryService.getCategories()
      .then((d) => setCategories(d.categories ?? []))
      .catch(() => {});
  }, []);

  const {
    events,
    pagination,
    loading,
    page,
    search,
    category,
    date,
    setPage,
    setSearch,
    setCategory,
    setDateFilter,
    clearFilters,
  } = useEvents();

  // Local input — debounced before pushing to URL
  const [searchInput, setSearchInput] = useState(search);
  useEffect(() => {
    setSearchInput(search);
  }, [search]);
  useEffect(() => {
    const t = setTimeout(() => {
      if (searchInput !== search) setSearch(searchInput);
    }, 500);
    return () => clearTimeout(t);
  }, [searchInput]);

  const hasFilters = Boolean(search || category || date);
  const totalResults = pagination?.total ?? 0;

  function handleClearAll() {
    clearFilters();
    setSearchInput('');
    setShowFilters(false);
  }

  // Sidebar content extracted so it renders in both desktop and mobile panels
  function SidebarContent() {
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
              className={`text-left px-3 py-2 rounded-btn text-sm transition-colors duration-150 ${!category ? 'bg-accent-text text-accent font-semibold' : 'text-secondary hover:text-primary hover:bg-border'}`}
            >
              All categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(String(cat.id))}
                className={`text-left px-3 py-2 rounded-btn text-sm transition-colors duration-150 flex items-center justify-between ${category === String(cat.id) ? 'bg-accent-text text-accent font-semibold' : 'text-secondary hover:text-primary hover:bg-border'}`}
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
                className={`text-left px-3 py-2 rounded-btn text-sm transition-colors duration-150 ${date === opt.value ? 'bg-accent-text text-accent font-semibold' : 'text-secondary hover:text-primary hover:bg-border'}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {hasFilters && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-2 text-sm font-semibold text-error hover:opacity-80 transition-opacity"
          >
            <X size={13} /> Clear all filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-main-bg">
      {/* Navbar */}
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Page title */}
      <div className="bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <h1 className="text-2xl sm:text-3xl font-black text-primary tracking-tight">
            Browse Events
          </h1>
          <p className="text-sm text-secondary mt-1">
            {loading
              ? 'Loading events…'
              : totalResults > 0
                ? `${totalResults.toLocaleString()} event${totalResults !== 1 ? 's' : ''} found`
                : hasFilters
                  ? 'No events match your filters'
                  : "Discover what's happening across Nigeria"}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-6xl mx-auto px-6 py-8 w-full">
        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-52 shrink-0">
            {/* Desktop also has a search input above the sidebar filters */}
            <div className="mb-5">
              <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-3">
                Search
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSearch(searchInput);
                }}
                className="relative"
              >
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
                />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search events…"
                  className="w-full h-10 pl-9 pr-3 bg-bg text-primary border border-border rounded-btn text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors duration-180"
                />
              </form>
            </div>
            <SidebarContent />
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Mobile search bar + filter toggle */}
            <div className="flex items-center gap-3 mb-6 lg:hidden">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSearch(searchInput);
                }}
                className="relative flex-1"
              >
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
                />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search events…"
                  className="w-full h-10 pl-9 pr-3 bg-card border border-border rounded-btn text-sm text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
                />
              </form>
              <button
                onClick={() => setShowFilters((v) => !v)}
                className={`h-10 px-3 flex items-center gap-2 border rounded-btn text-sm font-medium transition-colors duration-150 ${showFilters || hasFilters ? 'bg-accent-text text-accent border-accent-border' : 'bg-card text-secondary border-border hover:text-primary'}`}
              >
                <Filter size={15} />
                Filters
                {hasFilters && (
                  <span className="w-4 h-4 rounded-full bg-accent text-white text-[10px] flex items-center justify-center font-bold">
                    {[search, category, date].filter(Boolean).length}
                  </span>
                )}
              </button>
            </div>
            {/* Mobile collapsible filter panel */}
            {showFilters && (
              <div className="lg:hidden bg-card border border-border rounded-card p-4 mb-6">
                {/* Pills layout for mobile */}
                <div className="flex flex-col gap-4">
                  <div>
                    <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-2">
                      Category
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setCategory('')}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${!category ? 'bg-accent text-white' : 'bg-border text-secondary'}`}
                      >
                        All
                      </button>
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setCategory(String(cat.id))}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${category === String(cat.id) ? 'bg-accent text-white' : 'bg-border text-secondary'}`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-2">
                      When
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {DATE_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => setDateFilter(opt.value)}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${date === opt.value ? 'bg-accent text-white' : 'bg-border text-secondary'}`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  {hasFilters && (
                    <button
                      onClick={handleClearAll}
                      className="text-sm font-semibold text-error flex items-center gap-1.5"
                    >
                      <X size={13} /> Clear all
                    </button>
                  )}
                </div>
              </div>
            )}
            {/* Active filter chips */}
            {hasFilters && (
              <div className="flex flex-wrap items-center gap-2 mb-5">
                <span className="text-xs text-muted">Active:</span>
                {search && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-accent-text text-accent text-xs font-medium rounded-full border border-accent-border">
                    "{search}"
                    <button
                      onClick={() => {
                        setSearch('');
                        setSearchInput('');
                      }}
                      aria-label="Remove"
                    >
                      <X size={11} />
                    </button>
                  </span>
                )}
                {category && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-accent-text text-accent text-xs font-medium rounded-full border border-accent-border">
                    {categories.find((c) => String(c.id) === category)?.name ??
                      'Category'}
                    <button onClick={() => setCategory('')} aria-label="Remove">
                      <X size={11} />
                    </button>
                  </span>
                )}
                {date && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-accent-text text-accent text-xs font-medium rounded-full border border-accent-border">
                    {DATE_OPTIONS.find((o) => o.value === date)?.label ?? date}
                    <button
                      onClick={() => setDateFilter('')}
                      aria-label="Remove"
                    >
                      <X size={11} />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Events grid */}
            <EventGrid
              events={events}
              loading={loading}
              cols={3}
              emptyMessage="No events match your filters"
              ctaTo="/events"
            />
            {/* Pagination */}
            {pagination?.total_pages > 1 && (
              <div className="mt-10">
                <Pagination
                  currentPage={page}
                  totalPages={pagination.total_pages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
