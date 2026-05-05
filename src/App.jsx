import { BrowserRouter, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useLoaderStore } from './store/loaderStore';

import TopBarLoader from './components/loaders/TopBarLoader';
import CenterLoader from './components/loaders/CenterLoader';
import ToastContainer from './components/ui/ToastContainer';
import AppRoutes from './Routes';

function NavigationLoader() {
  const location = useLocation();
  const startTopBar = useLoaderStore((state) => state.startTopBar);
  const stopTopBar = useLoaderStore((state) => state.stopTopBar);

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

export default function App() {
  return (
    <BrowserRouter>
      <NavigationLoader />
      <TopBarLoader />
      <CenterLoader />
      <ToastContainer />
      <AppRoutes />
    </BrowserRouter>
  );
}
