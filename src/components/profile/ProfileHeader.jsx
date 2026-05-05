// ProfileHeader — avatar card shown at the top of the Profile settings page.
//
// Props:
//   profile  — profile object from useProfile()
//   user     — fallback user from useAuthStore()
//   loading  — shows skeleton

import { CheckCircle2, AlertCircle } from 'lucide-react';
import { formatShortDate } from '../../utils/formatDate';

function Skeleton() {
  return (
    <div className="bg-card border border-border rounded-card p-5 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-border shrink-0" />
        <div className="flex flex-col gap-2 flex-1">
          <div className="h-5 bg-border rounded w-36" />
          <div className="h-3 bg-border rounded w-48" />
          <div className="h-4 bg-border rounded w-20 mt-1" />
        </div>
      </div>
    </div>
  );
}

export default function ProfileHeader({ profile, user, loading }) {
  if (loading) return <Skeleton />;

  const name = profile?.name ?? user?.name ?? '—';
  const email = profile?.email ?? user?.email ?? '—';
  const role = profile?.role ?? user?.role ?? 'attendee';
  const avatar = profile?.avatar;
  const verified = Boolean(profile?.email_verified ?? user?.email_verified);
  const since = profile?.created_at ?? user?.created_at;

  return (
    <div className="bg-card border border-border rounded-card p-5">
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="relative shrink-0">
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className="w-16 h-16 rounded-full object-cover border-2 border-border"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-accent-text border-2 border-accent-border flex items-center justify-center">
              <span className="text-xl font-black text-accent">
                {name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-black text-primary truncate">{name}</h2>
          <p className="text-xs text-secondary truncate mt-0.5">{email}</p>

          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {/* Role pill */}
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-accent-text text-accent capitalize">
              {role}
            </span>

            {/* Verified badge */}
            {verified ? (
              <span className="inline-flex items-center gap-1 text-xs text-success font-medium">
                <CheckCircle2 size={11} strokeWidth={2.5} /> Verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs text-warning font-medium">
                <AlertCircle size={11} strokeWidth={2.5} /> Unverified
              </span>
            )}
          </div>

          {since && (
            <p className="text-[11px] text-muted mt-1">
              Member since {formatShortDate(since)}
            </p>
          )}
        </div>
      </div>

      {/* Optional stats strip */}
      {(profile?.booking_count != null || profile?.ticket_count != null) && (
        <div className="mt-4 pt-4 border-t border-border flex items-center gap-8">
          {profile?.booking_count != null && (
            <div>
              <p className="text-base font-black text-primary leading-none">
                {profile.booking_count}
              </p>
              <p className="text-[11px] text-muted mt-0.5">Bookings</p>
            </div>
          )}
          {profile?.ticket_count != null && (
            <div>
              <p className="text-base font-black text-primary leading-none">
                {profile.ticket_count}
              </p>
              <p className="text-[11px] text-muted mt-0.5">Tickets</p>
            </div>
          )}
          {profile?.events_attended != null && (
            <div>
              <p className="text-base font-black text-primary leading-none">
                {profile.events_attended}
              </p>
              <p className="text-[11px] text-muted mt-0.5">Attended</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
