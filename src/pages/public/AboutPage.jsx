import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Ticket,
  ShieldCheck,
  Zap,
  Heart,
  Users,
  TrendingUp,
  MapPin,
  ArrowRight,
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Footer from '../../components/layout/Footer';
import { useAuthStore } from '../../store/authStore';

const STATS = [
  { label: 'Events hosted', value: '1,200+' },
  { label: 'Tickets sold', value: '48,000+' },
  { label: 'Active organisers', value: '340+' },
  { label: 'Cities covered', value: '12' },
];

const VALUES = [
  {
    icon: ShieldCheck,
    title: 'Trust & security',
    desc: 'Every payment runs through Paystack and every ticket carries a unique QR code, so attendees and organisers can trust what they see.',
    color: '#2563eb',
  },
  {
    icon: Zap,
    title: 'Simplicity first',
    desc: "Creating an event or buying a ticket shouldn't take a manual. We keep every flow short, clear, and mobile-friendly.",
    color: '#f59e0b',
  },
  {
    icon: Heart,
    title: 'Built for Nigeria',
    desc: 'From Naira pricing to local payment rails, Ticketer is designed around how events actually happen here, not adapted from elsewhere.',
    color: '#ef4444',
  },
  {
    icon: Users,
    title: 'Community-driven',
    desc: 'Organisers of every size, from a campus meetup to a citywide festival, get the same tools to sell tickets and manage attendees.',
    color: '#10b981',
  },
];

export default function AboutPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const token = useAuthStore((state) => state.token);
  const isLoggedIn = Boolean(token);

  return (
    <div className="flex flex-col min-h-screen bg-main-bg">
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1">
        <section className="relative overflow-hidden bg-main-bg pt-16 pb-16 px-6">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
            <div className="absolute top-1/2 -left-24 w-64 h-64 rounded-full bg-accent/5 blur-2xl" />
          </div>

          <div className="relative max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-text border border-accent-border rounded-full mb-6">
              <Sparkles size={13} className="text-accent" />
              <span className="text-xs font-semibold text-accent">
                About Ticketer
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black text-primary tracking-tight leading-[1.05] mb-6">
              Helping Nigeria's best events find their crowd
            </h1>

            <p className="text-base sm:text-lg text-secondary leading-relaxed max-w-2xl mx-auto">
              Ticketer is a ticketing platform built for the way events
              actually happen in Nigeria: quick to set up for organisers,
              simple and secure for attendees, and honest about fees on both
              sides.
            </p>
          </div>
        </section>

        <section className="border-y border-border bg-card">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-0 sm:divide-x divide-border">
              {STATS.map((s) => (
                <div
                  key={s.label}
                  className="flex flex-col items-center gap-1 text-center"
                >
                  <span className="text-2xl font-black text-primary tracking-tight">
                    {s.value}
                  </span>
                  <span className="text-xs text-secondary font-medium">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            <div>
              <p className="text-xs font-semibold text-accent uppercase tracking-widest mb-2">
                Our story
              </p>
              <h2 className="text-2xl sm:text-3xl font-black text-primary tracking-tight mb-4">
                Why we built Ticketer
              </h2>
            </div>
            <div className="flex flex-col gap-4 text-sm text-secondary leading-relaxed">
              <p>
                Buying a ticket for a concert, conference, or meetup in
                Nigeria used to mean bank transfers to strangers, screenshots
                as "proof of payment," and hoping the event actually happened.
                Organisers, meanwhile, were stuck juggling spreadsheets and
                DMs just to know who was coming.
              </p>
              <p>
                Ticketer brings both sides onto one platform: attendees get a
                real ticket with a scannable QR code the moment they pay, and
                organisers get a dashboard that shows sales, revenue, and
                check-ins in real time, no spreadsheets required.
              </p>
              <p>
                We're still early, and still Lagos-headquartered, but we're
                building for every city where people gather.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-card border-y border-border py-16">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <p className="text-xs font-semibold text-accent uppercase tracking-widest mb-2">
                What we do
              </p>
              <h2 className="text-2xl sm:text-3xl font-black text-primary tracking-tight">
                One platform, two sides of the same event
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-main-bg border border-border rounded-card p-6">
                <div className="w-11 h-11 rounded-card bg-accent-text border border-accent-border flex items-center justify-center mb-4">
                  <Ticket size={20} className="text-accent" strokeWidth={1.75} />
                </div>
                <h3 className="font-bold text-primary mb-2">For attendees</h3>
                <p className="text-sm text-secondary leading-relaxed">
                  Browse events by category or city, pay securely with
                  Paystack, and get a QR-coded ticket instantly, no printing,
                  no waiting on an email that never arrives.
                </p>
              </div>
              <div className="bg-main-bg border border-border rounded-card p-6">
                <div className="w-11 h-11 rounded-card bg-accent-text border border-accent-border flex items-center justify-center mb-4">
                  <TrendingUp
                    size={20}
                    className="text-accent"
                    strokeWidth={1.75}
                  />
                </div>
                <h3 className="font-bold text-primary mb-2">For organisers</h3>
                <p className="text-sm text-secondary leading-relaxed">
                  Create ticket tiers, publish your event, and track sales as
                  they come in. Scan attendees in at the gate with any phone
                  camera, then receive your payout automatically after the
                  event.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-accent uppercase tracking-widest mb-2">
              What we care about
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-primary tracking-tight">
              The principles behind the product
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {VALUES.map(({ icon: Icon, title, desc, color }) => (
              <div
                key={title}
                className="flex items-start gap-4 p-5 bg-card border border-border rounded-card hover:border-accent/20 transition-colors duration-150"
              >
                <div
                  className="w-10 h-10 rounded-btn flex items-center justify-center shrink-0"
                  style={{ background: `${color}18` }}
                >
                  <Icon size={18} strokeWidth={1.75} style={{ color }} />
                </div>
                <div>
                  <p className="font-bold text-primary text-sm mb-1">
                    {title}
                  </p>
                  <p className="text-sm text-secondary leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* <section className="max-w-4xl mx-auto px-6 pb-16">
          <div className="flex items-center gap-3 p-5 bg-card border border-border rounded-card">
            <div className="w-10 h-10 rounded-btn bg-accent-text flex items-center justify-center shrink-0">
              <MapPin size={17} className="text-accent" strokeWidth={1.75} />
            </div>
            <p className="text-sm text-secondary leading-relaxed">
              <span className="font-semibold text-primary">
                Headquartered in Lagos, Nigeria.
              </span>{' '}
              Ticketer currently supports events across 12 cities, with more
              being added as organisers bring their events onto the platform.
            </p>
          </div>
        </section> */}

        <section className="bg-accent mx-6 lg:mx-auto lg:max-w-6xl rounded-card mb-16 px-6 py-12 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-white/7" />
            <div className="absolute -bottom-16 -left-8 w-48 h-48 rounded-full bg-white/7" />
          </div>
          <div className="relative flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="text-center sm:text-left">
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight mb-3">
                Want to be part of the story?
              </h2>
              <p className="text-sm text-white/80 leading-relaxed max-w-sm">
                Whether you're planning your next event or just want to see
                what's happening near you, Ticketer is ready when you are.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full sm:w-auto">
              <Link
                to="/events"
                className="flex items-center justify-center gap-2 h-12 px-6 bg-white text-accent font-bold text-sm rounded-btn hover:bg-white/90 transition-colors duration-180 active:scale-95 w-full sm:w-auto"
              >
                Browse Events <ArrowRight size={16} strokeWidth={2.5} />
              </Link>
              {!isLoggedIn && (
                <Link
                  to="/register"
                  className="flex items-center justify-center h-12 px-6 border border-white/40 text-white font-semibold text-sm rounded-btn hover:bg-white/10 transition-colors duration-180 w-full sm:w-auto"
                >
                  Create account
                </Link>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}