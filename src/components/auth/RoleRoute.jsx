// Layered on top of ProtectedRoute — only mounts when the user is already
// authenticated and verified. Checks whether their role is in the allowed list.
//
// Usage:
//   <RoleRoute allowed={[ROLES.ADMIN, ROLES.DEV]}>
//     <AdminDashboard />
//   </RoleRoute>
//
// If the role doesn't match → /unauthorized (not /login, they ARE logged in).

import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { hasRole } from '../../utils/roleGuard';

export default function RoleRoute({ children, allowed = [] }) {
  const user = useAuthStore((state) => state.user);
  if(!hasRole(user?.role, allowed)) {
    return <Navigate to="/unauthorized" replace />;
  }
  return children;
}