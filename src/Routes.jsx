import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { getDefaultPath } from './utils/roleGuard';
import { ROLES } from './config/constants';

import ProtectedRoute from './components/auth/ProtectedRoute';
import RoleRoute from './components/auth/RoleRoute';

// auth Pages
const LoginPage = lazy(() => import('./pages/public/LoginPage.jsx'));
const RegisterPage = lazy(() => import('./pages/public/RegisterPage'));
const VerifyEmailPage = lazy(() => import('./pages/public/VerifyEmailPage'));
const ForgotPasswordPage = lazy(() => import('./pages/public/ForgotPasswordPage'));
const ResetPassworPage = lazy(() => import('./pages/public/ResetPasswordPage'));
const VerifyOtpPage = lazy(() => import('./pages/public/VerifyOtpPage'));
const OnboardingPage = lazy(() => import('./pages/public/OnboardingPage.jsx'));

// ── Page imports ──────────────────────────────────────────────────────────────
// public
const HomePage = lazy(() => import('./pages/public/HomePage'));
const EventsPage = lazy(() => import('./pages/public/EventsPage'));
const EventDetailPage = lazy(() => import('./pages/public/EventDetailPage'));
const UnauthorizedPage = lazy(() => import('./pages/public/UnauthorizedPage'));
const NotFoundPage = lazy(() => import('./pages/public/NotFoundPage'));
const ThemePage = lazy(() => import('./pages/public/ThemePage'));
const NotificationsPage = lazy(() => import('./pages/public/NotificationsPage'));

// attendee
const AttendeeDashboard = lazy(() => import('./pages/attendee/AttendeeDashboard'));
const MyBookingsPage = lazy(() => import('./pages/attendee/MyBookingsPage'));
const BecomeOrganizerPage = lazy(() => import('./pages/attendee/BecomeOrganizerPage'));
const MyTicketsPage = lazy(() => import('./pages/attendee/MyTicketsPage'));
const MyTransactionsPage = lazy(() => import('./pages/attendee/MyTransactionsPage'));

//profile
const ProfilePage = lazy(() => import('./pages/profile/ProfilePage'));
const EditProfilePage = lazy(() => import('./pages/profile/EditProfilePage'));
const ChangePasswordPage = lazy(() => import('./pages/profile/ChangePasswordPage'));
const ChangeEmailPage = lazy(() => import('./pages/profile/ChangeEmailPage'));
const TicketDetailPage = lazy(() => import('./pages/attendee/TicketDetailPage'));

// organizer
const OrganizerDashboard = lazy(() => import('./pages/organizer/OrganizerDashboard'));
const ManageEventsPage = lazy(() => import('./pages/organizer/ManageEventsPage'));
const CreateEventPage = lazy(() => import('./pages/organizer/CreateEventPage'));
const EditEventPage = lazy(() => import('./pages/organizer/EditEventPage'));
const EventBookingsPage = lazy(() => import('./pages/organizer/EventBookingsPage'));
const CheckinPage = lazy(() => import('./pages/organizer/CheckinPage'));

// admin
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const UsersPage = lazy(() => import('./pages/admin/UsersPage'));
const AdminEventsPage = lazy(() => import('./pages/admin/AdminEventsPage'));
const OrgApplicationsPage = lazy(() => import('./pages/admin/OrgApplicationsPage'));

// payment
const PaymentCallbackPage = lazy(() => import('./pages/payment/PaymentCallbackPage'));
import Spinner from './components/ui/Spinner';

function RootRedirect() {
  const token = useAuthStore((state) => state.token);
  const isVerified = useAuthStore((state) => state.isVerified);
  const user = useAuthStore((state) => state.user);
  const _hasHydrated = useAuthStore((state) => state._hasHydrated);
  const hasSeenOnboarding = localStorage.getItem('onboarding_seen');

  if (!_hasHydrated) return null;

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
    <Suspense
    fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size={35} className='text-accent' />
      </div>
    }
  >
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
        <Route path="/theme" element={<ThemePage />} />
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
          path="/notifications"
          element={
            <ProtectedRoute>
              <NotificationsPage />
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
        {/* Ticket Page */}
        <Route
          path="/my-tickets"
          element={
            <ProtectedRoute>
              <MyTicketsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ticket/:id"
          element={
            <ProtectedRoute>
              <TicketDetailPage />
            </ProtectedRoute>
          }
        />
        {/* Profile pages */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-transactions"
          element={
            <ProtectedRoute>
              <MyTransactionsPage />
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
        {/* Organizers */}
        <Route
          path="/organizer/dashboard"
          element={
            <ProtectedRoute>
              <RoleRoute allowed={[ROLES.ORGANIZER, ROLES.ADMIN, ROLES.DEV]}>
                <OrganizerDashboard />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer/events"
          element={
            <ProtectedRoute>
              <RoleRoute allowed={[ROLES.ORGANIZER, ROLES.ADMIN, ROLES.DEV]}>
                <ManageEventsPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer/create/event"
          element={
            <ProtectedRoute>
              <RoleRoute allowed={[ROLES.ORGANIZER, ROLES.ADMIN, ROLES.DEV]}>
                <CreateEventPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer/events/:id/edit"
          element={
            <ProtectedRoute>
              <RoleRoute allowed={[ROLES.ORGANIZER, ROLES.ADMIN, ROLES.DEV]}>
                <EditEventPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer/events/:id/bookings"
          element={
            <ProtectedRoute>
              <RoleRoute allowed={[ROLES.ORGANIZER, ROLES.ADMIN, ROLES.DEV]}>
                <EventBookingsPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer/events/:id/checkin"
          element={
            <ProtectedRoute>
              <RoleRoute allowed={[ROLES.ORGANIZER, ROLES.ADMIN, ROLES.DEV]}>
                <CheckinPage />
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
                <UsersPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/events"
          element={
            <ProtectedRoute>
              <RoleRoute allowed={[ROLES.ADMIN, ROLES.DEV]}>
                <AdminEventsPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/organizer/applications"
          element={
            <ProtectedRoute>
              <RoleRoute allowed={[ROLES.ADMIN, ROLES.DEV]}>
                <OrgApplicationsPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        {/* Payment */}
        <Route
          path="/payment/callback"
          element={
            <ProtectedRoute>
              <PaymentCallbackPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
