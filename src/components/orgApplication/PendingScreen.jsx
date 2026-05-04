import { Link } from 'react-router-dom';
import { Clock, ChevronRight } from 'lucide-react';
import { formatShortDate } from '../../utils/formatDate';

export default function PendingScreen({ application }) {
  return (
    <div className="flex flex-col items-center text-center max-w-md mx-auto py-12 px-6">
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-full bg-warning/10 border-2 border-warning/30 flex items-center justify-center">
          <Clock size={32} className="text-warning" strokeWidth={1.5} />
        </div>
        <div
          className="absolute inset-0 rounded-full border border-warning/20 animate-ping"
          style={{ animationDuration: '1s' }}
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
              <span className="text-xs text-muted">Event type</span>
              <span className="text-xs font-semibold text-primary">
                {application.event_type}
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
