import * as reactRouterDom from 'react-router';
import { useEffect } from 'react';
import { useLoaderStore } from './store/loaderStore';
import { useAuthStore } from './store/authStore';
import { getDefaultPath } from './utils/roleGuard';
import { ROLES } from './config/constants';

import TopBarLoader from './components/loaders/TopBarLoader';
import CenterLoader from './components/loaders/CenterLoader';
import ProtectedRoute from './components/auth/ProtectedRoute';
import RoleRoute from './components/auth/RoleRoute';

function NavigationLoader() {
  const location = reactRouterDom.useLocation();
  const startTopBar = useLoaderStore((state) => state.startTopBar);
  const stopTopBar = useLoaderStore((state) => state.stopTopBar);

  useEffect(() => {
    startTopBar();
    const timeout = setTimeout(stopTopBar, 350);
    return () => {
      clearTimeout(timeout);
      stopTopBar();
    };
  }, [location.pathname]);
  return null;
}
function RootRedirect() {
  const token = useAuthStore((state) => state.token);
  const isVerified = useAuthStore((state) => state.isVerified);
  const user = useAuthStore((state) => state.user);

  if (!token) return <reactRouterDom.Navigate to="/login" replace />;
  if (!isVerified) return <reactRouterDom.Navigate to="/verify-email" replace />;
  return <reactRouterDom.Navigate to={getDefaultPath(user.role)} replace />;
}

function GuestOnly({ children }) {
  const token = useAuthStore((state) => state.token);
  const isVerified = useAuthStore((state) => state.isVerified);
  const user = useAuthStore((state) => state.user);
  
  if (!token) return <reactRouterDom.Navigate to="/login" replace />;
  if (!isVerified)
    return <reactRouterDom.Navigate to="/verify-email" replace />;
  return <reactRouterDom.Navigate to={getDefaultPath(user.role)} replace />;
}

function AppShell() {
  return (
    <>
      <NavigationLoader />
      <TopBarLoader />
      <CenterLoader />

      {/* <reactRouterDom.Routes>
        <reactRouterDom.Route index element={<div>Home</div>} />
        <reactRouterDom.Route path="/login" element={<div>Login</div>} />
      </reactRouterDom.Routes> */}
    </>
  );
}

export default function App() {
  return (
    <reactRouterDom.BrowserRouter>
      <AppShell />
    </reactRouterDom.BrowserRouter>
  );
}
