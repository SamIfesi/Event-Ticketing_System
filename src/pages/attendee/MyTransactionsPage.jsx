import { useEffect, useState } from 'react';
import { CreditCard, Search, X } from 'lucide-react';
import { useTransactions } from '../../hooks/useTransactions';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatShortDate, formatTime } from '../../utils/formatDate';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Footer from '../../components/layout/Footer';
import Badge from '../../components/ui/Badge';
import Pagination from '../../components/ui/Pagination';

const TYPE_LABELS = {
  payment_initiated: 'Initiated',
  payment_confirmed: 'Confirmed',
  payment_failed:    'Failed',
  refund_processed:  'Refunded',
  payout_sent:       'Payout Sent',
  payout_failed:     'Payout Failed',
  force_payment:     'Force Paid',
};

const TYPE_VARIANTS = {
  payment_confirmed: 'success',
  payment_failed:    'error',
  refund_processed:  'neutral',
  payout_sent:       'info',
  force_payment:     'info',
  payment_initiated: 'warning',
};

function TypeBadge({ type }) {
  const label   = TYPE_LABELS[type]   ?? type;
  const variant = TYPE_VARIANTS[type] ?? 'neutral';
  return <Badge variant={variant} size="sm">{label}</Badge>;
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse border-t border-border">
      <td className="px-4 py-3.5"><div className="h-3 bg-border rounded w-24" /></td>
      <td className="px-4 py-3.5"><div className="h-3 bg-border rounded w-32" /></td>
      <td className="px-4 py-3.5"><div className="h-3 bg-border rounded w-28" /></td>
      <td className="px-4 py-3.5"><div className="h-3 bg-border rounded w-20" /></td>
      <td className="px-4 py-3.5"><div className="h-3 bg-border rounded w-8" /></td>
      <td className="px-4 py-3.5"><div className="h-3 bg-border rounded w-16" /></td>
      <td className="px-4 py-3.5"><div className="h-5 bg-border rounded w-20" /></td>
    </tr>
  );
}

export default function MyTransactionsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState('');

  const {
    myTransactions,
    myTransactionsPagination,
    myTransactionsLoading,
    fetchMyTransactions,
    page,
    setPage,
  } = useTransactions();

  useEffect(() => {
    fetchMyTransactions();
  }, [page, fetchMyTransactions]);

  const filtered = search
    ? myTransactions.filter(
        (t) =>
          (t.event_title ?? '').toLowerCase().includes(search.toLowerCase()) ||
          (t.ticket_type_name ?? '')
            .toLowerCase()
            .includes(search.toLowerCase())
      )
    : myTransactions;

  return (
    <div className="flex flex-col min-h-screen bg-main-bg">
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-primary tracking-tight">
            Payment History
          </h1>
          <p className="text-sm text-secondary mt-1">
            A record of all your ticket purchases and refunds.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-sm">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by event or ticket type…"
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

        {/* Table */}
        <div className="bg-card border border-border rounded-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-max">
              <thead>
                <tr className="bg-main-bg">
                  {[
                    'Date',
                    'Event',
                    'Reference',
                    'Ticket Type',
                    'Qty',
                    'Amount',
                    'Status',
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
                {myTransactionsLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonRow key={i} />
                  ))
                ) : filtered.length > 0 ? (
                  filtered.map((t) => (
                    <tr
                      key={t.id}
                      className="border-t border-border hover:bg-main-bg transition-colors duration-150"
                    >
                      <td className="px-4 py-3.5">
                        <p className="text-xs font-semibold text-primary">
                          {formatShortDate(t.created_at)}
                        </p>
                        <p className="text-[11px] text-muted mt-0.5">
                          {formatTime(t.created_at)}
                        </p>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-sm font-semibold text-primary truncate max-w-45">
                          {t.event_title ?? '—'}
                        </p>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-sm font-semibold text-primary truncate max-w-45">
                          {t.paystack_reference ?? '—'}
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
                        <TypeBadge type={t.type} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-16 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-14 h-14 rounded-card bg-accent-text border border-accent-border flex items-center justify-center">
                          <CreditCard
                            size={24}
                            strokeWidth={1.5}
                            className="text-accent"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-primary">
                            No payment history yet
                          </p>
                          <p className="text-sm text-secondary mt-1">
                            {search
                              ? 'No results match your search.'
                              : 'Book a ticket to get started.'}
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {myTransactionsPagination?.total_pages > 1 && (
          <div className="mt-8">
            <Pagination
              currentPage={page}
              totalPages={myTransactionsPagination.total_pages}
              onPageChange={setPage}
            />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}