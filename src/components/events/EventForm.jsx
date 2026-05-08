// Shared form used by both CreateEventPage and EditEventPage.
// Handles: title, description, category, location, banner_image URL,
//          start_date, end_date, total_tickets, status, ticket_types[]
//
// Props:
//   initialValues — pre-filled data (for edit mode)
//   categories    — array from CategoryService
//   loading       — disables submit while mutating
//   error         — top-level error string
//   fieldErrors   — { field: message } from backend validation
//   onSubmit      — (formData) => void
//   submitLabel   — button label e.g. "Create Event" | "Save Changes"

import { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Image,
  MapPin,
  Calendar,
  Tag,
  FileText,
  Ticket,
  ChevronDown,
  XCircle,
  Info,
} from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { formatCurrency } from '../../utils/formatCurrency';

// ── Ticket type row ───────────────────────────────────────────
function TicketTypeRow({ tt, index, onChange, onRemove, disabled }) {
  return (
    <div className="relative bg-main-bg border border-border rounded-card p-4 flex flex-col gap-3">
      {/* Remove button */}
      {index > 0 && (
        <button
          type="button"
          onClick={() => onRemove(index)}
          disabled={disabled}
          className="absolute top-3 right-3 text-muted hover:text-error transition-colors disabled:opacity-50"
          aria-label="Remove ticket type"
        >
          <Trash2 size={14} strokeWidth={2} />
        </button>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Name */}
        <Input
          label="Ticket name"
          placeholder="e.g. Regular, VIP, Early Bird"
          value={tt.name}
          onChange={(e) => onChange(index, 'name', e.target.value)}
          disabled={disabled}
          icon={<Ticket size={15} />}
        />

        {/* Price */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-primary select-none">
            Price (₦)
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3.5 text-muted text-sm font-semibold pointer-events-none">
              ₦
            </span>
            <input
              type="number"
              min="0"
              step="100"
              placeholder="0 for free"
              value={tt.price}
              onChange={(e) => onChange(index, 'price', e.target.value)}
              disabled={disabled}
              className="w-full h-12 pl-8 pr-4 bg-bg text-primary border border-border rounded-card text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors disabled:opacity-50"
            />
          </div>
          {tt.price > 0 && (
            <p className="text-xs text-muted">{formatCurrency(tt.price)}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Quantity */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-primary select-none">
            Quantity
          </label>
          <input
            type="number"
            min="1"
            placeholder="e.g. 100"
            value={tt.quantity}
            onChange={(e) => onChange(index, 'quantity', e.target.value)}
            disabled={disabled}
            className="w-full h-12 px-4 bg-bg text-primary border border-border rounded-card text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors disabled:opacity-50"
          />
        </div>

        {/* Sales end */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-primary select-none">
            Sales end <span className="text-muted font-normal">(optional)</span>
          </label>
          <input
            type="datetime-local"
            value={tt.sales_end_at ?? ''}
            onChange={(e) => onChange(index, 'sales_end_at', e.target.value)}
            disabled={disabled}
            className="w-full h-12 px-4 bg-bg text-primary border border-border rounded-card text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors disabled:opacity-50"
          />
        </div>
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-primary select-none">
          Description <span className="text-muted font-normal">(optional)</span>
        </label>
        <input
          type="text"
          placeholder="Brief description of what's included…"
          value={tt.description ?? ''}
          onChange={(e) => onChange(index, 'description', e.target.value)}
          disabled={disabled}
          className="w-full h-12 px-4 bg-bg text-primary border border-border rounded-card text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors disabled:opacity-50"
        />
      </div>
    </div>
  );
}

// ── Defaults ──────────────────────────────────────────────────
const EMPTY_TICKET = { name: '', price: 0, quantity: '', description: '', sales_end_at: '' };

const DEFAULT_VALUES = {
  title: '',
  description: '',
  category_id: '',
  location: '',
  banner_image: '',
  start_date: '',
  end_date: '',
  total_tickets: '',
  status: 'draft',
  ticket_types: [{ ...EMPTY_TICKET }],
};

// ── Main component ────────────────────────────────────────────
export default function EventForm({
  initialValues,
  categories = [],
  loading = false,
  error,
  fieldErrors = {},
  onSubmit,
  submitLabel = 'Create Event',
}) {
  const [form, setForm] = useState({ ...DEFAULT_VALUES, ...initialValues });

  // Sync if initialValues change (edit mode data arriving async)
  useEffect(() => {
    if (initialValues) {
      setForm((prev) => ({ ...prev, ...initialValues }));
    }
  }, [initialValues]);

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  // Ticket type helpers
  function updateTicket(index, field, value) {
    setForm((prev) => {
      const updated = prev.ticket_types.map((tt, i) =>
        i === index ? { ...tt, [field]: value } : tt
      );
      return { ...prev, ticket_types: updated };
    });
  }

  function addTicket() {
    setForm((prev) => ({
      ...prev,
      ticket_types: [...prev.ticket_types, { ...EMPTY_TICKET }],
    }));
  }

  function removeTicket(index) {
    setForm((prev) => ({
      ...prev,
      ticket_types: prev.ticket_types.filter((_, i) => i !== index),
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Derive total_tickets from sum of ticket type quantities if not set manually
    const totalFromTypes = form.ticket_types.reduce(
      (acc, tt) => acc + parseInt(tt.quantity || 0, 10),
      0
    );
    onSubmit({
      ...form,
      total_tickets: form.total_tickets || totalFromTypes,
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-8">

      {/* Top-level error */}
      {error && (
        <div className="flex items-start gap-2 p-3.5 bg-error/10 border border-error/20 rounded-card">
          <XCircle size={15} className="text-error shrink-0 mt-0.5" />
          <p className="text-xs text-error leading-relaxed">{error}</p>
        </div>
      )}

      {/* ── Section: Basic info ────────────────────────────── */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2 pb-2 border-b border-border">
          <FileText size={15} className="text-accent" />
          <h3 className="text-sm font-bold text-primary">Basic Information</h3>
        </div>

        <Input
          label="Event title"
          placeholder="e.g. Lagos Tech Summit 2026"
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
          error={fieldErrors.title}
          disabled={loading}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-primary select-none">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            placeholder="Tell attendees what this event is about…"
            rows={4}
            disabled={loading}
            className="w-full px-4 py-3 bg-bg text-primary border border-border rounded-card text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors resize-none disabled:opacity-50 leading-relaxed"
          />
          {fieldErrors.description && (
            <p className="text-xs text-error">{fieldErrors.description}</p>
          )}
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-primary select-none">
            Category <span className="text-muted font-normal">(optional)</span>
          </label>
          <div className="relative">
            <Tag size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
            <select
              value={form.category_id}
              onChange={(e) => set('category_id', e.target.value)}
              disabled={loading}
              className="w-full h-12 pl-10 pr-9 bg-bg text-primary border border-border rounded-card text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent appearance-none disabled:opacity-50 transition-colors"
            >
              <option value="">Select a category…</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
          </div>
        </div>

        {/* Location */}
        <Input
          label="Location / Venue"
          placeholder="e.g. Eko Hotel, Lagos"
          value={form.location}
          onChange={(e) => set('location', e.target.value)}
          error={fieldErrors.location}
          disabled={loading}
          icon={<MapPin size={15} />}
        />

        {/* Banner image URL */}
        <Input
          label={<>Banner image URL <span className="text-muted font-normal">(optional)</span></>}
          type="url"
          placeholder="https://… (image link)"
          value={form.banner_image}
          onChange={(e) => set('banner_image', e.target.value)}
          error={fieldErrors.banner_image}
          disabled={loading}
          icon={<Image size={15} />}
        />
        {form.banner_image && (
          <img
            src={form.banner_image}
            alt="Banner preview"
            className="w-full h-40 object-cover rounded-card border border-border"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        )}
      </section>

      {/* ── Section: Date & time ────────────────────────────── */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2 pb-2 border-b border-border">
          <Calendar size={15} className="text-accent" />
          <h3 className="text-sm font-bold text-primary">Date & Time</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-primary select-none">Start date & time</label>
            <input
              type="datetime-local"
              value={form.start_date}
              onChange={(e) => set('start_date', e.target.value)}
              disabled={loading}
              className="w-full h-12 px-4 bg-bg text-primary border border-border rounded-card text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors disabled:opacity-50"
            />
            {fieldErrors.start_date && (
              <p className="text-xs text-error">{fieldErrors.start_date}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-primary select-none">End date & time</label>
            <input
              type="datetime-local"
              value={form.end_date}
              onChange={(e) => set('end_date', e.target.value)}
              disabled={loading}
              className="w-full h-12 px-4 bg-bg text-primary border border-border rounded-card text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors disabled:opacity-50"
            />
            {fieldErrors.end_date && (
              <p className="text-xs text-error">{fieldErrors.end_date}</p>
            )}
          </div>
        </div>
      </section>

      {/* ── Section: Ticket types ────────────────────────────── */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <div className="flex items-center gap-2">
            <Ticket size={15} className="text-accent" />
            <h3 className="text-sm font-bold text-primary">Ticket Types</h3>
          </div>
          <button
            type="button"
            onClick={addTicket}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs font-semibold text-accent hover:text-accent-hover transition-colors disabled:opacity-50"
          >
            <Plus size={13} strokeWidth={2.5} /> Add type
          </button>
        </div>

        <div className="flex items-start gap-1.5 p-3 bg-accent-text border border-accent-border rounded-btn">
          <Info size={13} className="text-accent shrink-0 mt-0.5" />
          <p className="text-xs text-accent/80 leading-relaxed">
            Total ticket capacity is the sum of all ticket type quantities. Set price to 0 for free tickets.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {form.ticket_types.map((tt, i) => (
            <TicketTypeRow
              key={i}
              tt={tt}
              index={i}
              onChange={updateTicket}
              onRemove={removeTicket}
              disabled={loading}
            />
          ))}
        </div>
      </section>

      {/* ── Section: Publish settings ────────────────────────── */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2 pb-2 border-b border-border">
          <h3 className="text-sm font-bold text-primary">Publish Settings</h3>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-primary select-none">Status</label>
          <div className="relative">
            <select
              value={form.status}
              onChange={(e) => set('status', e.target.value)}
              disabled={loading}
              className="w-full h-12 pl-4 pr-9 bg-bg text-primary border border-border rounded-card text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent appearance-none disabled:opacity-50 transition-colors"
            >
              <option value="draft">Draft — not visible to public</option>
              <option value="published">Published — live and bookable</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
          </div>
          <p className="text-xs text-muted">
            You can always publish later from your events list.
          </p>
        </div>
      </section>

      {/* ── Submit ────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 pt-2">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          className="flex-1 sm:flex-none sm:min-w-45"
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}