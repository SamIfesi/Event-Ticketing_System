import { Link } from 'react-router-dom'
import logo from '/assets/icons/logo.svg'

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
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
    </footer>
  );
}
