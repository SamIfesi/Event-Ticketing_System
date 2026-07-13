// src/pages/public/LegalPage.jsx
//
// Legal hub — central landing page linking out to all of Ticketer's legal
// documents. Mirrors the "Welcome Page" pattern used by docs.tix.africa,
// restyled with Ticketer's own design tokens.
//
// Route: /legal  (add alongside /terms and /privacy in Routes.jsx, outside
// ProtectedRoute/GuestOnly — same treatment as those two pages)

import { Link } from 'react-router-dom';
import { useState } from 'react';
import {
  Handshake,
  Lock,
  CreditCard,
  ChevronRight,
  ScrollText,
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Footer from '../../components/layout/Footer';

const LEGAL_DOCS = [
  {
    to: '/terms',
    icon: Handshake,
    color: '#2563eb',
    title: 'Terms of Use',
    description:
      'The rules for using Ticketer — booking tickets, hosting events, and your rights and responsibilities on the platform.',
  },
  {
    to: '/privacy',
    icon: Lock,
    color: '#8b5cf6',
    title: 'Privacy Policy',
    description:
      'What data we collect, how we use it, and how it is shared with processors like Paystack, Cloudinary, and Google.',
  },
  {
    to: '/refund-policy',
    icon: CreditCard,
    color: '#f59e0b',
    title: 'Refund Policy',
    description:
      'When and how refunds are issued — for cancelled events, postponements, and payment disputes.',
  },
];

function LegalDocCard({ to, icon: Icon, color, title, description }) {
  return (
    <Link
      to={to}
      className="group flex items-start gap-4 p-5 bg-card border border-border rounded-card hover:border-accent/40 hover:shadow-md transition-all duration-200 active:scale-[.99] touch-manipulation"
    >
      <div
        className="w-11 h-11 rounded-btn flex items-center justify-center shrink-0"
        style={{ background: `${color}18` }}
      >
        <Icon size={20} strokeWidth={1.75} style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-bold text-primary leading-snug">
          {title}
        </h3>
        <p className="text-sm text-secondary mt-1 leading-relaxed">
          {description}
        </p>
      </div>
      <ChevronRight
        size={18}
        className="text-muted group-hover:text-accent group-hover:translate-x-0.5 transition-all duration-200 shrink-0 mt-1"
      />
    </Link>
  );
}

export default function LegalPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-main-bg">
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-12">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-14 h-14 rounded-card bg-accent-text border border-accent-border flex items-center justify-center mb-4">
            <ScrollText size={24} strokeWidth={1.75} className="text-accent" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-primary tracking-tight">
            Legal Documentation
          </h1>
          <p className="text-sm text-secondary mt-2 max-w-md leading-relaxed">
            You'll find all of Ticketer's legal documents here. If you're using
            our website or app, these documents apply to you — please read them
            carefully.
          </p>
        </div>

        {/* Doc cards */}
        <div className="flex flex-col gap-4">
          {LEGAL_DOCS.map((doc) => (
            <LegalDocCard key={doc.to} {...doc} />
          ))}
        </div>

        {/* Footnote */}
        <p className="text-center text-xs text-muted mt-10">
          Questions about any of these documents? Reach us at{' '}
          <a
            href="mailto:ekesamrose@gmail.com"
            className="text-accent font-medium hover:text-accent-hover transition-colors"
          >
            ekesamrose@gmail.com
          </a>
        </p>
      </main>

      <Footer variant="minimal" />
    </div>
  );
}
