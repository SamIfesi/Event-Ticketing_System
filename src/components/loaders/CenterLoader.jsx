import { useLoaderStore } from '../../store/loaderStore'

export default function CenterLoader() {
  const active = useLoaderStore((s) => s.centerCount > 0)
  if (!active) return null


}