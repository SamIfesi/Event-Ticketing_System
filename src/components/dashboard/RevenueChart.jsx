// src/components/dashboard/RevenueChart.jsx
//
// Simple bar chart visualising revenue or booking counts over time.
// Uses pure CSS bars — no external chart library needed.
// Falls back gracefully when data is empty.
//
// Props:
//   data     — array of { label: string, value: number }
//              e.g. [{ label: 'Jan', value: 45000 }, ...]
//   title    — card heading
//   valuePrefix — '₦' | '#' etc.
//   loading  — shows skeleton bars

import { formatCurrency } from '../../utils/formatCurrency';

function Bar({ label, value, max, valuePrefix, accent }) {
  const pct = max > 0 ? Math.max(4, (value / max) * 100) : 4;
  const formatted =
    valuePrefix === '₦' ? formatCurrency(value) : value.toLocaleString();

  return (
    <div className="flex flex-col items-center gap-1.5 flex-1 min-w-0 group">
      {/* Value tooltip on hover */}
      <div className="relative w-full flex flex-col items-center">
        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 absolute -top-6 text-[10px] font-semibold text-primary bg-card border border-border rounded px-1.5 py-0.5 whitespace-nowrap pointer-events-none z-10">
          {formatted}
        </span>

        {/* Bar track */}
        <div className="w-full h-28 bg-border rounded-t-sm overflow-hidden flex items-end">
          <div
            className="w-full rounded-t-sm transition-all duration-500"
            style={{
              height: `${pct}%`,
              background: accent ?? 'var(--color-accent)',
              opacity: 0.85,
            }}
          />
        </div>
      </div>

      {/* Label */}
      <span className="text-[10px] text-muted font-medium truncate w-full text-center">
        {label}
      </span>
    </div>
  );
}

function SkeletonBar() {
  return (
    <div className="flex flex-col items-center gap-1.5 flex-1 animate-pulse">
      <div
        className="w-full bg-border rounded-t-sm"
        style={{ height: `${Math.random() * 60 + 30}%` }}
      />
      <div className="h-2 bg-border rounded w-6" />
    </div>
  );
}

export default function RevenueChart({
  data = [],
  title = 'Revenue',
  subtitle,
  valuePrefix = '₦',
  accent,
  loading = false,
  className = '',
}) {
  const max = data.length > 0 ? Math.max(...data.map((d) => d.value), 1) : 1;
  const total = data.reduce((acc, d) => acc + d.value, 0);

  return (
    <div
      className={`bg-card border border-border rounded-card p-5 ${className}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-5 gap-4">
        <div>
          <h3 className="text-sm font-bold text-primary">{title}</h3>
          {subtitle && <p className="text-xs text-muted mt-0.5">{subtitle}</p>}
        </div>
        {!loading && total > 0 && (
          <div className="text-right shrink-0">
            <p className="text-lg font-black text-primary tracking-tight">
              {valuePrefix === '₦'
                ? formatCurrency(total)
                : total.toLocaleString()}
            </p>
            <p className="text-[11px] text-muted">Total</p>
          </div>
        )}
      </div>

      {/* Bars */}
      {loading ? (
        <div className="flex items-end gap-2 h-28">
          {Array.from({ length: 7 }).map((_, i) => (
            <SkeletonBar key={i} />
          ))}
        </div>
      ) : data.length > 0 ? (
        <div className="flex items-end gap-1.5">
          {data.map((d) => (
            <Bar
              key={d.label}
              label={d.label}
              value={d.value}
              max={max}
              valuePrefix={valuePrefix}
              accent={accent}
            />
          ))}
        </div>
      ) : (
        <div className="h-28 flex items-center justify-center">
          <p className="text-sm text-muted">No data available</p>
        </div>
      )}
    </div>
  );
}
