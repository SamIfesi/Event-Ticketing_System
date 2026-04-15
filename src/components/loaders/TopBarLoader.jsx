import { useLoaderStore } from '../../store/loaderStore';

export default function TopBarLoader() {
  const active = useLoaderStore((s) => s.topBarCount > 0);
  if (!active) return null;

  // Drop your existing top bar loader JSX here
  // The component only mounts when topBarCount > 0
  return <div className="your-existing-top-bar-loader-classes" />;
}
