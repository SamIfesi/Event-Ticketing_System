import { useEffect, useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Mic2,
  Phone,
  Calendar,
  ChevronDown,
  ShieldCheck,
  RefreshCw,
  FileText,
  Users,
  Eye,
  X,
} from 'lucide-react';
import { useOrganizerApplication } from '../../hooks/useOrgApplication';
import { formatShortDate } from '../../utils/formatDate';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Footer from '../../components/layout/Footer';
import Pagination from '../../components/ui/Pagination';
import { ConfirmModal } from '../../components/ui/Modal';

// ── Status config ─────────────────────────────────────────────
const STATUS_TABS = [
  { value: 'pending', label: 'Pending', icon: Clock, color: '#f59e0b' },
  { value: 'approved', label: 'Approved', icon: CheckCircle2, color: '#22c55e' },
  { value: 'rejected', label: 'Rejected', icon: XCircle, color: '#ef4444' },
];

// ── Application Detail Modal ──────────────────────────────────
function ApplicationDetailModal({ application, isOpen, onClose, onApprove, onReject, mutating }) {
  const [confirmAction, setConfirmAction] = useState(null); // 'approve' | 'reject'

  if (!application) return null;

  const isPending = application.status === 'pending';

  function handleAction(action) {
    setConfirmAction(action);
  }

  function handleConfirm() {
    if (confirmAction === 'approve') onApprove(application.id);
    else onReject(application.id);
    setConfirmAction(null);
    onClose();
  }

  return (
    <>
      {isOpen && (
        <>
          <div
            aria-hidden="true"
            onClick={onClose}
            className="fixed inset-0 z-[9990] bg-black/50 backdrop-blur-sm animate-[fadeIn_180ms_ease_forwards]"
          />
          <div className="fixed inset-0 z-[9991] flex items-center justify-center px-6 py-8 pointer-events-none">
            <div
              onClick={(e) => e.stopPropagation()}
              className="pointer-events-auto w-full max-w-lg bg-card border border-border rounded-card shadow-2xl flex flex-col animate-[modalIn_220ms_cubic-bezier(0.16,1,0.3,1)_forwards]"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4 px-5 pt-5 pb-4 border-b border-border">
                <div>
                  <h2 className="text-base font-bold text-primary">Application Review</h2>
                  <p className="text-xs text-muted mt-0.5">
                    Submitted {application.created_at ? formatShortDate(application.created_at) : '—'}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-9 h-9 flex items-center justify-center rounded-btn text-muted hover:text-primary hover:bg-border transition-colors"
                >
                  <X size={16} strokeWidth={2.5} />
                </button>
              </div>

              {/* Body */}
              <div className="px-5 py-5 flex flex-col gap-5 overflow-y-auto max-h-[60vh]">
                {/* Applicant */}
                <div className="flex items-center gap-3 p-4 bg-main-bg border border-border rounded-card">
                  <div className="w-11 h-11 rounded-full bg-accent-text border border-accent-border flex items-center justify-center shrink-0">
                    <span className="text-sm font-black text-accent">
                      {application.user_name?.charAt(0)?.toUpperCase() ?? '?'}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-primary truncate">
                      {application.user_name ?? '—'}
                    </p>
                    <p className="text-xs text-muted truncate">{application.user_email ?? '—'}</p>
                  </div>
                  <div className="ml-auto shrink-0">
                    <StatusPill status={application.status} />
                  </div>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-2 gap-3">
                  <DetailItem
                    icon={Mic2}
                    label="Organisation"
                    value={application.org_name}
                    color="#2563eb"
                  />
                  <DetailItem
                    icon={FileText}
                    label="Event Type"
                    value={application.event_type}
                    color="#8b5cf6"
                  />
                  <DetailItem
                    icon={Phone}
                    label="Phone"
                    value={application.phone}
                    color="#10b981"
                  />
                  <DetailItem
                    icon={Calendar}
                    label="Applied"
                    value={application.created_at ? formatShortDate(application.created_at) : '—'}
                    color="#f59e0b"
                  />
                </div>

                {/* Reason */}
                {application.reason && (
                  <div className="p-4 bg-main-bg border border-border rounded-card">
                    <p className="text-xs font-bold text-muted uppercase tracking-wider mb-2">
                      Message from applicant
                    </p>
                    <p className="text-sm text-secondary leading-relaxed">{application.reason}</p>
                  </div>
                )}
              </div>

              {/* Footer actions */}
              {isPending && (
                <div className="px-5 pb-5 pt-4 border-t border-border flex items-center gap-3">
                  <button
                    onClick={() => handleAction('reject')}
                    disabled={mutating}
                    className="flex-1 h-10 flex items-center justify-center gap-2 border border-error/30 text-error text-sm font-semibold rounded-btn hover:bg-error/10 transition-colors disabled:opacity-50"
                  >
                    <XCircle size={15} strokeWidth={2} />
                    Reject
                  </button>
                  <button
                    onClick={() => handleAction('approve')}
                    disabled={mutating}
                    className="flex-1 h-10 flex items-center justify-center gap-2 bg-success text-white text-sm font-semibold rounded-btn hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    <CheckCircle2 size={15} strokeWidth={2} />
                    Approve
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <ConfirmModal
        isOpen={Boolean(confirmAction)}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleConfirm}
        loading={mutating}
        title={
          confirmAction === 'approve'
            ? `Approve ${application.user_name}?`
            : `Reject ${application.user_name}?`
        }
        description={
          confirmAction === 'approve'
            ? 'This user will immediately gain Organizer access and can start creating events.'
            : 'The applicant will be notified that their application was not approved. They can reapply later.'
        }
        confirmLabel={confirmAction === 'approve' ? 'Yes, approve' : 'Yes, reject'}
        danger={confirmAction === 'reject'}
      />
    </>
  );
}

// ── Status pill ───────────────────────────────────────────────
function StatusPill({ status }) {
  const config = {
    pending: { label: 'Pending', bg: 'bg-warning/10', text: 'text-warning', dot: 'bg-warning' },
    approved: { label: 'Approved', bg: 'bg-success/10', text: 'text-success', dot: 'bg-success' },
    rejected: { label: 'Rejected', bg: 'bg-error/10', text: 'text-error', dot: 'bg-error' },
  };
  const c = config[status] ?? config.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

// ── Detail item ───────────────────────────────────────────────
function DetailItem({ icon: Icon, label, value, color }) {
  return (
    <div className="flex items-start gap-2.5 p-3 bg-card border border-border rounded-card">
      <div
        className="w-7 h-7 rounded-btn flex items-center justify-center shrink-0 mt-0.5"
        style={{ background: `${color}15` }}
      >
        <Icon size={13} strokeWidth={1.75} style={{ color }} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold text-muted uppercase tracking-wider">{label}</p>
        <p className="text-xs font-semibold text-primary mt-0.5 truncate">{value ?? '—'}</p>
      </div>
    </div>
  );
}

// ── Application card ──────────────────────────────────────────
function ApplicationCard({ application, onView, onApprove, onReject, mutating }) {
  const isPending = application.status === 'pending';

  return (
    <div className="bg-card border border-border rounded-card p-5 hover:border-accent/30 hover:shadow-md transition-all duration-200">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-11 h-11 rounded-full bg-accent-text border border-accent-border flex items-center justify-center shrink-0">
          <span className="text-sm font-black text-accent">
            {application.user_name?.charAt(0)?.toUpperCase() ?? '?'}
          </span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-bold text-primary truncate">{application.user_name ?? '—'}</p>
              <p className="text-xs text-muted truncate">{application.user_email ?? '—'}</p>
            </div>
            <StatusPill status={application.status} />
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
            <div className="flex items-center gap-1.5 text-xs text-secondary">
              <Mic2 size={11} className="text-muted shrink-0" />
              <span className="truncate max-w-[120px]">{application.org_name ?? '—'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-secondary">
              <FileText size={11} className="text-muted shrink-0" />
              <span className="truncate max-w-[120px]">{application.event_type ?? '—'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted">
              <Calendar size={11} className="shrink-0" />
              <span>{application.created_at ? formatShortDate(application.created_at) : '—'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reason preview */}
      {application.reason && (
        <p className="mt-3 text-xs text-secondary leading-relaxed line-clamp-2 pl-[60px]">
          "{application.reason}"
        </p>
      )}

      {/* Actions */}
      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
        <button
          onClick={() => onView(application)}
          className="flex items-center gap-1.5 text-xs font-semibold text-secondary hover:text-primary transition-colors"
        >
          <Eye size={12} strokeWidth={2.5} />
          View details
        </button>

        {isPending && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onReject(application.id)}
              disabled={mutating}
              className="flex items-center gap-1 h-8 px-3 border border-error/30 text-error text-xs font-semibold rounded-btn hover:bg-error/10 transition-colors disabled:opacity-50"
            >
              <XCircle size={12} strokeWidth={2} />
              Reject
            </button>
            <button
              onClick={() => onApprove(application.id)}
              disabled={mutating}
              className="flex items-center gap-1 h-8 px-3 bg-success/10 border border-success/20 text-success text-xs font-semibold rounded-btn hover:bg-success/20 transition-colors disabled:opacity-50"
            >
              <CheckCircle2 size={12} strokeWidth={2} />
              Approve
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Skeleton card ─────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-card border border-border rounded-card p-5 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-full bg-border shrink-0" />
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="h-4 bg-border rounded w-32" />
            <div className="h-5 bg-border rounded w-16" />
          </div>
          <div className="h-3 bg-border rounded w-48" />
          <div className="flex gap-3 mt-1">
            <div className="h-3 bg-border rounded w-24" />
            <div className="h-3 bg-border rounded w-20" />
          </div>
        </div>
      </div>
      <div className="mt-3 pl-[60px]">
        <div className="h-3 bg-border rounded w-full" />
        <div className="h-3 bg-border rounded w-3/4 mt-1" />
      </div>
      <div className="mt-4 pt-4 border-t border-border flex justify-between">
        <div className="h-4 bg-border rounded w-20" />
        <div className="flex gap-2">
          <div className="h-8 bg-border rounded w-16" />
          <div className="h-8 bg-border rounded w-18" />
        </div>
      </div>
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────
function EmptyState({ status }) {
  const config = {
    pending: { icon: Clock, label: 'No pending applications', sub: 'New organizer applications will appear here for review.' },
    approved: { icon: CheckCircle2, label: 'No approved applications', sub: 'Approved applications will appear here.' },
    rejected: { icon: XCircle, label: 'No rejected applications', sub: 'Rejected applications will appear here.' },
  };
  const c = config[status] ?? config.pending;
  const Icon = c.icon;

  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center col-span-full">
      <div className="w-14 h-14 rounded-card bg-accent-text border border-accent-border flex items-center justify-center">
        <Icon size={24} strokeWidth={1.5} className="text-accent" />
      </div>
      <div>
        <p className="font-bold text-primary">{c.label}</p>
        <p className="text-sm text-secondary mt-1 max-w-xs">{c.sub}</p>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────
export default function OrgApplicationsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [confirmApprove, setConfirmApprove] = useState(null);
  const [confirmReject, setConfirmReject] = useState(null);

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

  // Trigger fetch when tab/page changes
  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  function handleView(app) {
    setSelectedApp(app);
    setDetailOpen(true);
  }

  async function handleApprove(id) {
    await approveApplication(id);
    setConfirmApprove(null);
  }

  async function handleReject(id) {
    await rejectApplication(id);
    setConfirmReject(null);
  }

  // Counts per tab from pagination (rough)
  const total = applicationsPagination?.total ?? 0;

  const activeTab =
    STATUS_TABS.find((t) => t.value === statusFilter) ?? STATUS_TABS[0];

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
                ? 'Loading applications…'
                : `${total.toLocaleString()} ${statusFilter} application${total !== 1 ? 's' : ''}`}
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

        {/* ── Status tabs ──────────────────────────────────── */}
        <div className="flex items-center gap-2 mb-6 border-b border-border">
          {STATUS_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = statusFilter === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setStatusFilter(tab.value)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all duration-150 -mb-px ${
                  isActive
                    ? 'border-accent text-accent'
                    : 'border-transparent text-secondary hover:text-primary'
                }`}
              >
                <Icon
                  size={14}
                  strokeWidth={isActive ? 2.5 : 2}
                  style={{ color: isActive ? tab.color : undefined }}
                />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ── Applications grid ─────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          {applicationsLoading ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          ) : applications.length > 0 ? (
            applications.map((app) => (
              <ApplicationCard
                key={app.id}
                application={app}
                onView={handleView}
                onApprove={(id) => setConfirmApprove(id)}
                onReject={(id) => setConfirmReject(id)}
                mutating={mutating}
              />
            ))
          ) : (
            <EmptyState status={statusFilter} />
          )}
        </div>

        {/* ── Pagination ────────────────────────────────────── */}
        <Pagination
          currentPage={page}
          totalPages={applicationsPagination?.total_pages ?? 1}
          onPageChange={setPage}
        />
      </main>

      <Footer />

      {/* ── Detail modal ──────────────────────────────────── */}
      <ApplicationDetailModal
        application={selectedApp}
        isOpen={detailOpen}
        onClose={() => {
          setDetailOpen(false);
          setSelectedApp(null);
        }}
        onApprove={(id) => {
          setDetailOpen(false);
          setConfirmApprove(id);
        }}
        onReject={(id) => {
          setDetailOpen(false);
          setConfirmReject(id);
        }}
        mutating={mutating}
      />

      {/* ── Quick-action confirm modals ───────────────────── */}
      <ConfirmModal
        isOpen={Boolean(confirmApprove)}
        onClose={() => setConfirmApprove(null)}
        onConfirm={() => handleApprove(confirmApprove)}
        loading={mutating}
        title="Approve application?"
        description="This user will immediately gain Organizer access and can start creating events."
        confirmLabel="Yes, approve"
      />

      <ConfirmModal
        isOpen={Boolean(confirmReject)}
        onClose={() => setConfirmReject(null)}
        onConfirm={() => handleReject(confirmReject)}
        loading={mutating}
        title="Reject application?"
        description="The applicant will be notified that their application was not approved. They can reapply later."
        confirmLabel="Yes, reject"
        danger
      />
    </div>
  );
}