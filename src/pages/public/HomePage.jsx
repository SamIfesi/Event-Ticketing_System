import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ArrowRight,
  Users,
  Ticket,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import EventsService from '../../services/events.service';
import CategoryService from '../../services/category.service';
import line from '/assets/illustrations/line.svg';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Footer from '../../components/layout/Footer';
import EventGrid from '../../components/events/EventGrid';
import CategoryScroller from '../../components/events/CategoryScroller';

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

// ────────────────────────────────────────────────────────────────────────────
// Main page
// ────────────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const token = useAuthStore((state) => state.token);
  const isLoggedIn = Boolean(token);

  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
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

          <EventGrid
            events={featuredEvents}
            loading={loadingEvents}
            cols={4}
            ctaTo="/events"
          />
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
      <Footer />
    </div>
  );
}
