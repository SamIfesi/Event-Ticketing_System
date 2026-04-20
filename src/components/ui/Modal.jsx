// Behavior:
//   - Centered on all screen sizes
//   - Full width with mx-4 on mobile, max-w-md on tablet+
//   - Backdrop click closes the modal (unless preventClose is true)
//   - Escape key closes the modal
//   - Scroll-locks the body while open
//   - Renders via a portal so it always sits above everything
//
// The modal has three optional pre-built sections:
//   title      — bold heading
//   description — secondary text below the title
//   footer     — slot for action buttons (you pass them in)
//
// For destructive confirmations, use the `ConfirmModal` export below.
//
// Usage — basic:
//   const { openModal, closeModal, activeModal } = useUiStore();
//
//   <button onClick={() => openModal('delete-event', { eventId: 5 })}>
//     Delete
//   </button>
//
//   <Modal
//     isOpen={activeModal === 'delete-event'}
//     onClose={closeModal}
//     title="Cancel this event?"
//     footer={
//       <>
//         <Button variant="ghost" onClick={closeModal}>Keep it</Button>
//         <Button variant="danger" onClick={handleDelete}>Yes, cancel</Button>
//       </>
//     }
//   >
//     <p>All ticket holders will be notified by email.</p>
//   </Modal>
//
// Usage — confirm shorthand:
//   <ConfirmModal
//     isOpen={activeModal === 'remove-user'}
//     onClose={closeModal}
//     onConfirm={handleRemove}
//     title="Remove this user?"
//     description="This will revoke their access immediately."
//     confirmLabel="Remove"
//     danger
//   />

import { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import Button from './Button';

// ── Main Modal ────────────────────────────────────────────────
export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md', // 'sm' | 'md' | 'lg'
  preventClose = false, // true = no backdrop click or Escape to close
  className = '',
}) {
  // ── Escape key ──────────────────────────────────────────────
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape' && !preventClose) onClose();
    },
    [onClose, preventClose]
  );

  // ── Body scroll lock ────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const SIZE_CLASSES = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  };

  const maxWidth = SIZE_CLASSES[size] ?? SIZE_CLASSES.md;

  return createPortal(
    <>
      {/* ── Backdrop ─────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        onClick={preventClose ? undefined : onClose}
        className="
          fixed inset-0 z-[9990]
          bg-black/50 backdrop-blur-sm
          animate-[fadeIn_180ms_ease_forwards]
        "
      />

      {/* ── Dialog ───────────────────────────────────────────── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        aria-describedby={description ? 'modal-description' : undefined}
        className="
          fixed inset-0 z-[9991]
          flex items-center justify-center
          px-4 py-8
          pointer-events-none
        "
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`
            pointer-events-auto
            w-full ${maxWidth}
            bg-[var(--card)] border border-[var(--border)]
            rounded-[var(--card-br)] shadow-[var(--shadow-lg)]
            flex flex-col
            animate-[modalIn_220ms_cubic-bezier(0.16,1,0.3,1)_forwards]
            ${className}
          `}
        >
          {/* ── Header ─────────────────────────────────────── */}
          {(title || !preventClose) && (
            <div
              className="
              flex items-start justify-between gap-4
              px-5 pt-5 pb-4
              border-b border-[var(--border)]
            "
            >
              <div className="flex flex-col gap-1">
                {title && (
                  <h2
                    id="modal-title"
                    className="text-base font-semibold text-[var(--text-p)] leading-snug"
                  >
                    {title}
                  </h2>
                )}
                {description && (
                  <p
                    id="modal-description"
                    className="text-sm text-[var(--text-s)] leading-relaxed"
                  >
                    {description}
                  </p>
                )}
              </div>

              {/* Close button — 44px touch target */}
              {!preventClose && (
                <button
                  onClick={onClose}
                  aria-label="Close dialog"
                  className="
                    shrink-0 -mt-1 -mr-1
                    w-11 h-11 flex items-center justify-center
                    rounded-[var(--btn-br)]
                    text-[var(--text-m)] hover:text-[var(--text-p)]
                    hover:bg-[var(--border)]
                    transition-colors duration-150
                    touch-manipulation
                  "
                >
                  <X size={18} strokeWidth={2.5} />
                </button>
              )}
            </div>
          )}

          {/* ── Body ───────────────────────────────────────── */}
          {children && (
            <div className="px-5 py-4 text-sm text-[var(--text-s)] leading-relaxed">
              {children}
            </div>
          )}

          {/* ── Footer ─────────────────────────────────────── */}
          {footer && (
            <div
              className="
              flex items-center justify-end gap-3
              px-5 pb-5 pt-4
              border-t border-[var(--border)]
              flex-wrap
            "
            >
              {footer}
            </div>
          )}
        </div>
      </div>

      {/* ── Keyframe animations (injected once) ──────────────── */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);   }
        }
      `}</style>
    </>,
    document.body
  );
}

// ── ConfirmModal — shorthand for destructive confirmations ────
//
// Usage:
//   <ConfirmModal
//     isOpen={activeModal === 'delete-event'}
//     onClose={closeModal}
//     onConfirm={handleDelete}
//     loading={deleting}
//     title="Cancel this event?"
//     description="This cannot be undone. All bookings will be affected."
//     confirmLabel="Yes, cancel event"
//     danger
//   />
export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  title = 'Are you sure?',
  description = '',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = false,
  size = 'sm',
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      size={size}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            variant={danger ? 'danger' : 'primary'}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </>
      }
    />
  );
}
