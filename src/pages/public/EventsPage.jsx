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
import { formatEventDate } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';
import Pagination from '../../components/ui/Pagination';
import { useAuthStore } from '../../store/authStore';
import logo from '/assets/icons/logo.svg';

const CARD_GRADIENTS = [
  'from-blue-600 to-indigo-800',
  'from-amber-500 to-orange-700',
  'from-emerald-500 to-teal-700',
  'from-rose-500 to-pink-700',
  'from-violet-600 to-purple-800',
  'from-cyan-500 to-sky-700',
];

const DATE_OPTIONS = [
  { value: '', label: 'All dates' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'past', label: 'Past' },
];

function EventCard({ event, index }) {
  const hasPrice = event.min_price != null;
  return (
    <Link
      to={`/events/${event.id}`}
      className="group flex flex-col bg-card border border-border rounded-card overflow-hidden hover:shadow-lg hover:border-accent/30 transition-all duration-200 active:scale-[.99]"
    >
      <div
        className={`relative h-44 bg-gradient-to-br ${CARD_GRADIENTS[index % CARD_GRADIENTS.length]} overflow-hidden`}
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
              {event.title.charAt(0)}
            </span>
          </div>
        )}
        {event.category_name && (
          <span className="absolute top-3 left-3 px-2.5 py-1 bg-black/40 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
            {event.category_name}
          </span>
        )}
        <span className="absolute top-3 right-3 px-2.5 py-1 bg-black/40 backdrop-blur-sm text-white text-xs font-bold rounded-full">
          {hasPrice
            ? event.min_price === 0
              ? 'Free'
              : `From ${formatCurrency(event.min_price)}`
            : 'View tickets'}
        </span>
      </div>

      <div className="flex flex-col gap-2 p-4 flex-1">
        <h3 className="font-bold text-primary text-sm leading-snug line-clamp-2 group-hover:text-accent transition-colors duration-180">
          {event.title}
        </h3>
        {event.description && (
          <p className="text-xs text-muted leading-relaxed line-clamp-2">
            {event.description}
          </p>
        )}
        <div className="flex flex-col gap-1.5 mt-auto pt-2 border-t border-border">
          <div className="flex items-center gap-1.5 text-xs text-secondary">
            <Calendar size={12} className="shrink-0 text-muted" />
            <span>{formatEventDate(event.start_date)}</span>
          </div>
          {event.location && (
            <div className="flex items-center gap-1.5 text-xs text-secondary">
              <MapPin size={12} className="shrink-0 text-muted" />
              <span className="truncate">{event.location}</span>
            </div>
          )}
          {event.organizer_name && (
            <p className="text-xs text-muted">By {event.organizer_name}</p>
          )}
        </div>
      </div>
    </Link>
  );
}

function EventCardSkeleton() {
  return (
    <div className="flex flex-col bg-card border border-border rounded-card overflow-hidden animate-pulse">
      <div className="h-44 bg-border" />
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

function EmptyState({ hasFilters, onClear }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 gap-5 text-center">
      <div className="w-16 h-16 rounded-card bg-accent-text border border-accent-border flex items-center justify-center">
        <Ticket size={28} strokeWidth={1.5} className="text-accent" />
      </div>
      <div>
        <p className="font-semibold text-primary text-lg">
          {hasFilters ? 'No events match your filters' : 'No events yet'}
        </p>
        <p className="text-sm text-secondary mt-1 max-w-xs mx-auto">
          {hasFilters
            ? 'Try adjusting your search terms or removing a filter.'
            : 'Events appear here once organisers publish them. Check back soon!'}
        </p>
      </div>
      {hasFilters && (
        <button
          onClick={onClear}
          className="text-sm font-semibold text-accent hover:text-accent-hover transition-colors duration-150"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}

export default function EventsPage() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const isLoggedIn = Boolean(token);

  const [categories, setCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

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
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <Link to="/home" className="shrink-0">
            <img src={logo} alt="Ticketer" className="h-6" />
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/events" className="text-sm font-semibold text-accent">
              Browse Events
            </Link>
            {isLoggedIn && (
              <>
                <Link
                  to="/my-bookings"
                  className="text-sm font-medium text-secondary hover:text-primary transition-colors duration-150"
                >
                  My Bookings
                </Link>
                <Link
                  to="/my-tickets"
                  className="text-sm font-medium text-secondary hover:text-primary transition-colors duration-150"
                >
                  My Tickets
                </Link>
              </>
            )}
          </nav>
          <div className="flex items-center gap-2 shrink-0">
            {isLoggedIn ? (
              <Link to="/profile" className="flex items-center gap-2 px-3">
                <div className="w-10 h-10 rounded-full bg-accent-text flex items-center justify-center">
                  <span className="font-bold text-accent text-sm">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <span className="hidden sm:block text-sm font-medium text-primary max-w-[100px] truncate">
                  {user?.name?.split(' ')[0]}
                </span>
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 text-sm font-semibold text-secondary hover:text-primary transition-colors duration-150"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="h-9 px-4 bg-accent hover:bg-accent-hover text-white text-sm font-semibold rounded-btn transition-colors duration-180 flex items-center"
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

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
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <EventCardSkeleton key={i} />
                ))
              ) : events.length > 0 ? (
                events.map((event, i) => (
                  <EventCard key={event.id} event={event} index={i} />
                ))
              ) : (
                <EmptyState hasFilters={hasFilters} onClear={handleClearAll} />
              )}
            </div>

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
