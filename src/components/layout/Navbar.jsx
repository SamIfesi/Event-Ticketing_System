import { Link, useLocation } from 'react-router-dom';
import { Menu, ChevronDown, LogOut, Monitor } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useAuth } from '../../hooks/useAuth';
import { useThemeStore } from '../../store/themeStore';
import { ROLES, NAV_GROUPS, PROFILE_MENU } from '../../config/constants';
import Dropdown from '../ui/Dropdown';
import logo from '/assets/icons/logo.svg';

// ─── helpers ────────────────────────────────────────────────────────────────

function isRoleAllowed(group, role, isLoggedIn) {
  if (group.requireAuth && !isLoggedIn) return false;
  if (!group.roles || group.roles.length === 0) return true; // everyone
  return group.roles.includes(role);
}

// ─── Nav group dropdown panel ────────────────────────────────────────────────

function NavGroupPanel({ items, close }) {
  const location = useLocation();

  function isActive(to) {
    return location.pathname === to || location.pathname.startsWith(to + '/');
  }

  return (
    <div className="min-w-55 bg-card border border-border rounded-card shadow-xl overflow-hidden">
      {items.map(({ to, icon: Icon, label, description }) => (
        <Link
          key={to}
          to={to}
          onClick={close}
          role="menuitem"
          className={`flex items-start gap-3 px-4 py-3 transition-colors duration-150 group ${
            isActive(to) ? 'bg-accent-text' : 'hover:bg-border'
          }`}
        >
          <div
            className={`mt-0.5 w-7 h-7 rounded-md flex items-center justify-center shrink-0 transition-colors ${
              isActive(to)
                ? 'bg-accent/20'
                : 'bg-main-bg group-hover:bg-accent/10'
            }`}
          >
            <Icon
              size={14}
              strokeWidth={isActive(to) ? 2.5 : 2}
              className={
                isActive(to)
                  ? 'text-accent'
                  : 'text-muted group-hover:text-accent'
              }
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span
              className={`text-sm font-medium leading-snug ${
                isActive(to) ? 'text-accent' : 'text-primary'
              }`}
            >
              {label}
            </span>
            {description && (
              <span className="text-[11px] text-muted leading-tight mt-0.5 truncate">
                {description}
              </span>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}

// ─── Single nav group tab (trigger + dropdown) ───────────────────────────────

function NavGroupTab({ group, role, isLoggedIn }) {
  const location = useLocation();

  // Highlight the tab if any of its items is active
  const isAnyActive = group.items.some(
    (item) =>
      location.pathname === item.to ||
      location.pathname.startsWith(item.to + '/')
  );

  return (
    <Dropdown
      hoverOpen
      align="left"
      panel={({ close }) => <NavGroupPanel items={group.items} close={close} />}
    >
      <button
        className={`flex items-center gap-1 px-1 py-1 text-sm font-medium transition-colors duration-150 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-accent/50 ${
          isAnyActive ? 'text-accent' : 'text-secondary hover:text-primary'
        }`}
        aria-haspopup="menu"
      >
        {group.label}
        <ChevronDown size={13} strokeWidth={2} className="mt-px opacity-60" />
      </button>
    </Dropdown>
  );
}

// ─── Profile dropdown panel ──────────────────────────────────────────────────

function ProfilePanel({ user, close, logout }) {
  return (
    <div className="min-w-50 bg-card border border-border rounded-card shadow-xl overflow-hidden">
      {/* User info header */}
      <div className="px-4 py-3 border-b border-border">
        <p className="text-sm font-semibold text-primary truncate">
          {user?.name}
        </p>
        <p className="text-xs text-muted truncate">{user?.email}</p>
      </div>

      {/* Profile links */}
      {PROFILE_MENU.map(({ to, icon: Icon, label }) => (
        <Link
          key={to}
          to={to}
          onClick={close}
          role="menuitem"
          className="flex items-center gap-3 px-4 py-2.5 text-sm text-secondary hover:text-primary hover:bg-border transition-colors duration-150"
        >
          <Icon size={15} strokeWidth={2} className="shrink-0 text-muted" />
          {label}
        </Link>
      ))}

      <div className="border-t border-border" />

      {/* Sign out */}
      <button
        onClick={async () => {
          close();
          await logout();
        }}
        role="menuitem"
        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-error hover:bg-error/10 transition-colors duration-150"
      >
        <LogOut size={15} strokeWidth={2} className="shrink-0" />
        Sign out
      </button>
    </div>
  );
}

// ─── Theme toggle button ─────────────────────────────────────────────────────

function ThemeToggleButton({ onNavigate }) {
  const { resolvedTheme, toggleTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';

  return (
    <div className="flex items-center gap-0.5">
      <button
        onClick={toggleTheme}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        className="w-9 h-9 flex items-center justify-center rounded-btn text-muted hover:text-primary hover:bg-border transition-colors duration-150"
        title={isDark ? 'Light mode' : 'Dark mode'}
      >
        {/* Sun / Moon using inline SVG to avoid extra imports */}
        {isDark ? (
          // Sun icon
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
          </svg>
        ) : (
          // Moon icon
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        )}
      </button>

      {/* Link to full theme page */}
      <Link
        to="/profile/theme"
        onClick={onNavigate}
        aria-label="Theme settings"
        title="More theme options"
        className="w-9 h-9 flex items-center justify-center rounded-btn text-muted hover:text-primary hover:bg-border transition-colors duration-150"
      >
        <Monitor size={15} strokeWidth={2} />
      </Link>
    </div>
  );
}

// ─── Avatar trigger ──────────────────────────────────────────────────────────

function AvatarTrigger({ user }) {
  return (
    <button
      aria-haspopup="menu"
      className="flex items-center gap-2 px-2 py-1 rounded-btn hover:bg-border transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
    >
      <div className="w-8 h-8 rounded-full bg-accent-text flex items-center justify-center shrink-0">
        <span className="font-bold text-accent text-sm">
          {user?.name?.charAt(0)?.toUpperCase()}
        </span>
      </div>
      <span className="hidden sm:block text-sm font-medium text-primary max-w-[100px] truncate">
        {user?.name?.split(' ')[0]}
      </span>
      <ChevronDown
        size={13}
        strokeWidth={2}
        className="text-muted hidden sm:block"
      />
    </button>
  );
}

// ─── Main Navbar ─────────────────────────────────────────────────────────────

export default function Navbar({ onMenuClick }) {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const isLoggedIn = Boolean(token);
  const role = user?.role ?? null;

  const { logout } = useAuth();

  // Determine which groups this user can see
  const visibleGroups = NAV_GROUPS.filter((g) =>
    isRoleAllowed(g, role, isLoggedIn)
  );

  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        {/* ── Logo ── */}
        <Link to="/home" className="flex items-center gap-2 shrink-0">
          <img src={logo} alt="Ticketer" className="h-6" />
        </Link>

        {/* ── Desktop grouped nav ── */}
        <nav
          className="hidden md:flex items-center gap-1"
          aria-label="Primary navigation"
        >
          {visibleGroups.map((group) => (
            <NavGroupTab
              key={group.id}
              group={group}
              role={role}
              isLoggedIn={isLoggedIn}
            />
          ))}
        </nav>

        {/* ── Right-side controls ── */}
        <div className="flex items-center gap-1 shrink-0">
          {isLoggedIn ? (
            <>
              {/* Theme toggle (desktop) */}
              <div className="hidden md:flex items-center">
                <ThemeToggleButton />
              </div>

              {/* Vertical divider */}
              <div className="hidden md:block w-px h-5 bg-border mx-1" />

              {/* Profile avatar + dropdown */}
              <Dropdown
                align="right"
                panel={({ close }) => (
                  <ProfilePanel user={user} close={close} logout={logout} />
                )}
              >
                <AvatarTrigger user={user} />
              </Dropdown>

              {/* Hamburger — mobile only */}
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

              {/* Hamburger — mobile guests */}
              <button
                onClick={onMenuClick}
                aria-label="Open menu"
                className="md:hidden w-10 h-10 flex items-center justify-center rounded-btn text-secondary hover:text-primary hover:bg-border transition-colors duration-150 touch-manipulation"
              >
                <Menu size={20} strokeWidth={2} />
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
