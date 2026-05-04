import { CalendarDays, BarChart3, QrCode, Users, Sparkles } from 'lucide-react';

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

export default function OrganizerPitch({ user }) {
  return (
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
        Apply to become an organizer and unlock powerful tools to create events,
        sell tickets, and manage your audience — all in one platform.
      </p>

      {/* Perks grid */}
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
              <p className="text-xs text-muted mt-0.5 leading-snug">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Who is applying */}
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
  );
}
