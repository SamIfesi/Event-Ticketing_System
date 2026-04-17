import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useLoaderStore } from './store/loaderStore';
import { useAuthStore } from './store/authStore';
import { getDefaultPath } from './utils/roleGuard';
import { ROLES } from './config/constants';

import TopBarLoader   from './components/loaders/TopBarLoader';
import CenterLoader   from './components/loaders/CenterLoader';
import ProtectedRoute from './components/auth/ProtectedRoute';
import RoleRoute      from './components/auth/RoleRoute';

// ── Page imports ──────────────────────────────────────────────────────────────

// public
// import HomePage          from './pages/public/HomePage';
// import EventsPage        from './pages/public/EventsPage';
// import EventDetailPage   from './pages/public/EventDetailPage';
// import UnauthorizedPage  from './pages/public/UnauthorizedPage';
// import NotFoundPage      from './pages/public/NotFoundPage';

// auth
// import LoginPage         from './pages/public/LoginPage';
// import RegisterPage      from './pages/public/RegisterPage';
// import VerifyEmailPage   from './pages/public/VerifyEmailPage';

// attendee
// import AttendeeDashboard from './pages/attendee/AttendeeDashboard';
// import MyBookingsPage    from './pages/attendee/MyBookingsPage';
// import MyTicketsPage     from './pages/attendee/MyTicketsPage';
// import ProfilePage       from './pages/attendee/ProfilePage';

// organizer
// import OrganizerDashboard  from './pages/organizer/OrganizerDashboard';
// import ManageEventsPage    from './pages/organizer/ManageEventsPage';
// import CreateEventPage     from './pages/organizer/CreateEventPage';
// import EditEventPage       from './pages/organizer/EditEventPage';
// import EventBookingsPage   from './pages/organizer/EventBookingsPage';
// import CheckinPage         from './pages/organizer/CheckinPage';

// admin
// import AdminDashboard    from './pages/admin/AdminDashboard';
// import UsersPage         from './pages/admin/UsersPage';
// import AdminEventsPage   from './pages/admin/AdminEventsPage';

// payment
// import PaymentCallbackPage from './pages/payment/PaymentCallbackPage';

// ─────────────────────────────────────────────────────────────────────────────
// NavigationLoader
// Fires the top bar for 350ms on every route change — pure navigation feedback,
// no API call involved. Zustand counts stack, so concurrent nav + API calls
// keep the bar alive until both are done.
// ─────────────────────────────────────────────────────────────────────────────
function NavigationLoader() {
  const location    = useLocation();
  const startTopBar = useLoaderStore((state) => state.startTopBar);
  const stopTopBar  = useLoaderStore((state) => state.stopTopBar);

  useEffect(() => {
    startTopBar();
    const t = setTimeout(stopTopBar, 350);
    return () => {
      clearTimeout(t);
      stopTopBar();
    };
  }, [location.pathname]);

  return null;
}

function RootRedirect() {
  const token      = useAuthStore((state) => state.token);
  const isVerified = useAuthStore((state) => state.isVerified);
  const user       = useAuthStore((state) => state.user);

  if (!token)      return <Navigate to="/login"        replace />;
  if (!isVerified) return <Navigate to="/verify-email" replace />;
  return           <Navigate to={getDefaultPath(user?.role)} replace />;
}

function GuestOnly({ children }) {
  const token      = useAuthStore((state) => state.token);
  const isVerified = useAuthStore((state) => state.isVerified);
  const user       = useAuthStore((state) => state.user);

  if (!token)      return children;
  if (!isVerified) return <Navigate to="/verify-email" replace />;
  return           <Navigate to={getDefaultPath(user?.role)} replace />;
}

// ─────────────────────────────────────────────────────────────────────────────
// AppRoutes
// ─────────────────────────────────────────────────────────────────────────────
function AppRoutes() {
  return (
    <Routes>

      {/* ── Root ─────────────────────────────────────────────────────────── */}
      <Route path="/" element={<RootRedirect />} />

      {/* ── Public (no auth required) ────────────────────────────────────── */}
      <Route path="/events"       element={<div>Events (todo)</div>} />
      <Route path="/events/:id"   element={<div>Event detail (todo)</div>} />
      <Route path="/unauthorized" element={<div>Unauthorized (todo)</div>} />

      {/* ── Auth pages ───────────────────────────────────────────────────── */}
      <Route path="/login"    element={<GuestOnly><div>Login (todo)</div></GuestOnly>} />
      <Route path="/register" element={<GuestOnly><div>Register (todo)</div></GuestOnly>} />

      {/* verify-email: protected but requireVerified=false — reachable while unverified */}
      <Route
        path="/verify-email"
        element={
          <ProtectedRoute requireVerified={false}>
            <div>Verify email (todo)</div>
          </ProtectedRoute>
        }
      />

      {/* ── Attendee ─────────────────────────────────────────────────────── */}
      <Route path="/dashboard"   element={<ProtectedRoute><div>Attendee dashboard (todo)</div></ProtectedRoute>} />
      <Route path="/my-bookings" element={<ProtectedRoute><div>My bookings (todo)</div></ProtectedRoute>} />
      <Route path="/my-tickets"  element={<ProtectedRoute><div>My tickets (todo)</div></ProtectedRoute>} />
      <Route path="/profile"     element={<ProtectedRoute><div>Profile (todo)</div></ProtectedRoute>} />

      {/* ── Organizer ────────────────────────────────────────────────────── */}
      <Route
        path="/organizer/dashboard"
        element={
          <ProtectedRoute>
            <RoleRoute allowed={[ROLES.ORGANIZER, ROLES.ADMIN, ROLES.DEV]}>
              <div>Organizer dashboard (todo)</div>
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/organizer/events"
        element={
          <ProtectedRoute>
            <RoleRoute allowed={[ROLES.ORGANIZER, ROLES.ADMIN, ROLES.DEV]}>
              <div>Manage events (todo)</div>
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/organizer/events/create"
        element={
          <ProtectedRoute>
            <RoleRoute allowed={[ROLES.ORGANIZER, ROLES.ADMIN, ROLES.DEV]}>
              <div>Create event (todo)</div>
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/organizer/events/:id/edit"
        element={
          <ProtectedRoute>
            <RoleRoute allowed={[ROLES.ORGANIZER, ROLES.ADMIN, ROLES.DEV]}>
              <div>Edit event (todo)</div>
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/organizer/events/:id/bookings"
        element={
          <ProtectedRoute>
            <RoleRoute allowed={[ROLES.ORGANIZER, ROLES.ADMIN, ROLES.DEV]}>
              <div>Event bookings (todo)</div>
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/organizer/events/:id/checkin"
        element={
          <ProtectedRoute>
            <RoleRoute allowed={[ROLES.ORGANIZER, ROLES.ADMIN, ROLES.DEV]}>
              <div>Check-in (todo)</div>
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      {/* ── Admin / Dev ──────────────────────────────────────────────────── */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <RoleRoute allowed={[ROLES.ADMIN, ROLES.DEV]}>
              <div>Admin dashboard (todo)</div>
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute>
            <RoleRoute allowed={[ROLES.ADMIN, ROLES.DEV]}>
              <div>Users (todo)</div>
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/events"
        element={
          <ProtectedRoute>
            <RoleRoute allowed={[ROLES.ADMIN, ROLES.DEV]}>
              <div>Admin events (todo)</div>
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      {/* ── Payment callback ─────────────────────────────────────────────── */}
      <Route
        path="/payment/callback"
        element={
          <ProtectedRoute>
            <div>Payment callback (todo)</div>
          </ProtectedRoute>
        }
      />

      {/* ── 404 ──────────────────────────────────────────────────────────── */}
      <Route path="*" element={<div>404 (todo)</div>} />

    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <NavigationLoader />
      <TopBarLoader />
      <CenterLoader />
      <AppRoutes />
    </BrowserRouter>
  );
}