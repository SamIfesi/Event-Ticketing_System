import { useEffect, useState } from 'react';
import { useProfile } from '../../hooks/useProfile';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Footer from '../../components/layout/Footer';
import TicketFilters from '../../components/tickets/TicketFilters';
import TicketsSummary from '../../components/tickets/TicketsSummary';
import TicketsEmptyState from '../../components/tickets/TicketsEmptyState';
import ExpandableTicketCard from '../../components/tickets/ExpandableTicketCard';

function TicketSkeleton() {
  return (
    <div className="bg-card border border-border rounded-card overflow-hidden animate-pulse">
      <div className="h-1 bg-border w-full" />
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-btn bg-border shrink-0" />
          <div className="flex-1 flex flex-col gap-2">
            <div className="h-4 bg-border rounded w-2/3" />
            <div className="h-3 bg-border rounded w-1/3" />
          </div>
          <div className="h-5 bg-border rounded w-14 shrink-0" />
        </div>
        <div className="flex gap-4">
          <div className="h-3 bg-border rounded w-28" />
          <div className="h-3 bg-border rounded w-20" />
        </div>
        <div className="h-px bg-border" />
        <div className="flex justify-between">
          <div className="h-3 bg-border rounded w-16" />
          <div className="h-3 bg-border rounded w-20" />
        </div>
      </div>
    </div>
  );
}

export default function MyTicketsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatus] = useState('');
  const [dateFilter, setDate] = useState('all');

  const { tickets, ticketsLoading, fetchTickets } = useProfile();

  useEffect(() => {
    fetchTickets({ filter: dateFilter !== 'all' ? dateFilter : undefined });
  }, [dateFilter]);

  const filtered = tickets.filter((t) => {
    const matchStatus = !statusFilter || t.status === statusFilter;
    const matchSearch =
      !search ||
      (t.event_title ?? t.event?.title ?? '')
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (t.ticket_type_name ?? '').toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const hasFilters = Boolean(search || statusFilter);

  return (
    <div className="flex flex-col min-h-screen bg-main-bg">
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8">
        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-primary tracking-tight">
            My Tickets
          </h1>
          <p className="text-sm text-secondary mt-1">
            Your QR-coded entry passes, ready to scan at the gate.
          </p>
        </div>

        {/* Stats */}
        {!ticketsLoading && tickets.length > 0 && (
          <div className="mb-6">
            <TicketsSummary tickets={tickets} />
          </div>
        )}

        {/* Filters */}
        <div className="mb-6">
          <TicketFilters
            search={search}
            onSearch={setSearch}
            statusFilter={statusFilter}
            onStatus={setStatus}
            dateFilter={dateFilter}
            onDate={setDate}
          />
        </div>

        {/* Grid */}
        {ticketsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[0, 1, 2, 3].map((i) => (
              <TicketSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map((ticket) => (
              <ExpandableTicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        ) : (
          <TicketsEmptyState filtered={hasFilters} />
        )}
      </main>

      <Footer />
    </div>
  );
}
