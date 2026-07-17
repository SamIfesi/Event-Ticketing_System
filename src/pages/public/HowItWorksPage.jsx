import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  CalendarPlus,
  Megaphone,
  HelpCircle,
  FileText,
  Ticket,
  Send,
  QrCode,
  BarChart3,
  Users,
  Share2,
  Search,
  Wallet,
  ShieldCheck,
  Smartphone,
  CreditCard,
  RefreshCw,
  ArrowRight,
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Footer from '../../components/layout/Footer';
import AccordionItem from '../../components/ui/AccordionItem';
import { useAuthStore } from '../../store/authStore';

// ── Section 1: Create & manage your events ────────────────────
const CREATE_MANAGE_ITEMS = [
  {
    icon: FileText,
    title: '1. Apply to become an organiser',
    body: (
      <>
        <p>
          Every account starts as an attendee. To create events, tap{' '}
          <strong className="text-primary">Become Organiser</strong> from your
          profile and fill in a short application — your organisation name, the
          type of events you plan to host, and a phone number.
        </p>
        <p className="mt-2">
          Most applications are reviewed within 24–48 hours. Once approved,
          organiser tools unlock immediately on your account.
        </p>
      </>
    ),
  },
  {
    icon: Ticket,
    title: '2. Create your event and set ticket types',
    body: (
      <>
        <p>
          Add your event title, description, location, date, and a banner image.
          Then build out one or more ticket tiers — Regular, VIP, Early Bird, or
          anything else — each with its own price and quantity. Free tickets are
          supported too; just set the price to 0.
        </p>
      </>
    ),
  },
  {
    icon: Send,
    title: '3. Publish when you\u2019re ready',
    body: (
      <>
        <p>
          Save your event as a draft while you finish the details, then publish
          it whenever you're ready to go live. Published events are instantly
          searchable and bookable on Ticketer.
        </p>
        <p className="mt-2">
          You'll need verified bank details on file before you can publish —
          this is what lets us pay you out automatically after the event.
        </p>
      </>
    ),
  },
  {
    icon: BarChart3,
    title: '4. Manage sales from your dashboard',
    body: (
      <>
        <p>
          Your organiser dashboard shows ticket sales, revenue, and attendee
          counts in real time — no spreadsheets. Edit event details, add new
          ticket tiers, or cancel an event (with attendees notified
          automatically) at any point.
        </p>
      </>
    ),
  },
  {
    icon: QrCode,
    title: '5. Check attendees in at the gate',
    body: (
      <>
        <p>
          On event day, open the check-in scanner from your dashboard on any
          phone. Scanning an attendee's QR code confirms their ticket instantly
          and flags it as used, so it can't be scanned twice.
        </p>
      </>
    ),
  },
  {
    icon: Wallet,
    title: '6. Get paid automatically',
    body: (
      <>
        <p>
          Once your event ends, Ticketer holds funds for a short fraud
          protection window, then pays your organiser cut directly to your
          verified bank account — no invoicing required.
        </p>
      </>
    ),
  },
];

// ── Section 2: Promote & sell ──────────────────────────────────
const PROMOTE_SELL_ITEMS = [
  {
    icon: Share2,
    title: 'Share your unique event page',
    body: (
      <p>
        Every event gets its own shareable page with a clean link, a preview
        image, and all the details attendees need. Share it directly on
        WhatsApp, Instagram, or Twitter — link previews are built in.
      </p>
    ),
  },
  {
    icon: Search,
    title: 'Get discovered on Ticketer',
    body: (
      <p>
        Published events appear in event search and category browsing
        automatically, so people actively looking for something to do in your
        city can find you without any extra work.
      </p>
    ),
  },
  {
    icon: BarChart3,
    title: 'Watch sales happen in real time',
    body: (
      <p>
        Your dashboard updates the moment a ticket is bought. Track revenue by
        ticket tier, see how close you are to selling out, and get a low-stock
        alert automatically as tiers near capacity.
      </p>
    ),
  },
  {
    icon: Users,
    title: 'Understand your audience',
    body: (
      <p>
        See attendee counts, ticket types sold, and check-in stats for every
        event you run — useful for planning your next one.
      </p>
    ),
  },
  {
    icon: CreditCard,
    title: 'Pricing that stays predictable',
    body: (
      <p>
        Your platform fee percentage is agreed up front and shown on every
        transaction in your revenue ledger — no surprise deductions when payout
        day comes.
      </p>
    ),
  },
];

// ── Section 3: FAQs ─────────────────────────────────────────────
const FAQ_ITEMS = [
  {
    icon: HelpCircle,
    title: 'How do I buy a ticket?',
    body: (
      <p>
        Find an event, choose a ticket type and quantity, and pay securely with
        Paystack using card, bank transfer, or USSD. Your ticket — with its QR
        code — is issued the moment payment is confirmed.
      </p>
    ),
  },
  {
    icon: ShieldCheck,
    title: 'Is my payment secure?',
    body: (
      <p>
        Yes. All payments are processed by Paystack; Ticketer never sees or
        stores your card details, PIN, or bank login information.
      </p>
    ),
  },
  {
    icon: Smartphone,
    title: 'Do I need to print my ticket?',
    body: (
      <p>
        No. Your ticket lives in the Ticketer app under{' '}
        <strong className="text-primary">My Tickets</strong>, and its QR code
        can be scanned straight from your phone screen at the gate. You can also
        download a PDF or image copy if you'd like a backup.
      </p>
    ),
  },
  {
    icon: RefreshCw,
    title: 'Can I get a refund?',
    body: (
      <p>
        Ticket purchases are generally final, except where an event is cancelled
        by the organiser or as required by law. If an event is cancelled,
        Ticketer coordinates refunds to every affected attendee automatically.
      </p>
    ),
  },
  {
    icon: CalendarPlus,
    title: 'What happens if an event is cancelled?',
    body: (
      <p>
        Every attendee with a paid booking is notified immediately, and refunds
        are processed back to the original payment method. Organisers do not
        receive a payout for cancelled events.
      </p>
    ),
  },
  {
    icon: Megaphone,
    title: 'How do I become an organiser?',
    body: (
      <p>
        Open your profile and tap{' '}
        <strong className="text-primary">Become Organiser</strong>, then fill in
        a short application. Approval typically takes 24–48 hours, after which
        you can create and publish events right away.
      </p>
    ),
  },
  {
    icon: Wallet,
    title: 'When do organisers get paid?',
    body: (
      <p>
        After your event ends, funds are held briefly for fraud protection, then
        paid out automatically to your verified bank account — you don't need to
        request anything.
      </p>
    ),
  },
];

// ── Reusable section wrapper ─────────────────────────────────────
function AccordionSection({ icon: Icon, label, title, subtitle, items }) {
  return (
    <section className="max-w-3xl mx-auto px-6 py-12">
      <div className="flex items-center gap-2 mb-2">
        <Icon size={14} className="text-accent" />
        <span className="text-xs font-bold text-accent uppercase tracking-widest">
          {label}
        </span>
      </div>
      <h2 className="text-2xl sm:text-3xl font-black text-primary tracking-tight mb-2">
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm text-secondary leading-relaxed mb-6 max-w-xl">
          {subtitle}
        </p>
      )}
      {!subtitle && <div className="mb-6" />}

      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <AccordionItem key={item.title} title={item.title} icon={item.icon}>
            {item.body}
          </AccordionItem>
        ))}
      </div>
    </section>
  );
}

export default function HowItWorksPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const token = useAuthStore((state) => state.token);
  const isLoggedIn = Boolean(token);

  return (
    <div className="flex flex-col min-h-screen bg-main-bg">
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-main-bg pt-16 pb-12 px-6">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
            <div className="absolute top-1/2 -left-24 w-64 h-64 rounded-full bg-accent/5 blur-2xl" />
          </div>

          <div className="relative max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-text border border-accent-border rounded-full mb-6">
              <Sparkles size={13} className="text-accent" />
              <span className="text-xs font-semibold text-accent">
                How Ticketer works
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black text-primary tracking-tight leading-[1.05] mb-6">
              From creating an event to getting paid
            </h1>

            <p className="text-base sm:text-lg text-secondary leading-relaxed max-w-2xl mx-auto">
              Everything organisers and attendees need to know about running and
              attending events on Ticketer. Tap any question below to expand it.
            </p>
          </div>
        </section>

        {/* Section 1 */}
        <div className="border-t border-border">
          <AccordionSection
            icon={CalendarPlus}
            label="For organisers"
            title="Create and manage your events"
            subtitle="From application to payout — the full organiser lifecycle."
            items={CREATE_MANAGE_ITEMS}
          />
        </div>

        {/* Section 2 */}
        <div className="border-t border-border bg-card">
          <AccordionSection
            icon={Megaphone}
            label="For organisers"
            title="Promote and sell tickets"
            subtitle="Get your event in front of the right people and track every sale."
            items={PROMOTE_SELL_ITEMS}
          />
        </div>

        {/* Section 3 */}
        <div className="border-t border-border">
          <AccordionSection
            icon={HelpCircle}
            label="Need help?"
            title="Frequently asked questions"
            items={FAQ_ITEMS}
          />
        </div>

        {/* CTA */}
        <section className="bg-accent mx-6 lg:mx-auto lg:max-w-6xl rounded-card mb-16 mt-4 px-6 py-12 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-white/7" />
            <div className="absolute -bottom-16 -left-8 w-48 h-48 rounded-full bg-white/7" />
          </div>
          <div className="relative flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="text-center sm:text-left">
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight mb-3">
                Ready to get started?
              </h2>
              <p className="text-sm text-white/80 leading-relaxed max-w-sm">
                Browse what's happening near you, or apply to host your own
                event in minutes.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full sm:w-auto">
              <Link
                to="/events"
                className="flex items-center justify-center gap-2 h-12 px-6 bg-white text-accent font-bold text-sm rounded-btn hover:bg-white/90 transition-colors duration-180 active:scale-95 w-full sm:w-auto"
              >
                Browse Events <ArrowRight size={16} strokeWidth={2.5} />
              </Link>
              <Link
                to={isLoggedIn ? '/become-organizer' : '/register'}
                className="flex items-center justify-center h-12 px-6 border border-white/40 text-white font-semibold text-sm rounded-btn hover:bg-white/10 transition-colors duration-180 w-full sm:w-auto"
              >
                {isLoggedIn ? 'Become an organiser' : 'Create account'}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer variant="minimal" />
    </div>
  );
}
3