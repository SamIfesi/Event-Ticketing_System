<<<<<<< HEAD
import { ROLES } from '../config/constants';

export function hasRole(userRole, allowedRoles = []) {
=======
import {ROLES} from '../config/constants'

export function hasRole(userRole, allowedRoles = []){
>>>>>>> 187fc07ecf3fb764d8f6a6b5ee81e992f299986a
  if (!userRole) return false;
  return allowedRoles.includes(userRole);
}

<<<<<<< HEAD
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
=======
export function isAdminOrDev(userRole){
  return hasRole(userRole, [ROLES.ADMIN, ROLES.DEV]);
}

export function isOrganizerOrHigher(userRole){
  return hasRole(userRole, [ROLES.ORGANIZER, ROLES.ADMIN, ROLES.DEV]);
}

export function isAttendeeOnly(userRole){
  return userRole === ROLES.ATTENDEE;
}

export function getDefaultPath(role){
  switch(role){
>>>>>>> 187fc07ecf3fb764d8f6a6b5ee81e992f299986a
    case ROLES.ADMIN:
    case ROLES.DEV:
      return '/admin/dashboard';
    case ROLES.ORGANIZER:
      return '/organizer/dashboard';
    case ROLES.ATTENDEE:
    default:
      return '/events';
  }
<<<<<<< HEAD
}
=======
}
>>>>>>> 187fc07ecf3fb764d8f6a6b5ee81e992f299986a
