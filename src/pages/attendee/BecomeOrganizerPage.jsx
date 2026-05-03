// /become-organizer
// Attendees use this page to apply to become an event organizer.
// Three states:
//   1. No application yet → show the application form
//   2. Application pending → show a waiting screen
//   3. Application approved → show success + redirect prompt
//   4. Application rejected → show rejection + allow reapply

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mic2,
  CalendarDays,
  Phone,
  FileText,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Sparkles,
  Users,
  BarChart3,
  QrCode,
} from 'lucide-react';
import { useOrganizerApplication } from '../../hooks/useOrgApplication';
import { useAuthStore } from '../../store/authStore';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Footer from '../../components/layout/Footer';
import { formatShortDate } from '../../utils/formatDate';

const PERKS = [
  {
    icon: CalendarDays,
    title: 'Create & manage events',
    desc: 'Build events with multiple ticket tiers, set prices, and go live instantly.',
    color: '#2563eb',
  },
  {
    icon: BarChart3,
    title: 'Track your sales',
    desc: 'Real-time dashboard showing revenue, bookings, and ticket availability.',
    color: '#10b981',
  },
  {
    icon: QrCode,
    title: 'Gate check-in',
    desc: 'Scan attendee QR codes at the door with your phone camera.',
    color: '#f59e0b',
  },
  {
    icon: Users,
    title: 'Manage attendees',
    desc: 'View all bookings, download attendee lists, and handle check-ins.',
    color: '#8b5cf6',
  },
];

const EVENT_TYPE_OPTIONS = [
  'Music & Concerts',
  'Technology & Conferences',
  'Business & Networking',
  'Arts & Culture',
  'Food & Drink',
  'Sports & Fitness',
  'Education & Workshops',
  'Health & Wellness',
  'Other',
];

// ── Pending state screen ──────────────────────────────────────
function PendingScreen({ application }) {
  return (
    <div className="flex flex-col items-center text-center max-w-md mx-auto py-12 px-6">
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-full bg-warning/10 border-2 border-warning/30 flex items-center justify-center">
          <Clock size={32} className="text-warning" strokeWidth={1.5} />
        </div>
        <div
          className="absolute inset-0 rounded-full border border-warning/20 animate-ping"
          style={{ animationDuration: '2.5s' }}
        />
      </div>

      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-warning/10 border border-warning/20 rounded-full mb-5">
        <span className="text-xs font-bold text-warning uppercase tracking-widest">
          Under Review
        </span>
      </div>

      <h2 className="text-2xl font-black text-primary tracking-tight mb-3">
        Application submitted!
      </h2>
      <p className="text-sm text-secondary leading-relaxed mb-8 max-w-xs">
        Your application is being reviewed. We'll notify you once a decision has
        been made — usually within 24–48 hours.
      </p>

      {application && (
        <div className="w-full bg-card border border-border rounded-card p-4 text-left mb-8">
          <p className="text-xs font-bold text-muted uppercase tracking-wider mb-3">
            Your submission
          </p>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted">Organisation</span>
              <span className="text-xs font-semibold text-primary">
                {application.org_name}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted">Event types</span>
              <span className="text-xs font-semibold text-primary">
                {application.event_types}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted">Submitted</span>
              <span className="text-xs font-semibold text-primary">
                {formatShortDate(application.created_at)}
              </span>
            </div>
          </div>
        </div>
      )}

      <Link
        to="/dashboard"
        className="flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent-hover transition-colors"
      >
        Back to dashboard <ChevronRight size={14} strokeWidth={2.5} />
      </Link>
    </div>
  );
}

// ── Approved screen ───────────────────────────────────────────
function ApprovedScreen() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center text-center max-w-md mx-auto py-12 px-6">
      <div className="w-20 h-20 rounded-full bg-success/10 border-2 border-success/30 flex items-center justify-center mb-6">
        <CheckCircle2 size={32} className="text-success" strokeWidth={1.5} />
      </div>

      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-success/10 border border-success/20 rounded-full mb-5">
        <span className="text-xs font-bold text-success uppercase tracking-widest">
          Approved
        </span>
      </div>

      <h2 className="text-2xl font-black text-primary tracking-tight mb-3">
        You're an organizer!
      </h2>
      <p className="text-sm text-secondary leading-relaxed mb-8 max-w-xs">
        Your application was approved. You now have full access to create
        events, manage bookings, and check in attendees.
      </p>

      <Button
        variant="primary"
        size="md"
        icon={<ArrowRight size={16} strokeWidth={2.5} />}
        onClick={() => navigate('/organizer/dashboard')}
        className="w-full max-w-xs"
      >
        Go to Organizer Dashboard
      </Button>
    </div>
  );
}

// ── Rejected screen ───────────────────────────────────────────
function RejectedScreen({ onReapply }) {
  return (
    <div className="flex flex-col items-center text-center max-w-md mx-auto py-12 px-6">
      <div className="w-20 h-20 rounded-full bg-error/10 border-2 border-error/30 flex items-center justify-center mb-6">
        <XCircle size={32} className="text-error" strokeWidth={1.5} />
      </div>

      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-error/10 border border-error/20 rounded-full mb-5">
        <span className="text-xs font-bold text-error uppercase tracking-widest">
          Not approved
        </span>
      </div>

      <h2 className="text-2xl font-black text-primary tracking-tight mb-3">
        Application not approved
      </h2>
      <p className="text-sm text-secondary leading-relaxed mb-8 max-w-xs">
        Unfortunately your application wasn't approved this time. You're welcome
        to reapply with more details about your event plans.
      </p>

      <Button
        variant="primary"
        size="md"
        onClick={onReapply}
        className="w-full max-w-xs"
      >
        Apply again
      </Button>
    </div>
  );
}

// ── Application form ──────────────────────────────────────────
function ApplicationForm({ onSubmit, loading, fieldErrors, submitError }) {
  const [form, setForm] = useState({
    org_name: '',
    event_types: '',
    phone: '',
    reason: '',
  });

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(form);
  }

  const isValid =
    form.org_name.trim().length >= 2 &&
    form.event_types.trim().length >= 2 &&
    form.phone.trim().length >= 7;

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {submitError && (
        <div className="flex items-start gap-2 p-3 bg-error/10 border border-error/20 rounded-card">
          <XCircle size={15} className="text-error shrink-0 mt-0.5" />
          <p className="text-xs text-error">{submitError}</p>
        </div>
      )}

      <Input
        label="Organisation or event brand name"
        type="text"
        placeholder="e.g. Lagos Tech Hub, Afrobeat Fest..."
        value={form.org_name}
        onChange={(e) => handleChange('org_name', e.target.value)}
        error={fieldErrors?.org_name}
        icon={<Mic2 size={17} />}
        disabled={loading}
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-primary select-none">
          What type of events will you host?
        </label>
        <select
          value={form.event_types}
          onChange={(e) => handleChange('event_types', e.target.value)}
          disabled={loading}
          className={`w-full h-12 pl-4 pr-4 bg-card text-primary border rounded-card text-sm focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-180
            ${
              fieldErrors?.event_types
                ? 'border-error focus:ring-error/30'
                : 'border-border focus:ring-accent/30 focus:border-accent'
            }`}
        >
          <option value="">Select event type…</option>
          {EVENT_TYPE_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {fieldErrors?.event_types && (
          <p className="text-xs text-error">{fieldErrors.event_types}</p>
        )}
      </div>

      <Input
        label="Phone number"
        type="tel"
        placeholder="e.g. 08012345678"
        value={form.phone}
        onChange={(e) => handleChange('phone', e.target.value)}
        error={fieldErrors?.phone}
        icon={<Phone size={17} />}
        disabled={loading}
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-primary select-none">
          Tell us about your plans{' '}
          <span className="text-muted font-normal">(optional)</span>
        </label>
        <textarea
          value={form.reason}
          onChange={(e) => handleChange('reason', e.target.value)}
          placeholder="Briefly describe the events you plan to host, your experience, and your audience…"
          rows={4}
          disabled={loading}
          className="w-full px-4 py-3 bg-card text-primary border border-border rounded-card text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors duration-180 resize-none disabled:opacity-50 disabled:cursor-not-allowed leading-relaxed"
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        loading={loading}
        disabled={!isValid}
        className="w-full mt-2"
        iconRight={!loading && <ArrowRight size={16} strokeWidth={2.5} />}
      >
        Submit Application
      </Button>

      <p className="text-xs text-muted text-center">
        Applications are typically reviewed within 24–48 hours.
      </p>
    </form>
  );
}

// ── Main page ─────────────────────────────────────────────────
export default function BecomeOrganizerPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const user = useAuthStore((s) => s.user);

  const {
    myApplication,
    myApplicationLoading,
    myApplicationChecked,
    fetchMyApplication,
    hasPendingApplication,
    hasApprovedApplication,
    hasRejectedApplication,
    canApply,
    submitting,
    submitError,
    fieldErrors,
    submitApplication,
  } = useOrganizerApplication();

  useEffect(() => {
    fetchMyApplication();
  }, []);

  async function handleSubmit(formData) {
    const success = await submitApplication(formData);
    if (success) setShowForm(false);
  }

  // Loading state
  if (myApplicationLoading || !myApplicationChecked) {
    return (
      <div className="flex flex-col min-h-screen bg-main-bg">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
            <p className="text-sm text-muted">Loading…</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-main-bg">
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-10">
        {/* ── Pending state ─────────────────────────────────── */}
        {hasPendingApplication && !showForm && (
          <PendingScreen application={myApplication} />
        )}

        {/* ── Approved state ────────────────────────────────── */}
        {hasApprovedApplication && !showForm && <ApprovedScreen />}

        {/* ── Rejected state ────────────────────────────────── */}
        {hasRejectedApplication && !showForm && (
          <RejectedScreen onReapply={() => setShowForm(true)} />
        )}

        {/* ── Application form or landing ───────────────────── */}
        {(canApply || showForm) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left: pitch */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-text border border-accent-border rounded-full mb-6">
                <Sparkles size={13} className="text-accent" />
                <span className="text-xs font-semibold text-accent">
                  For event organisers
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-primary tracking-tight leading-tight mb-4">
                Ready to host your event on Ticketer?
              </h1>
              <p className="text-sm text-secondary leading-relaxed mb-8 max-w-md">
                Apply to become an organizer and unlock powerful tools to create
                events, sell tickets, and manage your audience — all in one
                platform.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {PERKS.map(({ icon: Icon, title, desc, color }) => (
                  <div
                    key={title}
                    className="flex items-start gap-3 p-4 bg-card border border-border rounded-card hover:border-accent/20 transition-colors duration-150"
                  >
                    <div
                      className="w-8 h-8 rounded-btn flex items-center justify-center shrink-0"
                      style={{ background: `${color}15` }}
                    >
                      <Icon size={15} strokeWidth={1.75} style={{ color }} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-primary">{title}</p>
                      <p className="text-xs text-muted mt-0.5 leading-snug">
                        {desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 p-4 bg-accent-text border border-accent-border rounded-card">
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center shrink-0">
                  <span className="text-xs font-black text-white">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-primary">
                    Applying as {user?.name}
                  </p>
                  <p className="text-xs text-muted">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Right: form */}
            <div className="bg-card border border-border rounded-card p-6 lg:sticky lg:top-24">
              <h2 className="text-lg font-bold text-primary mb-1">
                Organizer application
              </h2>
              <p className="text-sm text-secondary mb-6">
                Fill in your details and we'll review your application within
                24–48 hours.
              </p>

              <ApplicationForm
                onSubmit={handleSubmit}
                loading={submitting}
                fieldErrors={fieldErrors}
                submitError={submitError}
              />
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
