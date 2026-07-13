// src/pages/public/TermsPage.jsx
//
// Terms of Service — required for Google OAuth consent screen verification.
// NOTE: Placeholders like company registration number / registered address
// should be filled in once the platform is formally registered and a domain
// is live. Search for "TODO" to find remaining placeholders.

import { Link } from 'react-router-dom';
import { ScrollText, ChevronRight } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Footer from '../../components/layout/Footer';
import { useState } from 'react';

const LAST_UPDATED = 'July 2, 2026';
const SUPPORT_EMAIL = 'ekesamrose@gmail.com';

function Section({ id, title, children }) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-lg font-bold text-primary mb-3">{title}</h2>
      <div className="text-sm text-secondary leading-relaxed flex flex-col gap-3">
        {children}
      </div>
    </section>
  );
}

const SECTIONS = [
  { id: 'acceptance', label: '1. Acceptance of Terms' },
  { id: 'eligibility', label: '2. Eligibility' },
  { id: 'accounts', label: '3. Accounts & Sign-in' },
  { id: 'tickets', label: '4. Tickets & Bookings' },
  { id: 'payments', label: '5. Payments' },
  { id: 'organizers', label: '6. Organizers' },
  { id: 'conduct', label: '7. Acceptable Use' },
  { id: 'ip', label: '8. Intellectual Property' },
  { id: 'disclaimers', label: '9. Disclaimers' },
  { id: 'liability', label: '10. Limitation of Liability' },
  { id: 'termination', label: '11. Termination' },
  { id: 'changes', label: '12. Changes to These Terms' },
  { id: 'law', label: '13. Governing Law' },
  { id: 'contact', label: '14. Contact Us' },
];

export default function TermsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-main-bg">
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center gap-2 text-xs text-secondary mb-3">
            <Link to="/legal" className="hover:text-primary transition-colors">
              Legal
            </Link>
            <ChevronRight size={12} className="text-muted" />
            <span className="text-primary font-medium">Terms of Service</span>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 rounded-card bg-accent-text border border-accent-border flex items-center justify-center shrink-0">
              <ScrollText size={20} className="text-accent" strokeWidth={1.75} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-primary tracking-tight">
                Terms of Service
              </h1>
              <p className="text-xs text-muted mt-0.5">
                Last updated: {LAST_UPDATED}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 w-full flex gap-10">
        {/* Table of contents — desktop only */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-24 flex flex-col gap-0.5">
            <p className="text-xs font-bold text-muted uppercase tracking-widest mb-2 px-3">
              On this page
            </p>
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="px-3 py-1.5 text-xs text-secondary hover:text-accent hover:bg-accent-text rounded-btn transition-colors duration-150"
              >
                {s.label}
              </a>
            ))}
          </div>
        </aside>

        {/* Body */}
        <div className="flex-1 min-w-0 flex flex-col gap-10">
          <p className="text-sm text-secondary leading-relaxed">
            These Terms of Service ("Terms") govern your access to and use of
            Ticketer, including our website, mobile experience, and related
            services (collectively, the "Service"). By creating an account,
            browsing events, purchasing tickets, or applying to become an
            organizer on Ticketer, you agree to be bound by these Terms. If
            you do not agree, please do not use the Service.
          </p>

          <Section id="acceptance" title="1. Acceptance of Terms">
            <p>
              By accessing or using Ticketer you confirm that you have read,
              understood, and agree to these Terms and our{' '}
              <Link to="/privacy" className="text-accent hover:text-accent-hover font-medium">
                Privacy Policy
              </Link>
              , which is incorporated into these Terms by reference. If you
              are using the Service on behalf of an organization (for
              example, as an event organizer), you represent that you have
              the authority to bind that organization to these Terms.
            </p>
          </Section>

          <Section id="eligibility" title="2. Eligibility">
            <p>
              You must be at least 13 years old to create a Ticketer account.
              If you are between 13 and 17 years old, you may only use the
              Service with the involvement and consent of a parent or legal
              guardian, who agrees to be bound by these Terms on your behalf
              and is responsible for your use of the Service, including any
              purchases made.
            </p>
            <p>
              Certain events listed on Ticketer may carry their own age
              restrictions (for example, age-restricted concerts or venues).
              It is the responsibility of the ticket holder and, where
              applicable, their parent or guardian, to comply with any such
              restrictions set by the event organizer or venue.
            </p>
          </Section>

          <Section id="accounts" title="3. Accounts & Sign-in">
            <p>
              To book tickets or create events, you need a Ticketer account.
              You can create one using an email address and password, or by
              signing in with your Google account. If you sign in with
              Google, we receive your name, email address, and profile image
              from Google to create and personalize your account — see our{' '}
              <Link to="/privacy" className="text-accent hover:text-accent-hover font-medium">
                Privacy Policy
              </Link>{' '}
              for details.
            </p>
            <p>
              You are responsible for maintaining the confidentiality of your
              account credentials and for all activity that occurs under your
              account. Notify us immediately at{' '}
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="text-accent hover:text-accent-hover font-medium"
              >
                {SUPPORT_EMAIL}
              </a>{' '}
              if you suspect unauthorized use of your account.
            </p>
            <p>
              You agree to provide accurate, current, and complete information
              when creating your account and to keep it up to date.
            </p>
          </Section>

          <Section id="tickets" title="4. Tickets & Bookings">
            <p>
              Ticketer acts as a platform connecting attendees with event
              organizers. When you purchase a ticket, you are entering into a
              transaction with the event organizer; Ticketer facilitates the
              booking, payment processing, and ticket delivery (including
              QR-coded digital tickets).
            </p>
            <p>
              Ticket prices, availability, and refund/cancellation policies
              are set by the individual event organizer unless otherwise
              stated. Once a booking is confirmed and paid for, it is
              generally non-transferable and non-refundable except:
            </p>
            <ul className="list-disc list-inside pl-2 flex flex-col gap-1">
              <li>where the organizer or Ticketer cancels the event,</li>
              <li>where required by applicable Nigerian consumer protection law, or</li>
              <li>at the organizer's discretion.</li>
            </ul>
            <p>
              If an event is cancelled by its organizer, Ticketer will
              coordinate refunds to affected attendees in accordance with our
              payout and refund processes.
            </p>
            <p>
              Your digital ticket (QR code) is your proof of purchase and
              entry credential. Do not share your ticket or QR code publicly,
              as this may allow unauthorized use or duplicate entry attempts.
            </p>
          </Section>

          <Section id="payments" title="5. Payments">
            <p>
              All payments on Ticketer are processed in Nigerian Naira (₦)
              through our third-party payment processor, Paystack. Ticketer
              does not store your full card details — payment card
              information is handled directly and securely by Paystack in
              accordance with its own terms and PCI-DSS compliance standards.
            </p>
            <p>
              By making a payment, you authorize Ticketer and Paystack to
              charge the selected payment method for the total amount shown
              at checkout, including any applicable platform or service fees.
            </p>
          </Section>

          <Section id="organizers" title="6. Organizers">
            <p>
              Users who wish to create and sell tickets for their own events
              may apply to become an Organizer. Organizer applications are
              reviewed and approved at Ticketer's discretion.
            </p>
            <p>
              Organizers are solely responsible for the accuracy of their
              event listings, for delivering the event as described, and for
              complying with all applicable laws (including venue capacity,
              safety, licensing, and consumer protection requirements).
            </p>
            <p>
              To receive payouts, organizers must provide valid Nigerian bank
              account details, which are verified through Paystack before
              funds are released. Ticketer deducts a platform fee from gross
              ticket revenue as disclosed to the organizer at the time of
              event setup. Payouts are subject to a hold period following an
              event's conclusion and may be frozen or reviewed if Ticketer
              detects suspicious activity, fraud reports, or repeated event
              cancellations.
            </p>
            <p>
              Ticketer reserves the right to suspend, unpublish, or cancel any
              event, and to freeze or withhold payouts, where we reasonably
              believe the listing violates these Terms, applicable law, or
              poses a risk to attendees.
            </p>
          </Section>

          <Section id="conduct" title="7. Acceptable Use">
            <p>You agree not to:</p>
            <ul className="list-disc list-inside pl-2 flex flex-col gap-1">
              <li>use the Service for any unlawful purpose or to defraud other users;</li>
              <li>create fake events, fake bookings, or manipulate ticket availability;</li>
              <li>attempt to duplicate, forge, or resell QR-coded tickets outside the platform;</li>
              <li>interfere with or disrupt the integrity or performance of the Service;</li>
              <li>attempt to gain unauthorized access to other users' accounts or data; or</li>
              <li>use automated means (bots, scrapers) to access the Service without our written permission.</li>
            </ul>
            <p>
              We reserve the right to suspend or terminate accounts that
              violate this section.
            </p>
          </Section>

          <Section id="ip" title="8. Intellectual Property">
            <p>
              The Ticketer name, logo, and platform design are the property
              of Ticketer. Event content (titles, descriptions, banner
              images) uploaded by organizers remains the property of the
              respective organizer, who grants Ticketer a license to display
              it on the platform for the purpose of promoting and selling
              tickets to their event.
            </p>
          </Section>

          <Section id="disclaimers" title="9. Disclaimers">
            <p>
              Ticketer is provided "as is" and "as available." We do our best
              to keep the Service accurate and reliable, but we do not
              guarantee that events listed will occur as described, that the
              Service will be uninterrupted or error-free, or that all
              content submitted by organizers is accurate.
            </p>
            <p>
              Ticketer is not responsible for the conduct of any organizer,
              attendee, or third party, on or off the platform, including at
              physical event venues.
            </p>
          </Section>

          <Section id="liability" title="10. Limitation of Liability">
            <p>
              To the fullest extent permitted by law, Ticketer and its
              officers, employees, and agents shall not be liable for any
              indirect, incidental, special, or consequential damages arising
              from your use of the Service, including but not limited to loss
              of data, loss of revenue, or damages resulting from an event
              being cancelled, delayed, or altered by an organizer.
            </p>
            <p>
              Nothing in these Terms limits any liability that cannot legally
              be limited, including liability arising from fraud or gross
              negligence.
            </p>
          </Section>

          <Section id="termination" title="11. Termination">
            <p>
              You may stop using the Service and delete your account at any
              time by contacting us at{' '}
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="text-accent hover:text-accent-hover font-medium"
              >
                {SUPPORT_EMAIL}
              </a>
              . We may suspend or terminate your access to the Service at our
              discretion if we believe you have violated these Terms,
              engaged in fraudulent activity, or posed a risk to other users.
            </p>
          </Section>

          <Section id="changes" title="12. Changes to These Terms">
            <p>
              We may update these Terms from time to time as the platform
              evolves — for example, once Ticketer completes formal business
              registration or launches on a permanent domain. We will update
              the "Last updated" date above when changes are made. Continued
              use of the Service after changes take effect constitutes
              acceptance of the revised Terms.
            </p>
          </Section>

          <Section id="law" title="13. Governing Law">
            <p>
              These Terms are governed by the laws of the Federal Republic of
              Nigeria, without regard to conflict-of-law principles. Any
              disputes arising from these Terms or your use of the Service
              shall be subject to the exclusive jurisdiction of the courts of
              Nigeria.
            </p>
          </Section>

          <Section id="contact" title="14. Contact Us">
            <p>
              If you have questions about these Terms, please contact us at{' '}
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="text-accent hover:text-accent-hover font-medium"
              >
                {SUPPORT_EMAIL}
              </a>
              .
            </p>
            {/* TODO: Add registered business name, registration number, and
                registered address once the company is formally registered. */}
          </Section>
        </div>
      </div>

      <Footer variant="minimal" />
    </div>
  );
}