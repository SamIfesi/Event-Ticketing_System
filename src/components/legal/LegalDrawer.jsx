// src/components/legal/LegalDrawer.jsx
//
// Slide-out drawer listing all legal documents — mirrors the GitBook-style
// mobile nav from docs.tix.africa, restyled with Ticketer's Sidebar pattern
// (same backdrop, translate-x transition, and touch-target sizing as
// src/components/layout/Sidebar.jsx).
//
// Usage — trigger from anywhere (e.g. Footer "Legal" link, or a floating
// help button):
//
//   const [legalOpen, setLegalOpen] = useState(false);
//   <button onClick={() => setLegalOpen(true)}>Legal</button>
//   <LegalDrawer isOpen={legalOpen} onClose={() => setLegalOpen(false)} />

import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  X,
  Handshake,
  Lock,
  CreditCard,
  ChevronRight,
  ScrollText,
} from 'lucide-react';

const LEGAL_LINKS = [
  { to: '/terms', icon: Handshake, label: 'Terms of Use', flag: '🇳🇬' },
  { to: '/privacy', icon: Lock, label: 'Privacy Policy', flag: '🇳🇬' },
  {
    to: '/refund-policy',
    icon: CreditCard,
    label: 'Refund Policy',
    flag: '🇳🇬',
  },
];

export default function LegalDrawer({ isOpen, onClose }) {
  const location = useLocation();

  // Close on route change
  useEffect(() => {
    onClose?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Escape key + scroll lock
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose?.();
    }
    if (isOpen) document.addEventListener('keydown', onKey);
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  function isActive(path) {
    return location.pathname === path;
  }

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-9980 backdrop-blur-[1.5px] transition-opacity duration-300 ${
          isOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Legal documentation"
        className={`fixed top-0 right-0 h-full z-9981 w-72 max-w-[85vw] bg-card border-l border-border flex flex-col shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            <ScrollText size={17} className="text-accent" strokeWidth={1.75} />
            <span className="text-sm font-bold text-primary">
              Legal Documentation
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-10 h-10 flex items-center justify-center rounded-btn text-muted hover:text-primary hover:bg-border transition-colors duration-150 touch-manipulation"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Links */}
        <nav className="flex-1 overflow-y-auto px-2 py-3">
          <p className="px-4 pb-1 text-[11px] font-bold text-muted uppercase tracking-widest select-none">
            Legal Documentation
          </p>
          {LEGAL_LINKS.map(({ to, icon: Icon, label, flag }) => {
            const active = isActive(to);
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-4 py-3 rounded-btn text-sm font-medium transition-all duration-150 group touch-manipulation ${
                  active
                    ? 'bg-accent-text text-accent'
                    : 'text-secondary hover:text-primary hover:bg-border'
                }`}
              >
                <Icon
                  size={17}
                  strokeWidth={active ? 2.5 : 2}
                  className={`shrink-0 ${active ? 'text-accent' : 'text-muted group-hover:text-primary'}`}
                />
                <span className="flex-1">
                  {label} <span className="ml-0.5">{flag}</span>
                </span>
                {active && (
                  <ChevronRight size={14} className="text-accent/60" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-border shrink-0">
          <p className="text-center text-xs text-muted">
            © {new Date().getFullYear()} Ticketer.
          </p>
        </div>
      </aside>
    </>
  );
}
