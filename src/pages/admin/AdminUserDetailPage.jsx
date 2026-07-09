import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Mail, Calendar, UserX, UserCheck, ChevronDown } from 'lucide-react';
import { useAdmin } from '../../hooks/useAdmin';
import { formatShortDate } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';
import { ROLE_OPTIONS, ROLE_COLORS, ROLES } from '../../config/constants';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Footer from '../../components/layout/Footer';
import Badge from '../../components/ui/Badge';
import { ConfirmModal } from '../../components/ui/Modal';

function StatBlock({ label, value }) {
  return (
    <div className="flex flex-col items-center justify-center bg-main-bg rounded-card p-4 text-center">
      <p className="text-lg font-black text-primary">{value ?? '—'}</p>
      <p className="text-[11px] text-muted mt-0.5">{label}</p>
    </div>
  );
}

export default function AdminUserDetailPage() {
  const { id } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [confirmStatus, setConfirmStatus] = useState(false);

  const {
    selectedUser,
    selectedUserLoading,
    fetchUser,
    updateUserRole,
    updateUserStatus,
    mutating,
  } = useAdmin();

  useEffect(() => {
    if (id) fetchUser(id);
  }, [id, fetchUser]);

  const user = selectedUser;
  const isActive = user?.is_active !== 0;
  const roleColor = ROLE_COLORS[user?.role] ?? '#94a3b8';

  return (
    <div className="flex flex-col min-h-screen bg-main-bg">
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-8">
        <div className="flex items-center gap-2 text-xs text-secondary mb-6">
          <Link to="/admin/users" className="hover:text-primary transition-colors flex items-center gap-1">
            <ArrowLeft size={13} strokeWidth={2.5} /> Manage Users
          </Link>
          <span className="text-muted">/</span>
          <span className="text-primary font-medium truncate max-w-50">
            {selectedUserLoading ? 'Loading…' : (user?.name ?? 'User')}
          </span>
        </div>

        {selectedUserLoading ? (
          <div className="animate-pulse h-48 bg-border rounded-card" />
        ) : !user ? (
          <p className="text-sm text-muted py-10 text-center">User not found.</p>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Header card */}
            <div className="bg-card border border-border rounded-card p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-accent-text flex items-center justify-center shrink-0 overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-lg font-black text-accent">
                        {user.name?.charAt(0)?.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <h1 className="text-lg font-black text-primary">{user.name}</h1>
                    <p className="text-xs text-muted flex items-center gap-1.5 mt-0.5">
                      <Mail size={11} /> {user.email}
                    </p>
                    <p className="text-xs text-muted flex items-center gap-1.5 mt-1">
                      <Calendar size={11} /> Joined {formatShortDate(user.created_at)}
                    </p>
                  </div>
                </div>
                <Badge
                  status={isActive ? 'active' : 'suspended'}
                  dot
                  variant={isActive ? 'success' : 'error'}
                />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-5 pt-5 border-t border-border">
                <div className="relative">
                  <button
                    onClick={() => setRoleMenuOpen((v) => !v)}
                    disabled={mutating}
                    className="flex items-center gap-1.5 h-9 px-3 rounded-btn text-xs font-semibold border border-border hover:border-accent/40 transition-colors disabled:opacity-50"
                    style={{ color: roleColor }}
                  >
                    <ShieldCheck size={13} /> {user.role}
                    <ChevronDown size={12} />
                  </button>
                  {roleMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setRoleMenuOpen(false)} />
                      <div className="absolute left-0 top-10 z-20 w-44 bg-card border border-border rounded-card shadow-lg py-1 overflow-hidden">
                        {ROLE_OPTIONS.filter((r) => r.value !== user.role).map((r) => (
                          <button
                            key={r.value}
                            onClick={() => {
                              updateUserRole(user.id, r.value);
                              setRoleMenuOpen(false);
                            }}
                            className="w-full text-left px-3 py-2 text-xs font-medium text-secondary hover:bg-main-bg hover:text-primary transition-colors"
                          >
                            Set as {r.label}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <button
                  onClick={() => setConfirmStatus(true)}
                  disabled={mutating}
                  className={`flex items-center gap-1.5 h-9 px-3 rounded-btn text-xs font-semibold border transition-colors disabled:opacity-50 ${
                    isActive
                      ? 'text-error border-error/20 hover:bg-error/10'
                      : 'text-success border-success/20 hover:bg-success/10'
                  }`}
                >
                  {isActive ? <UserX size={13} /> : <UserCheck size={13} />}
                  {isActive ? 'Suspend' : 'Activate'}
                </button>
              </div>
            </div>

            {/* Booking summary */}
            <div className="bg-card border border-border rounded-card p-5">
              <h2 className="text-sm font-bold text-primary mb-4">Booking Activity</h2>
              <div className="grid grid-cols-3 gap-3">
                <StatBlock label="Total Bookings" value={user.booking_summary?.total_bookings ?? 0} />
                <StatBlock label="Paid Bookings" value={user.booking_summary?.paid_bookings ?? 0} />
                <StatBlock
                  label="Total Spent"
                  value={formatCurrency(user.booking_summary?.total_spent ?? 0)}
                />
              </div>
            </div>

            {/* Organizer summary */}
            {user.role === ROLES.ORGANIZER && user.organizer_summary && (
              <div className="bg-card border border-border rounded-card p-5">
                <h2 className="text-sm font-bold text-primary mb-4">Organizer Activity</h2>
                <div className="grid grid-cols-3 gap-3">
                  <StatBlock label="Total Events" value={user.organizer_summary.total_events ?? 0} />
                  <StatBlock label="Live Events" value={user.organizer_summary.live_events ?? 0} />
                  <StatBlock label="Tickets Sold" value={user.organizer_summary.total_tickets_sold ?? 0} />
                </div>
              </div>
            )}
          </div>
        )}
      </main>
      <Footer variant="minimal" />
      

      <ConfirmModal
        isOpen={confirmStatus}
        onClose={() => setConfirmStatus(false)}
        onConfirm={() => {
          updateUserStatus(user.id, !isActive);
          setConfirmStatus(false);
        }}
        loading={mutating}
        title={isActive ? `Suspend ${user?.name}?` : `Activate ${user?.name}?`}
        description={
          isActive
            ? 'This user will immediately lose access to their account.'
            : 'This user will regain full access to their account.'
        }
        confirmLabel={isActive ? 'Yes, suspend' : 'Yes, activate'}
        danger={isActive}
      />
    </div>
  );
}