import { useEffect, useRef } from 'react';
import { useLoaderStore } from '../../store/loaderStore';

const EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';

export default function TopBarLoader() {
  const active = useLoaderStore((state) => state.topBarCount > 0);
  const fillRef = useRef(null);
  const rafRef = useRef(null);
  const pctRef = useRef(0);

  function setWidth(pct, transition = 'none') {
    if (!fillRef.current) return;
    fillRef.current.style.transition = transition;
    fillRef.current.style.width = `${pct}%`;
    pctRef.current = pct;
  }

  function animateTo(target, durationMs, onDone) {
    const start = performance.now();
    const fromPct = pctRef.current;

    function step(now) {
      const t = Math.min((now - start) / durationMs, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      const pct = fromPct + (target - fromPct) * ease;
      setWidth(pct);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        onDone?.();
      }
    }
    rafRef.current = requestAnimationFrame(step);
  }

  useEffect(() => {
    if (active) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      setWidth(0);

      requestAnimationFrame(() => {
        setWidth(30, `width 20s ${EASING}`);
        setTimeout(() => animateTo(85, 700), 140);
      });
    } else {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      setWidth(100, `width 180s ${EASING}`);

      setTimeout(() => {
        if (!fillRef.current) return;
        fillRef.current.style.transition = 'opacity 220ms ease';
        fillRef.current.style.opacity = '0';

        setTimeout(() => {
          setWidth(0);
          if (fillRef.current) fillRef.current.style.opacity = '1';
        }, 240);
      }, 180);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [active]);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none"
    >
      <div className="w-full h-[5px] bg-transparent">
        <div
          ref={fillRef}
          className="relative h-full w-0 bg-accent will-change-[width]"
        >
          {active && (
            <span className="absolute inset-y-0 right-0 w-20 animate-pulse bg-gradient-to-r from-transport to-white/35"></span>
          )}
        </div>
      </div>
    </div>
  );
}
