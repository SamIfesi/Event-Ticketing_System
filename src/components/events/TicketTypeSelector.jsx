// Renders all ticket types for a single event and lets the user
// pick a type + quantity before proceeding to payment.
//
// Used inside EventDetailPage's sticky sidebar.
//
// Props:
//   ticketTypes  — array from event.ticket_types
//   disabled     — true when event is past or cancelled
//   onSelect     — callback({ ticketType, quantity })
//   loading      — shows skeleton while loading

import { useState } from 'react';
import { Ticket, Minus, Plus, AlertCircle, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';
import Button from '../ui/Button';

// ── Single ticket type row ────────────────────────────────────
function TicketTypeRow({ ticketType, selected, onSelect, disabled }) {
  const available =
    (ticketType.quantity ?? 0) - (ticketType.quantity_sold ?? 0);
  const soldOut = available <= 0;
  const isFree = Number(ticketType.price) === 0;
  const isLow = !soldOut && available <= 10;

  return (
    <button
      type="button"
      disabled={soldOut || disabled}
      onClick={() => !soldOut && !disabled && onSelect(ticketType)}
      className={`w-full text-left border rounded-card p-4 transition-all duration-150 ${
        soldOut || disabled
          ? 'border-border opacity-60 cursor-not-allowed'
          : selected
            ? 'border-accent ring-2 ring-accent/20 bg-accent-text'
            : 'border-border hover:border-accent/40 hover:shadow-sm cursor-pointer'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Name + selected check */}
          <div className="flex items-center gap-2">
            <p className="font-bold text-sm text-primary truncate">
              {ticketType.name}
            </p>
            {selected && (
              <CheckCircle2
                size={15}
                className="text-accent shrink-0"
                strokeWidth={2.5}
              />
            )}
          </div>

          {ticketType.description && (
            <p className="text-xs text-secondary mt-1 leading-relaxed line-clamp-2">
              {ticketType.description}
            </p>
          )}

          {/* Availability hint */}
          <div className="mt-2">
            {soldOut ? (
              <span className="text-xs font-semibold text-error">Sold out</span>
            ) : isLow ? (
              <span className="text-xs font-semibold text-warning">
                Only {available} left
              </span>
            ) : (
              <span className="text-xs text-muted">
                {available.toLocaleString()} available
              </span>
            )}
          </div>
        </div>

        {/* Price */}
        <div className="shrink-0 text-right">
          <span className="font-black text-primary text-base">
            {isFree ? 'Free' : formatCurrency(ticketType.price)}
          </span>
          {!isFree && <p className="text-[11px] text-muted">per ticket</p>}
        </div>
      </div>

      {/* Low stock bar */}
      {isLow && !soldOut && (
        <div className="mt-3 h-1 bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-warning rounded-full transition-all"
            style={{
              width: `${Math.min((available / (ticketType.quantity ?? 1)) * 100, 100)}%`,
            }}
          />
        </div>
      )}
    </button>
  );
}

// ── Quantity stepper ──────────────────────────────────────────
function QuantityStepper({ value, min = 1, max = 10, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
        className="w-9 h-9 flex items-center justify-center rounded-btn border border-border text-primary hover:bg-border disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150 touch-manipulation"
      >
        <Minus size={14} strokeWidth={2.5} />
      </button>

      <span className="w-8 text-center font-bold text-primary tabular-nums">
        {value}
      </span>

      <button
        type="button"
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        className="w-9 h-9 flex items-center justify-center rounded-btn border border-border text-primary hover:bg-border disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150 touch-manipulation"
      >
        <Plus size={14} strokeWidth={2.5} />
      </button>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────
function TicketTypeSkeleton() {
  return (
    <div className="border border-border rounded-card p-4 animate-pulse">
      <div className="flex justify-between mb-3">
        <div className="flex-1">
          <div className="h-4 bg-border rounded w-24 mb-2" />
          <div className="h-3 bg-border rounded w-40" />
        </div>
        <div className="h-6 bg-border rounded w-16" />
      </div>
      <div className="h-9 bg-border rounded-btn mt-2" />
    </div>
  );
}

// ── Main component ────────────────────────────────────────────
export default function TicketTypeSelector({
  ticketTypes = [],
  disabled = false,
  loading = false,
  onSelect,
}) {
  const [selectedType, setSelectedType] = useState(null);
  const [quantity, setQuantity] = useState(1);

  function handleTypeSelect(ticketType) {
    setSelectedType(ticketType);
    setQuantity(1);
  }

  function handleConfirm() {
    if (!selectedType || !onSelect) return;
    onSelect({ ticketType: selectedType, quantity });
  }

  const available = selectedType
    ? (selectedType.quantity ?? 0) - (selectedType.quantity_sold ?? 0)
    : 0;
  const maxQty = Math.min(available, 10);
  const total = selectedType ? Number(selectedType.price) * quantity : 0;
  const isFree = selectedType && Number(selectedType.price) === 0;

  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        <TicketTypeSkeleton />
        <TicketTypeSkeleton />
      </div>
    );
  }

  if (!ticketTypes.length) {
    return (
      <div className="text-center py-6">
        <Ticket
          size={24}
          className="text-muted mx-auto mb-2"
          strokeWidth={1.5}
        />
        <p className="text-sm text-secondary">
          Ticket details not yet available.
        </p>
        <p className="text-xs text-muted mt-1">
          Check back closer to the event date.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Type list */}
      {ticketTypes.map((tt) => (
        <TicketTypeRow
          key={tt.id}
          ticketType={tt}
          selected={selectedType?.id === tt.id}
          onSelect={handleTypeSelect}
          disabled={disabled}
        />
      ))}

      {/* Quantity + CTA — only shown when a type is selected */}
      {selectedType && !disabled && (
        <div className="mt-1 p-4 bg-main-bg border border-border rounded-card flex flex-col gap-4">
          {/* Quantity row */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-primary">Quantity</p>
              <p className="text-xs text-muted">Max 10 per order</p>
            </div>
            <QuantityStepper
              value={quantity}
              min={1}
              max={maxQty}
              onChange={setQuantity}
            />
          </div>

          {/* Total */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <span className="text-sm text-secondary">Total</span>
            <span className="font-black text-primary text-lg">
              {isFree ? 'Free' : formatCurrency(total)}
            </span>
          </div>

          {/* CTA */}
          <Button
            variant="primary"
            size="md"
            className="w-full"
            onClick={handleConfirm}
          >
            {isFree ? 'Reserve ticket' : `Pay ${formatCurrency(total)}`}
          </Button>
        </div>
      )}

      {/* Disabled warning */}
      {disabled && (
        <div className="flex items-start gap-2 p-3 bg-border rounded-btn">
          <AlertCircle size={15} className="text-muted shrink-0 mt-0.5" />
          <p className="text-xs text-secondary">
            Ticket sales are closed for this event.
          </p>
        </div>
      )}
    </div>
  );
}
