import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import logo from '/assets/icons/logo.svg';

// variant: 'guest' | 'auth' | 'minimal'
// If omitted, falls back to the old auto-detect-by-auth-state behavior
// (guest footer for logged-out users, auth footer for logged-in users).
//
// 'minimal' is the new 3rd design — same logo/copyright styling as the
// other two, just with the nav links stripped out. Use this on pages
// that shouldn't show a full link list but still want a footer.
export default function Footer({ variant }) {
  const token = useAuthStore((state) => state.token);
  const isLoggedIn = Boolean(token);

  const resolvedVariant = variant ?? (isLoggedIn ? 'auth' : 'guest');

  if (resolvedVariant === 'minimal') {
    return (
      <footer className="border-t border-border bg-card">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="flex flex-col items-center gap-2">
            <img src={logo} alt="Ticketer logo" className="h-5" />
                     </div>
          <div className="mt-4 text-center">
            <p className="text-xs text-muted">
              © {new Date().getFullYear()} Ticketer.
            </p>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t border-border bg-card">
      {resolvedVariant === 'guest' ? (
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-center sm:items-start gap-2">
              <img src={logo} alt="Ticketer logo" className="h-5" />
              <p className="text-xs text-muted">
                Nigeria's event ticketing platform
              </p>
            </div>
            <nav className="flex items-center gap-6 flex-wrap justify-center">
              {[
                { label: 'Browse Events', to: '/events' },
                { label: 'Sign In', to: '/login' },
                { label: 'Register', to: '/register' },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-xs text-secondary hover:text-primary transition-colors duration-150"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-xs text-muted">
              © {new Date().getFullYear()} Ticketer.
            </p>
          </div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-center sm:items-start gap-2">
              <img src={logo} alt="Ticketer logo" className="h-5" />
              <p className="text-xs text-muted">
                Nigeria's event ticketing platform
              </p>
            </div>
            <nav className="flex items-center gap-6 flex-wrap justify-center">
              {[
                { label: 'Home', to: '/home' },
                { label: 'Browse Events', to: '/events' },
                { label: 'My Bookings', to: '/my-bookings' },
                { label: 'Profile', to: '/profile' },
                { label: 'Dashboard', to: '/dashboard' },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-xs text-secondary hover:text-primary transition-colors duration-150"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-xs text-muted">
              © {new Date().getFullYear()} Ticketer.
            </p>
          </div>
        </div>
      )}
    </footer>
  );
}
