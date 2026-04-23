export const BASE_URL = import.meta.env.VITE_API_URL;
export const ROLES = {
  DEV: 'dev',
  ADMIN: 'admin',
  ORGANIZER: 'organizer',
  ATTENDEE: 'attendee',
};

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
}

export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
}

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
}

export const JOB_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  DONE: 'done',
  FAILED: 'failed',
}

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PER_PAGE: 12,
}

export const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY ?? '';

export const STORAGE_KEY = {
  AUTH: 'auth',
}