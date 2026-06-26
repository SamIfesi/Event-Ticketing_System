import { useEffect, useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Wallet,
  ArrowDownLeft,
  Banknote,
  X,
} from 'lucide-react';
import { useTransactions } from '../../hooks/useTransactions';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatShortDate, formatTime } from '../../utils/formatDate';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Footer from '../../components/layout/Footer';
import Badge from '../../components/ui/Badge';
import Pagination from '../../components/ui/Pagination';
import StatCard from '../../components/dashboard/StatCard';

const TYPE_LABELS = {
  payment_initiated: 'Initiated',
  payment_confirmed: 'Confirmed',
  payment_failed: 'Failed',
  refund_processed: 'Refunded',
  payout_sent: 'Payout Sent',
  payout_failed: 'Payout Failed',
  force_payment: 'Force Paid',
};

const TYPE_VARIANTS = {
  payment_confirmed: 'success',
  payment_failed: 'error',
  refund_processed: 'neutral',
  payout_sent: 'info',
  force_payment: 'info',
  payment_initiated: 'warning',
};

const TYPE_FILTERS = [
  { value: '', label: 'All' },
  { value: 'payment_confirmed', label: 'Confirmed' },
  { value: 'refund_processed', label: 'Refunded' },
  { value: 'payout_sent', label: 'Payout' },
];

function TypeBadge({ type }) {
  const label = TYPE_LABELS[type] ?? type;
  const variant = TYPE_VARIANTS[type] ?? 'neutral';
  return (
    <Badge variant={variant} size="sm">
      {label}
    </Badge>
  );
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse border-t border-border">
      {[80, 160, 120, 80, 30, 90, 80, 80].map((w, i) => (
        <td key={i} className="px-4 py-3.5">
          <div className="h-3 bg-border rounded" style={{ width: w }} />
        </td>
      ))}
    </tr>
  );
}

export default function OrganizerTransactionsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
    organizerTransactions,
    organizerTransactionsPagination,
    organizerTransactionsLoading,
    organizerSummary,
    fetchOrganizerTransactions,
    page,
    fromDate,
    toDate,
    typeFilter,
    setPage,
    setFromDate,
    setToDate,
    setTypeFilter,
    clearFilters,
  } = useTransactions();

  useEffect(() => {
    fetchOrganizerTransactions();
  }, [page, fromDate, toDate, typeFilter, fetchOrganizerTransactions]);

  const hasFilters = fromDate || toDate || typeFilter;

  return (
    <div className="flex flex-col min-h-screen bg-main-bg">
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-primary tracking-tight">
            Revenue Ledger
          </h1>
          <p className="text-sm text-secondary mt-1">
            A detailed breakdown of all earnings, refunds, and payouts for your
            events.
          </p>
        </div>

        {/* Date range + type filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Date range */}
          <div className="flex items-center gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-muted uppercase tracking-wider">
                From
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="h-10 px-3 bg-card border border-border rounded-btn text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-muted uppercase tracking-wider">
                To
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="h-10 px-3 bg-card border border-border rounded-btn text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
              />
            </div>
          </div>

          {/* Type filter pills */}
          <div className="flex items-end gap-2 flex-wrap">
            {TYPE_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setTypeFilter(f.value)}
                className={`h-10 px-3 rounded-btn text-xs font-semibold border transition-colors ${
                  typeFilter === f.value
                    ? 'bg-accent text-white border-accent'
                    : 'bg-card text-secondary border-border hover:text-primary hover:border-accent/40'
                }`}
              >
                {f.label}
              </button>
            ))}
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="h-10 px-3 rounded-btn text-xs font-semibold text-error border border-error/20 hover:bg-error/10 transition-colors flex items-center gap-1.5"
              >
                <X size={12} /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Summary stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={TrendingUp}
            label="Gross Revenue"
            value={
              organizerSummary
                ? formatCurrency(organizerSummary.gross_revenue ?? 0)
                : '—'
            }
            sub="total from ticket sales"
            accent="#2563eb"
            loading={organizerTransactionsLoading && !organizerSummary}
          />
          <StatCard
            icon={Wallet}
            label="Your Revenue"
            value={
              organizerSummary
                ? formatCurrency(organizerSummary.organizer_revenue ?? 0)
                : '—'
            }
            sub="after platform fees"
            accent="#10b981"
            loading={organizerTransactionsLoading && !organizerSummary}
          />
          <StatCard
            icon={BarChart3}
            label="Platform Fees"
            value={
              organizerSummary
                ? formatCurrency(organizerSummary.platform_fees ?? 0)
                : '—'
            }
            sub="deducted from gross"
            accent="#f59e0b"
            loading={organizerTransactionsLoading && !organizerSummary}
          />
          <StatCard
            icon={ArrowDownLeft}
            label="Total Refunded"
            value={
              organizerSummary
                ? formatCurrency(organizerSummary.total_refunded ?? 0)
                : '—'
            }
            sub="returned to attendees"
            accent="#ef4444"
            loading={organizerTransactionsLoading && !organizerSummary}
          />
        </div>

        {/* Transactions table */}
        <div className="bg-card border border-border rounded-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-max">
              <thead>
                <tr className="bg-main-bg">
                  {[
                    'Date',
                    'Event',
                    'Attendee',
                    'Ticket Type',
                    'Qty',
                    'Amount',
                    'Your Cut',
                    'Type',
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-bold text-muted uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {organizerTransactionsLoading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <SkeletonRow key={i} />
                  ))
                ) : organizerTransactions.length > 0 ? (
                  organizerTransactions.map((t) => (
                    <tr
                      key={t.id}
                      className="border-t border-border hover:bg-main-bg transition-colors duration-150"
                    >
                      <td className="px-4 py-3.5">
                        <p className="text-xs font-semibold text-primary">
                          {formatShortDate(t.created_at)}
                        </p>
                        <p className="text-[11px] text-muted">
                          {formatTime(t.created_at)}
                        </p>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-sm font-semibold text-primary truncate max-w-40">
                          {t.event_title ?? '—'}
                        </p>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-xs font-semibold text-primary truncate max-w-30">
                          {t.attendee_name ?? '—'}
                        </p>
                        <p className="text-[11px] text-muted truncate max-w-30">
                          {t.attendee_email}
                        </p>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-xs text-secondary">
                          {t.ticket_type_name ?? '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-xs font-semibold text-primary">
                          {t.quantity ?? 1}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`text-sm font-bold ${t.amount < 0 ? 'text-error' : 'text-primary'}`}
                        >
                          {t.amount < 0 ? '-' : ''}
                          {formatCurrency(Math.abs(t.amount))}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-sm font-semibold text-success">
                          {t.organizer_amount != null
                            ? formatCurrency(t.organizer_amount)
                            : '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <TypeBadge type={t.type} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-4 py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-card bg-accent-text border border-accent-border flex items-center justify-center">
                          <Banknote
                            size={20}
                            strokeWidth={1.5}
                            className="text-accent"
                          />
                        </div>
                        <p className="text-sm font-semibold text-primary">
                          No transactions found
                        </p>
                        <p className="text-xs text-muted">
                          {hasFilters
                            ? 'Try adjusting your filters.'
                            : 'Transactions will appear here once attendees book your events.'}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {organizerTransactionsPagination?.total_pages > 1 && (
          <div className="mt-8">
            <Pagination
              currentPage={page}
              totalPages={organizerTransactionsPagination.total_pages}
              onPageChange={setPage}
            />
          </div>
        )}
      </main>

      <Footer variant="minimal" />
    </div>
  );
}
