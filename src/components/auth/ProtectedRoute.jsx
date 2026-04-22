// Wraps any route that requires authentication.
// Three states to handle:
//
//   1. No token           → redirect to /login (not logged in at all)
//   2. Token + unverified → redirect to /verify-email (logged in but no OTP yet)
//   3. Token + verified   → render children normally
//
// The `requireVerified` prop (default true) lets you opt out for the
// /verify-email page itself — it needs to be reachable while unverified.

import {Navigate, useLocation} from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export default function ProtectedRoute({ children, requireVerified = true }) {
  const token = useAuthStore((state) => state.token);
  const isVerified = useAuthStore((state) => state.isVerified);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireVerified && !isVerified) {
    return <Navigate to="/verify-email" state={{ from: location }} replace />;
  }

  return children;

}