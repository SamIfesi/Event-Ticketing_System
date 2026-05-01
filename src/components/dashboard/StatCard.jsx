// Reusable stat card used across Attendee, Organizer, and Admin dashboards.
//
// Props:
//   icon     — Lucide icon component
//   label    — metric label e.g. "Total Bookings"
//   value    — the big number / string to display
//   sub      — small secondary text below the value
//   accent   — hex color for the icon bg + decorative blob
//   loading  — shows skeleton pulse when true
//   trend    — optional { value: number, label: string }
//              e.g. { value: 12, label: 'vs last month' }
//              positive = green arrow up, negative = red arrow down

import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accent = '#2563eb',
  loading = false,
  trend,
  className = '',
}) {
  return (
    <div
      className={`relative bg-card border border-border rounded-card p-5 overflow-hidden group hover:border-accent/30 hover:shadow-md transition-all duration-200 ${className}`}
    >
      {/* Decorative background blob */}
      <div
        className="absolute -top-5 -right-5 w-24 h-24 rounded-full opacity-[0.06] transition-all duration-300 group-hover:opacity-10 group-hover:scale-110"
        style={{ background: accent }}
      />

      <div className="relative flex flex-col gap-3">
        {/* Icon */}
        <div
          className="w-10 h-10 rounded-btn flex items-center justify-center shrink-0"
          style={{ background: `${accent}18` }}
        >
          {Icon && (
            <Icon size={18} strokeWidth={1.75} style={{ color: accent }} />
          )}
        </div>

        {/* Value area */}
        {loading ? (
          <div className="flex flex-col gap-1.5 animate-pulse">
            <div className="h-7 bg-border rounded w-20" />
            <div className="h-3 bg-border rounded w-24" />
          </div>
        ) : (
          <div>
            <p className="text-2xl font-black text-primary tracking-tight leading-none">
              {value ?? '—'}
            </p>
            <p className="text-xs text-muted mt-1 leading-snug">{label}</p>
            {sub && (
              <p className="text-xs text-secondary mt-0.5 leading-snug">
                {sub}
              </p>
            )}
          </div>
        )}

        {/* Trend indicator */}
        {!loading && trend != null && (
          <div
            className={`flex items-center gap-1 text-xs font-semibold ${
              trend.value >= 0 ? 'text-success' : 'text-error'
            }`}
          >
            {trend.value >= 0 ? (
              <TrendingUp size={13} strokeWidth={2.5} />
            ) : (
              <TrendingDown size={13} strokeWidth={2.5} />
            )}
            <span>
              {trend.value >= 0 ? '+' : ''}
              {trend.value}%
            </span>
            {trend.label && (
              <span className="font-normal text-muted">{trend.label}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
