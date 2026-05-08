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

import {
  EVENT_STATUS_MAP,
  PAYMENT_STATUS_MAP,
  BOOKING_STATUS_MAP,
  TICKET_STATUS_MAP,
  VARIANT_STYLES,
  SIZE_STYLES,
  DOT_COLORS,
} from '../../config/constants';

// Merge all maps — Badge auto-detects the right one
const ALL_STATUS_MAPS = {
  ...EVENT_STATUS_MAP,
  ...PAYMENT_STATUS_MAP,
  ...BOOKING_STATUS_MAP,
  ...TICKET_STATUS_MAP,
};

export default function Badge({
  status, // auto-resolve from status maps
  variant = 'neutral', // fallback if no status provided
  size = 'sm',
  dot = false, // show a colored dot before the label
  children, // override the label
  className = '',
  style = {}, // for custom inline styles (e.g. dynamic colors)
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
      style={style}
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
