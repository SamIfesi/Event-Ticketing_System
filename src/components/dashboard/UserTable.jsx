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
import {
  ROLES,
  ROLE_OPTIONS,
  ROLE_COLORS,
  USERTABLE_HEADS,
} from '../../config/constants';
import { formatShortDate } from '../../utils/formatDate';
import { SkeletonRow } from '../dashboard/EventTable';

function UserRow({ user, onRoleChange, onStatusChange, mutating }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isActive = user.is_active !== 0;
  const role = user.role?.trim().toLowerCase();
  const color = ROLE_COLORS[role] ?? '#ff0303';

  return (
    <tr className="border-t border-border hover:bg-main-bg transition-colors duration-150">
      {/* User + email */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Avatar Image or Placeholder */}
          <div className="w-10 h-10 rounded-full bg-accent-text flex items-center justify-center shrink-0 overflow-hidden">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs font-bold text-accent">
                {user.name?.charAt(0)?.toUpperCase()}
              </span>
            )}
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-primary hover:text-accent transition-colors truncate block max-w-45">
              {user.name}
            </p>
            <p className="text-xs text-muted truncate max-w-40">{user.email}</p>
          </div>
        </div>
      </td>

      {/* Role */}
      <td className="px-4 py-3">
        <Badge
          status={user.role}
          style={{
            background: `${color}18`,
            color,
          }}
        />
      </td>

      {/* Status */}
      <td className="px-4 py-3">
        <Badge
          status={isActive ? 'active' : 'suspended'}
          size="sm"
          dot
          variant={isActive ? 'success' : 'error'}
        />
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
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenuOpen(false)}
              />

              <div className="absolute right-0 top-9 z-20 w-44 bg-card border border-border rounded-card shadow-lg py-1 overflow-hidden">
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
      className={`bg-card border border-border rounded-card overflow-hidden min-w-0 ${className}`}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-155">
          <thead>
            <tr className="bg-main-bg">
              {USERTABLE_HEADS.map((header) => (
                <th
                  key={header}
                  className="px-4 py-3 text-left text-xs font-bold text-muted uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
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
