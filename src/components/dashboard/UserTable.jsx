// Reusable user table used on the Admin dashboard and Users page.
// Shows avatar, name, email, role badge, status, and action buttons.
//
// Props:
//   users        — array of user objects
//   loading      — shows skeleton rows
//   onRoleChange — (userId, newRole) => void
//   onStatusChange — (userId, isActive) => void
//   mutating     — disables action buttons while a mutation is in flight

import { useState } from 'react';
import { MoreHorizontal, ShieldCheck, UserX, UserCheck } from 'lucide-react';
import Badge from '../ui/Badge';
import { ROLES } from '../../config/constants';
import { formatShortDate } from '../../utils/formatDate';

const ROLE_OPTIONS = [
  { value: ROLES.ATTENDEE, label: 'Attendee' },
  { value: ROLES.ORGANIZER, label: 'Organizer' },
  { value: ROLES.ADMIN, label: 'Admin' },
];

const ROLE_COLORS = {
  [ROLES.DEV]: '#8b5cf6',
  [ROLES.ADMIN]: '#ef4444',
  [ROLES.ORGANIZER]: '#f59e0b',
  [ROLES.ATTENDEE]: '#2563eb',
};

function RoleBadge({ role }) {
  const color = ROLE_COLORS[role] ?? '#94a3b8';
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold capitalize"
      style={{ background: `${color}18`, color }}
    >
      {role}
    </span>
  );
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-border shrink-0" />
          <div className="flex flex-col gap-1.5">
            <div className="h-3 bg-border rounded w-24" />
            <div className="h-2.5 bg-border rounded w-32" />
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="h-5 bg-border rounded w-16" />
      </td>
      <td className="px-4 py-3">
        <div className="h-5 bg-border rounded w-12" />
      </td>
      <td className="px-4 py-3">
        <div className="h-3 bg-border rounded w-20" />
      </td>
      <td className="px-4 py-3">
        <div className="h-8 bg-border rounded w-8" />
      </td>
    </tr>
  );
}

function UserRow({ user, onRoleChange, onStatusChange, mutating }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isActive = user.is_active !== 0;

  return (
    <tr className="border-t border-border hover:bg-main-bg transition-colors duration-150">
      {/* Name + email */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-accent-text flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-accent">
              {user.name?.charAt(0)?.toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-primary truncate max-w-[140px]">
              {user.name}
            </p>
            <p className="text-xs text-muted truncate max-w-[160px]">
              {user.email}
            </p>
          </div>
        </div>
      </td>

      {/* Role */}
      <td className="px-4 py-3">
        <RoleBadge role={user.role} />
      </td>

      {/* Status */}
      <td className="px-4 py-3">
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
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
      <td className="px-4 py-3">
        <span className="text-xs text-muted">
          {user.created_at ? formatShortDate(user.created_at) : '—'}
        </span>
      </td>

      {/* Actions */}
      <td className="px-4 py-3">
        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            disabled={mutating}
            className="w-8 h-8 flex items-center justify-center rounded-btn text-muted hover:text-primary hover:bg-border transition-colors duration-150 disabled:opacity-50"
          >
            <MoreHorizontal size={16} strokeWidth={2} />
          </button>

          {menuOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenuOpen(false)}
              />
              {/* Dropdown */}
              <div className="absolute right-0 top-9 z-20 w-44 bg-card border border-border rounded-card shadow-lg py-1 overflow-hidden">
                {/* Role options */}
                {ROLE_OPTIONS.filter((r) => r.value !== user.role).map((r) => (
                  <button
                    key={r.value}
                    onClick={() => {
                      onRoleChange?.(user.id, r.value);
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-secondary hover:bg-main-bg hover:text-primary transition-colors duration-150"
                  >
                    <ShieldCheck size={13} className="text-muted" />
                    Set as {r.label}
                  </button>
                ))}

                <div className="border-t border-border my-1" />

                {/* Activate / deactivate */}
                <button
                  onClick={() => {
                    onStatusChange?.(user.id, !isActive);
                    setMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium transition-colors duration-150 ${
                    isActive
                      ? 'text-error hover:bg-error/5'
                      : 'text-success hover:bg-success/5'
                  }`}
                >
                  {isActive ? (
                    <>
                      <UserX size={13} /> Suspend account
                    </>
                  ) : (
                    <>
                      <UserCheck size={13} /> Activate account
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}

export default function UserTable({
  users = [],
  loading = false,
  onRoleChange,
  onStatusChange,
  mutating = false,
  className = '',
}) {
  return (
    <div
      className={`bg-card border border-border rounded-card overflow-hidden ${className}`}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px]">
          <thead>
            <tr className="bg-main-bg">
              <th className="px-4 py-3 text-left text-xs font-bold text-muted uppercase tracking-wider">
                User
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-muted uppercase tracking-wider">
                Role
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-muted uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-muted uppercase tracking-wider">
                Joined
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-muted uppercase tracking-wider">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            ) : users.length > 0 ? (
              users.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  onRoleChange={onRoleChange}
                  onStatusChange={onStatusChange}
                  mutating={mutating}
                />
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-12 text-center text-sm text-muted"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
