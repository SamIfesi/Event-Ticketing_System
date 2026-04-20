// Two usage patterns:
//
// 1. Generic variant (you pick the color):
//    <Badge variant="success">Active</Badge>
//    <Badge variant="error">Failed</Badge>
//
// 2. Semantic shorthand (pass a status string, Badge figures out the color):
//    <Badge status="published" />       → maps to EVENT_STATUS
//    <Badge status="paid" />            → maps to PAYMENT_STATUS
//    <Badge status="confirmed" />       → maps to BOOKING_STATUS
//    <Badge status="valid" />           → maps to TICKET_STATUS
//
// Sizes:
//    sm (default) — for table cells and tight spaces
//    md           — for detail pages and cards
//
// You can override the label shown by passing children:
//    <Badge status="draft">In Draft</Badge>

// ── Status → variant maps ─────────────────────────────────────
// Matches your constants.js values exactly

const EVENT_STATUS_MAP = {
  draft: { variant: 'warning', label: 'Draft' },
  published: { variant: 'success', label: 'Published' },
  cancelled: { variant: 'error', label: 'Cancelled' },
  completed: { variant: 'neutral', label: 'Completed' },
};

const PAYMENT_STATUS_MAP = {
  pending: { variant: 'warning', label: 'Pending' },
  paid: { variant: 'success', label: 'Paid' },
  failed: { variant: 'error', label: 'Failed' },
  refunded: { variant: 'neutral', label: 'Refunded' },
};

const BOOKING_STATUS_MAP = {
  pending: { variant: 'warning', label: 'Pending' },
  confirmed: { variant: 'success', label: 'Confirmed' },
  cancelled: { variant: 'error', label: 'Cancelled' },
};

const TICKET_STATUS_MAP = {
  valid: { variant: 'success', label: 'Valid' },
  used: { variant: 'neutral', label: 'Used' },
  cancelled: { variant: 'error', label: 'Cancelled' },
  expired: { variant: 'neutral', label: 'Expired' },
};

// Merge all maps — Badge auto-detects the right one
const ALL_STATUS_MAPS = {
  ...EVENT_STATUS_MAP,
  ...PAYMENT_STATUS_MAP,
  ...BOOKING_STATUS_MAP,
  ...TICKET_STATUS_MAP,
};

// ── Variant → styles ──────────────────────────────────────────
const VARIANT_STYLES = {
  success:
    'bg-[var(--Success)]/10 text-[var(--Success)] ring-[var(--Success)]/20',
  error: 'bg-[var(--Error)]/10   text-[var(--Error)]   ring-[var(--Error)]/20',
  warning:
    'bg-[var(--Warning)]/10 text-[var(--Warning)] ring-[var(--Warning)]/20',
  info: 'bg-[var(--Info)]/10    text-[var(--Info)]    ring-[var(--Info)]/20',
  neutral: 'bg-[var(--border)]     text-[var(--text-s)]  ring-[var(--border)]',
  accent:
    'bg-[var(--accent-tint)] text-[var(--accent)] ring-[var(--accent-border)]',
};

const SIZE_STYLES = {
  sm: 'text-xs px-2 py-0.5 gap-1',
  md: 'text-sm px-2.5 py-1 gap-1.5',
};

// ── Dot indicator ─────────────────────────────────────────────
const DOT_COLORS = {
  success: 'bg-[var(--Success)]',
  error: 'bg-[var(--Error)]',
  warning: 'bg-[var(--Warning)]',
  info: 'bg-[var(--Info)]',
  neutral: 'bg-[var(--text-m)]',
  accent: 'bg-[var(--accent)]',
};

export default function Badge({
  status, // auto-resolve from status maps
  variant = 'neutral', // fallback if no status provided
  size = 'sm',
  dot = false, // show a colored dot before the label
  children, // override the label
  className = '',
}) {
  // Resolve from status map if status is provided
  let resolvedVariant = variant;
  let resolvedLabel = children;

  if (status) {
    const mapped = ALL_STATUS_MAPS[status.toLowerCase()];
    if (mapped) {
      resolvedVariant = mapped.variant;
      resolvedLabel = children ?? mapped.label;
    } else {
      // Unknown status — show it as-is in neutral
      resolvedLabel = children ?? status;
    }
  }

  const variantStyle =
    VARIANT_STYLES[resolvedVariant] ?? VARIANT_STYLES.neutral;
  const sizeStyle = SIZE_STYLES[size] ?? SIZE_STYLES.sm;
  const dotColor = DOT_COLORS[resolvedVariant] ?? DOT_COLORS.neutral;

  return (
    <span
      className={`
        inline-flex items-center font-medium
        rounded-full ring-1 ring-inset
        ${variantStyle}
        ${sizeStyle}
        ${className}
      `}
    >
      {dot && (
        <span
          aria-hidden="true"
          className={`
            shrink-0 rounded-full
            ${size === 'md' ? 'w-1.5 h-1.5' : 'w-1 h-1'}
            ${dotColor}
          `}
        />
      )}
      {resolvedLabel}
    </span>
  );
}
