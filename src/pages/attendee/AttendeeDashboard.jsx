import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Ticket,
  CalendarDays,
  BookOpen,
  Wallet,
  ArrowRight,
  Clock,
  MapPin,
  AlertCircle,
  ChevronRight,
  Search,
  Zap,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useProfile } from '../../hooks/useProfile';
import { useBookings } from '../../hooks/useBookings';
import { formatCurrency } from '../../utils/formatCurrency';
import { isEventPast } from '../../utils/formatDate';
import Badge from '../../components/ui/Badge';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Footer from '../../components/layout/Footer';
import StatCard from '../../components/dashboard/StatCard';
import UpcomingEventCard from '../../components/dashboard/UpcomingEventCard';
import BookingRow from '../../components/bookings/BookingRow';

function SkeletonRow() {
  return (
    <div className=" flex items-center gap-4 px-4 py-3.5 animate-pulse">
      <div className="w-9 h-9 rounded-btn bg-border shrink-0" />
      <div className=" flex-1 flex flex-col gap-1.5">
        <div className="h-3.5 bg-border rounded w-3/4" />
        <div className="h-3 bg-border rounded w-1/2" />
      </div>
      <div className="h-5 bg-border rounded w-16" />
    </div>
  );
}

function QuickAction({ icon: Icon, label, to, color }) {
  return (
    <Link
      to={to}
      className="flex flex-col items-center gap-2.5 p-4 bg-card border border-border rounded-card hover:border-accent/40 hover:shadow-md transition-all duration-200 active:scale-[.97] touch-manipulation group"
    >
      <div
        className="w-11 h-11 rounded-btn flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
        style={{ background: `${color}15` }}
      >
        <Icon size={20} strokeWidth={1.75} style={{ color }} />
      </div>
      <span className="text-xs font-semibold text-secondary group-hover:text-primary transition-colors text-center leading-tight">
        {label}
      </span>
    </Link>
  );
}

function EmptyBookings() {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
      <div className="w-14 h-14 rounded-card bg-accent-text border border-accent-border flex items-center justify-center">
        <Ticket size={24} strokeWidth={1.5} className="text-accent" />
      </div>
      <div>
        <p className="font-semibold text-primary">No bookings yet</p>
        <p className="text-sm text-secondary mt-1 max-w-xs">
          Find an event you love and grab your first ticket.
        </p>
      </div>

      <Link
        to="/events"
        className=" flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-hover transition-colors duration-180"
      >
        Browse events →
      </Link>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function AttendeeDashboard() {
  const user = useAuthStore((state) => state.user);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { profile, profileLoading, fetchProfile } = useProfile();
  const { bookings, bookingsLoading, fetchMyBookings } = useBookings();

  useEffect(() => {
    fetchProfile();
    fetchMyBookings();
  }, []);

  const totalBookings = bookings?.length ?? 0;
  const confirmedBookings =
    bookings?.filter(
      (b) => b.payment_status === 'paid' || b.status === 'confirmed'
    ) ?? [];
  const upcomingBookings = confirmedBookings.filter(
    (b) => b.event?.start_date && !isEventPast(b.event.start_date)
  );
  const totalTickets =
    bookings?.reduce((acc, b) => acc + (b.quantity ?? 0), 0) ?? 0;
  const totalSpent =
    bookings
      ?.filter((b) => b.payment_status === 'paid')
      .reduce((acc, b) => acc + (b.total_amount ?? 0), 0) ?? 0;

  const recentBookings = [...(bookings ?? [])].slice(0, 5);

  const nextEvents = upcomingBookings.slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen bg-main-bg">
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-btween gap-4 mb-8">
          <div>
            {profileLoading ? (
              <div className="animate-pulse flex flex-col gap-2">
                <div className="h-7 bg-border rounded w-52" />
                <div className="h-4 bg-border rounded w-36" />
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-accent uppercase trackng-widest">
                    {getGreeting()}
                  </span>
                  <Zap size={13} className="text-accent" />
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-primary tracking-tight">
                  {user?.name ?? 'welcome back'}
                </h1>
                <p className="text-sm text-secondary mt-0.5">
                  Here's what going on with your tickets.'
                </p>
              </>
            )}
          </div>
          <Link
            to="/events"
            className="self-start sm:self-auto flex items-center gap-2 h-11 px-5 bg-accent hover:bg-accent-hover text-white text-sm font-semibold rounded-btn transition-colors duration-180 active:scale-95 touch-manipulation shrink-0"
          >
            <Search size={15} strokeWidth={2.5} /> Find Events
          </Link>
        </div>

        {/* stat cards */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-primary">
            Dashboard Statistics
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={BookOpen}
            label="Total Bookings"
            value={bookingsLoading ? '—' : totalBookings}
            sub={
              totalBookings === 1
                ? '1 booking made'
                : `${totalBookings}bookings made`
            }
            accent="#2563eb"
            loading={bookingsLoading}
          />
          <StatCard
            icon={CalendarDays}
            label="Upcoming Events"
            value={bookingsLoading ? '—' : upcomingBookings.length}
            sub={
              upcomingBookings.length === 0
                ? 'Nothing scheduled'
                : 'Events ahead'
            }
            accent="#10b981"
            loading={bookingsLoading}
          />
          <StatCard
            icon={Ticket}
            label="Total Tickets"
            value={bookingsLoading ? '—' : totalTickets}
            sub="across all bookings"
            accent="#f59e0b"
            loading={bookingsLoading}
          />
          <StatCard
            icon={Wallet}
            label="Total Spent"
            value={bookingsLoading ? '—' : formatCurrency(totalSpent)}
            sub="on paid bookings"
            accent="#8b5cf6"
            loading={bookingsLoading}
          />
        </div>

        {/* Two col layout: upcoming + quick actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-primary">
                Upcoming Events
              </h2>
              <Link
                to="/my-tickets"
                className="text-xs font-semibold text-accent hover:text-accent-hover transition-colors duration-180 flex items-center gap-1"
              >
                View tickets
                <ChevronRight size={13} strokeWidth={2.5} />
              </Link>
            </div>

            {bookingsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[0, 1, 2].map((index) => (
                  <div
                    key={index}
                    className="bg-card border border-border rounded-card overflow-hidden animate-pulse"
                  >
                    <div className="h-28 bg-border" />
                    <div className="p-3 flex flex-col gap-2">
                      <div className="h-3 bg-border rounded w-full" />
                      <div className="h-3 bg-border rounded w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : nextEvents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {nextEvents.map((booking, index) => (
                  <UpcomingEventCard
                    key={booking.id}
                    booking={booking}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-card border border-border rounded-card p-8 flex flex-col items-center gap-3 text-center">
                <CalendarDays
                  size={28}
                  className="text-muted"
                  strokeWidth={1.5}
                />
                <div>
                  <p className="text-sm font-semibold text-primary">
                    No upcoming events
                  </p>
                  <p className="text-xs text-secondary mt-0.5">
                    Your next events will appear here.
                  </p>
                </div>
                <Link
                  to="/events"
                  className="text-xs font-semibold text-accent hover:text-accent-hover transition-colors duration-180"
                >
                  Browse events →
                </Link>
              </div>
            )}
          </div>

          {/* Quick action - 1/3 width */}
          <div>
            <h2 className="text-basefont-bold text-primary mb-4">
              Quick Actions
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <QuickAction
                icon={Search}
                label="Browse Events"
                to="/events "
                color="#2563eb"
              />
              <QuickAction
                icon={BookOpen}
                label="My Bookings"
                to="/my-bookings"
                color="#10b981"
              />
              <QuickAction
                icon={Ticket}
                label="My Tickets"
                to="/my-tickets"
                color="#f59e0b"
              />
              <QuickAction
                icon={CalendarDays}
                label="Upcoming Events"
                to="/my-bookings"
                color="#8b5cf6"
              />
            </div>

            {/* profile complete nudge */}

            {!profileLoading && profile && !profile.avatar && (
              <Link
                to="/profile"
                className="mt-4 flex items-center gap-3 p-3 bg-accents-text border border-accent-border rounded-card hpver:shadow-sm transition-all duration-180"
              >
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                  <AlertCircle size={15} className="text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-accent leading-snug">
                    Complete your profile
                  </p>
                  <p className="text-[11px] text-secondary mt-0.5">
                    Add a photo and update your Bio
                  </p>
                </div>
                <ChevronRight className="text-accent/60 shrink-0" size={13} />
              </Link>
            )}
          </div>
        </div>

        {/* ── Recent bookings table ───────────────────────────────────── */}
        <div className="bg-card border border-border rounded-card overflow-hidden">
          <div className="flex items-center justify-between px-4 py-4 border-b border-border">
            <h2 className="text-base font-bold text-primary">
              Recent Bookings
            </h2>
            <Link
              to="/my-bookings"
              className="text-xs font-semibold text-accent hover:text-accent-hover transition-colors flex items-center gap-1"
            >
              View all <ArrowRight size={13} strokeWidth={2.5} />
            </Link>
          </div>

          {bookingsLoading ? (
            <div className="divide-y divide-border">
              {[0, 1, 2, 3].map((i) => (
                <SkeletonRow key={i} />
              ))}
            </div>
          ) : recentBookings.length > 0 ? (
            <div className="divide-y divide-border">
              {recentBookings.map((booking) => (
                <BookingRow key={booking.id} booking={booking} />
              ))}
            </div>
          ) : (
            <EmptyBookings />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
