import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ChevronRight as ArrowRight } from 'lucide-react';
import EventsService from '../../services/events.service';
import CategoryEventCard from './CategoryEventCard';
import { getCategoryIcon } from '../../utils/categoryIcons';

// One Ticketmaster-style row: category title + "See all" link, with a
// horizontally scrolling, snap-aligned strip of event cards and optional
// arrow controls on desktop.
export default function CategoryEventRow({ category, limit = 8 }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollerRef = useRef(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    EventsService.getEvents({
      category: category.id,
      date: 'upcoming',
      limit,
    })
      .then((data) => {
        if (active) setEvents(data.events ?? []);
      })
      .catch(() => {
        if (active) setEvents([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [category.id, limit]);

  function updateScrollState() {
    const el = scrollerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });
    return () => el.removeEventListener('scroll', updateScrollState);
  }, [loading]);

  function scrollByCards(direction) {
    const el = scrollerRef.current;
    if (!el) return;
    const cardWidth = el.firstChild?.offsetWidth ?? 280;
    el.scrollBy({ left: direction * (cardWidth + 16) * 2, behavior: 'smooth' });
  }

  // Don't render the row at all once we know the category has nothing upcoming
  if (!loading && events.length === 0) return null;

  const CategoryIcon = getCategoryIcon(category.name);

  const SCROLLER_CLASSES =
    'flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-1';
  const SCROLLER_STYLE = { scrollbarWidth: 'none', msOverflowStyle: 'none' };

  return (
    <div className="relative">
      {/* Row header */}
      <div className="flex items-end justify-between mb-4 gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-btn bg-accent-text border border-accent-border flex items-center justify-center shrink-0">
            <CategoryIcon size={15} strokeWidth={1.75} className="text-accent" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-primary tracking-tight">
            {category.name}
          </h3>
        </div>
        <Link
          to={`/events?category=${category.id}`}
          className="flex items-center gap-1 text-xs font-semibold text-accent hover:text-accent-hover transition-colors duration-150 shrink-0"
        >
          See all <ArrowRight size={13} strokeWidth={2.5} />
        </Link>
      </div>

      {/* Scrollable strip — skeleton and real cards share the same scroller div
          so scroll behaviour is identical in both states                        */}
      <div className="relative group/row">
        <div
          ref={scrollerRef}
          className={SCROLLER_CLASSES}
          style={SCROLLER_STYLE}
        >
          {loading
            ? [0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="shrink-0 w-44 sm:w-52 lg:w-56 snap-start animate-pulse"
                >
                  <div className="w-full aspect-[4/3] bg-border rounded-card" />
                  <div className="mt-3 flex flex-col gap-2">
                    <div className="h-3 bg-border rounded w-full" />
                    <div className="h-3 bg-border rounded w-2/3" />
                  </div>
                </div>
              ))
            : events.map((event) => (
                <CategoryEventCard key={event.id} event={event} />
              ))}
        </div>

        {/* Desktop arrow controls */}
        {!loading && canScrollLeft && (
          <button
            onClick={() => scrollByCards(-1)}
            aria-label="Scroll left"
            className="hidden lg:flex absolute -left-4 top-1/2 -translate-y-1/2 w-9 h-9 items-center justify-center rounded-full bg-card border border-border shadow-md text-secondary hover:text-primary hover:border-accent/40 transition-all duration-150 opacity-0 group-hover/row:opacity-100"
          >
            <ChevronLeft size={16} strokeWidth={2.5} />
          </button>
        )}
        {!loading && canScrollRight && (
          <button
            onClick={() => scrollByCards(1)}
            aria-label="Scroll right"
            className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 w-9 h-9 items-center justify-center rounded-full bg-card border border-border shadow-md text-secondary hover:text-primary hover:border-accent/40 transition-all duration-150 opacity-0 group-hover/row:opacity-100"
          >
            <ChevronRight size={16} strokeWidth={2.5} />
          </button>
        )}
      </div>
    </div>
  );
}