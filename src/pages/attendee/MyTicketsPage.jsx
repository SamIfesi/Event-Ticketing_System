import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Ticket,
  Search,
  X,
  Calendar,
  MapPin,
  CheckCircle2,
  XCircle,
  Clock,
  QrCode,
  ChevronDown,
  ChevronUp,
  Download,
} from 'lucide-react';
import { useProfile } from '../../hooks/useProfile';
import { formatShortDate, formatTime } from '../../utils/formatDate';
import Badge from '../../components/ui/Badge';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Footer from '../../components/layout/Footer';
import QRCodeDisplay from '../../components/tickets/QRCodeDisplay';

const STATUS_FILTERS = [
  { value: '', label: 'All' },
  { value: 'valid', label: 'Valid' },
  { value: 'used', label: 'Used' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'expired', label: 'Expired' },
];

const DATE_FILTERS = [
  { value: 'all', label: 'All time' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'past', label: 'Past' },
];

function StatusIcon({ status }) {
  switch (status) {
    case 'valid':
      return <CheckCircle2 size={14} className="text-success" strokeWidth={2.5} />;
    case 'used':
      return <CheckCircle2 size={14} className="text-muted" strokeWidth={2.5} />;
    case 'cancelled':
    case 'expired':
      return <XCircle size={14} className="text-error" strokeWidth={2.5} />;
    default:
      return <Clock size={14} className="text-warning" strokeWidth={2.5} />;
  }
}

function TicketSkeleton() {
  return (
    <div className="bg-card border border-border rounded-card overflow-hidden animate-pulse">
      <div className="h-2 bg-border w-full" />
      <div className="p-5 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1.5 flex-1">
            <div className="h-4 bg-border rounded w-3/4" />
            <div className="h-3 bg-border rounded w-1/2" />
          </div>
          <div className="h-5 bg-border rounded w-16 shrink-0" />
        </div>
        <div className="flex gap-4">
          <div className="h-3 bg-border rounded w-24" />
          <div className="h-3 bg-border rounded w-20" />
        </div>
        <div className="h-px bg-border" />
        <div className="flex items-center justify-between">
          <div className="h-3 bg-border rounded w-24" />
          <div className="h-7 bg-border rounded w-20" />
        </div>
      </div>
    </div>
  );
}

function TicketCard({ ticket }) {
  const [expanded, setExpanded] = useState(false);
  const event = ticket?.event ?? {};
  const isValid = ticket?.status === 'valid';
  const isUsed = ticket?.status === 'used';
  const isCancelled = ticket?.status === 'cancelled' || ticket?.status === 'expired';

  const accentColor = isValid
    ? 'bg-success'
    : isUsed
    ? 'bg-muted'
    : isCancelled
    ? 'bg-error'
    : 'bg-warning';

  return (
    <div
      className={`bg-card border border-border rounded-card overflow-hidden transition-all duration-200 hover:shadow-md ${
        isCancelled ? 'opacity-60' : 'hover:border-accent/20'
      }`}
    >
      {/* Top color strip */}
      <div className={`h-1 w-full ${accentColor}`} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-3">
          {/* Event thumb */}
          <div className="w-12 h-12 rounded-btn overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-700 shrink-0 flex items-center justify-center">
            {event.banner_image ? (
              <img
                src={event.banner_image}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-base font-black text-white/60">
                {(ticket?.event_title ?? event?.title ?? 'E')?.charAt(0)}
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-bold text-sm text-primary leading-snug line-clamp-1">
                  {ticket?.event_title ?? event?.title ?? 'Event'}
                </h3>
                <p className="text-xs text-muted mt-0.5">
                  {ticket?.ticket_type_name ?? 'General'} ·{' '}
                  <span className="font-mono">
                    #{String(ticket?.id ?? 0).padStart(6, '0')}
                  </span>
                </p>
              </div>
              <Badge status={ticket?.status} size="sm" />
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3">
          {event.start_date && (
            <div className="flex items-center gap-1.5 text-xs text-secondary">
              <Calendar size={11} className="text-muted shrink-0" />
              <span>
                {formatShortDate(event.start_date)} · {formatTime(event.start_date)}
              </span>
            </div>
          )}
          {event.location && (
            <div className="flex items-center gap-1.5 text-xs text-secondary">
              <MapPin size={11} className="text-muted shrink-0" />
              <span className="truncate max-w-[180px]">{event.location}</span>
            </div>
          )}
        </div>

        {/* Status note */}
        {isUsed && ticket?.checked_in_at && (
          <div className="mt-3 flex items-center gap-1.5 text-xs text-muted">
            <CheckCircle2 size={11} className="text-success" />
            <span>Checked in on {formatShortDate(ticket.checked_in_at)}</span>
          </div>
        )}

        {/* Divider */}
        <div className="my-4 border-t border-dashed border-border relative">
          <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-main-bg border border-border" />
          <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-main-bg border border-border" />
        </div>

        {/* Footer row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <StatusIcon status={ticket?.status} />
            <span className="text-xs font-semibold text-secondary capitalize">
              {ticket?.status ?? 'Unknown'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isValid && (
              <button
                onClick={() => setExpanded((v) => !v)}
                className="flex items-center gap-1 text-xs font-semibold text-accent hover:text-accent-hover transition-colors touch-manipulation"
              >
                <QrCode size={13} strokeWidth={2} />
                {expanded ? 'Hide QR' : 'Show QR'}
                {expanded ? (
                  <ChevronUp size={12} strokeWidth={2.5} />
                ) : (
                  <ChevronDown size={12} strokeWidth={2.5} />
                )}
              </button>
            )}
            <Link
              to={`/events/${event?.id ?? ticket?.event_id}`}
              className="text-xs font-semibold text-secondary hover:text-primary transition-colors"
            >
              View event
            </Link>
          </div>
        </div>

        {/* Expandable QR */}
        {expanded && isValid && (
          <div className="mt-4 pt-4 border-t border-border flex flex-col items-center gap-3">
            <p className="text-xs text-muted text-center">
              Show this QR code at the gate for entry
            </p>
            <QRCodeDisplay
              url={ticket?.qr_code_url}
              size={160}
              disabled={isUsed || isCancelled}
            />
            <p className="text-[10px] font-mono text-muted tracking-wider">
              #{String(ticket?.id ?? 0).padStart(8, '0')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({ filtered }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-5 text-center">
      <div className="w-16 h-16 rounded-card bg-accent-text border border-accent-border flex items-center justify-center">
        <Ticket size={28} strokeWidth={1.5} className="text-accent" />
      </div>
      <div>
        <p className="font-bold text-primary text-lg">
          {filtered ? 'No tickets match your filter' : 'No tickets yet'}
        </p>
        <p className="text-sm text-secondary mt-1 max-w-xs">
          {filtered
            ? 'Try changing or clearing your filters.'
            : 'Tickets for events you book will appear here.'}
        </p>
      </div>
      {!filtered && (
        <Link
          to="/events"
          className="flex items-center gap-1.5 h-10 px-5 bg-accent hover:bg-accent-hover text-white text-sm font-semibold rounded-btn transition-colors"
        >
          <Search size={14} strokeWidth={2.5} /> Browse events
        </Link>
      )}
    </div>
  );
}

export default function MyTicketsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [search, setSearch] = useState('');

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

  const validCount = tickets.filter((t) => t.status === 'valid').length;
  const usedCount = tickets.filter((t) => t.status === 'used').length;

  return (
    <div className="flex flex-col min-h-screen bg-main-bg">
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-primary tracking-tight">
            My Tickets
          </h1>
          <p className="text-sm text-secondary mt-1">
            Your QR-coded entry passes, ready to scan at the gate.
          </p>
        </div>

        {/* Summary */}
        {!ticketsLoading && tickets.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Total Tickets', value: tickets.length, color: '#2563eb' },
              { label: 'Valid', value: validCount, color: '#22c55e' },
              { label: 'Used', value: usedCount, color: '#94a3b8' },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                className="bg-card border border-border rounded-card px-4 py-3 text-center"
              >
                <p
                  className="text-xl font-black leading-none"
                  style={{ color }}
                >
                  {value}
                </p>
                <p className="text-xs text-muted mt-1">{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tickets…"
              className="w-full h-10 pl-9 pr-9 bg-card border border-border rounded-btn text-sm text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Date filter */}
          <div className="flex items-center gap-2">
            {DATE_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setDateFilter(f.value)}
                className={`h-10 px-3 rounded-btn text-xs font-semibold transition-colors border ${
                  dateFilter === f.value
                    ? 'bg-accent text-white border-accent'
                    : 'bg-card text-secondary border-border hover:text-primary hover:border-accent/40'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Status pills */}
        <div className="flex items-center gap-2 flex-wrap mb-6">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`h-8 px-3 rounded-full text-xs font-semibold transition-colors ${
                statusFilter === f.value
                  ? 'bg-accent text-white'
                  : 'bg-card border border-border text-secondary hover:text-primary'
              }`}
            >
              {f.label}
            </button>
          ))}
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
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        ) : (
          <EmptyState filtered={Boolean(statusFilter || search)} />
        )}
      </main>

      <Footer />
    </div>
  );
}