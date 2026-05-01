import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRight,
  ChevronLeft,
  Music,
  Cpu,
  Trophy,
  Palette,
  Briefcase,
  Utensils,
  BookOpen,
  Heart,
  Star,
  Ticket,
} from 'lucide-react';

const CATEGORY_COLORS = [
  '#f59e0b',
  '#2563eb',
  '#10b981',
  '#ef4444',
  '#8b5cf6',
  '#f97316',
  '#06b6d4',
  '#22c55e',
  '#ec4899',
];

const ICON_MAP = {
  music: Music,
  monitor: Cpu,
  trophy: Trophy,
  palette: Palette,
  briefcase: Briefcase,
  utensils: Utensils,
  'book-open': BookOpen,
  'heart-pulse': Heart,
  star: Star,
  ticket: Ticket,
};

function CategoryCard({ cat, index }) {
  const Icon = ICON_MAP[cat.icon] ?? Music; // fall back to Ticket if unknown
  const color = CATEGORY_COLORS[index % CATEGORY_COLORS.length];
  return (
    <Link
      to={`/events?category=${cat.id}`}
      className="group flex-shrink-0 flex flex-col items-center gap-3 w-28 p-4 bg-main-bg border border-border rounded-card hover:border-accent/40 hover:shadow-md transition-all duration-200 active:scale-[.97] touch-manipulation snap-start"
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
        style={{ background: `${color}18` }}
      >
        <Icon size={22} style={{ color }} strokeWidth={1.75} />
      </div>
      <div className="text-center">
        <span className="block text-xs font-semibold text-primary leading-tight">
          {cat.name}
        </span>
        <span className="block text-[11px] text-muted mt-0.5">
          {cat.event_count ?? 0} events
        </span>
      </div>
    </Link>
  );
}

function CategorySkeleton() {
  return (
    <div className="flex-shrink-0 flex flex-col items-center gap-3 w-28 p-4 bg-main-bg border border-border rounded-card animate-pulse">
      <div className="w-12 h-12 rounded-xl bg-border" />
      <div className="h-3 bg-border rounded w-14" />
    </div>
  );
}

export default function CategoryScroller({ categories, loading }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  function updateArrows() {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }

  function scrollBy(dir) {
    scrollRef.current?.scrollBy({ left: dir * 256, behavior: 'smooth' });
  }

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener('scroll', updateArrows, { passive: true });
    const ro = new ResizeObserver(updateArrows);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', updateArrows);
      ro.disconnect();
    };
  }, [categories]);

  return (
    <div className="relative">
      <div
        className={`absolute left-0 top-0 bottom-2 w-14 z-10 pointer-events-none bg-gradient-to-r from-card to-transparent transition-opacity duration-200 rounded-l-card ${canScrollLeft ? 'opacity-100' : 'opacity-0'}`}
      />
      <button
        onClick={() => scrollBy(-1)}
        aria-label="Scroll left"
        className={`absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-card border border-border shadow-md flex items-center justify-center text-secondary hover:text-primary hover:border-accent/40 transition-all duration-150 touch-manipulation ${canScrollLeft ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <ChevronLeft size={16} strokeWidth={2.5} />
      </button>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="flex-shrink-0 w-1" aria-hidden="true" />
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <CategorySkeleton key={i} />
            ))
          : categories.map((cat, i) => (
              <CategoryCard key={cat.id} cat={cat} index={i} />
            ))}
        <div className="flex-shrink-0 w-1" aria-hidden="true" />
      </div>

      <div
        className={`absolute right-0 top-0 bottom-2 w-14 z-10 pointer-events-none bg-gradient-to-l from-card to-transparent transition-opacity duration-200 rounded-r-card ${canScrollRight ? 'opacity-100' : 'opacity-0'}`}
      />
      <button
        onClick={() => scrollBy(1)}
        aria-label="Scroll right"
        className={`absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-card border border-border shadow-md flex items-center justify-center text-secondary hover:text-primary hover:border-accent/40 transition-all duration-150 touch-manipulation ${canScrollRight ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <ChevronRight size={16} strokeWidth={2.5} />
      </button>
    </div>
  );
}
