// SettingsItem — one row in the profile settings list.
//
// Renders as a <Link> when `to` is provided, or a <button> when `onClick` is provided.
//
// Props:
//   icon      — Lucide icon component
//   iconColor — hex color for the icon tint  (default: accent)
//   label     — primary text
//   subtitle  — secondary text below label
//   to        — react-router path (renders as Link)
//   onClick   — click handler (renders as button)
//   danger    — red label styling for destructive actions
//   right     — optional JSX to render instead of the chevron

import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function SettingsItem({
  icon: Icon,
  iconColor = '#2563eb',
  label,
  subtitle,
  to,
  onClick,
  danger = false,
  right,
  className = '',
}) {
  const inner = (
    <div
      className={`flex items-center gap-4 px-4 py-4 hover:bg-main-bg active:bg-border transition-colors duration-150 touch-manipulation ${className}`}
    >
      {/* Icon */}
      {Icon && (
        <div
          className="w-9 h-9 rounded-btn flex items-center justify-center shrink-0"
          style={{ background: `${iconColor}18` }}
        >
          <Icon size={17} strokeWidth={1.75} style={{ color: iconColor }} />
        </div>
      )}

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-semibold leading-snug ${
            danger ? 'text-error' : 'text-primary'
          }`}
        >
          {label}
        </p>
        {subtitle && (
          <p className="text-xs text-muted mt-0.5 leading-snug">{subtitle}</p>
        )}
      </div>

      {/* Right side */}
      {right ?? (
        <ChevronRight
          size={16}
          strokeWidth={2}
          className={danger ? 'text-error/60' : 'text-muted'}
        />
      )}
    </div>
  );

  if (to) {
    return <Link to={to}>{inner}</Link>;
  }

  return (
    <button type="button" onClick={onClick} className="w-full text-left">
      {inner}
    </button>
  );
}
