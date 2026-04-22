import { useLoaderStore } from '../../store/loaderStore';

export default function CenterLoader() {
  const active = useLoaderStore((s) => s.centerCount > 0);
  if (!active) return null;

  return (
    <div
      role="status"
      aria-label="Loading"
      className="fixed inset z-[9998] flex items-center justify-center bg-black/[.04] pointer-events-none"
    >
      <div className="flex items-end gap-[5px] h-8">
        {[0, 150, 300].map((delay) => (
          <span
            key={delay}
            className="block w-[5px] rounded-[3px] bg-[var(--accent)]"
            style={{
              animation: `_cb_bounce 0.9s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms infinite`,
            }}
          ></span>
        ))}
      </div>
      <style>{`
      @keyframes _cb_bounce { 
      0%, 100% {height: 10px; opacity: 0.4;} 
      50%      { height: 32px; opacity: 1; } 
      }
      `}</style>
    </div>
  );
}
