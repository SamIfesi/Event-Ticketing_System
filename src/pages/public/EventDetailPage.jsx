// Single event detail page. Uses useEvents().fetchEvent(id) which calls
// GET /api/events/:id — this endpoint returns the full event object
// including ticket_types[] with price, quantity, quantity_sold, etc.
//
// The booking flow (selecting a ticket type → Paystack popup) lives in
// useBookings and will be wired here once the payment pages are built.
// For now the "Buy ticket" button is rendered but shows a coming-soon toast.

import { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  Users,
  Ticket,
  CheckCircle,
  AlertCircle,
  Share2,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { useEvents } from '../../hooks/useEvents';
import { useAuthStore } from '../../store/authStore';
import { useUiStore } from '../../store/uiStore';
import {
  formatEventDate,
  formatTime,
  isEventPast,
} from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import logo from '/assets/icons/logo.svg';

// ── Ticket type card ─────────────────────────────────────────────────────────
// Renders a single ticket tier (Regular, VIP, Early Bird, etc.)
// Shows availability, price, and a buy button.
function TicketTypeCard({ ticketType, onSelect, disabled }) {
  const available =
    (ticketType.quantity ?? 0) - (ticketType.quantity_sold ?? 0);
  const soldOut = available <= 0;
  const isFree = Number(ticketType.price) === 0;

  return (
    <div
      className={`border rounded-card p-4 transition-all duration-150 ${
        soldOut
          ? 'border-border opacity-60 cursor-not-allowed'
          : 'border-border hover:border-accent/40 hover:shadow-md cursor-pointer'
      }`}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-primary text-sm">{ticketType.name}</h3>
          {ticketType.description && (
            <p className="text-xs text-secondary mt-1 leading-relaxed">
              {ticketType.description}
            </p>
          )}
        </div>
        {/* Price badge */}
        <div className="shrink-0 text-right">
          <span className="font-black text-primary text-lg">
            {isFree ? 'Free' : formatCurrency(ticketType.price)}
          </span>
          {!isFree && <p className="text-xs text-muted">per ticket</p>}
        </div>
      </div>

      {/* Availability bar */}
      {!soldOut && available <= 20 && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-warning font-medium">
              Only {available} left
            </span>
          </div>
          <div className="h-1.5 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-warning rounded-full"
              style={{
                width: `${Math.min((available / ticketType.quantity) * 100, 100)}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Action button */}
      <Button
        variant={soldOut ? 'secondary' : 'primary'}
        size="sm"
        disabled={soldOut || disabled}
        onClick={() => !soldOut && onSelect(ticketType)}
        className="w-full mt-1"
      >
        {soldOut ? 'Sold out' : 'Select ticket'}
      </Button>
    </div>
  );
}

// ── Skeleton for the ticket type section ─────────────────────────────────────
function TicketSkeleton() {
  return (
    <div className="border border-border rounded-card p-4 animate-pulse">
      <div className="flex justify-between mb-3">
        <div className="flex-1">
          <div className="h-4 bg-border rounded w-24 mb-2" />
          <div className="h-3 bg-border rounded w-40" />
        </div>
        <div className="h-7 bg-border rounded w-20" />
      </div>
      <div className="h-9 bg-border rounded-btn" />
    </div>
  );
}

// ── Page skeleton while the event loads ──────────────────────────────────────
function PageSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="w-full h-72 sm:h-96 bg-border" />
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-5">
          <div className="h-8 bg-border rounded w-3/4" />
          <div className="h-4 bg-border rounded w-1/3" />
          <div className="space-y-2 mt-4">
            <div className="h-3 bg-border rounded" />
            <div className="h-3 bg-border rounded" />
            <div className="h-3 bg-border rounded w-4/5" />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <TicketSkeleton />
          <TicketSkeleton />
        </div>
      </div>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const isLoggedIn = Boolean(token);
  const toastInfo = useUiStore((s) => s.toastInfo);

  const { event, eventLoading, eventError, fetchEvent } = useEvents();

  // Load the event when the page mounts or the URL id changes
  useEffect(() => {
    if (id) fetchEvent(id);
  }, [id]);

  // ── Derived state ────────────────────────────────────────────────────────
  const isPast = event
    ? isEventPast(event.end_date ?? event.start_date)
    : false;
  const isFullySoldOut =
    event?.ticket_types?.length > 0 &&
    event.ticket_types.every((tt) => tt.quantity - tt.quantity_sold <= 0);

  // ── Ticket selection ─────────────────────────────────────────────────────
  // Once the booking / payment pages are wired, this will navigate to checkout.
  // For now it shows a toast explaining the feature is coming.
  function handleSelectTicket(ticketType) {
    if (!isLoggedIn) {
      navigate('/login', { state: { from: `/events/${id}` } });
      return;
    }
    // TODO: navigate(`/payment/checkout?event=${id}&ticket_type=${ticketType.id}`)
    toastInfo(`Booking flow coming soon! You selected: ${ticketType.name}`);
  }

  // ── Share button ─────────────────────────────────────────────────────────
  function handleShare() {
    if (navigator.share) {
      navigator
        .share({ title: event?.title, url: window.location.href })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toastInfo('Link copied to clipboard!');
    }
  }

  // ── Error state ──────────────────────────────────────────────────────────
  if (eventError && !eventLoading) {
    return (
      <div className="min-h-screen bg-main-bg flex flex-col items-center justify-center gap-5 px-6 text-center">
        <AlertCircle size={40} className="text-error" strokeWidth={1.5} />
        <div>
          <p className="font-bold text-primary text-lg">Event not found</p>
          <p className="text-sm text-secondary mt-1">
            This event may have been removed or is no longer available.
          </p>
        </div>
        <Link
          to="/events"
          className="flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-hover transition-colors"
        >
          <ArrowLeft size={15} strokeWidth={2.5} /> Browse events
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-main-bg">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <Link to="/home" className="shrink-0">
            <img src={logo} alt="Ticketer" className="h-6" />
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/events"
              className="text-sm font-medium text-secondary hover:text-primary transition-colors duration-150"
            >
              Browse Events
            </Link>
            {isLoggedIn && (
              <>
                <Link
                  to="/my-bookings"
                  className="text-sm font-medium text-secondary hover:text-primary transition-colors duration-150"
                >
                  My Bookings
                </Link>
                <Link
                  to="/my-tickets"
                  className="text-sm font-medium text-secondary hover:text-primary transition-colors duration-150"
                >
                  My Tickets
                </Link>
              </>
            )}
          </nav>
          <div className="flex items-center gap-2 shrink-0">
            {isLoggedIn ? (
              <Link to="/profile" className="flex items-center gap-2 px-3">
                <div className="w-10 h-10 rounded-full bg-accent-text flex items-center justify-center">
                  <span className="font-bold text-accent text-sm">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 text-sm font-semibold text-secondary hover:text-primary transition-colors duration-150"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="h-9 px-4 bg-accent hover:bg-accent-hover text-white text-sm font-semibold rounded-btn transition-colors duration-180 flex items-center"
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      {!eventLoading && event && (
        <nav className="bg-card border-b border-border">
          <div className="max-w-6xl mx-auto px-6 h-10 flex items-center gap-2 text-xs text-secondary">
            <Link to="/events" className="hover:text-primary transition-colors">
              Events
            </Link>
            <ChevronRight size={12} className="text-muted" />
            {event.category_name && (
              <>
                <Link
                  to={`/events?category=${event.category_id ?? ''}`}
                  className="hover:text-primary transition-colors"
                >
                  {event.category_name}
                </Link>
                <ChevronRight size={12} className="text-muted" />
              </>
            )}
            <span className="text-primary font-medium truncate max-w-[200px]">
              {event.title}
            </span>
          </div>
        </nav>
      )}

      {/* Main content */}
      {eventLoading ? (
        <PageSkeleton />
      ) : event ? (
        <>
          {/* ── Hero banner ─────────────────────────────────────────────── */}
          <div
            className="relative w-full bg-gradient-to-br from-blue-600 to-indigo-800 overflow-hidden"
            style={{ height: '360px' }}
          >
            {event.banner_image ? (
              <img
                src={event.banner_image}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            ) : (
              // No banner: show the first letter as a giant decorative mark
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className="text-white/10 font-black select-none"
                  style={{
                    fontSize: 'clamp(8rem, 20vw, 16rem)',
                    lineHeight: 1,
                  }}
                >
                  {event.title.charAt(0)}
                </span>
              </div>
            )}

            {/* Dark overlay so text is readable if there is a banner */}
            {event.banner_image && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            )}

            {/* Status badges overlaid on the banner */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              {event.category_name && (
                <span className="px-2.5 py-1 bg-black/50 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                  {event.category_name}
                </span>
              )}
              {isPast && (
                <span className="px-2.5 py-1 bg-black/50 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                  Past event
                </span>
              )}
            </div>

            {/* Share button */}
            <button
              onClick={handleShare}
              aria-label="Share this event"
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors touch-manipulation"
            >
              <Share2 size={16} strokeWidth={2} />
            </button>
          </div>

          {/* ── Body: info + ticket sidebar ─────────────────────────────── */}
          <div className="max-w-6xl mx-auto px-6 py-10 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Left column: event details */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                {/* Title + status */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge status={event.status} size="sm" dot />
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-primary tracking-tight leading-tight">
                    {event.title}
                  </h1>
                  {event.organizer_name && (
                    <p className="text-sm text-secondary mt-2">
                      Hosted by{' '}
                      <span className="font-semibold text-primary">
                        {event.organizer_name}
                      </span>
                    </p>
                  )}
                </div>

                {/* Key details strip */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Date */}
                  <div className="flex items-start gap-3 p-4 bg-card border border-border rounded-card">
                    <div className="w-9 h-9 rounded-btn bg-accent-text flex items-center justify-center shrink-0">
                      <Calendar
                        size={17}
                        className="text-accent"
                        strokeWidth={1.75}
                      />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted uppercase tracking-wide">
                        Date
                      </p>
                      <p className="text-sm font-semibold text-primary mt-0.5">
                        {formatEventDate(event.start_date)}
                      </p>
                      <p className="text-xs text-secondary mt-0.5">
                        {formatTime(event.start_date)}
                        {event.end_date && ` – ${formatTime(event.end_date)}`}
                      </p>
                    </div>
                  </div>

                  {/* Location */}
                  {event.location && (
                    <div className="flex items-start gap-3 p-4 bg-card border border-border rounded-card">
                      <div className="w-9 h-9 rounded-btn bg-accent-text flex items-center justify-center shrink-0">
                        <MapPin
                          size={17}
                          className="text-accent"
                          strokeWidth={1.75}
                        />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted uppercase tracking-wide">
                          Location
                        </p>
                        <p className="text-sm font-semibold text-primary mt-0.5">
                          {event.location}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Tickets */}
                  {event.total_tickets > 0 && (
                    <div className="flex items-start gap-3 p-4 bg-card border border-border rounded-card">
                      <div className="w-9 h-9 rounded-btn bg-accent-text flex items-center justify-center shrink-0">
                        <Ticket
                          size={17}
                          className="text-accent"
                          strokeWidth={1.75}
                        />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted uppercase tracking-wide">
                          Tickets
                        </p>
                        <p className="text-sm font-semibold text-primary mt-0.5">
                          {(
                            event.total_tickets - (event.tickets_sold ?? 0)
                          ).toLocaleString()}{' '}
                          remaining
                        </p>
                        <p className="text-xs text-secondary mt-0.5">
                          of {event.total_tickets.toLocaleString()} total
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Attendees (just tickets_sold as a proxy) */}
                  {event.tickets_sold > 0 && (
                    <div className="flex items-start gap-3 p-4 bg-card border border-border rounded-card">
                      <div className="w-9 h-9 rounded-btn bg-accent-text flex items-center justify-center shrink-0">
                        <Users
                          size={17}
                          className="text-accent"
                          strokeWidth={1.75}
                        />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted uppercase tracking-wide">
                          Attending
                        </p>
                        <p className="text-sm font-semibold text-primary mt-0.5">
                          {event.tickets_sold.toLocaleString()} people
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                {event.description && (
                  <div>
                    <h2 className="text-base font-bold text-primary mb-3">
                      About this event
                    </h2>
                    {/* Render the description as-is; in production you'd sanitize HTML */}
                    <div className="text-sm text-secondary leading-relaxed whitespace-pre-wrap">
                      {event.description}
                    </div>
                  </div>
                )}

                {/* Back link */}
                <div className="pt-4 border-t border-border">
                  <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-secondary hover:text-primary transition-colors duration-150"
                  >
                    <ArrowLeft size={15} strokeWidth={2.5} />
                    Back
                  </button>
                </div>
              </div>

              {/* Right column: sticky ticket panel */}
              <div className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
                {/* Panel header */}
                <div className="bg-card border border-border rounded-card p-4">
                  <h2 className="font-bold text-primary mb-1">Get tickets</h2>

                  {/* Past event warning */}
                  {isPast && (
                    <div className="flex items-start gap-2 p-3 bg-border rounded-btn mb-3 mt-2">
                      <AlertCircle
                        size={15}
                        className="text-muted shrink-0 mt-0.5"
                      />
                      <p className="text-xs text-secondary">
                        This event has already taken place.
                      </p>
                    </div>
                  )}

                  {/* Fully sold out warning */}
                  {!isPast && isFullySoldOut && (
                    <div className="flex items-start gap-2 p-3 bg-border rounded-btn mb-3 mt-2">
                      <AlertCircle
                        size={15}
                        className="text-error shrink-0 mt-0.5"
                      />
                      <p className="text-xs text-secondary">
                        All ticket types are sold out.
                      </p>
                    </div>
                  )}

                  {/* Ticket type cards */}
                  <div className="flex flex-col gap-3 mt-3">
                    {event.ticket_types && event.ticket_types.length > 0 ? (
                      event.ticket_types.map((tt) => (
                        <TicketTypeCard
                          key={tt.id}
                          ticketType={tt}
                          onSelect={handleSelectTicket}
                          disabled={isPast}
                        />
                      ))
                    ) : (
                      // No ticket types configured yet
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
                    )}
                  </div>
                </div>

                {/* Login nudge for guests */}
                {!isLoggedIn && event.ticket_types?.length > 0 && !isPast && (
                  <div className="bg-accent-text border border-accent-border rounded-card p-4 flex flex-col gap-2">
                    <p className="text-xs font-semibold text-accent">
                      Sign in to book
                    </p>
                    <p className="text-xs text-secondary">
                      Create a free account to purchase tickets and manage your
                      bookings.
                    </p>
                    <Link
                      to={`/register`}
                      state={{ from: `/events/${id}` }}
                      className="mt-1 text-xs font-semibold text-accent hover:text-accent-hover transition-colors"
                    >
                      Create account →
                    </Link>
                  </div>
                )}

                {/* Share */}
                <button
                  onClick={handleShare}
                  className="flex items-center justify-center gap-2 h-10 border border-border rounded-btn text-sm font-medium text-secondary hover:text-primary hover:border-accent/40 transition-all duration-150 touch-manipulation"
                >
                  <Share2 size={15} strokeWidth={2} />
                  Share event
                </button>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
