import { useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import Button from '../../../components/ui/Button';

export function ApprovedScreen() {
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

export function RejectedScreen({ onReapply }) {
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
