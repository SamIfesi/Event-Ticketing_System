import { ROLES } from '../config/constants';

export function hasRole(userRole, allowedRoles = []) {
  if (!userRole) return false;
  return allowedRoles.includes(userRole);
}

export function isAdminOrDev(userRole) {
  return hasRole(userRole, [ROLES.ADMIN, ROLES.DEV]);
}

export function isOrganizerOrHigher(userRole) {
  return hasRole(userRole, [ROLES.ORGANIZER, ROLES.ADMIN, ROLES.DEV]);
}

export function isAttendeeOnly(userRole) {
  return userRole === ROLES.ATTENDEE;
}

export function getDefaultPath(role) {
  switch (role) {
    case ROLES.ADMIN:
    case ROLES.DEV:
      return '/admin/dashboard';
    case ROLES.ORGANIZER:
      return '/organizer/dashboard';
    case ROLES.ATTENDEE:
    default:
      return '/dashboard';
  }
}
