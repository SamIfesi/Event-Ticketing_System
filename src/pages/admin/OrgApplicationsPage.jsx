import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ShieldCheck,
  Mic2,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  User,
  Phone,
  CalendarDays,
  FileText,
} from 'lucide-react';
import { useOrganizerApplication } from '../../hooks/useOrgApplication';
import { formatShortDate } from '../../utils/formatDate';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Footer from '../../components/layout/Footer';
import Pagination from '../../components/ui/Pagination';
import { ConfirmModal } from '../../components/ui/Modal';
import Button from '../../components/ui/Button';

// ── Status filter tabs ────────────────────────────────────────
const STATUS_TABS = [
  { value: 'pending',  label: 'Pending',  icon: Clock,         color: '#f59e0b' },
  { value: 'approved', label: 'Approved', icon: CheckCircle2,  color: '#22c55e' },
  { value: 'rejected', label: 'Rejected', icon: XCircle,       color: '#ef4444' },
];

// ── Skeleton card ─────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-card border border-border rounded-card p-5 animate-pulse flex flex-col gap-4">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-border shrink-0" />
        <div className="flex-1 flex flex-col gap-2">
          <div className="h-4 bg-border rounded w-36" />
          <div className="h-3 bg-border rounded w-48" />
          <div className="h-3 bg-border rounded w-28" />
        </div>
        <div className="h-5 bg-border rounded w-16 shrink-0" />
      </div>
      <div className="h-3 bg-border rounded w-full" />
      <div className="flex gap-2 pt-2 border-t border-border">
        <div className="flex-1 h-9 bg-border rounded-btn" />
        <div className="flex-1 h-9 bg-border rounded-btn" />
      </div>
    </div>
  );
}

// ── Application card ──────────────────────────────────────────
function ApplicationCard({ application, onApprove, onReject, mutating }) {
  const [approveConfirm, setApproveConfirm] = useState(false);
  const [rejectConfirm,  setRejectConfirm]  = useState(false);
  const [expanded,       setExpanded]        = useState(false);

  const isPending  = application.status === 'pending';
  const isApproved = application.status === 'approved';
  const isRejected = application.status === 'rejected';

  const statusConfig = {
    pending:  { color: '#f59e0b', bg: '#f59e0b15', label: 'Pending',  Icon: Clock        },
    approved: { color: '#22c55e', bg: '#22c55e15', label: 'Approved', Icon: CheckCircle2 },
    rejected: { color: '#ef4444', bg: '#ef444415', label: 'Rejected', Icon: XCircle      },
  }[application.status] ?? { color: '#94a3b8', bg: '#94a3b815', label: application.status, Icon: Clock };

  return (
    <>
      <div className="bg-card border border-border rounded-card overflow-hidden hover:shadow-md transition-shadow duration-200">
        {/* Top color strip */}
        <div className="h-1 w-full" style={{ background: statusConfig.color }} />

        <div className="p-5">
          {/* Header row */}
          <div className="flex items-start gap-4 mb-4">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-accent-text flex items-center justify-center shrink-0">
              <span className="text-sm font-bold text-accent">
                {(application.user_name ?? 'U')?.charAt(0)?.toUpperCase()}
              </span>
            </div>

            {/* User info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-primary truncate">{application.user_name ?? '—'}</p>
              <p className="text-xs text-muted truncate">{application.user_email ?? '—'}</p>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="text-xs text-secondary flex items-center gap-1">
                  <Mic2 size={11} className="text-muted" />
                  {application.org_name}
                </span>
                <span className="text-xs text-muted">·</span>
                <span className="text-xs text-secondary">{application.event_type}</span>
              </div>
            </div>

            {/* Status badge */}
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold shrink-0"
              style={{ background: statusConfig.bg, color: statusConfig.color }}
            >
              <statusConfig.Icon size={11} strokeWidth={2.5} />
              {statusConfig.label}
            </span>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-start gap-2">
              <Phone size={12} className="text-muted shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] text-muted uppercase font-bold tracking-wide">Phone</p>
                <p className="text-xs font-semibold text-primary">{application.phone ?? '—'}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CalendarDays size={12} className="text-muted shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] text-muted uppercase font-bold tracking-wide">Applied</p>
                <p className="text-xs font-semibold text-primary">
                  {application.created_at ? formatShortDate(application.created_at) : '—'}
                </p>
              </div>
            </div>
          </div>

          {/* Reason (expandable) */}
          {application.reason && (
            <div className="mb-4">
              <button
                onClick={() => setExpanded((v) => !v)}
                className="flex items-center gap-1.5 text-xs font-semibold text-accent hover:text-accent-hover transition-colors"
              >
                <FileText size={12} strokeWidth={2} />
                {expanded ? 'Hide reason' : 'View reason'}
              </button>
              {expanded && (
                <p className="mt-2 text-xs text-secondary leading-relaxed bg-main-bg border border-border rounded-btn p-3">
                  {application.reason}
                </p>
              )}
            </div>
          )}

          {/* Reviewed by */}
          {!isPending && application.reviewed_by_name && (
            <p className="text-[11px] text-muted mb-4">
              {isApproved ? 'Approved' : 'Rejected'} by{' '}
              <span className="font-semibold">{application.reviewed_by_name}</span>
              {application.reviewed_at && ` on ${formatShortDate(application.reviewed_at)}`}
            </p>
          )}

          {/* Action buttons — only for pending */}
          {isPending && (
            <div className="flex items-center gap-2 pt-3 border-t border-border">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setApproveConfirm(true)}
                disabled={mutating}
                className="flex-1"
              >
                <CheckCircle2 size={13} strokeWidth={2.5} className="mr-1" />
                Approve
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => setRejectConfirm(true)}
                disabled={mutating}
                className="flex-1"
              >
                <XCircle size={13} strokeWidth={2.5} className="mr-1" />
                Reject
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Confirm modals */}
      <ConfirmModal
        isOpen={approveConfirm}
        onClose={() => setApproveConfirm(false)}
        onConfirm={() => { onApprove(application.id); setApproveConfirm(false); }}
        loading={mutating}
        title={`Approve ${application.user_name}?`}
        description={`This will immediately upgrade ${application.user_name} to the Organizer role. They can start creating events right away.`}
        confirmLabel="Yes, approve"
      />
      <ConfirmModal
        isOpen={rejectConfirm}
        onClose={() => setRejectConfirm(false)}
        onConfirm={() => { onReject(application.id); setRejectConfirm(false); }}
        loading={mutating}
        title={`Reject ${application.user_name}'s application?`}
        description="They will not be upgraded to organizer. They can apply again later."
        confirmLabel="Yes, reject"
        danger
      />
    </>
  );
}

export default function OrgApplicationsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    applications,
    applicationsPagination,
    applicationsLoading,
    page,
    statusFilter,
    setPage,
    setStatusFilter,
    fetchApplications,
    mutating,
    approveApplication,
    rejectApplication,
  } = useOrganizerApplication();

  // Force the URL to have a status param so the hook auto-fetches
  useEffect(() => {
    if (!searchParams.has('status')) {
      setSearchParams({ status: 'pending', page: '1' }, { replace: true });
    } else {
      fetchApplications();
    }
  }, [searchParams.get('status'), searchParams.get('page')]);

  const total = applicationsPagination?.total ?? 0;
  const totalPages = applicationsPagination?.total_pages ?? 1;

  return (
    <div className="flex flex-col min-h-screen bg-main-bg">
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">
        {/* ── Header ───────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck size={14} className="text-accent" />
              <span className="text-xs font-bold text-accent uppercase tracking-widest">
                Admin
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-primary tracking-tight">
              Organizer Applications
            </h1>
            <p className="text-sm text-secondary mt-1">
              {applicationsLoading
                ? 'Loading…'
                : `${total} ${statusFilter} application${total !== 1 ? 's' : ''}`}
            </p>
          </div>
          <button
            onClick={fetchApplications}
            disabled={applicationsLoading}
            className="self-start sm:self-auto flex items-center gap-2 h-10 px-4 border border-border rounded-btn text-sm font-medium text-secondary hover:text-primary hover:border-accent/40 transition-colors disabled:opacity-50"
          >
            <RefreshCw
              size={14}
              className={applicationsLoading ? 'animate-spin' : ''}
            />
            Refresh
          </button>
        </div>

        {/* ── Status tabs ───────────────────────────────────── */}
        <div className="flex items-center gap-2 mb-8 flex-wrap">
          {STATUS_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = statusFilter === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setStatusFilter(tab.value)}
                className={`flex items-center gap-2 h-10 px-4 rounded-btn text-xs font-semibold border transition-colors ${
                  isActive
                    ? 'border-transparent text-white'
                    : 'bg-card text-secondary border-border hover:text-primary hover:border-accent/40'
                }`}
                style={
                  isActive
                    ? { background: tab.color, borderColor: tab.color }
                    : {}
                }
              >
                <Icon size={13} strokeWidth={2.5} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ── Application cards ─────────────────────────────── */}
        {applicationsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : applications.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
            {applications.map((app) => (
              <ApplicationCard
                key={app.id}
                application={app}
                onApprove={approveApplication}
                onReject={rejectApplication}
                mutating={mutating}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 gap-5 text-center">
            <div className="w-16 h-16 rounded-card bg-accent-text border border-accent-border flex items-center justify-center">
              <Mic2 size={28} strokeWidth={1.5} className="text-accent" />
            </div>
            <div>
              <p className="font-bold text-primary text-lg">
                No {statusFilter} applications
              </p>
              <p className="text-sm text-secondary mt-1 max-w-xs">
                {statusFilter === 'pending'
                  ? 'No applications are waiting for review right now.'
                  : `No applications have been ${statusFilter} yet.`}
              </p>
            </div>
          </div>
        )}

        {/* Pagination */}
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </main>
      <Footer />
    </div>
  );
}