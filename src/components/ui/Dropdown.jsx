// Reusable headless dropdown — handles open/close, keyboard nav, outside-click,
// and route-change close. Renders children as the trigger; `panel` as the menu.

import { useEffect, useRef, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * @param {React.ReactNode} children  — the trigger element (button / avatar)
 * @param {React.ReactNode} panel     — the dropdown content
 * @param {string}          align     — 'left' | 'right' (panel alignment)
 * @param {string}          className — extra classes on the wrapper
 * @param {boolean}         hoverOpen — if true, also opens on mouse-enter
 */
export default function Dropdown({
  children,
  panel,
  align = 'center',
  className = '',
  hoverOpen = false,
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const location = useLocation();

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Close on outside click
  useEffect(() => {
    function handle(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    function handle(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    if (open) document.addEventListener('keydown', handle);
    return () => document.removeEventListener('keydown', handle);
  }, [open]);

  const toggle = useCallback(() => setOpen((v) => !v), []);
  const close  = useCallback(() => setOpen(false), []);

  const alignClass =
    align === 'right'
      ? 'right-0'
      : align === 'left'
        ? 'left-0'
        : 'left-1/2 -translate-x-1/2'; // 'center' (default)

  return (
    <div
      ref={wrapperRef}
      className={`relative ${className}`}
      onMouseEnter={hoverOpen ? () => setOpen(true) : undefined}
      onMouseLeave={hoverOpen ? () => setOpen(false) : undefined}
    >
      {/* Trigger — clone to inject open state & toggle handler */}
      <div onClick={toggle} aria-expanded={open}>
        {children}
      </div>

      {/* Panel */}
      <div
        role="menu"
        aria-hidden={!open}
        className={`
          absolute top-full ${alignClass} z-9990
          transition-all duration-200 origin-top
          ${open
              ? 'opacity-100 scale-y-100 pointer-events-auto translate-y-0'
              : 'opacity-0 scale-y-95 pointer-events-none -translate-y-1'
          }
        `}
      >
        {/* Pass close so children can close the dropdown after navigation */}
        {typeof panel === 'function' ? panel({ close }) : panel}
      </div>
    </div>
  );
}