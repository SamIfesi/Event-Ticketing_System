import { useState } from 'react';
import { Mic2, Phone, XCircle, ArrowRight } from 'lucide-react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

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

export default function ApplicationForm({ onSubmit, loading, fieldErrors, submitError }) {
  const [form, setForm] = useState({
    org_name: '',
    event_type: '',
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
    form.event_type.trim().length >= 2 &&
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
          value={form.event_type}
          onChange={(e) => handleChange('event_type', e.target.value)}
          disabled={loading}
          className={`w-full h-12 pl-4 pr-4 bg-card text-primary border rounded-card text-sm focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-180
            ${
              fieldErrors?.event_type
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
        {fieldErrors?.event_type && (
          <p className="text-xs text-error">{fieldErrors.event_type}</p>
        )}
      </div>

      <Input
        label="Phone number"
        type="tel"
        placeholder="e.g. 08012345678"
        value={form.phone}
        onChange={(e) => handleChange('phone', e.target.value)}
        error={fieldErrors?.phone}
        icon={<Phone size={15} />}
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