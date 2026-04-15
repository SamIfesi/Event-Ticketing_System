import { useLoaderStore } from '../../store/loaderStore'

export default function CenterLoader() {
  const active = useLoaderStore((s) => s.centerCount > 0)
  if (!active) return null

  // Drop your existing 3-bar loader JSX here
  return <div className="your-existing-3-bar-loader-classes" />
}