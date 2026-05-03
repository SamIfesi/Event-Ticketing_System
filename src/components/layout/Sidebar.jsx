// Slide-in sidebar for mobile (and optionally desktop).
// Appears when the user taps the hamburger in Navbar.
//
// Features:
//   - Backdrop overlay closes sidebar on click
//   - Escape key closes sidebar
//   - Role-aware nav links — only shows sections the user can access
//   - Smooth slide-in/out animation
//   - User card at the top
//   - theme toggle at the bottom
//   - Logout at the bottom
//
// Usage:
//   <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  X,
  Home,
  Search,
  Ticket,
  BookOpen,
  LayoutDashboard,
  CalendarDays,
  PlusCircle,
  Users,
  ShieldCheck,
  LogOut,
  User,
  ChevronRight,
  Moon,
  Sun,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../config/constants';
import logo from '/assets/icons/logo.svg';
import { useThemeStore } from '../../store/themeStore';

// ── Nav link item ─────────────────────────────────────────────
function NavItem({ to, icon: Icon, label, onClick, active }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-btn text-sm font-medium transition-all duration-150 group touch-manipulation ${
        active
          ? 'bg-accent-text text-accent'
          : 'text-secondary hover:text-primary hover:bg-border'
      }`}
    >
      <Icon
        size={17}
        strokeWidth={active ? 2.5 : 2}
        className={`shrink-0 transition-colors ${active ? 'text-accent' : 'text-muted group-hover:text-primary'}`}
      />
      <span className="flex-1">{label}</span>
      {active && <ChevronRight size={14} className="text-accent/60" />}
    </Link>
  );
}

// ── Section header ─────────────────────────────────────────────
function SectionLabel({ label }) {
  return (
    <p className="px-4 pt-4 pb-1 text-[11px] font-bold text-muted uppercase tracking-widest select-none">
      {label}
    </p>
  );
}

// ── Divider ────────────────────────────────────────────────────
function Divider() {
  return <div className="my-2 border-t border-border" />;
}

function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button
      onClick={toggleTheme}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-btn text-sm font-medium text-secondary hover:bg-border transition-colors duration-150 mb-2"
    >
      {theme === 'dark' ? (
        <>
          <Sun size={17} className="shrink-0" />
          Light Mode
        </>
      ) : (
        <>
          <Moon size={17} className="shrink-0" />
          Dark Mode
        </>
      )}
    </button>
  );
}

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const isLoggedIn = Boolean(token);
  const role = user?.role;

  const isAdmin = role === ROLES.ADMIN || role === ROLES.DEV;
  const isOrganizer = role === ROLES.ORGANIZER || isAdmin;

  const { logout } = useAuth();

  // Escape key to close
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  // Body scroll lock while open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  function isActive(path) {
    return (
      location.pathname === path || location.pathname.startsWith(path + '/')
    );
  }

  async function handleLogout() {
    onClose();
    await logout();
  }

  return (
    <>
      {/* ── Backdrop ──────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-[9980] backdrop-blur-[1.5px] transition-opacity duration-300 ${
          isOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* ── Drawer ────────────────────────────────────────────── */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`fixed top-0 right-0 h-full z-[9981] w-72 max-w-[85vw] bg-card border-l border-border flex flex-col shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* ── Header ───────────────────────────────────────── */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-border shrink-0">
          <img src={logo} alt="Ticketer" className="h-5" />
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="w-10 h-10 flex items-center justify-center rounded-btn text-muted hover:text-primary hover:bg-border transition-colors duration-150 touch-manipulation"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* ── User card ─────────────────────────────────────── */}
        {isLoggedIn && user && (
          <div className="px-4 py-4 border-b border-border shrink-0">
            <Link
              to="/profile"
              onClick={onClose}
              className="flex items-center gap-3 p-3 rounded-card bg-main-bg hover:bg-border transition-colors duration-150 touch-manipulation group"
            >
              <div className="w-10 h-10 rounded-full bg-accent-text flex items-center justify-center shrink-0">
                <span className="font-bold text-accent text-sm">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-primary truncate">
                  {user.name}
                </p>
                <p className="text-xs text-muted truncate">{user.email}</p>
              </div>
              <ChevronRight
                size={15}
                className="text-muted group-hover:text-primary transition-colors shrink-0"
              />
            </Link>
          </div>
        )}

        {/* ── Scrollable nav ────────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto px-2 py-2">
          {/* General */}
          <SectionLabel label="Discover" />
          <NavItem
            to="/home"
            icon={Home}
            label="Home"
            onClick={onClose}
            active={isActive('/home')}
          />
          <NavItem
            to="/events"
            icon={Search}
            label="Browse Events"
            onClick={onClose}
            active={isActive('/events')}
          />

          {isLoggedIn && (
            <>
              <Divider />
              <SectionLabel label="My Activity" />
              <NavItem
                to="/dashboard"
                icon={LayoutDashboard}
                label="Dashboard"
                onClick={onClose}
                active={isActive('/dashboard')}
              />
              <NavItem
                to="/my-bookings"
                icon={BookOpen}
                label="My Bookings"
                onClick={onClose}
                active={isActive('/my-bookings')}
              />
              <NavItem
                to="/become-organizer"
                icon={BookOpen}
                label="Become Organizer"
                onClick={onClose}
                active={isActive('/become-organizer')}
              />
              <NavItem
                to="/my-tickets"
                icon={Ticket}
                label="My Tickets"
                onClick={onClose}
                active={isActive('/my-tickets')}
              />
              <NavItem
                to="/profile"
                icon={User}
                label="Profile"
                onClick={onClose}
                active={isActive('/profile')}
              />
            </>
          )}

          {isOrganizer && (
            <>
              <Divider />
              <SectionLabel label="Organiser" />
              <NavItem
                to="/organizer/dashboard"
                icon={LayoutDashboard}
                label="Organiser Dashboard"
                onClick={onClose}
                active={isActive('/organizer/dashboard')}
              />
              <NavItem
                to="/organizer/events"
                icon={CalendarDays}
                label="My Events"
                onClick={onClose}
                active={isActive('/organizer/events')}
              />
              <NavItem
                to="/organizer/events/create"
                icon={PlusCircle}
                label="Create Event"
                onClick={onClose}
                active={isActive('/organizer/events/create')}
              />
            </>
          )}

          {isAdmin && (
            <>
              <Divider />
              <SectionLabel label="Admin" />
              <NavItem
                to="/admin/dashboard"
                icon={ShieldCheck}
                label="Admin Dashboard"
                onClick={onClose}
                active={isActive('/admin/dashboard')}
              />
              <NavItem
                to="/admin/users"
                icon={Users}
                label="Manage Users"
                onClick={onClose}
                active={isActive('/admin/users')}
              />
              <NavItem
                to="/admin/events"
                icon={CalendarDays}
                label="All Events"
                onClick={onClose}
                active={isActive('/admin/events')}
              />
            </>
          )}
        </nav>

        {/* ── Footer ────────────────────────────────────────── */}
        <div className="px-2 py-4 border-t border-border shrink-0">
          <ThemeToggle />
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-btn text-sm font-medium text-error hover:bg-[var(--color-error)]/10 transition-colors duration-150 touch-manipulation"
            >
              <LogOut size={17} strokeWidth={2} className="shrink-0" />
              Sign out
            </button>
          ) : (
            <div className="flex flex-col gap-2 px-2">
              <Link
                to="/login"
                onClick={onClose}
                className="flex items-center justify-center h-11 rounded-btn border border-border text-sm font-semibold text-primary hover:bg-border transition-colors duration-150"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                onClick={onClose}
                className="flex items-center justify-center h-11 rounded-btn bg-accent hover:bg-accent-hover text-white text-sm font-semibold transition-colors duration-180"
              >
                Get started
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
