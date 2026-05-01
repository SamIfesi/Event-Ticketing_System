import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Search,
  Filter,
  X,
  CheckCircle2,
  CreditCard,
} from 'lucide-react';
import { useBookings } from '../../hooks/useBookings';
import { formatCurrency } from '../../utils/formatCurrency';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Footer from '../../components/layout/Footer';
import BookingCard from '../../components/bookings/BookingCard';
import { BookingSkeleton, EmptyState } from '../../components/bookings/BookingSkeleton';

const PAYMENT_FILTERS = [
  { value: '', label: 'All' },
  { value: 'paid', label: 'Paid' },
  { value: 'pending', label: 'Pending' },
  { value: 'failed', label: 'Failed' },
  { value: 'refunded', label: 'Refunded' },
];

export default function MyBookingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');

  const { bookings, bookingsLoading, fetchMyBookings } = useBookings();

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const filtered = bookings.filter((b) => {
    const matchFilter = !filter || b.payment_status === filter;
    const matchSearch =
      !search ||
      (b.event_title ?? b.event?.title ?? '')
        .toLowerCase()
        .includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  // Summary stats
  const totalSpent = bookings
    .filter((b) => b.payment_status === 'paid')
    .reduce((acc, b) => acc + (b.total_amount ?? 0), 0);
  const confirmedCount = bookings.filter(
    (b) => b.payment_status === 'paid'
  ).length;
  const totalTickets = bookings.reduce((acc, b) => acc + (b.quantity ?? 0), 0);

  return (
    <div className="flex flex-col min-h-screen bg-main-bg">
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-primary tracking-tight">
            My Bookings
          </h1>
          <p className="text-sm text-secondary mt-1">
            Track all your event bookings and payment status.
          </p>
        </div>

        {/* Summary strip */}
        {!bookingsLoading && bookings.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              {
                label: 'Total Bookings',
                value: bookings.length,
                icon: BookOpen,
                color: '#2563eb',
              },
              {
                label: 'Confirmed',
                value: confirmedCount,
                icon: CheckCircle2,
                color: '#22c55e',
              },
              {
                label: 'Total Tickets',
                value: totalTickets,
                icon: Ticket,
                color: '#ee743c',
              },
              {
                label: 'Total Spent',
                value: formatCurrency(totalSpent),
                icon: CreditCard,
                color: '#8b5cf6',
              },
            ].map(({ label, value, icon: Icon, color }) => (
              <div
                key={label}
                className="bg-card border border-border rounded-card px-4 py-3.5 flex items-center gap-3"
              >
                <div
                  className="w-9 h-9 rounded-btn flex items-center justify-center shrink-0"
                  style={{ background: `${color}18` }}
                >
                  <Icon size={17} strokeWidth={1.75} style={{ color }} />
                </div>
                <div>
                  <p className="text-base font-black text-primary leading-none">
                    {value}
                  </p>
                  <p className="text-xs text-muted mt-0.5">{label}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Search + filter row */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by event name…"
              className="w-full h-10 pl-9 pr-9 bg-card border border-border rounded-btn text-sm text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {PAYMENT_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`h-10 px-3 rounded-btn text-xs font-semibold transition-colors border ${
                  filter === f.value
                    ? 'bg-accent text-white border-accent'
                    : 'bg-card text-secondary border-border hover:text-primary hover:border-accent/40'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings list */}
        {bookingsLoading ? (
          <div className="flex flex-col gap-4">
            {[0, 1, 2, 3].map((i) => (
              <BookingSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="flex flex-col gap-4">
            {filtered.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        ) : (
          <EmptyState filtered={Boolean(filter || search)} />
        )}
      </main>

      <Footer />
    </div>
  );
}
