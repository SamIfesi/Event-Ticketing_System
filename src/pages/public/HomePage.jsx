import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ArrowRight,
  MapPin,
  Calendar,
  Users,
  Ticket,
  ChevronRight,
  ChevronLeft,
  Zap,
  Music,
  Briefcase,
  Cpu,
  Heart,
  BookOpen,
  Utensils,
  Trophy,
  Palette,
  Star,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { formatEventDate } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';
import EventsService from '../../services/events.service';
import CategoryService from '../../services/category.service';
import logo from '/assets/icons/logo.svg';
import line from '/assets/illustrations/line.svg';

// Maps the icon string stored in the DB → the actual Lucide component.
// Your DB stores strings like 'music', 'monitor', 'trophy' (see schema.sql).
const ICON_MAP = {
  music: Music,
  monitor: Cpu,
  trophy: Trophy,
  palette: Palette,
  briefcase: Briefcase,
  utensils: Utensils,
  'book-open': BookOpen,
  'heart-pulse': Heart,
  star: Star,
  ticket: Ticket,
};

// Color palette for categories — cycles by index since the DB has no color field
const CATEGORY_COLORS = [
  '#f59e0b',
  '#2563eb',
  '#10b981',
  '#ef4444',
  '#8b5cf6',
  '#f97316',
  '#06b6d4',
  '#22c55e',
  '#ec4899',
];

const CARD_GRADIENTS = [
  'from-blue-600 to-indigo-800',
  'from-amber-500 to-orange-700',
  'from-emerald-500 to-teal-700',
  'from-rose-500 to-pink-700',
];

const STATS = [
  { label: 'Events hosted', value: '1,200+' },
  { label: 'Tickets sold', value: '48,000+' },
  { label: 'Active organisers', value: '340+' },
  { label: 'Cities covered', value: '12' },
];

const HOW_STEPS = [
  {
    step: '01',
    icon: Search,
    title: 'Discover events',
    desc: 'Browse hundreds of events across Nigeria — concerts, conferences, festivals, and more.',
  },
  {
    step: '02',
    icon: Ticket,
    title: 'Book your ticket',
    desc: 'Select your ticket type, pay securely via Paystack, and get your QR code instantly.',
  },
  {
    step: '03',
    icon: Zap,
    title: 'Show up & enjoy',
    desc: 'Scan your QR at the gate and walk straight in. No printing needed.',
  },
];

// ── Search bar ───────────────────────────────────────────────────────────────
function HeroSearch() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  function handleSearch(e) {
    e.preventDefault();
    navigate(
      query.trim()
        ? `/events?search=${encodeURIComponent(query.trim())}`
        : '/events'
    );
  }

  return (
    <form
      onSubmit={handleSearch}
      className="relative flex items-center w-full max-w-xl"
    >
      <Search
        size={18}
        className="absolute left-4 text-muted pointer-events-none"
      />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search events, artists, venues…"
        className="w-full h-14 pl-11 pr-36 bg-card border border-border rounded-card text-primary placeholder:text-muted text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all duration-200 shadow-md"
      />
      <button
        type="submit"
        className="absolute right-2 h-10 px-5 bg-accent hover:bg-accent-hover text-white text-sm font-semibold rounded-btn transition-colors duration-180 active:scale-95 touch-manipulation"
      >
        Search
      </button>
    </form>
  );
}

// ── EventCard — real API shape ───────────────────────────────────────────────
// The list endpoint returns: id, title, description, location, banner_image,
// start_date, category_name, organizer_name, status, total_tickets, tickets_sold.
// min_price is NOT included in the list — we fall back to "View tickets".
function EventCard({ event, index }) {
  const hasPrice = event.min_price != null;
  return (
    <Link
      to={`/events/${event.id}`}
      className="group flex flex-col bg-card border border-border rounded-card overflow-hidden hover:shadow-lg hover:border-accent/30 transition-all duration-250 active:scale-[.99]"
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
        <div className="flex flex-col gap-1.5 mt-auto">
          <div className="flex items-center gap-1.5 text-xs text-secondary">
            <Calendar size={13} className="shrink-0 text-muted" />
            <span>{formatEventDate(event.start_date)}</span>
          </div>
          {event.location && (
            <div className="flex items-center gap-1.5 text-xs text-secondary">
              <MapPin size={13} className="shrink-0 text-muted" />
              <span className="truncate">{event.location}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

// ── Skeleton while events are loading ───────────────────────────────────────
function EventCardSkeleton() {
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

// ── CategoryCard — icon resolved from DB string ───────────────────────────
function CategoryCard({ cat, index }) {
  const Icon = ICON_MAP[cat.icon] ?? Music; // fall back to Ticket if unknown
  const color = CATEGORY_COLORS[index % CATEGORY_COLORS.length];
  return (
    <Link
      to={`/events?category=${cat.id}`}
      className="group flex-shrink-0 flex flex-col items-center gap-3 w-28 p-4 bg-main-bg border border-border rounded-card hover:border-accent/40 hover:shadow-md transition-all duration-200 active:scale-[.97] touch-manipulation snap-start"
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
        style={{ background: `${color}18` }}
      >
        <Icon size={22} style={{ color }} strokeWidth={1.75} />
      </div>
      <div className="text-center">
        <span className="block text-xs font-semibold text-primary leading-tight">
          {cat.name}
        </span>
        <span className="block text-[11px] text-muted mt-0.5">
          {cat.event_count ?? 0} events
        </span>
      </div>
    </Link>
  );
}

function CategorySkeleton() {
  return (
    <div className="flex-shrink-0 flex flex-col items-center gap-3 w-28 p-4 bg-main-bg border border-border rounded-card animate-pulse">
      <div className="w-12 h-12 rounded-xl bg-border" />
      <div className="h-3 bg-border rounded w-14" />
    </div>
  );
}

// ── CategoryScroller — unchanged logic, now accepts live data + loading prop
function CategoryScroller({ categories, loading }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  function updateArrows() {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }

  function scrollBy(dir) {
    scrollRef.current?.scrollBy({ left: dir * 256, behavior: 'smooth' });
  }

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener('scroll', updateArrows, { passive: true });
    const ro = new ResizeObserver(updateArrows);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', updateArrows);
      ro.disconnect();
    };
  }, [categories]);

  return (
    <div className="relative">
      <div
        className={`absolute left-0 top-0 bottom-2 w-14 z-10 pointer-events-none bg-gradient-to-r from-card to-transparent transition-opacity duration-200 rounded-l-card ${canScrollLeft ? 'opacity-100' : 'opacity-0'}`}
      />
      <button
        onClick={() => scrollBy(-1)}
        aria-label="Scroll left"
        className={`absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-card border border-border shadow-md flex items-center justify-center text-secondary hover:text-primary hover:border-accent/40 transition-all duration-150 touch-manipulation ${canScrollLeft ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <ChevronLeft size={16} strokeWidth={2.5} />
      </button>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="flex-shrink-0 w-1" aria-hidden="true" />
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <CategorySkeleton key={i} />
            ))
          : categories.map((cat, i) => (
              <CategoryCard key={cat.id} cat={cat} index={i} />
            ))}
        <div className="flex-shrink-0 w-1" aria-hidden="true" />
      </div>

      <div
        className={`absolute right-0 top-0 bottom-2 w-14 z-10 pointer-events-none bg-gradient-to-l from-card to-transparent transition-opacity duration-200 rounded-r-card ${canScrollRight ? 'opacity-100' : 'opacity-0'}`}
      />
      <button
        onClick={() => scrollBy(1)}
        aria-label="Scroll right"
        className={`absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-card border border-border shadow-md flex items-center justify-center text-secondary hover:text-primary hover:border-accent/40 transition-all duration-150 touch-manipulation ${canScrollRight ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <ChevronRight size={16} strokeWidth={2.5} />
      </button>
    </div>
  );
}

function StatItem({ value, label }) {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <span className="text-2xl font-black text-primary tracking-tight">
        {value}
      </span>
      <span className="text-xs text-secondary font-medium">{label}</span>
    </div>
  );
}

// ── Shown when DB returns zero events ────────────────────────────────────────
function EmptyEvents() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-16 gap-4 text-center">
      <div className="w-16 h-16 rounded-card bg-accent-text border border-accent-border flex items-center justify-center">
        <Music size={28} strokeWidth={1.5} className="text-accent" />
      </div>
      <div>
        <p className="font-semibold text-primary">No events yet</p>
        <p className="text-sm text-secondary mt-1 max-w-xs">
          Events will appear here once organisers publish them. Check back soon!
        </p>
      </div>
      <Link
        to="/events"
        className="text-sm font-semibold text-accent hover:text-accent-hover transition-colors duration-150"
      >
        Browse all events →
      </Link>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Main page
// ────────────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const isLoggedIn = Boolean(token);

  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Fetch 4 upcoming published events for the featured grid
  useEffect(() => {
    EventsService.getEvents({ page: 1, limit: 4, date: 'upcoming' })
      .then((data) => setFeaturedEvents(data.events ?? []))
      .catch(() => setFeaturedEvents([]))
      .finally(() => setLoadingEvents(false));
  }, []);

  // Fetch all categories with event_count for the scroller
  useEffect(() => {
    CategoryService.getCategories()
      .then((data) => setCategories(data.categories ?? []))
      .catch(() => setCategories([]))
      .finally(() => setLoadingCategories(false));
  }, []);

  // Fade-in hero on mount
  const heroRef = useRef(null);
  useEffect(() => {
    if (!heroRef.current) return;
    heroRef.current.style.opacity = '0';
    heroRef.current.style.transform = 'translateY(16px)';
    requestAnimationFrame(() => {
      if (!heroRef.current) return;
      heroRef.current.style.transition =
        'opacity 600ms ease, transform 600ms ease';
      heroRef.current.style.opacity = '1';
      heroRef.current.style.transform = 'translateY(0)';
    });
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-main-bg">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <Link to="/home" className="flex items-center gap-2 shrink-0">
            <img src={logo} alt="Ticketer logo" className="h-6" />
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/events"
              className="text-sm font-medium text-secondary hover:text-primary transition-colors duration-150"
            >
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
              <Link
                to="/profile"
                className="flex items-center gap-2 px-3 text-xl font-medium text-primary"
              >
                <div className="w-10 h-10 rounded-full bg-accent-text flex items-center justify-center">
                  <span className="font-bold text-accent">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <span className="hidden sm:block max-w-[100px] truncate">
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

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-main-bg pt-16 pb-20 px-6">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
            <div className="absolute top-1/2 -left-24 w-64 h-64 rounded-full bg-accent/5 blur-2xl" />
          </div>

          <div ref={heroRef} className="relative max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-text border border-accent-border rounded-full mb-6">
              <Zap size={13} className="text-accent" />
              <span className="text-xs font-semibold text-accent">
                Nigeria's event ticketing platform
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-primary tracking-tight leading-[1.05] mb-6">
              Every great{' '}
              <span className="text-accent relative">
                experience
                <img
                  src={line}
                  alt=""
                  className="absolute -bottom-1 left-0 w-full"
                />
              </span>{' '}
              starts with a ticket.
            </h1>

            <p className="text-base sm:text-lg text-secondary leading-relaxed mb-10 max-w-xl mx-auto">
              Discover concerts, conferences, festivals and more. Book
              instantly, pay securely, and show up with just your phone.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
              <HeroSearch />
            </div>

            <div className="mt-4 flex items-center justify-center gap-4 flex-wrap">
              {['Music', 'Technology', 'Business', 'Food & Drink'].map(
                (tag) => (
                  <Link
                    key={tag}
                    to={`/events?search=${encodeURIComponent(tag)}`}
                    className="text-xs text-muted hover:text-accent transition-colors duration-150 underline underline-offset-2"
                  >
                    {tag}
                  </Link>
                )
              )}
            </div>
          </div>
        </section>

        {/* Stats bar */}
        <section className="border-y border-border bg-card">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-0 sm:divide-x divide-border">
              {STATS.map((s) => (
                <StatItem key={s.label} value={s.value} label={s.label} />
              ))}
            </div>
          </div>
        </section>

        {/* Featured Events */}
        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="flex items-end justify-between mb-8 gap-4">
            <div>
              <p className="text-xs font-semibold text-accent uppercase tracking-widest mb-1">
                Happening soon
              </p>
              <h2 className="text-2xl sm:text-3xl font-black text-primary tracking-tight">
                Featured Events
              </h2>
            </div>
            <Link
              to="/events"
              className="flex items-center gap-1 text-sm font-semibold text-accent hover:text-accent-hover transition-colors duration-150 shrink-0"
            >
              View all <ChevronRight size={16} strokeWidth={2.5} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loadingEvents ? (
              Array.from({ length: 4 }).map((_, i) => (
                <EventCardSkeleton key={i} />
              ))
            ) : featuredEvents.length > 0 ? (
              featuredEvents.map((event, i) => (
                <EventCard key={event.id} event={event} index={i} />
              ))
            ) : (
              <EmptyEvents />
            )}
          </div>
        </section>

        {/* Categories */}
        <section className="bg-card border-y border-border py-16">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-end justify-between mb-8 gap-5">
              <div>
                <p className="text-xs font-semibold text-accent uppercase tracking-widest mb-1">
                  Browse by type
                </p>
                <h2 className="text-2xl sm:text-3xl font-black text-primary tracking-tight">
                  Explore Categories
                </h2>
              </div>
              <Link
                to="/events"
                className="flex items-center gap-1 text-sm font-semibold text-accent hover:text-accent-hover transition-colors duration-150 shrink-0"
              >
                All categories <ChevronRight size={16} strokeWidth={2.5} />
              </Link>
            </div>
            <CategoryScroller
              categories={categories}
              loading={loadingCategories}
            />
          </div>
        </section>

        {/* How it works */}
        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-accent uppercase tracking-widest mb-1">
              Simple process
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-primary tracking-tight">
              How it works
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative">
            <div className="hidden sm:block absolute top-10 left-[calc(16.66%+1rem)] right-[calc(16.66%+1rem)] h-px bg-border z-0" />
            {HOW_STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.step}
                  className="relative z-10 flex flex-col items-center text-center gap-4 p-6 bg-card border border-border rounded-card"
                >
                  <div className="w-14 h-14 rounded-card bg-accent-text border border-accent-border flex items-center justify-center shrink-0">
                    <Icon
                      size={22}
                      className="text-accent"
                      strokeWidth={1.75}
                    />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-muted block mb-1">
                      {step.step}
                    </span>
                    <h3 className="font-bold text-primary mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-secondary leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Organiser CTA */}
        <section className="bg-accent mx-6 lg:mx-auto lg:max-w-6xl rounded-card mb-16 px-6 py-12 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-white/7" />
            <div className="absolute -bottom-16 -left-8 w-48 h-48 rounded-full bg-white/7" />
          </div>
          <div className="relative flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="text-center sm:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 rounded-full mb-4">
                <Users size={13} className="text-white" />
                <span className="text-xs font-semibold text-white">
                  For organisers
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight mb-3">
                Ready to host your event?
              </h2>
              <p className="text-sm text-white/80 leading-relaxed max-w-sm">
                Create your event, set ticket tiers, manage bookings, and check
                in attendees — all in one place.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full sm:w-auto">
              {isLoggedIn ? (
                <Link
                  to="/organizer/dashboard"
                  className="flex items-center justify-center gap-2 h-12 px-6 bg-white text-accent font-bold text-sm rounded-btn hover:bg-white/90 transition-colors duration-180 active:scale-95 w-full sm:w-auto"
                >
                  Go to Dashboard <ArrowRight size={16} strokeWidth={2.5} />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="flex items-center justify-center gap-2 h-12 px-6 bg-white text-accent font-bold text-sm rounded-btn hover:bg-white/90 transition-colors duration-180 active:scale-95 w-full sm:w-40"
                  >
                    Start for free <ArrowRight size={16} strokeWidth={2.5} />
                  </Link>
                  <Link
                    to="/login"
                    className="flex items-center justify-center h-12 px-6 border border-white/40 text-white font-semibold text-sm rounded-btn hover:bg-white/10 transition-colors duration-180 w-full sm:w-40"
                  >
                    Sign in
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-center sm:items-start gap-2">
              <img src={logo} alt="Ticketer logo" className="h-5" />
              <p className="text-xs text-muted">
                Nigeria's event ticketing platform
              </p>
            </div>
            <nav className="flex items-center gap-6 flex-wrap justify-center">
              {[
                { label: 'Browse Events', to: '/events' },
                { label: 'Sign In', to: '/login' },
                { label: 'Register', to: '/register' },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-xs text-secondary hover:text-primary transition-colors duration-150"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-xs text-muted">
              © {new Date().getFullYear()} Ticketer.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
