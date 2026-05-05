import { useEffect, useState } from 'react';
import { Search, X, CalendarDays, RefreshCw, ShieldCheck } from 'lucide-react';
import { useAdmin } from '../../hooks/useAdmin';
import { EVENT_STATUS } from '../../config/constants';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Footer from '../../components/layout/Footer';
import EventTable from '../../components/dashboard/EventTable';
import Pagination from '../../components/ui/Pagination';

const STATUS_FILTERS = [
  { value: '', label: 'All' },
  { value: EVENT_STATUS.PUBLISHED, label: 'Published' },
  { value: EVENT_STATUS.DRAFT, label: 'Draft' },
  { value: EVENT_STATUS.CANCELLED, label: 'Cancelled' },
  { value: EVENT_STATUS.COMPLETED, label: 'Completed' },
];

export default function AdminEventsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
    adminEvents,
    adminEventsPagination,
    adminEventsLoading,
    eventsPage,
    eventsStatus,
    setEventsPage,
    setEventsStatusFilter,
    fetchAdminEvents,
    updateEventStatus,
    mutating,
  } = useAdmin();

  useEffect(() => {
    fetchAdminEvents();
  }, []);

  const total = adminEventsPagination?.total ?? 0;

  return (
    <div className="flex flex-col min-h-screen bg-main-bg">
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck size={14} className="text-accent" />
              <span className="text-xs font-bold text-accent uppercase tracking-widest">
                Admin
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-primary tracking-tight">
              All Events
            </h1>
            <p className="text-sm text-secondary mt-1">
              {adminEventsLoading
                ? 'Loading events…'
                : `${total.toLocaleString()} event${total !== 1 ? 's' : ''} on the platform`}
            </p>
          </div>
          <button
            onClick={fetchAdminEvents}
            disabled={adminEventsLoading}
            className="self-start sm:self-auto flex items-center gap-2 h-10 px-4 border border-border rounded-btn text-sm font-medium text-secondary hover:text-primary hover:border-accent/40 transition-colors duration-150 disabled:opacity-50"
          >
            <RefreshCw
              size={14}
              className={adminEventsLoading ? 'animate-spin' : ''}
            />
            Refresh
          </button>
        </div>

        {/* Status filter pills */}
        <div className="flex items-center gap-2 flex-wrap mb-6">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setEventsStatusFilter(f.value)}
              className={`h-9 px-4 rounded-btn text-xs font-semibold transition-colors border ${
                eventsStatus === f.value
                  ? 'bg-accent text-white border-accent'
                  : 'bg-card text-secondary border-border hover:text-primary hover:border-accent/40'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Table */}
        <EventTable
          events={adminEvents}
          loading={adminEventsLoading}
          onStatusChange={updateEventStatus}
          showActions="admin"
          mutating={mutating}
          className="mb-6"
        />

        {/* Pagination */}
        <Pagination
          currentPage={eventsPage}
          totalPages={adminEventsPagination?.total_pages ?? 1}
          onPageChange={setEventsPage}
        />
      </main>

      <Footer />
    </div>
  );
}
