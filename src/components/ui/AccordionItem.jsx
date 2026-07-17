// Props:
//   title       — header text, always visible
//   children    — body content, shown when expanded
//   defaultOpen — expanded on first render (default false)
//   icon        — optional Lucide icon shown before the title

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function AccordionItem({
  title,
  children,
  defaultOpen = false,
  icon: Icon,
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border border-border rounded-card bg-card overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-main-bg transition-colors duration-150 touch-manipulation"
      >
        {Icon && (
          <div className="w-8 h-8 rounded-btn bg-accent-text flex items-center justify-center shrink-0">
            <Icon size={15} strokeWidth={1.75} className="text-accent" />
          </div>
        )}
        <span className="flex-1 text-sm font-semibold text-primary leading-snug">
          {title}
        </span>
        <ChevronDown
          size={16}
          strokeWidth={2.5}
          className={`shrink-0 text-muted transition-transform duration-200 ${
            open ? 'rotate-180 text-accent' : ''
          }`}
        />
      </button>

      <div
        className="grid transition-all duration-200 ease-out"
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <div
            className={`px-5 pb-5 text-sm text-secondary leading-relaxed ${Icon ? 'pl-16' : ''}`}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}