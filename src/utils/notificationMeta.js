import {
  CheckCircle2, XCircle, QrCode, CalendarX, CalendarClock,
  ShieldCheck, UserX, Megaphone, AlertTriangle, Banknote,
  Flag, CreditCard, ThumbsUp, ThumbsDown, Bell, ClipboardList
} from 'lucide-react';

// Icon + accent color per notification type — same pattern as your TOAST_CONFIG
export const NOTIFICATION_META = {
  booking_confirmed:        { icon: CheckCircle2, color: 'var(--color-success)' },
  booking_failed:           { icon: XCircle,      color: 'var(--color-error)' },
  ticket_checkin:           { icon: QrCode,       color: 'var(--color-success)' },
  event_cancelled:          { icon: CalendarX,    color: 'var(--color-error)' },
  event_updated:            { icon: CalendarClock,color: 'var(--color-info)' },
  role_changed:             { icon: ShieldCheck,  color: 'var(--color-accent)' },
  account_deactivated:      { icon: UserX,        color: 'var(--color-error)' },
  new_booking:              { icon: Megaphone,    color: 'var(--color-accent)' },
  low_tickets:              { icon: AlertTriangle,color: 'var(--color-warning)' },
  payout_sent:              { icon: Banknote,     color: 'var(--color-success)' },
  payout_failed:            { icon: XCircle,      color: 'var(--color-error)' },
  payout_frozen:            { icon: Flag,         color: 'var(--color-warning)' },
  account_flagged:          { icon: Flag,         color: 'var(--color-error)' },
  bank_details_required:    { icon: CreditCard,   color: 'var(--color-warning)' },
  admin_payout_failed:      { icon: XCircle,      color: 'var(--color-error)' },
  admin_organizer_flagged:  { icon: Flag,         color: 'var(--color-error)' },
  organizer_approved:       { icon: ThumbsUp,      color: 'var(--color-success)' },
  organizer_rejected:       { icon: ThumbsDown,    color: 'var(--color-error)' },
  new_organizer_application: { icon: Megaphone,    color: 'var(--color-accent)' },
  organizer_application_submitted: { icon: ThumbsUp,    color: 'var(--color-success)' },
};

export function getNotificationMeta(type) {
  return NOTIFICATION_META[type] ?? { icon: Bell, color: 'var(--color-muted)' };
}

// Known-broken action_urls get overridden here, by type — using related_id
// where we know what it points to. Anything not listed falls back to
// whatever action_url is already stored (most of those are fine).
const SAFE_OVERRIDES = {
  booking_confirmed:       () => '/my-bookings',
  event_cancelled:         () => '/my-bookings',
  ticket_checkin:          (n) => (n.related_id ? `/ticket/${n.related_id}` : '/my-tickets'),
  low_tickets:             (n) => (n.related_id ? `/organizer/events/${n.related_id}/edit` : '/organizer/events'),
  payout_sent:             () => '/organizer/payment-details',
  payout_frozen:           () => '/organizer/payment-details',
  admin_organizer_flagged: () => '/admin/users',
  new_organizer_application: () => '/admin/organizer/applications',
  organizer_application_submitted: () => '/become-organizer',
};

export function resolveNotificationLink(notification) {
  const override = SAFE_OVERRIDES[notification.type];
  if (override) return override(notification);
  return notification.action_url || null;
}