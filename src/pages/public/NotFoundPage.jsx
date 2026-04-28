import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Search } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  // Fade in on mount
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    requestAnimationFrame(() => {
      el.style.transition = 'opacity 500ms ease, transform 500ms ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  }, []);

  return (
    <div className="min-h-screen bg-main-bg flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden">

      {/* ── Ambient blobs ─────────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div ref={containerRef} className="relative flex flex-col items-center text-center max-w-md w-full">

        {/* ── Giant 404 ────────────────────────────────────────────────────── */}
        <div className="relative mb-6 select-none">
          <span
            className="text-[10rem] sm:text-[13rem] font-black leading-none tracking-tighter"
            style={{
              background: 'linear-gradient(135deg, var(--color-border) 0%, var(--color-muted) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            404
          </span>

          {/* Ticket stub overlay — sits on top of the 404 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="relative flex items-center gap-0 rotate-[-8deg] shadow-lg"
              style={{ filter: 'drop-shadow(0 8px 24px rgba(37,99,235,0.18))' }}
            >
              {/* Left part */}
              <div className="bg-accent text-white px-4 py-2 rounded-l-lg">
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">
                  Ticket
                </p>
                <p className="text-sm font-black">VOID</p>
              </div>

              {/* Perforated edge */}
              <div className="w-px self-stretch bg-white/20 border-l-2 border-dashed border-white/40" />

              {/* Right part */}
              <div className="bg-accent/90 text-white px-3 py-2 rounded-r-lg">
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">
                  Seat
                </p>
                <p className="text-sm font-black">---</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Copy ─────────────────────────────────────────────────────────── */}
        <h1 className="text-2xl sm:text-3xl font-black text-primary tracking-tight mb-3">
          Page not found
        </h1>
        <p className="text-sm text-secondary leading-relaxed mb-10 max-w-xs">
          Looks like this ticket leads nowhere. The page you're looking for
          doesn't exist or may have been moved.
        </p>

        {/* ── Actions ───────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 h-12 px-6 bg-card border border-border text-primary text-sm font-semibold rounded-btn hover:border-accent/40 hover:shadow-md transition-all duration-180 active:scale-95 touch-manipulation w-full sm:w-40"
          >
            <ArrowLeft size={16} strokeWidth={2.5} />
            Go back
          </button>

          <Link
            to="/"
            className="flex items-center justify-center gap-2 h-12 px-6 bg-accent hover:bg-accent-hover text-white text-sm font-semibold rounded-btn transition-colors duration-180 active:scale-95 touch-manipulation w-full sm:w-40"
          >
            <Home size={16} strokeWidth={2.5} />
            Home
          </Link>
        </div>

        {/* ── Browse events nudge ───────────────────────────────────────────── */}
        <div className="mt-8 pt-8 border-t border-border w-full flex flex-col items-center gap-3">
          <p className="text-xs text-muted">Looking for something specific?</p>
          <Link
            to="/events"
            className="flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-hover transition-colors duration-150"
          >
            <Search size={14} strokeWidth={2.5} />
            Browse all events
          </Link>
        </div>
      </div>
    </div>
  );
}