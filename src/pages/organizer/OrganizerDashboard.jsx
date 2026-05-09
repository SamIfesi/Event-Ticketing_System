import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDays,
  Ticket,
  TrendingUp,
  Users,
  PlusCircle,
  ArrowRight,
  ChevronRight,
  LayoutDashboard,
} from 'lucide-react';
import { useOrganizerEvents } from '../../hooks/useOrganizerEvents';
import { useBookings } from '../../hooks/useBookings';
import { useAuthStore } from '../../store/authStore';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatShortDate, isEventPast } from '../../utils/formatDate';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Footer from '../../components/layout/Footer';
import StatCard from '../../components/dashboard/StatCard';
import RevenueChart from '../../components/dashboard/RevenueChart';
import Badge from '../../components/ui/Badge';
import EventTable from '../../components/dashboard/EventTable';

// ── Recent booking row ────────────────────────────────────────
function BookingRow({ booking }) {
  return (
    <div className="flex items-center gap-4 px-4 py-3.5 border-t border-border hover:bg-main-bg transition-colors duration-150 first:border-0">
      <div className="w-8 h-8 rounded-full bg-accent-text flex items-center justify-center shrink-0">
        <span className="text-xs font-bold text-accent">
          {(booking.attendee_name ?? 'A')?.charAt(0)?.toUpperCase()}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-primary truncate">
          {booking.attendee_name ?? 'Attendee'}
        </p>
        <p className="text-xs text-muted">
          {booking.ticket_type ?? 'Ticket'} ·{' '}
          {formatShortDate(booking.paid_at ?? booking.created_at)}
        </p>
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        <span className="text-sm font-bold text-primary">
          {formatCurrency(booking.total_amount ?? 0)}
        </span>
        <Badge status={booking.payment_status ?? 'paid'} size="sm" />
      </div>
    </div>
  );
}

function SkeletonBookingRow() {
  return (
    <div className="flex items-center gap-4 px-4 py-3.5 border-t border-border animate-pulse first:border-0">
      <div className="w-8 h-8 rounded-full bg-border shrink-0" />
      <div className="flex-1 flex flex-col gap-1.5">
        <div className="h-3 bg-border rounded w-32" />
        <div className="h-2.5 bg-border rounded w-24" />
      </div>
      <div className="flex flex-col items-end gap-1">
        <div className="h-4 bg-border rounded w-16" />
        <div className="h-4 bg-border rounded w-12" />
      </div>
    </div>
  );
}

export default function OrganizerDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = useAuthStore((s) => s.user);

  const {
    myEvents,
    myEventsLoading,
    fetchMyEvents,
    bookings: recentBookings,
    bookingsLoading,
    fetchEventBookings,
  } = useOrganizerEvents();

  useEffect(() => {
    fetchMyEvents();
  }, []);

  // Aggregate stats across all organizer events
  const totalEvents = myEvents.length;
  const publishedEvents = myEvents.filter(
    (e) => e.status === 'published'
  ).length;
  const totalSold = myEvents.reduce((acc, e) => acc + (e.tickets_sold ?? 0), 0);
  const totalRevenue = myEvents.reduce(
    (acc, e) => acc + parseFloat(e.revenue ?? 0),
    0
  );

  const upcomingEvents = myEvents
    .filter((e) => e.status === 'published' && !isEventPast(e.start_date))
    .sort((a, b) => new Date(a.start_date) - new Date(b.start_date))
    .slice(0, 5);

  // Build a simple revenue chart from the top events
  const chartData = [...myEvents]
    .filter((e) => parseFloat(e.revenue ?? 0) > 0)
    .sort((a, b) => parseFloat(b.revenue) - parseFloat(a.revenue))
    .slice(0, 7)
    .map((e) => ({
      label: e.title?.slice(0, 12) + (e.title?.length > 12 ? '…' : ''),
      value: parseFloat(e.revenue ?? 0),
    }));

  return (
    <div className="flex flex-col min-h-screen bg-main-bg">
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">
        {/* ── Header ───────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <LayoutDashboard size={14} className="text-accent" />
              <span className="text-xs font-bold text-accent uppercase tracking-widest">
                Organizer
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-primary tracking-tight">
              {user?.name?.split(' ')[0]}'s Dashboard
            </h1>
            <p className="text-sm text-secondary mt-1">
              Manage your events and track performance.
            </p>
          </div>
          <Link
            to="/organizer/create/event"
            className="self-start sm:self-auto flex items-center gap-2 h-11 px-5 bg-accent hover:bg-accent-hover text-white text-sm font-semibold rounded-btn transition-colors duration-180 shrink-0"
          >
            <PlusCircle size={16} strokeWidth={2.5} /> New Event
          </Link>
        </div>

        {/* ── Stat cards ───────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={CalendarDays}
            label="Total Events"
            value={myEventsLoading ? '—' : totalEvents}
            sub={`${publishedEvents} published`}
            accent="#2563eb"
            loading={myEventsLoading}
          />
          <StatCard
            icon={CalendarDays}
            label="Upcoming"
            value={myEventsLoading ? '—' : upcomingEvents.length}
            sub="live events ahead"
            accent="#10b981"
            loading={myEventsLoading}
          />
          <StatCard
            icon={Ticket}
            label="Tickets Sold"
            value={myEventsLoading ? '—' : totalSold.toLocaleString()}
            sub="across all events"
            accent="#f59e0b"
            loading={myEventsLoading}
          />
          <StatCard
            icon={TrendingUp}
            label="Total Revenue"
            value={myEventsLoading ? '—' : formatCurrency(totalRevenue)}
            sub="from paid bookings"
            accent="#8b5cf6"
            loading={myEventsLoading}
          />
        </div>

        {/* ── Charts + upcoming ────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Revenue by event chart */}
          <div className="lg:col-span-2">
            <RevenueChart
              data={chartData}
              title="Revenue by Event"
              subtitle="Top earning events"
              valuePrefix="₦"
              loading={myEventsLoading}
            />
          </div>

          {/* Upcoming events list */}
          <div className="bg-card border border-border rounded-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-primary">Upcoming</h3>
              <Link
                to="/organizer/events"
                className="text-xs font-semibold text-accent hover:text-accent-hover transition-colors flex items-center gap-0.5"
              >
                All <ChevronRight size={12} strokeWidth={2.5} />
              </Link>
            </div>

            {myEventsLoading ? (
              <div className="flex flex-col gap-3">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="animate-pulse flex flex-col gap-1.5 py-3 border-b border-border last:border-0"
                  >
                    <div className="h-3 bg-border rounded w-3/4" />
                    <div className="h-2.5 bg-border rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : upcomingEvents.length > 0 ? (
              <div className="flex flex-col divide-y divide-border">
                {upcomingEvents.map((event) => (
                  <Link
                    key={event.id}
                    to={`/organizer/events/${event.id}/bookings`}
                    className="py-3 flex flex-col gap-1 hover:opacity-80 transition-opacity"
                  >
                    <p className="text-sm font-semibold text-primary line-clamp-1">
                      {event.title}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted">
                        {formatShortDate(event.start_date)}
                      </p>
                      <span className="text-xs font-semibold text-accent">
                        {event.tickets_sold ?? 0}/{event.total_tickets ?? 0}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <CalendarDays
                  size={24}
                  className="text-muted"
                  strokeWidth={1.5}
                />
                <p className="text-xs text-muted">
                  No upcoming published events.
                </p>
                <Link
                  to="/organizer/events/create"
                  className="text-xs font-semibold text-accent hover:text-accent-hover transition-colors"
                >
                  Create your first event →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* ── Events table ─────────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-primary">My Events</h2>
            <Link
              to="/organizer/events"
              className="flex items-center gap-1 text-xs font-semibold text-accent hover:text-accent-hover transition-colors"
            >
              Manage all <ArrowRight size={13} strokeWidth={2.5} />
            </Link>
          </div>
          <EventTable
            events={myEvents.slice(0, 5)}
            loading={myEventsLoading}
            showActions="organizer"
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
