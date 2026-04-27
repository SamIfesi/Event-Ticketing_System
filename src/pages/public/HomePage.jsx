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
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { formatEventDate } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';
import logo from '/assets/icons/logo.svg';
import line from '/assets/illustrations/line.svg';

// ── Fake data until EventsService is wired in ────────────────────────────────
const FEATURED_EVENTS = [
  {
    id: 1,
    title: 'Lagos Tech Summit 2026',
    category: 'Technology',
    location: 'Eko Hotel & Suites, Lagos',
    start_date: '2026-05-15T09:00:00',
    banner_image: null,
    min_price: 15000,
    total_tickets: 500,
    status: 'published',
  },
  {
    id: 2,
    title: 'Afrobeats Night: Legends Live',
    category: 'Music',
    location: 'Tafawa Balewa Square, Lagos',
    start_date: '2026-05-22T19:00:00',
    banner_image: null,
    min_price: 8000,
    total_tickets: 2000,
    status: 'published',
  },
  {
    id: 3,
    title: 'Startup Founders Bootcamp',
    category: 'Business',
    location: 'Co-Creation Hub, Yaba',
    start_date: '2026-06-01T08:00:00',
    banner_image: null,
    min_price: 25000,
    total_tickets: 150,
    status: 'published',
  },
  {
    id: 4,
    title: 'Nigerian Food Festival',
    category: 'Food & Drink',
    location: 'Landmark Event Centre',
    start_date: '2026-06-10T11:00:00',
    banner_image: null,
    min_price: 5000,
    total_tickets: 1000,
    status: 'published',
  },
];

const CATEGORIES = [
  { id: 1, name: 'Music', icon: Music, count: 24, color: '#f59e0b' },
  { id: 2, name: 'Technology', icon: Cpu, count: 18, color: '#2563eb' },
  { id: 3, name: 'Business', icon: Briefcase, count: 31, color: '#10b981' },
  { id: 4, name: 'Health', icon: Heart, count: 12, color: '#ef4444' },
  { id: 5, name: 'Education', icon: BookOpen, count: 9, color: '#8b5cf6' },
  { id: 6, name: 'Food & Drink', icon: Utensils, count: 15, color: '#f97316' },
  { id: 7, name: 'Sports', icon: Trophy, count: 8, color: '#06b6d4' },
];

const STATS = [
  { label: 'Events hosted', value: '1,200+' },
  { label: 'Tickets sold', value: '48,000+' },
  { label: 'Active organisers', value: '340+' },
  { label: 'Cities covered', value: '12' },
];

// ── Event card placeholder gradient ─────────────────────────────────────────
const CARD_GRADIENTS = [
  'from-blue-600 to-indigo-800',
  'from-amber-500 to-orange-700',
  'from-emerald-500 to-teal-700',
  'from-rose-500 to-pink-700',
];

// ── Search bar ───────────────────────────────────────────────────────────────
function HeroSearch() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  function handleSearch(e) {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/events?search=${encodeURIComponent(query.trim())}`);
    } else {
      navigate('/events');
    }
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

// ── Event card ───────────────────────────────────────────────────────────────
function EventCard({ event, index }) {
  return (
    <Link
      to={`/events/${event.id}`}
      className="group flex flex-col bg-card border border-border rounded-card overflow-hidden hover:shadow-lg hover:border-accent/30 transition-all duration-250 active:scale-[.99]"
    >
      {/* Banner / placeholder */}
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

        {/* Category pill */}
        <span className="absolute top-3 left-3 px-2.5 py-1 bg-black/40 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
          {event.category}
        </span>

        {/* Price */}
        <span className="absolute top-3 right-3 px-2.5 py-1 bg-black/40 backdrop-blur-sm text-white text-xs font-bold rounded-full">
          {event.min_price === 0
            ? 'Free'
            : `From ${formatCurrency(event.min_price)}`}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-2 p-4 flex-1">
        <h3 className="font-bold text-primary text-sm leading-snug line-clamp-2 group-hover:text-accent transition-colors duration-180">
          {event.title}
        </h3>
        <div className="flex flex-col gap-1.5 mt-auto">
          <div className="flex items-center gap-1.5 text-xs text-secondary">
            <Calendar size={13} className="shrink-0 text-muted" />
            <span>{formatEventDate(event.start_date)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-secondary">
            <MapPin size={13} className="shrink-0 text-muted" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ── Category card — compact for the scroll strip ─────────────────────────────
function CategoryCard({ cat }) {
  const Icon = cat.icon;
  return (
    <Link
      to={`/events?category=${cat.id}`}
      className="group flex-shrink-0 flex flex-col items-center gap-3 w-28 p-4 bg-main-bg border border-border rounded-card hover:border-accent/40 hover:shadow-md transition-all duration-200 active:scale-[.97] touch-manipulation snap-start"
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
        style={{ background: `${cat.color}18` }}
      >
        <Icon size={22} style={{ color: cat.color }} strokeWidth={1.75} />
      </div>
      <div className="text-center">
        <span className="block text-xs font-semibold text-primary leading-tight">
          {cat.name}
        </span>
        <span className="block text-[11px] text-muted mt-0.5">
          {cat.count} events
        </span>
      </div>
    </Link>
  );
}

// ── Horizontal category scroller ──────────────────────────────────────────────
function CategoryScroller() {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  function updateArrows() {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }

  function scrollBy(direction) {
    const el = scrollRef.current;
    if (!el) return;
    // 2 card widths: card(112px) + gap(16px) ≈ 256px × 2
    el.scrollBy({ left: direction * 256, behavior: 'smooth' });
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
  }, []);

  return (
    <div className="relative">
      {/* Left fade */}
      <div
        className={`absolute left-0 top-0 bottom-2 w-14 z-10 pointer-events-none bg-gradient-to-r from-card to-transparent transition-opacity duration-200 rounded-l-card ${
          canScrollLeft ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Left arrow */}
      <button
        onClick={() => scrollBy(-1)}
        aria-label="Scroll categories left"
        className={`absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-card border border-border shadow-md flex items-center justify-center text-secondary hover:text-primary hover:border-accent/40 transition-all duration-150 touch-manipulation ${
          canScrollLeft
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        <ChevronLeft size={16} strokeWidth={2.5} />
      </button>

      {/* Scroll track — hidden scrollbar via inline style */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* Inline rule to kill WebKit scrollbar without needing a CSS file edit */}
        <style>{`
          .cat-strip::-webkit-scrollbar { display: none; }
        `}</style>

        {/* Left breathing room */}
        <div className="flex-shrink-0 w-1" aria-hidden="true" />

        {CATEGORIES.map((cat) => (
          <CategoryCard key={cat.id} cat={cat} />
        ))}

        {/* Right breathing room */}
        <div className="flex-shrink-0 w-1" aria-hidden="true" />
      </div>

      {/* Right fade */}
      <div
        className={`absolute right-0 top-0 bottom-2 w-14 z-10 pointer-events-none bg-gradient-to-l from-card to-transparent transition-opacity duration-200 rounded-r-card ${
          canScrollRight ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Right arrow */}
      <button
        onClick={() => scrollBy(1)}
        aria-label="Scroll categories right"
        className={`absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-card border border-border shadow-md flex items-center justify-center text-secondary hover:text-primary hover:border-accent/40 transition-all duration-150 touch-manipulation ${
          canScrollRight
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        <ChevronRight size={16} strokeWidth={2.5} />
      </button>
    </div>
  );
}

// ── Stat item ────────────────────────────────────────────────────────────────
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

// ── How it works step ────────────────────────────────────────────────────────
const HOW_STEPS = [
  {
    step: '01',
    title: 'Discover events',
    desc: 'Browse hundreds of events across Nigeria — concerts, conferences, festivals, and more.',
    icon: Search,
  },
  {
    step: '02',
    title: 'Book your ticket',
    desc: 'Select your ticket type, pay securely via Paystack, and get your QR code instantly.',
    icon: Ticket,
  },
  {
    step: '03',
    title: 'Show up & enjoy',
    desc: 'Scan your QR at the gate and walk straight in. No printing needed.',
    icon: Zap,
  },
];

// ── Main page ────────────────────────────────────────────────────────────────
export default function HomePage() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const isLoggedIn = Boolean(token);

  // Simple fade-in on mount
  const heroRef = useRef(null);
  useEffect(() => {
    if (heroRef.current) {
      heroRef.current.style.opacity = '0';
      heroRef.current.style.transform = 'translateY(16px)';
      requestAnimationFrame(() => {
        if (!heroRef.current) return;
        heroRef.current.style.transition =
          'opacity 600ms ease, transform 600ms ease';
        heroRef.current.style.opacity = '1';
        heroRef.current.style.transform = 'translateY(0)';
      });
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-main-bg">
      {/* ── Navbar ──────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <Link to="/home" className="flex items-center gap-2 shrink-0">
            <img src={logo} alt="Ticketer" className="h-6" />
          </Link>

          {/* Nav links — hidden on mobile */}
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

          {/* Auth actions */}
          <div className="flex items-center gap-2 shrink-0 justify-center">
            {isLoggedIn ? (
              <Link
                to="/profile"
                className="flex items-center gap-2 h-9 px-3 rounded-btn border border-border hover:bg-border text-sm font-medium text-primary transition-colors duration-150"
              >
                <div className="w-6 h-6 rounded-full bg-accent-text flex items-center justify-center">
                  <span className="text-xs font-bold text-accent">
                    {user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
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
        {/* ── Hero ────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-main-bg pt-16 pb-20 px-6">
          {/* Background decoration */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
            <div className="absolute top-1/2 -left-24 w-64 h-64 rounded-full bg-accent/5 blur-2xl" />
          </div>

          <div ref={heroRef} className="relative max-w-3xl mx-auto text-center">
            {/* Eyebrow */}
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

        {/* ── Stats bar ───────────────────────────────────────────────────── */}
        <section className="border-y border-border bg-card">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-0 sm:divide-x divide-border">
              {STATS.map((s) => (
                <StatItem key={s.label} value={s.value} label={s.label} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Featured Events ──────────────────────────────────────────────── */}
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
              View all
              <ChevronRight size={16} strokeWidth={2.5} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURED_EVENTS.map((event, i) => (
              <EventCard key={event.id} event={event} index={i} />
            ))}
          </div>
        </section>

        {/* ── Categories ──────────────────────────────────────────────────── */}
        <section className="bg-card border-y border-border py-16">
          <div className="max-w-6xl mx-auto px-6">
            {/* Header */}
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
                All categories
                <ChevronRight size={16} strokeWidth={2.5} />
              </Link>
            </div>

            {/* Horizontal scroller */}
            <CategoryScroller />
          </div>
        </section>

        {/* ── How it works ─────────────────────────────────────────────────── */}
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
            {/* Connector line — desktop only */}
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

        {/* ── Organiser CTA ─────────────────────────────────────────────────── */}
        <section className="bg-accent mx-6 lg:mx-auto lg:max-w-6xl rounded-card mb-16 px-6 py-12 relative overflow-hidden">
          {/* Background decoration */}
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
                  Go to Dashboard
                  <ArrowRight size={16} strokeWidth={2.5} />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="flex items-center justify-center gap-2 h-12 px-6 bg-white text-accent font-bold text-sm rounded-btn hover:bg-white/90 transition-colors duration-180 active:scale-95 w-full sm:w-40"
                  >
                    Start for free
                    <ArrowRight size={16} strokeWidth={2.5} />
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

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
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
