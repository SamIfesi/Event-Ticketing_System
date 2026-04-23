// Works with URL-based pagination from your hooks.
// The hook reads from the URL and passes currentPage/totalPages as props.
// When user clicks a page, this component calls onPageChange(newPage)
// which the hook uses to update the URL via setSearchParams.
//
// Mobile  : shows prev / current of total / next — compact, thumb-friendly
// Tablet+ : shows prev, numbered pages (with ellipsis), next
//
// Usage:
//   const { page, pagination, setPage } = useEvents();
//
//   <Pagination
//     currentPage={page}
//     totalPages={pagination?.total_pages ?? 1}
//     onPageChange={setPage}
//   />
//
// If totalPages is 1 or less, renders nothing.

import { ChevronLeft, ChevronRight } from 'lucide-react';

// ── Helpers ───────────────────────────────────────────────────

// Builds the page number array with ellipsis markers.
// e.g. [1, '...', 4, 5, 6, '...', 12]
function buildPageRange(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = [];
  const delta = 1; // pages shown on each side of current

  const rangeStart = Math.max(2, current - delta);
  const rangeEnd   = Math.min(total - 1, current + delta);

  pages.push(1);

  if (rangeStart > 2)       pages.push('...');
  for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i);
  if (rangeEnd < total - 1) pages.push('...');

  pages.push(total);

  return pages;
}

// ── Page button ───────────────────────────────────────────────
function PageButton({ page, isActive, isDisabled, onClick, children, ariaLabel }) {
  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      aria-label={ariaLabel}
      aria-current={isActive ? 'page' : undefined}
      className={`
        inline-flex items-center justify-center
        min-w-[44px] h-11 px-2
        text-sm font-medium rounded-btn
        border transition-colors duration-150
        touch-manipulation select-none
        disabled:opacity-40 disabled:cursor-not-allowed
        ${
          isActive
            ? 'bg-accent text-white border-accent'
          : 'bg-transparent text-primary border-border hover:border-accent hover:text-accent'
        }
      `}
    >
      {children ?? page}
    </button>
  );
}

// ── Main component ────────────────────────────────────────────
export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}) {
  if (!totalPages || totalPages <= 1) return null;

  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  const pages = buildPageRange(currentPage, totalPages);

  return (
    <nav
      aria-label="Pagination"
      className={`flex items-center justify-center ${className}`}
    >
      {/* ── Mobile view ──────────────────────────────────────
          Shows: ← | Page 2 of 8 | →
          Hidden on md and above.
      ─────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 md:hidden">
        <PageButton
          isDisabled={!hasPrev}
          onClick={() => onPageChange(currentPage - 1)}
          ariaLabel="Previous page"
        >
          <ChevronLeft size={18} strokeWidth={2.5} />
        </PageButton>

        <span className="text-sm text-secondary font-medium whitespace-nowrap">
          Page <span className="text-primary font-semibold">{currentPage}</span>
          {' '}of{' '}
          <span className="text-primary font-semibold">{totalPages}</span>
        </span>

        <PageButton
          isDisabled={!hasNext}
          onClick={() => onPageChange(currentPage + 1)}
          ariaLabel="Next page"
        >
          <ChevronRight size={18} strokeWidth={2.5} />
        </PageButton>
      </div>

      {/* ── Tablet+ view ─────────────────────────────────────
          Shows: ← 1 2 ... 5 6 7 ... 12 →
          Hidden below md.
      ─────────────────────────────────────────────────────── */}
      <div className="hidden md:flex items-center gap-1.5">
        {/* Prev */}
        <PageButton
          isDisabled={!hasPrev}
          onClick={() => onPageChange(currentPage - 1)}
          ariaLabel="Previous page"
        >
          <ChevronLeft size={16} strokeWidth={2.5} />
        </PageButton>

        {/* Page numbers */}
        {pages.map((page, index) =>
          page === '...' ? (
            <span
              key={`ellipsis-${index}`}
              aria-hidden="true"
              className="
                inline-flex items-center justify-center
                min-w-[44px] h-11
                text-sm text-muted select-none
              "
            >
              &hellip;
            </span>
          ) : (
            <PageButton
              key={page}
              page={page}
              isActive={page === currentPage}
              onClick={() => page !== currentPage && onPageChange(page)}
              ariaLabel={`Page ${page}`}
            />
          )
        )}

        {/* Next */}
        <PageButton
          isDisabled={!hasNext}
          onClick={() => onPageChange(currentPage + 1)}
          ariaLabel="Next page"
        >
          <ChevronRight size={16} strokeWidth={2.5} />
        </PageButton>
      </div>
    </nav>
  );
}