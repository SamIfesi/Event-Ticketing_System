import * as reactRouterDom from 'react-router';
import { useEffect } from 'react';
import { useLoaderStore } from './store/loaderStore';
import TopBarLoader from './components/loaders/TopBarLoader';
import CenterLoader from './components/loaders/CenterLoader';

function NavigationLoader() {
  const location = reactRouterDom.useLocation();
  const { startTopBar, stopTopBar } = useLoaderStore();

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
