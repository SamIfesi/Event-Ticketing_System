// src/pages/public/RefundPolicyPage.jsx
//
// Refund Policy — matches the layout conventions of TermsPage.jsx and
// PrivacyPolicyPage.jsx: Navbar/Sidebar/Footer shell, sticky desktop table
// of contents, scroll-anchored sections, mobile-collapsed TOC.
//
// Route: /refund-policy (add outside ProtectedRoute/GuestOnly, same as
// /terms and /privacy — see SETUP_INSTRUCTIONS.md)
//
// TODO: confirm hold-period days and refund processing window with the
// business/finance team once formal registration is finalized — the figures
// below (7-day hold, 3-5 business day refund window) reflect current
// PayoutService / BookingsService behavior, not a legally reviewed SLA.

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CreditCard,
  ChevronRight,
  Ticket,
  XCircle,
  CalendarClock,
  ShieldAlert,
  Banknote,
  Mail,
  List,
  X,
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Footer from '../../components/layout/Footer';

const SUPPORT_EMAIL = 'ekesamrose@gmail.com';

const SECTIONS = [
  { id: 'overview', label: 'Overview', icon: List },
  { id: 'free-tickets', label: 'Free Tickets', icon: Ticket },
  { id: 'paid-tickets', label: 'Paid Ticket Purchases', icon: CreditCard },
  { id: 'cancelled-events', label: 'Cancelled Events', icon: XCircle },
  {
    id: 'postponed-events',
    label: 'Postponed or Rescheduled Events',
    icon: CalendarClock,
  },
  {
    id: 'disputes',
    label: 'Payment Disputes & Chargebacks',
    icon: ShieldAlert,
  },
  { id: 'processing', label: 'Refund Processing & Timing', icon: Banknote },
  { id: 'contact', label: 'Contact Us', icon: Mail },
];

// ── TOC (shared between desktop sidebar and mobile sheet) ──────
function TocList({ activeId, onNavigate }) {
  return (
    <nav className="flex flex-col gap-0.5">
      {SECTIONS.map(({ id, label, icon: Icon }) => (
        <a
          key={id}
          href={`#${id}`}
          onClick={() => onNavigate?.(id)}
          className={`flex items-center gap-2.5 px-3 py-2 rounded-btn text-sm transition-colors duration-150 ${
            activeId === id
              ? 'bg-accent-text text-accent font-semibold'
              : 'text-secondary hover:text-primary hover:bg-border'
          }`}
        >
          <Icon
            size={14}
            strokeWidth={activeId === id ? 2.5 : 2}
            className="shrink-0"
          />
          <span className="leading-snug">{label}</span>
        </a>
      ))}
    </nav>
  );
}

function Section({ id, title, icon: Icon, children }) {
  return (
    <section id={id} className="scroll-mt-24 mb-10">
      <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-border">
        <div className="w-8 h-8 rounded-btn bg-accent-text flex items-center justify-center shrink-0">
          <Icon size={15} className="text-accent" strokeWidth={1.75} />
        </div>
        <h2 className="text-lg font-bold text-primary">{title}</h2>
      </div>
      <div className="flex flex-col gap-3 text-sm text-secondary leading-relaxed">
        {children}
      </div>
    </section>
  );
}

export default function RefundPolicyPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileTocOpen, setMobileTocOpen] = useState(false);
  const [activeId, setActiveId] = useState(SECTIONS[0].id);
  const contentRef = useRef(null);

  // Track which section is in view for TOC highlighting
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '-96px 0px -70% 0px', threshold: 0 }
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-main-bg">
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Page header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex items-center gap-2 text-xs text-secondary mb-3">
            <Link to="/legal" className="hover:text-primary transition-colors">
              Legal
            </Link>
            <ChevronRight size={12} className="text-muted" />
            <span className="text-primary font-medium">Refund Policy</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-card bg-accent-text border border-accent-border flex items-center justify-center shrink-0">
              <CreditCard
                size={20}
                className="text-accent"
                strokeWidth={1.75}
              />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-primary tracking-tight">
                Refund Policy
              </h1>
              <p className="text-xs text-muted mt-0.5">
                Last updated: <span className="text-secondary">July 2026</span>{' '}
                · Applies to purchases made in Nigerian Naira (₦)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile TOC toggle */}
      <div className="lg:hidden sticky top-16 z-40 bg-card border-b border-border">
        <div className="max-w-5xl mx-auto px-6">
          <button
            onClick={() => setMobileTocOpen((v) => !v)}
            className="w-full flex items-center justify-between gap-2 py-3 text-sm font-semibold text-primary"
          >
            <span className="flex items-center gap-2">
              <List size={15} className="text-accent" />
              On this page
            </span>
            <ChevronRight
              size={15}
              className={`text-muted transition-transform duration-200 ${mobileTocOpen ? 'rotate-90' : ''}`}
            />
          </button>
          {mobileTocOpen && (
            <div className="pb-4">
              <TocList
                activeId={activeId}
                onNavigate={() => setMobileTocOpen(false)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="max-w-5xl mx-auto px-6 py-10 w-full flex-1">
        <div className="flex gap-10">
          {/* Desktop sticky TOC */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-24">
              <p className="text-xs font-bold text-muted uppercase tracking-widest mb-3 px-3">
                On this page
              </p>
              <TocList activeId={activeId} />
            </div>
          </aside>

          {/* Content */}
          <div ref={contentRef} className="flex-1 min-w-0">
            <Section id="overview" title="Overview" icon={List}>
              <p>
                This Refund Policy explains when and how refunds are issued for
                tickets purchased on Ticketer. It works alongside our{' '}
                <Link
                  to="/terms"
                  className="text-accent font-medium hover:text-accent-hover"
                >
                  Terms of Use
                </Link>{' '}
                and{' '}
                <Link
                  to="/privacy"
                  className="text-accent font-medium hover:text-accent-hover"
                >
                  Privacy Policy
                </Link>
                . By purchasing a ticket through Ticketer, you agree to the
                terms set out below.
              </p>
              <p>
                Ticketer acts as a platform connecting event organizers with
                attendees. Ticket sales are processed securely through{' '}
                <strong className="text-primary font-semibold">Paystack</strong>
                , and all amounts are charged and refunded in Nigerian Naira
                (₦).
              </p>
            </Section>

            <Section id="free-tickets" title="Free Tickets" icon={Ticket}>
              <p>
                Free tickets (₦0 ticket types) are issued instantly and are not
                eligible for a monetary refund, since no payment was taken. If
                you can no longer attend, you may simply not use the ticket, or
                contact the organizer to release your spot.
              </p>
            </Section>

            <Section
              id="paid-tickets"
              title="Paid Ticket Purchases"
              icon={CreditCard}
            >
              <p>
                <strong className="text-primary font-semibold">
                  All paid ticket sales are final and non-refundable
                </strong>{' '}
                once payment has been confirmed, except in the circumstances
                described in this policy — namely event cancellation,
                postponement without a suitable rescheduled date, or a
                platform/payment error.
              </p>
              <p>
                This reflects standard practice for event ticketing: your
                purchase reserves a specific ticket allocation on behalf of the
                organizer, who plans capacity, staffing, and costs around
                confirmed sales.
              </p>
              <p>
                If you believe you were charged in error — for example, a
                duplicate charge for the same booking, or a technical fault
                during checkout — contact{' '}
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="text-accent font-medium hover:text-accent-hover"
                >
                  {SUPPORT_EMAIL}
                </a>{' '}
                with your booking reference and we'll investigate.
              </p>
            </Section>

            <Section
              id="cancelled-events"
              title="Cancelled Events"
              icon={XCircle}
            >
              <p>
                If an organizer cancels an event, Ticketer automatically
                initiates a full refund to every attendee who paid for a ticket.
                Refunds are processed back to the original payment method via
                Paystack.
              </p>
              <p>
                In this scenario, the platform absorbs any Paystack transaction
                charges — the organizer does not receive a payout for a
                cancelled event, and attendees are not responsible for any
                processing fees.
              </p>
              <p>
                You'll receive an in-app notification and an email once your
                refund has been processed. You can also check the status of any
                refund from{' '}
                <Link
                  to="/my-transactions"
                  className="text-accent font-medium hover:text-accent-hover"
                >
                  Transaction History
                </Link>{' '}
                in your account.
              </p>
            </Section>

            <Section
              id="postponed-events"
              title="Postponed or Rescheduled Events"
              icon={CalendarClock}
            >
              <p>
                If an event is postponed, your existing ticket normally remains
                valid for the new date automatically — no action is needed on
                your part.
              </p>
              <p>
                If you're unable to attend the rescheduled date, contact the
                organizer directly, or reach out to{' '}
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="text-accent font-medium hover:text-accent-hover"
                >
                  {SUPPORT_EMAIL}
                </a>{' '}
                if the organizer is unresponsive. Refund eligibility for
                postponed events is assessed case by case, in coordination with
                the organizer.
              </p>
            </Section>

            <Section
              id="disputes"
              title="Payment Disputes & Chargebacks"
              icon={ShieldAlert}
            >
              <p>
                If you suspect fraudulent activity on your account or believe a
                charge is unauthorized, contact us immediately at{' '}
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="text-accent font-medium hover:text-accent-hover"
                >
                  {SUPPORT_EMAIL}
                </a>{' '}
                before filing a chargeback with your bank — this is usually the
                fastest way to resolve the issue.
              </p>
              <p>
                Organizer bank accounts on Ticketer are verified through
                Paystack before payouts are enabled. If a pattern of
                cancellations or disputes is detected on an organizer's account,
                their payouts may be frozen pending review while we investigate
                on your behalf.
              </p>
            </Section>

            <Section
              id="processing"
              title="Refund Processing & Timing"
              icon={Banknote}
            >
              <p>
                Approved refunds are issued back to the original payment method
                used at checkout. Depending on your bank, refunds typically
                appear within{' '}
                <strong className="text-primary font-semibold">
                  3–5 business days
                </strong>{' '}
                of being processed by Paystack, though this can occasionally
                take longer depending on your card issuer.
              </p>
              <p>
                Organizer payouts for successfully completed events are held for
                a short period after the event ends before being released, which
                allows time for any last-minute disputes to be raised and
                resolved fairly.
              </p>
            </Section>

            <Section id="contact" title="Contact Us" icon={Mail}>
              <p>
                For any questions about a refund, a booking, or this policy,
                reach out to us at{' '}
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="text-accent font-medium hover:text-accent-hover"
                >
                  {SUPPORT_EMAIL}
                </a>
                . Please include your booking reference or transaction ID so we
                can look into it quickly.
              </p>
              {/* TODO: insert formal business name, registration number, and
                  registered address once available — matches the TODO
                  convention used in TermsPage.jsx / PrivacyPolicyPage.jsx */}
            </Section>
          </div>
        </div>
      </div>

      <Footer variant="minimal" />
    </div>
  );
}
