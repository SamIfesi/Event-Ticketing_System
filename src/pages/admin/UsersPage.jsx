import { useEffect, useState } from 'react';
import {
  Search,
  X,
  Users,
  UserCheck,
  Mic2,
  ShieldCheck,
  Filter,
  UserX,
  RefreshCw,
} from 'lucide-react';
import { useAdmin } from '../../hooks/useAdmin';
import { formatShortDate } from '../../utils/formatDate';
import { ROLES } from '../../config/constants';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Footer from '../../components/layout/Footer';
import Badge from '../../components/ui/Badge';
import Pagination from '../../components/ui/Pagination';
import { ConfirmModal } from '../../components/ui/Modal';
import { useUiStore } from '../../store/uiStore';

// ── Role filter config ────────────────────────────────────────
const ROLE_FILTERS = [
  { value: '', label: 'All Roles' },
  { value: ROLES.ATTENDEE, label: 'Attendees' },
  { value: ROLES.ORGANIZER, label: 'Organizers' },
  { value: ROLES.ADMIN, label: 'Admins' },
];

// ── Role color map ────────────────────────────────────────────
const ROLE_COLORS = {
  [ROLES.DEV]: '#8b5cf6',
  [ROLES.ADMIN]: '#ef4444',
  [ROLES.ORGANIZER]: '#10b981',
  [ROLES.ATTENDEE]: '#2563eb',
};

// ── User row ──────────────────────────────────────────────────
function UserRow({ user, onRoleChange, onStatusChange, mutating }) {
  const [confirmModal, setConfirmModal] = useState(null);
  // confirmModal: { type: 'suspend'|'activate'|'role', newRole? }

  const isActive = user.is_active !== 0;
  const roleColor = ROLE_COLORS[user.role] ?? '#94a3b8';

  function handleStatusClick() {
    setConfirmModal({ type: isActive ? 'suspend' : 'activate' });
  }

  function handleConfirm() {
    if (confirmModal?.type === 'suspend' || confirmModal?.type === 'activate') {
      onStatusChange(user.id, !isActive);
    }
    setConfirmModal(null);
  }

  return (
    <>
      <tr className="border-t border-border hover:bg-main-bg transition-colors duration-150 group">
        {/* User info */}
        <td className="px-4 py-3.5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-accent-text flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-accent">
                {user.name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-primary truncate max-w-[160px]">
                {user.name}
              </p>
              <p className="text-xs text-muted truncate max-w-[180px]">
                {user.email}
              </p>
            </div>
          </div>
        </td>

        {/* Role */}
        <td className="px-4 py-3.5">
          <span
            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize"
            style={{ background: `${roleColor}15`, color: roleColor }}
          >
            {user.role}
          </span>
        </td>

        {/* Status */}
        <td className="px-4 py-3.5">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
              isActive ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-success' : 'bg-error'}`}
            />
            {isActive ? 'Active' : 'Suspended'}
          </span>
        </td>

        {/* Joined */}
        <td className="px-4 py-3.5">
          <span className="text-xs text-muted">
            {user.created_at ? formatShortDate(user.created_at) : '—'}
          </span>
        </td>

        {/* Actions */}
        <td className="px-4 py-3.5">
          <button
            onClick={handleStatusClick}
            disabled={mutating}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-btn text-xs font-semibold transition-colors duration-150 disabled:opacity-50 ${
              isActive
                ? 'text-error hover:bg-error/10 border border-error/20 hover:border-error/40'
                : 'text-success hover:bg-success/10 border border-success/20 hover:border-success/40'
            }`}
          >
            {isActive ? (
              <>
                <UserX size={12} strokeWidth={2.5} />
                Suspend
              </>
            ) : (
              <>
                <UserCheck size={12} strokeWidth={2.5} />
                Activate
              </>
            )}
          </button>
        </td>
      </tr>

      {/* Confirm modal */}
      <ConfirmModal
        isOpen={Boolean(confirmModal)}
        onClose={() => setConfirmModal(null)}
        onConfirm={handleConfirm}
        loading={mutating}
        title={
          confirmModal?.type === 'suspend'
            ? `Suspend ${user.name}?`
            : `Activate ${user.name}?`
        }
        description={
          confirmModal?.type === 'suspend'
            ? 'This user will lose access to their account immediately. You can reactivate anytime.'
            : 'This user will regain full access to their account.'
        }
        confirmLabel={
          confirmModal?.type === 'suspend' ? 'Yes, suspend' : 'Yes, activate'
        }
        danger={confirmModal?.type === 'suspend'}
      />
    </>
  );
}

// ── Skeleton row ──────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr className="animate-pulse border-t border-border">
      {[140, 80, 72, 72, 60].map((w, i) => (
        <td key={i} className="px-4 py-3.5">
          {i === 0 ? (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-border shrink-0" />
              <div className="flex flex-col gap-1.5">
                <div className="h-3 bg-border rounded w-28" />
                <div className="h-2.5 bg-border rounded w-36" />
              </div>
            </div>
          ) : (
            <div className="h-5 bg-border rounded" style={{ width: w }} />
          )}
        </td>
      ))}
    </tr>
  );
}

// ── Summary stat mini card ────────────────────────────────────
function MiniStat({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-card border border-border rounded-card px-4 py-3.5 flex items-center gap-3">
      <div
        className="w-9 h-9 rounded-btn flex items-center justify-center shrink-0"
        style={{ background: `${color}15` }}
      >
        <Icon size={16} strokeWidth={1.75} style={{ color }} />
      </div>
      <div>
        <p className="text-lg font-black text-primary leading-none">{value}</p>
        <p className="text-xs text-muted mt-0.5">{label}</p>
      </div>
    </div>
  );
}

export default function UsersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const {
    users,
    usersPagination,
    usersLoading,
    usersPage,
    usersSearch,
    usersRole,
    setUsersPage,
    setUsersSearch,
    setUsersRoleFilter,
    fetchUsers,
    mutating,
    updateUserRole,
    updateUserStatus,
  } = useAdmin();

  // Sync local input with URL state
  useEffect(() => {
    setSearchInput(usersSearch);
  }, [usersSearch]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      if (searchInput !== usersSearch) setUsersSearch(searchInput);
    }, 500);
    return () => clearTimeout(t);
  }, [searchInput]);

  const totalUsers = usersPagination?.total ?? 0;
  const attendeeCount = (users ?? []).filter(
    (u) => u.role === ROLES.ATTENDEE
  ).length;
  const organizerCount = (users ?? []).filter(
    (u) => u.role === ROLES.ORGANIZER
  ).length;
  const suspendedCount = (users ?? []).filter((u) => !u.is_active).length;

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
              Manage Users
            </h1>
            <p className="text-sm text-secondary mt-1">
              {usersLoading
                ? 'Loading users…'
                : `${totalUsers.toLocaleString()} user${totalUsers !== 1 ? 's' : ''} registered`}
            </p>
          </div>
          <button
            onClick={fetchUsers}
            disabled={usersLoading}
            className="self-start sm:self-auto flex items-center gap-2 h-10 px-4 border border-border rounded-btn text-sm font-medium text-secondary hover:text-primary hover:border-accent/40 transition-colors duration-150 disabled:opacity-50"
          >
            <RefreshCw
              size={14}
              className={usersLoading ? 'animate-spin' : ''}
            />
            Refresh
          </button>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <MiniStat
            icon={Users}
            label="Total Users"
            value={totalUsers.toLocaleString()}
            color="#2563eb"
          />
          <MiniStat
            icon={UserCheck}
            label="Attendees"
            value={attendeeCount}
            color="#2563eb"
          />
          <MiniStat
            icon={Mic2}
            label="Organizers"
            value={organizerCount}
            color="#10b981"
          />
          <MiniStat
            icon={UserX}
            label="Suspended"
            value={suspendedCount}
            color="#ef4444"
          />
        </div>

        {/* Search + filter row */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
            />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name or email…"
              className="w-full h-10 pl-9 pr-9 bg-card border border-border rounded-btn text-sm text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
            />
            {searchInput && (
              <button
                onClick={() => {
                  setSearchInput('');
                  setUsersSearch('');
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Role filter pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {ROLE_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setUsersRoleFilter(f.value)}
                className={`h-10 px-3 rounded-btn text-xs font-semibold transition-colors border ${
                  usersRole === f.value
                    ? 'bg-accent text-white border-accent'
                    : 'bg-card text-secondary border-border hover:text-primary hover:border-accent/40'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-card border border-border rounded-card overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="bg-main-bg">
                  {['User', 'Role', 'Status', 'Date Joined', 'Action'].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs font-bold text-muted uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {usersLoading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <SkeletonRow key={i} />
                  ))
                ) : (users ?? []).length > 0 ? (
                  (users ?? []).map((user) => (
                    <UserRow
                      key={user.id}
                      user={user}
                      onRoleChange={updateUserRole}
                      onStatusChange={updateUserStatus}
                      mutating={mutating}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-card bg-accent-text border border-accent-border flex items-center justify-center">
                          <Users
                            size={20}
                            strokeWidth={1.5}
                            className="text-accent"
                          />
                        </div>
                        <p className="text-sm font-semibold text-primary">
                          No users found
                        </p>
                        <p className="text-xs text-muted">
                          {usersSearch || usersRole
                            ? 'Try adjusting your search or filter.'
                            : 'No users have registered yet.'}
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
        <Pagination
          currentPage={usersPage}
          totalPages={usersPagination?.total_pages ?? 1}
          onPageChange={setUsersPage}
        />
      </main>

      <Footer />
    </div>
  );
}
