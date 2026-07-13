// src/pages/public/PrivacyPolicyPage.jsx
//
// Privacy Policy — required for Google OAuth consent screen verification.
// NOTE: Placeholders like company registration number / registered address
// should be filled in once the platform is formally registered and a domain
// is live. Search for "TODO" to find remaining placeholders.

import { Link } from 'react-router-dom';
import { ShieldCheck, ChevronRight } from 'lucide-react';
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
  { id: 'overview', label: '1. Overview' },
  { id: 'data-we-collect', label: '2. Information We Collect' },
  { id: 'google', label: '3. Signing in with Google' },
  { id: 'how-we-use', label: '4. How We Use Your Information' },
  { id: 'sharing', label: '5. How We Share Information' },
  { id: 'processors', label: '6. Third-Party Processors' },
  { id: 'retention', label: '7. Data Retention' },
  { id: 'security', label: '8. Data Security' },
  { id: 'rights', label: '9. Your Rights & Choices' },
  { id: 'children', label: '10. Children\u2019s Privacy' },
  { id: 'cookies', label: '11. Cookies & Similar Technologies' },
  { id: 'changes', label: '12. Changes to This Policy' },
  { id: 'contact', label: '13. Contact Us' },
];

function Bullet({ children }) {
  return <li className="leading-relaxed">{children}</li>;
}

export default function PrivacyPolicyPage() {
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
            <span className="text-primary font-medium">Privacy Policy</span>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 rounded-card bg-accent-text border border-accent-border flex items-center justify-center shrink-0">
              <ShieldCheck
                size={20}
                className="text-accent"
                strokeWidth={1.75}
              />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-primary tracking-tight">
                Privacy Policy
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
            This Privacy Policy explains how Ticketer ("we", "us", "our")
            collects, uses, shares, and protects your information when you use
            our website and services (the "Service"). By using Ticketer, you
            agree to the practices described in this policy. If you do not
            agree, please do not use the Service.
          </p>

          <Section id="overview" title="1. Overview">
            <p>
              Ticketer is an event ticketing platform that lets attendees
              discover events, book tickets, and receive QR-coded digital
              tickets, and lets organizers create events, sell tickets, and
              receive payouts. This policy covers all personal data processed
              through the platform, whether you sign up directly with an email
              and password or via Google Sign-In.
            </p>
          </Section>

          <Section id="data-we-collect" title="2. Information We Collect">
            <p>We collect the following categories of information:</p>

            <p className="font-semibold text-primary mt-1">
              Account information
            </p>
            <ul className="list-disc list-inside pl-2 flex flex-col gap-1">
              <Bullet>
                Name, email address, and password (if you register directly)
              </Bullet>
              <Bullet>
                Name, email address, and profile image (if you sign in with
                Google)
              </Bullet>
              <Bullet>Profile avatar you upload, hosted via Cloudinary</Bullet>
            </ul>

            <p className="font-semibold text-primary mt-1">
              Booking & ticket information
            </p>
            <ul className="list-disc list-inside pl-2 flex flex-col gap-1">
              <Bullet>Events you view, book, and attend</Bullet>
              <Bullet>Ticket type, quantity, and booking history</Bullet>
              <Bullet>
                QR-code check-in records (whether and when a ticket was scanned
                at an event)
              </Bullet>
            </ul>

            <p className="font-semibold text-primary mt-1">
              Payment information
            </p>
            <ul className="list-disc list-inside pl-2 flex flex-col gap-1">
              <Bullet>
                Transaction records (amount, reference, status) processed via
                Paystack. Ticketer does not collect or store your full card
                number, CVV, or bank PIN — these are handled directly by
                Paystack.
              </Bullet>
            </ul>

            <p className="font-semibold text-primary mt-1">
              Organizer information
            </p>
            <ul className="list-disc list-inside pl-2 flex flex-col gap-1">
              <Bullet>
                Organization name, event-type, and phone number (organizer
                applications)
              </Bullet>
              <Bullet>
                Bank account name, number, and bank code, verified and processed
                through Paystack, for the purpose of sending payouts
              </Bullet>
            </ul>

            <p className="font-semibold text-primary mt-1">
              Usage & device information
            </p>
            <ul className="list-disc list-inside pl-2 flex flex-col gap-1">
              <Bullet>
                Basic technical data such as IP address, browser type, and
                device information, collected automatically for security and to
                keep the Service running reliably
              </Bullet>
            </ul>

            <p>
              We do not use Google Analytics, Meta Pixel, or any other
              third-party advertising or analytics trackers.
            </p>
          </Section>

          <Section id="google" title="3. Signing in with Google">
            <p>
              If you choose "Continue with Google," we request access to your
              basic Google profile — specifically your{' '}
              <strong className="text-primary">name</strong>,{' '}
              <strong className="text-primary">email address</strong>, and{' '}
              <strong className="text-primary">profile image</strong>. We use
              this information solely to create or sign you into your Ticketer
              account and to personalize your profile (e.g. pre-filling your
              name and avatar).
            </p>
            <p>
              We do not request access to your Gmail, Google Drive, Google
              Calendar, contacts, or any other Google service, and we do not use
              your Google data for advertising. You can review or revoke
              Ticketer's access to your Google account at any time via your{' '}
              <a
                href="https://myaccount.google.com/permissions"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-accent-hover font-medium"
              >
                Google Account permissions page
              </a>
              .
            </p>
          </Section>

          <Section id="how-we-use" title="4. How We Use Your Information">
            <p>We use the information we collect to:</p>
            <ul className="list-disc list-inside pl-2 flex flex-col gap-1">
              <Bullet>
                create and manage your account, including email or Google
                sign-in
              </Bullet>
              <Bullet>
                process bookings, payments, and issue QR-coded tickets
              </Bullet>
              <Bullet>
                send booking confirmations, OTP verification codes, and
                in-app/notification updates about your bookings, events, or
                account
              </Bullet>
              <Bullet>
                enable event check-in via QR code scanning at the gate
              </Bullet>
              <Bullet>
                process organizer payouts and verify bank account details via
                Paystack
              </Bullet>
              <Bullet>
                review organizer applications and prevent fraud or abuse on the
                platform
              </Bullet>
              <Bullet>
                maintain the security, integrity, and reliability of the Service
              </Bullet>
              <Bullet>respond to support requests sent to us</Bullet>
            </ul>
          </Section>

          <Section id="sharing" title="5. How We Share Information">
            <p>We share personal data only in the following circumstances:</p>
            <ul className="list-disc list-inside pl-2 flex flex-col gap-1">
              <Bullet>
                <strong className="text-primary">With event organizers</strong>{' '}
                — if you book a ticket, the organizer of that event can see your
                name, email, and booking details, so they can manage attendance
                and check you in.
              </Bullet>
              <Bullet>
                <strong className="text-primary">
                  With our service providers
                </strong>{' '}
                — Paystack (payment processing and organizer payouts),
                Cloudinary (image hosting for avatars and event banners), and
                Google (authentication, if you sign in with Google). These
                providers only receive the data necessary to perform their
                function and are bound by their own privacy and security
                obligations.
              </Bullet>
              <Bullet>
                <strong className="text-primary">For legal reasons</strong> — if
                required to comply with applicable law, regulation, legal
                process, or a valid governmental request.
              </Bullet>
              <Bullet>
                <strong className="text-primary">Business transfers</strong> —
                if Ticketer is involved in a merger, acquisition, or asset sale,
                your information may be transferred as part of that transaction;
                we will notify you before your data becomes subject to a
                different privacy policy.
              </Bullet>
            </ul>
            <p>We do not sell your personal information to third parties.</p>
          </Section>

          <Section id="processors" title="6. Third-Party Processors">
            <p>
              Ticketer currently relies on the following third parties to
              operate the Service:
            </p>
            <ul className="list-disc list-inside pl-2 flex flex-col gap-1">
              <Bullet>
                <strong className="text-primary">Paystack</strong> — payment
                processing, transaction verification, and organizer bank
                payouts. See{' '}
                <a
                  href="https://paystack.com/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-accent-hover font-medium"
                >
                  Paystack's terms
                </a>{' '}
                for how they handle payment data.
              </Bullet>
              <Bullet>
                <strong className="text-primary">Cloudinary</strong> — secure
                hosting and delivery of uploaded images (profile avatars and
                event banners).
              </Bullet>
              <Bullet>
                <strong className="text-primary">Google</strong> — optional
                sign-in authentication (Google OAuth).
              </Bullet>
            </ul>
            <p>
              We do not use any advertising networks, analytics trackers, or
              data brokers.
            </p>
          </Section>

          <Section id="retention" title="7. Data Retention">
            <p>
              We retain your account and booking information for as long as your
              account is active, and for a reasonable period afterward to comply
              with legal, tax, and accounting obligations, resolve disputes, and
              enforce our agreements. If you delete your account, we will remove
              or anonymize your personal information within a reasonable
              timeframe, except where we are required to retain it (for example,
              financial transaction records).
            </p>
          </Section>

          <Section id="security" title="8. Data Security">
            <p>
              We use industry-standard measures to protect your data, including
              encrypted connections (HTTPS), authenticated API access, and
              reliance on PCI-DSS-compliant processors (Paystack) for payment
              data — we never see or store your full card details. No system is
              perfectly secure, and we cannot guarantee absolute security, but
              we work to protect your information against unauthorized access,
              alteration, or disclosure.
            </p>
          </Section>

          <Section id="rights" title="9. Your Rights & Choices">
            <p>Depending on your location, you may have the right to:</p>
            <ul className="list-disc list-inside pl-2 flex flex-col gap-1">
              <Bullet>access the personal data we hold about you;</Bullet>
              <Bullet>
                correct inaccurate or incomplete data (via your Profile
                settings, or by contacting us);
              </Bullet>
              <Bullet>
                request deletion of your account and associated personal data;
              </Bullet>
              <Bullet>
                withdraw consent for Google sign-in at any time via your Google
                account settings; and
              </Bullet>
              <Bullet>
                object to or restrict certain processing of your data.
              </Bullet>
            </ul>
            <p>
              To exercise any of these rights, contact us at{' '}
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="text-accent hover:text-accent-hover font-medium"
              >
                {SUPPORT_EMAIL}
              </a>
              . We will respond within a reasonable timeframe.
            </p>
          </Section>

          <Section id="children" title="10. Children's Privacy">
            <p>
              Ticketer is intended for users aged 13 and older. Users between 13
              and 17 years old may only use the Service with the consent and
              involvement of a parent or legal guardian, who is responsible for
              reviewing this Privacy Policy on the minor's behalf and for any
              activity conducted through the account, including ticket
              purchases.
            </p>
            <p>
              We do not knowingly collect personal information from children
              under 13. If we become aware that we have collected personal data
              from a child under 13 without appropriate parental consent, we
              will take steps to delete that information. If you believe a child
              under 13 has provided us with personal data, please contact us at{' '}
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="text-accent hover:text-accent-hover font-medium"
              >
                {SUPPORT_EMAIL}
              </a>
              .
            </p>
          </Section>

          <Section id="cookies" title="11. Cookies & Similar Technologies">
            <p>
              We use essential local/session storage to keep you signed in and
              to remember basic preferences such as your selected theme
              (light/dark/system). We do not use third-party advertising
              cookies, tracking pixels, or cross-site analytics.
            </p>
          </Section>

          <Section id="changes" title="12. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time — for example,
              as Ticketer completes formal business registration, moves to a
              permanent domain, or introduces new features. We will update the
              "Last updated" date above whenever changes are made. Significant
              changes will be communicated via the Service or by email where
              appropriate. Continued use of the Service after changes take
              effect constitutes acceptance of the revised policy.
            </p>
          </Section>

          <Section id="contact" title="13. Contact Us">
            <p>
              If you have questions, concerns, or requests regarding this
              Privacy Policy or your personal data, please contact us at{' '}
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
