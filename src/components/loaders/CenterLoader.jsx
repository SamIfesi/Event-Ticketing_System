import { useLoaderStore } from '../../store/loaderStore';

export default function CenterLoader() {
  const active = useLoaderStore((s) => s.centerCount > 0);
  if (!active) return null;

  return (
    <div
      role="status"
      aria-label="Loading"
      className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/20  pointer-events-none"
    >
      <div className="flex items-center justify-center gap-[4px] h-10 w-10 bg-accent-text rounded-full p-[.5rem]">
        {[0, 150, 300].map((delay) => (
          <span
            key={delay}
            className="block w-[3.5px] h-6 rounded-[3px] bg-accent"
            style={{
              animation: `postman-bounce 0.9s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms infinite`,
            }}
          ></span>
        ))}
      </div>
    </div>
  );
}
