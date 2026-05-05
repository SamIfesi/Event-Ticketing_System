import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { getDefaultPath } from './utils/roleGuard';
import { ROLES } from './config/constants';

import ProtectedRoute from './components/auth/ProtectedRoute';
import RoleRoute from './components/auth/RoleRoute';

// auth Pages
import LoginPage from './pages/public/LoginPage.jsx';
import RegisterPage from './pages/public/RegisterPage';
import VerifyEmailPage from './pages/public/VerifyEmailPage';
import ForgotPasswordPage from './pages/public/ForgotPasswordPage';
import ResetPassworPage from './pages/public/ResetPasswordPage';
import VerifyOtpPage from './pages/public/VerifyOtpPage';
import OnboardingPage from './pages/public/OnboardingPage.jsx';

// ── Page imports ──────────────────────────────────────────────────────────────
// public
import HomePage from './pages/public/HomePage';
import EventsPage from './pages/public/EventsPage';
import EventDetailPage from './pages/public/EventDetailPage';
import UnauthorizedPage from './pages/public/UnauthorizedPage';
import NotFoundPage from './pages/public/NotFoundPage';

// attendee
import AttendeeDashboard from './pages/attendee/AttendeeDashboard';
import MyBookingsPage from './pages/attendee/MyBookingsPage';
import BecomeOrganizerPage from './pages/attendee/BecomeOrganizerPage';
import MyTicketsPage from './pages/attendee/MyTicketsPage';
import ProfilePage from './pages/profile/ProfilePage';
import EditProfilePage from './pages/profile/EditProfilePage';
import ChangePasswordPage from './pages/profile/ChangePasswordPage';
import ChangeEmailPage from './pages/profile/ChangeEmailPage';
import ThemePage from './pages/public/ThemePage';

// organizer
// import OrganizerDashboard  from './pages/organizer/OrganizerDashboard';
// import ManageEventsPage    from './pages/organizer/ManageEventsPage';
// import CreateEventPage     from './pages/organizer/CreateEventPage';
// import EditEventPage       from './pages/organizer/EditEventPage';
// import EventBookingsPage   from './pages/organizer/EventBookingsPage';
// import CheckinPage         from './pages/organizer/CheckinPage';

// admin
import AdminDashboard    from './pages/admin/AdminDashboard';
import UsersPage         from './pages/admin/UsersPage';
// import AdminEventsPage   from './pages/admin/AdminEventsPage';

// payment
// import PaymentCallbackPage from './pages/payment/PaymentCallbackPage';

function RootRedirect() {
  const token = useAuthStore((state) => state.token);
  const isVerified = useAuthStore((state) => state.isVerified);
  const user = useAuthStore((state) => state.user);
  const hasSeenOnboarding = localStorage.getItem('onboarding_seen');

  if (!token) {
    return hasSeenOnboarding ? (
      <Navigate to="/home" replace />
    ) : (
      <Navigate to="/onboarding" replace />
    );
  }
  if (!isVerified) return <Navigate to="/verify-email" replace />;
  return <Navigate to={getDefaultPath(user?.role)} replace />;
}

function GuestOnly({ children }) {
  const token = useAuthStore((state) => state.token);
  const isVerified = useAuthStore((state) => state.isVerified);
  const user = useAuthStore((state) => state.user);

  if (!token) return children;
  if (!isVerified) return <Navigate to="/verify-email" replace />;
  return <Navigate to={getDefaultPath(user?.role)} replace />;
}

// AppRoutes
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      // Onboarding Pages
      <Route
        path="/onboarding"
        element={
          <GuestOnly>
            <OnboardingPage />
          </GuestOnly>
        }
      />
      {/* Public */}
      <Route path="/home" element={<HomePage />} />
      <Route path="/events" element={<EventsPage />} />
      <Route path="/events/:id" element={<EventDetailPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/404" element={<NotFoundPage />} />
      {/* Auth - guest only (logged-in users are redirected away) */}
      <Route
        path="/login"
        element={
          <GuestOnly>
            <LoginPage />
          </GuestOnly>
        }
      />
      <Route
        path="/register"
        element={
          <GuestOnly>
            <RegisterPage />
          </GuestOnly>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <GuestOnly>
            <ForgotPasswordPage />
          </GuestOnly>
        }
      />
      <Route
        path="/verify-otp"
        element={
          <GuestOnly>
            <VerifyOtpPage />
          </GuestOnly>
        }
      />
      <Route
        path="/reset-password"
        element={
          <GuestOnly>
            <ResetPassworPage />
          </GuestOnly>
        }
      />
      {/* verify email - needs token but Not verified */}
      <Route
        path="/verify-email"
        element={
          <ProtectedRoute requireVerified={false}>
            <VerifyEmailPage />
          </ProtectedRoute>
        }
      />
      {/* Attendees */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AttendeeDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-bookings"
        element={
          <ProtectedRoute>
            <MyBookingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/become-organizer"
        element={
          <ProtectedRoute>
            <BecomeOrganizerPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-tickets"
        element={
          <ProtectedRoute>
            <MyTicketsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/edit"
        element={
          <ProtectedRoute>
            <EditProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/change-password"
        element={
          <ProtectedRoute>
            <ChangePasswordPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/change-email"
        element={
          <ProtectedRoute>
            <ChangeEmailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/theme"
        element={
          <ProtectedRoute>
            <ThemePage />
          </ProtectedRoute>
        }
      />
      {/* Organizers */}
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
      {/* admin */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <RoleRoute allowed={[ROLES.ADMIN, ROLES.DEV]}>
            <AdminDashboard />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute>
            <RoleRoute allowed={[ROLES.ADMIN, ROLES.DEV]}>
              <UsersPage/>
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
      {/* Payment */}
      <Route
        path="/payment/callback"
        element={
          <ProtectedRoute>
            <div>Payment callback (todo)</div>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<div>404 (todo)</div>} />
    </Routes>
  );
}
