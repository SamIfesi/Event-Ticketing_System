export const BASE_URL = import.meta.env.VITE_API_URL;
export const PAYSTACK_PUBLIC_KEY =
  import.meta.env.VITE_PAYSTACK_PUBLIC_KEY ?? '';

export const ROLES = {
  DEV: 'dev',
  ADMIN: 'admin',
  ORGANIZER: 'organizer',
  ATTENDEE: 'attendee',
};

export const ROLE_OPTIONS = [
  { value: ROLES.ATTENDEE, label: 'Attendee' },
  { value: ROLES.ORGANIZER, label: 'Organizer' },
  { value: ROLES.ADMIN, label: 'Admin' },
];

export const ROLE_COLORS = {
  [ROLES.DEV]: '#8b5cf6',
  [ROLES.ADMIN]: '#ef4444',
  [ROLES.ORGANIZER]: '#f59e0b',
  [ROLES.ATTENDEE]: '#2563eb',
};

export const USERTABLE_HEADS = ['User', 'Role', 'Status', 'Joined', ''];
export const EVENT_TABLE_HEADS = ['Event', 'Status', 'Tickets', 'Revenue', 'Date', ''];

export const USER_STATUS = {
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  BANNED: 'banned',
};

export const EVENT_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
};

export const TICKET_STATUS = {
  VALID: 'valid',
  USED: 'used',
  CANCELLED: 'cancelled',
  EXPIRED: 'expired',
};

export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
};

export const JOB_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  DONE: 'done',
  FAILED: 'failed',
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PER_PAGE: 12,
};

export const STORAGE_KEY = {
  AUTH: 'auth',
};
