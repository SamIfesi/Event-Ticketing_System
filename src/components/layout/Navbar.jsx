import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import logo from '/assets/icons/logo.svg';

export default function Navbar({ onMenuClick }) {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const isLoggedIn = Boolean(token);
  const location = useLocation();

  function isActive(path) {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  }

  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/home" className="flex items-center gap-2 shrink-0">
          <img src={logo} alt="Ticketer" className="h-6" />
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/events"
            className={`text-sm font-medium transition-colors duration-150 ${
              isActive('/events') ? 'text-accent font-semibold' : 'text-secondary hover:text-primary'
            }`}
          >
            Browse Events
          </Link>
          {isLoggedIn && (
            <>
              <Link
                to="/my-bookings"
                className={`text-sm font-medium transition-colors duration-150 ${
                  isActive('/my-bookings') ? 'text-accent font-semibold' : 'text-secondary hover:text-primary'
                }`}
              >
                My Bookings
              </Link>
              <Link
                to="/my-tickets"
                className={`text-sm font-medium transition-colors duration-150 ${
                  isActive('/my-tickets') ? 'text-accent font-semibold' : 'text-secondary hover:text-primary'
                }`}
              >
                My Tickets
              </Link>
            </>
          )}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2 shrink-0">
          {isLoggedIn ? (
            <>
              <Link
                to="/profile"
                className="flex items-center gap-2 px-2 rounded-btn hover:bg-border transition-colors duration-150"
              >
                <div className="w-9 h-9 rounded-full bg-accent-text flex items-center justify-center">
                  <span className="font-bold text-accent text-sm">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <span className="hidden sm:block text-sm font-medium text-primary max-w-[100px] truncate">
                  {user?.name?.split(' ')[0]}
                </span>
              </Link>

              {/* Hamburger — mobile only, triggers sidebar */}
              <button
                onClick={onMenuClick}
                aria-label="Open menu"
                className="md:hidden w-10 h-10 flex items-center justify-center rounded-btn text-secondary hover:text-primary hover:bg-border transition-colors duration-150 touch-manipulation"
              >
                <Menu size={20} strokeWidth={2} />
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 text-sm font-semibold text-secondary hover:text-primary transition-colors duration-150"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="h-9 px-4 bg-accent hover:bg-accent-hover text-white text-sm font-semibold rounded-btn transition-colors duration-180 flex items-center"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}