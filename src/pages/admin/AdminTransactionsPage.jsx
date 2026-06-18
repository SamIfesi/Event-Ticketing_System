import { useEffect, useState } from 'react';
import {
  TrendingUp,
  Wallet,
  BarChart3,
  ArrowDownLeft,
  Banknote,
  ShieldCheck,
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
import RevenueChart from '../../components/dashboard/RevenueChart';

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

const TYPE_FILTERS = [
  { value: '',                  label: 'All' },
  { value: 'payment_confirmed', label: 'Confirmed' },
  { value: 'payment_failed',    label: 'Failed' },
  { value: 'refund_processed',  label: 'Refunded' },
  { value: 'payout_sent',       label: 'Payout Sent' },
];

function TypeBadge({ type }) {
  const label   = TYPE_LABELS[type]   ?? type;
  const variant = TYPE_VARIANTS[type] ?? 'neutral';
  return <Badge variant={variant} size="sm">{label}</Badge>;
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse border-t border-border">
      {[80, 140, 120, 120, 80, 90, 80].map((w, i) => (
        <td key={i} className="px-4 py-3.5">
          <div className="h-3 bg-border rounded" style={{ width: w }} />
        </td>
      ))}
    </tr>
  );
}

// ── Summary Tab ───────────────────────────────────────────────
function SummaryTab({ summary, summaryLoading, fromDate, toDate, setFromDate, setToDate, fetchSummary }) {
  useEffect(() => {
    fetchSummary();
  }, [fromDate, toDate]);

  const chartData = (summary?.daily ?? []).map((d) => ({
    label: formatShortDate(d.date),
    value: parseFloat(d.revenue ?? 0),
  }));

  return (
    <div className="flex flex-col gap-8">
      {/* Date range */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-muted uppercase tracking-wider">From</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="h-10 px-3 bg-card border border-border rounded-btn text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-muted uppercase tracking-wider">To</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="h-10 px-3 bg-card border border-border rounded-btn text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
          />
        </div>
        {(fromDate || toDate) && (
          <div className="flex flex-col gap-1">
            <label className="text-xs opacity-0">clear</label>
            <button
              onClick={() => { setFromDate(''); setToDate(''); }}
              className="h-10 px-3 rounded-btn text-xs font-semibold text-error border border-error/20 hover:bg-error/10 transition-colors flex items-center gap-1.5"
            >
              <X size={12} /> Clear dates
            </button>
          </div>
        )}
      </div>

      {/* KPI stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          icon={TrendingUp}
          label="Gross Revenue"
          value={summary ? formatCurrency(summary.totals?.gross_revenue ?? 0) : '—'}
          sub="total ticket sales"
          accent="#2563eb"
          loading={summaryLoading}
        />
        <StatCard
          icon={BarChart3}
          label="Platform Earnings"
          value={summary ? formatCurrency(summary.totals?.platform_earnings ?? 0) : '—'}
          sub="platform cut"
          accent="#10b981"
          loading={summaryLoading}
        />
        <StatCard
          icon={Wallet}
          label="Organizer Revenue"
          value={summary ? formatCurrency(summary.totals?.organizer_revenue ?? 0) : '—'}
          sub="paid to organizers"
          accent="#8b5cf6"
          loading={summaryLoading}
        />
        <StatCard
          icon={ArrowDownLeft}
          label="Total Refunded"
          value={summary ? formatCurrency(summary.totals?.total_refunded ?? 0) : '—'}
          sub="returned to attendees"
          accent="#ef4444"
          loading={summaryLoading}
        />
        <StatCard
          icon={Banknote}
          label="Payouts Sent"
          value={summary ? formatCurrency(summary.totals?.total_paid_out ?? 0) : '—'}
          sub="transferred to banks"
          accent="#f59e0b"
          loading={summaryLoading}
        />
        <StatCard
          icon={TrendingUp}
          label="Successful Payments"
          value={summary ? (summary.totals?.successful_payments ?? 0).toLocaleString() : '—'}
          sub={`${summary?.totals?.failed_payments ?? 0} failed`}
          accent="#06b6d4"
          loading={summaryLoading}
        />
      </div>

      {/* Daily revenue chart */}
      <RevenueChart
        data={chartData}
        title="Daily Revenue"
        subtitle={fromDate && toDate ? `${formatShortDate(fromDate)} – ${formatShortDate(toDate)}` : 'Current month'}
        valuePrefix="₦"
        loading={summaryLoading}
      />
    </div>
  );
}

// ── All Transactions Tab ──────────────────────────────────────
function AllTransactionsTab({
  transactions,
  transactionsLoading,
  transactionsPagination,
  fromDate, toDate, typeFilter,
  setFromDate, setToDate, setTypeFilter, setPage, page,
  fetchAdminTransactions,
}) {

  useEffect(() => {
    fetchAdminTransactions();
  }, [page, fromDate, toDate, typeFilter]);

  const hasFilters = fromDate || toDate || typeFilter;

  return (
    <div className="flex flex-col gap-6">
      {/* Filters row */}
      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        {/* Date range */}
        <div className="flex items-end gap-2">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-muted uppercase tracking-wider">From</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="h-10 px-3 bg-card border border-border rounded-btn text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-muted uppercase tracking-wider">To</label>
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
              onClick={() => { setFromDate(''); setToDate(''); setTypeFilter(''); }}
              className="h-10 px-3 rounded-btn text-xs font-semibold text-error border border-error/20 hover:bg-error/10 transition-colors flex items-center gap-1.5"
            >
              <X size={12} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-200">
            <thead>
              <tr className="bg-main-bg">
                {['Date', 'Event', 'Attendee', 'Organizer', 'Amount', 'Platform Fee', 'Type'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-muted uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactionsLoading ? (
                Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
              ) : transactions.length > 0 ? (
                transactions.map((t) => (
                  <tr key={t.id} className="border-t border-border hover:bg-main-bg transition-colors duration-150">
                    <td className="px-4 py-3.5">
                      <p className="text-xs font-semibold text-primary">{formatShortDate(t.created_at)}</p>
                      <p className="text-[11px] text-muted">{formatTime(t.created_at)}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-sm font-semibold text-primary truncate max-w-35">
                        {t.event_title ?? '—'}
                      </p>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-xs font-semibold text-primary truncate max-w-27.5">
                        {t.attendee_name ?? '—'}
                      </p>
                      <p className="text-[11px] text-muted truncate max-w-27.5">{t.attendee_email}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-xs font-semibold text-primary truncate max-w-27.5">
                        {t.organizer_name ?? '—'}
                      </p>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-sm font-bold ${t.amount < 0 ? 'text-error' : 'text-primary'}`}>
                        {t.amount < 0 ? '-' : ''}{formatCurrency(Math.abs(t.amount))}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs text-secondary">
                        {t.platform_fee != null ? formatCurrency(t.platform_fee) : '—'}
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
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-card bg-accent-text border border-accent-border flex items-center justify-center">
                        <BarChart3 size={20} strokeWidth={1.5} className="text-accent" />
                      </div>
                      <p className="text-sm font-semibold text-primary">No transactions found</p>
                      <p className="text-xs text-muted">Try adjusting your filters.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {transactionsPagination?.total_pages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={transactionsPagination.total_pages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────
export default function AdminTransactionsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab]     = useState('summary');

  const {
    adminTransactions,
    adminTransactionsPagination,
    adminTransactionsLoading,
    fetchAdminTransactions,
    summary,
    summaryLoading,
    fetchSummary,
    page,
    fromDate,
    toDate,
    typeFilter,
    setPage,
    setFromDate,
    setToDate,
    setTypeFilter,
    // clearFilters,
  } = useTransactions();

  return (
    <div className="flex flex-col min-h-screen bg-main-bg">
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck size={14} className="text-accent" />
            <span className="text-xs font-bold text-accent uppercase tracking-widest">Admin</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-primary tracking-tight">
            Transactions
          </h1>
          <p className="text-sm text-secondary mt-1">
            Platform-wide financial audit log and revenue summary.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 bg-main-bg border border-border rounded-card mb-8 w-fit">
          {[
            { value: 'summary',  label: 'Summary' },
            { value: 'all',      label: 'All Transactions' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-5 py-2 rounded-btn text-sm font-semibold transition-colors duration-150 ${
                activeTab === tab.value
                  ? 'bg-card text-primary shadow-sm'
                  : 'text-muted hover:text-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'summary' ? (
          <SummaryTab
            summary={summary}
            summaryLoading={summaryLoading}
            fromDate={fromDate}
            toDate={toDate}
            setFromDate={setFromDate}
            setToDate={setToDate}
            fetchSummary={fetchSummary}
          />
        ) : (
          <AllTransactionsTab
            transactions={adminTransactions}
            transactionsLoading={adminTransactionsLoading}
            transactionsPagination={adminTransactionsPagination}
            fromDate={fromDate}
            toDate={toDate}
            typeFilter={typeFilter}
            page={page}
            setFromDate={setFromDate}
            setToDate={setToDate}
            setTypeFilter={setTypeFilter}
            setPage={setPage}
            fetchAdminTransactions={fetchAdminTransactions}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}