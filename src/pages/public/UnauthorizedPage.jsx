import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldOff, LogIn } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { getDefaultPath } from '../../utils/roleGuard';
import { ROLES } from '../../config/constants';

export default function UnauthorizedPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const isLoggedIn = Boolean(token);

  const containerRef = useRef(null);
  const isAdmin = user?.role === ROLES.ADMIN || user?.role === ROLES.DEV;
  const isOrganizer = user?.role === ROLES.ORGANIZER;

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
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-error/5 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-error/5 blur-3xl" />
      </div>

      <div
        ref={containerRef}
        className="relative flex flex-col items-center text-center max-w-md w-full"
      >
        {/* ── Icon block ───────────────────────────────────────────────────── */}
        <div className="relative mb-8">
          {/* Outer ring */}
          <div className="w-24 h-24 rounded-full border-2 border-dashed border-error/30 flex items-center justify-center">
            {/* Inner circle */}
            <div className="w-16 h-16 rounded-full bg-error/10 border border-error/20 flex items-center justify-center">
              <ShieldOff
                size={28}
                strokeWidth={1.75}
                className="text-error"
              />
            </div>
          </div>

          {/* Animated pulse ring */}
          <div
            className="absolute inset-0 rounded-full border border-error/20"
            style={{ animation: 'ping 2s cubic-bezier(0,0,0.2,1) infinite' }}
          />
        </div>

        {/* ── Error code pill ───────────────────────────────────────────────── */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-error/10 border border-error/20 rounded-full mb-5">
          <span className="text-xs font-bold text-error tracking-widest uppercase">
            403 — Access Denied
          </span>
        </div>

        {/* ── Copy ─────────────────────────────────────────────────────────── */}
        <h1 className="text-2xl sm:text-3xl font-black text-primary tracking-tight mb-3">
          You don't have access
        </h1>
        <p className="text-sm text-secondary leading-relaxed mb-10 max-w-xs">
          {isLoggedIn
            ? "Your account doesn't have permission to view this page. If you think this is a mistake, contact support."
            : 'You need to sign in before you can access this page.'}
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

          {isLoggedIn ? (
            <Link
              to={isAdmin || isOrganizer ? getDefaultPath(user?.role) : '/dashboard'}
              className="flex items-center justify-center gap-2 h-12 px-6 bg-accent hover:bg-accent-hover text-white text-sm font-semibold rounded-btn transition-colors duration-180 active:scale-95 touch-manipulation w-full sm:w-40"
            >
              My Dashboard
            </Link>
          ) : (
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 h-12 px-6 bg-accent hover:bg-accent-hover text-white text-sm font-semibold rounded-btn transition-colors duration-180 active:scale-95 touch-manipulation w-full sm:w-40"
            >
              <LogIn size={16} strokeWidth={2.5} />
              Sign in
            </Link>
          )}
        </div>

        {/* ── Role hint ─────────────────────────────────────────────────────── */}
        {isLoggedIn && (
          <div className="mt-8 pt-8 border-t border-border w-full">
            <p className="text-xs text-muted leading-relaxed">
              Signed in as{' '}
              <span className="font-semibold text-secondary">{user?.name}</span>
              {' · '}
              <span className="capitalize">{user?.role}</span> account
            </p>
          </div>
        )}
      </div>

      {/* Ping keyframe — inlined since we can't edit index.css here */}
      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(1.6); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
