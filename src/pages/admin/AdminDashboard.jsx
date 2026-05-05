import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  CalendarDays,
  Ticket,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  Mic2,
  UserCheck,
  Clock,
  BarChart3,
} from 'lucide-react';
import { useAdmin } from '../../hooks/useAdmin';
// import { useAuthStore } from '../../store/authStore';
import { formatCurrency } from '../../utils/formatCurrency';
// import { formatShortDate } from '../../utils/formatDate';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Footer from '../../components/layout/Footer';
import StatCard from '../../components/dashboard/StatCard';
import RevenueChart from '../../components/dashboard/RevenueChart';
import UserTable from '../../components/dashboard/UserTable';
import EventTable from '../../components/dashboard/EventTable';

// ── Mini section header ───────────────────────────────────────
function SectionHeader({ title, linkTo, linkLabel }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-base font-bold text-primary">{title}</h2>
      {linkTo && (
        <Link
          to={linkTo}
          className="flex items-center gap-1 text-xs font-semibold text-accent hover:text-accent-hover transition-colors"
        >
          {linkLabel ?? 'View all'} <ArrowRight size={13} strokeWidth={2.5} />
        </Link>
      )}
    </div>
  );
}

// ── Activity item ─────────────────────────────────────────────
function ActivityItem({ item }) {
  const date = new Date(item.date);
  const day = date.toLocaleDateString('en-NG', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

  return (
    <div className="flex items-center gap-4 py-3 border-b border-border last:border-0">
      <div className="w-9 h-9 rounded-btn bg-accent-text flex items-center justify-center shrink-0">
        <BarChart3 size={15} className="text-accent" strokeWidth={1.75} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-primary">{day}</p>
        <p className="text-xs text-muted mt-0.5">
          {item.bookings} booking{item.bookings !== 1 ? 's' : ''}
        </p>
      </div>
      <span className="text-sm font-black text-primary shrink-0">
        {formatCurrency(item.revenue ?? 0)}
      </span>
    </div>
  );
}

// ── Skeleton ───────────────────────────────────────────────────
function SkeletonBlock({ className = '' }) {
  return <div className={`bg-border rounded animate-pulse ${className}`} />;
}

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // const user = useAuthStore((s) => s.user);

  const {
    stats,
    statsLoading,
    fetchStats,
    users,
    usersLoading,
    fetchUsers,
    mutating,
    updateUserRole,
    updateUserStatus,
    adminEvents,
    adminEventsLoading,
    fetchAdminEvents,
    updateEventStatus,
  } = useAdmin();

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchAdminEvents();
  }, []);

  // Build chart data from recent_activity
  const chartData = (stats?.recent_activity ?? []).map((item) => ({
    label: new Date(item.date).toLocaleDateString('en-NG', {
      weekday: 'short',
    }),
    value: parseFloat(item.revenue ?? 0),
  }));

  const bookingChartData = (stats?.recent_activity ?? []).map((item) => ({
    label: new Date(item.date).toLocaleDateString('en-NG', {
      weekday: 'short',
    }),
    value: parseInt(item.bookings ?? 0),
  }));

  const s = stats ?? {};

  return (
    <div className="flex flex-col min-h-screen bg-main-bg">
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck size={14} className="text-accent" />
            <span className="text-xs font-bold text-accent uppercase tracking-widest">
              Admin Dashboard
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-primary tracking-tight">
            Platform Overview
          </h1>
          <p className="text-sm text-secondary mt-1">
            Manage users, events, and platform health.
          </p>
        </div>

        {/* ── Stat cards ──────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={Users}
            label="Total Users"
            value={
              statsLoading ? '—' : (s.users?.total_users ?? 0).toLocaleString()
            }
            sub={`${s.users?.new_this_month ?? 0} new this month`}
            accent="#2563eb"
            loading={statsLoading}
          />
          <StatCard
            icon={CalendarDays}
            label="Total Events"
            value={
              statsLoading
                ? '—'
                : (s.events?.total_events ?? 0).toLocaleString()
            }
            sub={`${s.events?.published ?? 0} published`}
            accent="#10b981"
            loading={statsLoading}
          />
          <StatCard
            icon={Ticket}
            label="Tickets Sold"
            value={
              statsLoading
                ? '—'
                : (s.tickets?.total_tickets ?? 0).toLocaleString()
            }
            sub={`${s.tickets?.checked_in ?? 0} checked in`}
            accent="#f59e0b"
            loading={statsLoading}
          />
          <StatCard
            icon={TrendingUp}
            label="Total Revenue"
            value={
              statsLoading
                ? '—'
                : formatCurrency(s.bookings?.total_revenue ?? 0)
            }
            sub={`${s.bookings?.paid_bookings ?? 0} paid bookings`}
            accent="#8b5cf6"
            loading={statsLoading}
          />
        </div>

        {/* ── Role breakdown + activity ────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Role breakdown */}
          <div className="bg-card border border-border rounded-card p-5">
            <h3 className="text-sm font-bold text-primary mb-4">
              Users by Role
            </h3>

            {statsLoading ? (
              <div className="flex flex-col gap-3">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="animate-pulse flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-btn bg-border" />
                    <div className="flex-1">
                      <div className="h-3 bg-border rounded w-20 mb-1" />
                      <div className="h-2 bg-border rounded w-12" />
                    </div>
                    <div className="h-5 bg-border rounded w-10" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-0 divide-y divide-border">
                {[
                  {
                    label: 'Attendees',
                    count: s.users?.attendees ?? 0,
                    icon: UserCheck,
                    color: '#2563eb',
                  },
                  {
                    label: 'Organizers',
                    count: s.users?.organizers ?? 0,
                    icon: Mic2,
                    color: '#10b981',
                  },
                  {
                    label: 'Admins',
                    count: s.users?.admins ?? 0,
                    icon: ShieldCheck,
                    color: '#ef4444',
                  },
                ].map(({ label, count, icon: Icon, color }) => (
                  <div key={label} className="flex items-center gap-3 py-3">
                    <div
                      className="w-8 h-8 rounded-btn flex items-center justify-center shrink-0"
                      style={{ background: `${color}15` }}
                    >
                      <Icon size={14} strokeWidth={1.75} style={{ color }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-primary">
                        {label}
                      </p>
                    </div>
                    <span className="text-sm font-black text-primary">
                      {count.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-border">
              <Link
                to="/admin/users"
                className="flex items-center justify-center gap-1.5 h-9 rounded-btn bg-accent-text text-accent text-xs font-semibold hover:bg-accent hover:text-white transition-colors duration-150"
              >
                Manage All Users <ArrowRight size={12} strokeWidth={2.5} />
              </Link>
            </div>
          </div>

          {/* Event breakdown */}
          <div className="bg-card border border-border rounded-card p-5">
            <h3 className="text-sm font-bold text-primary mb-4">
              Events Breakdown
            </h3>

            {statsLoading ? (
              <div className="flex flex-col gap-3">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="animate-pulse flex items-center justify-between py-2"
                  >
                    <div className="h-3 bg-border rounded w-24" />
                    <div className="h-5 bg-border rounded w-10" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-border">
                {[
                  {
                    label: 'Published',
                    count: s.events?.published ?? 0,
                    color: '#22c55e',
                  },
                  {
                    label: 'Upcoming',
                    count: s.events?.upcoming ?? 0,
                    color: '#2563eb',
                  },
                  {
                    label: 'Draft',
                    count: s.events?.drafts ?? 0,
                    color: '#f59e0b',
                  },
                  {
                    label: 'Cancelled',
                    count: s.events?.cancelled ?? 0,
                    color: '#ef4444',
                  },
                ].map(({ label, count, color }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between py-3"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ background: color }}
                      />
                      <span className="text-sm text-secondary">{label}</span>
                    </div>
                    <span className="text-sm font-bold text-primary">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-border">
              <Link
                to="/admin/events"
                className="flex items-center justify-center gap-1.5 h-9 rounded-btn bg-accent-text text-accent text-xs font-semibold hover:bg-accent hover:text-white transition-colors duration-150"
              >
                Manage All Events <ArrowRight size={12} strokeWidth={2.5} />
              </Link>
            </div>
          </div>

          {/* Recent 7-day activity */}
          <div className="bg-card border border-border rounded-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Clock size={14} className="text-muted" />
              <h3 className="text-sm font-bold text-primary">Last 7 Days</h3>
            </div>

            {statsLoading ? (
              <div className="flex flex-col gap-1">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="animate-pulse flex items-center gap-3 py-3 border-b border-border"
                  >
                    <div className="w-9 h-9 rounded-btn bg-border shrink-0" />
                    <div className="flex-1">
                      <div className="h-3 bg-border rounded w-24 mb-1" />
                      <div className="h-2 bg-border rounded w-16" />
                    </div>
                    <div className="h-4 bg-border rounded w-16" />
                  </div>
                ))}
              </div>
            ) : (stats?.recent_activity ?? []).length > 0 ? (
              <div>
                {[...(stats.recent_activity ?? [])]
                  .reverse()
                  .slice(0, 5)
                  .map((item, i) => (
                    <ActivityItem key={i} item={item} index={i} />
                  ))}
              </div>
            ) : (
              <div className="flex items-center justify-center py-8">
                <p className="text-sm text-muted">No activity data yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Revenue chart ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <RevenueChart
            data={chartData}
            title="Revenue (Last 7 Days)"
            subtitle="Daily booking revenue"
            valuePrefix="₦"
            loading={statsLoading}
          />
          <RevenueChart
            data={bookingChartData}
            title="Bookings (Last 7 Days)"
            subtitle="Daily booking count"
            valuePrefix="#"
            accent="#10b981"
            loading={statsLoading}
          />
        </div>

        {/* ── Recent users ──────────────────────────────────────── */}
        <div className="mb-8">
          <SectionHeader
            title="Recent Users"
            linkTo="/admin/users"
            linkLabel="View all users"
          />
          <UserTable
            users={(users ?? []).slice(0, 5)}
            loading={usersLoading}
            onRoleChange={updateUserRole}
            onStatusChange={updateUserStatus}
            mutating={mutating}
          />
        </div>

        {/* ── Recent events ─────────────────────────────────────── */}
        <div>
          <SectionHeader
            title="Recent Events"
            linkTo="/admin/events"
            linkLabel="View all events"
          />
          <EventTable
            events={(adminEvents ?? []).slice(0, 5)}
            loading={adminEventsLoading}
            onStatusChange={updateEventStatus}
            showActions="admin"
            mutating={mutating}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
