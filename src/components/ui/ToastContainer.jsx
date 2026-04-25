import { useEffect, useState } from 'react';
import { useUiStore } from '../../store/uiStore';
import { CheckCircle, XCircle, X, AlertTriangle, Info } from 'lucide-react';

const TOAST_CONFIG = {
  success: { icon: CheckCircle, colorVar: 'var(--color-success)' },
  error:   { icon: XCircle,     colorVar: 'var(--color-error)'   },
  warning: { icon: AlertTriangle, colorVar: 'var(--color-warning)' },
  info:    { icon: Info,        colorVar: 'var(--color-info)'    },
};

function ToastItem({ toast, onDismiss }) {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const config = TOAST_CONFIG[toast.type] ?? TOAST_CONFIG.info;
  const Icon   = config.icon;

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  function dismiss() {
    setLeaving(true);
    setTimeout(() => onDismiss(toast.id), 700);
  }

  const show = visible && !leaving;
  const transform = show
    ? 'translateY(0)'       
    : 'translateY(-110%)';

  return (
    <div
      role="alert"
      aria-live="polite"
      onClick={dismiss}
      style={{
        transform,
        opacity: show ? 1 : 0,
        transition: leaving
          ? 'transform 240ms cubic-bezier(0.4, 0, 1, 1), opacity 240ms ease'
          : 'transform 360ms cubic-bezier(0.16, 1, 0.3, 1), opacity 300ms ease',
      }}
      className="relative flex items-start gap-3 w-full bg-card border border-border rounded-card shadow-lg px-4 py-3.5 cursor-pointer overflow-hidden active:brightness-95 touch-manipulation"
    >
      {/* Coloured left accent bar — matches the toast type */}
      <span
        aria-hidden="true"
        className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-card"
        style={{ background: config.colorVar }}
      />

      <span className="mt-px shrink-0" style={{ color: config.colorVar }}>
        <Icon size={20} strokeWidth={2} />
      </span>

      <p className="flex-1 text-sm leading-snug text-primary font-medium pr-5">
        {toast.message}
      </p>

      <button
        onClick={(e) => { e.stopPropagation(); dismiss(); }}
        className="absolute right-0 top-0 w-11 h-11 flex items-center justify-center text-muted hover:text-primary transition-colors duration-150 touch-manipulation"
        aria-label="Dismiss notification"
      >
        <X size={17} strokeWidth={2.5} />
      </button>
    </div>
  );
}

export default function ToastContainer() {
  const toasts       = useUiStore((state) => state.toasts);
  const dismissToast = useUiStore((state) => state.dismissToast);

  if (toasts.length === 0) return null;

  return (
    <div
      aria-label="Notifications"
      className="
        fixed z-[9997] pointer-events-none overflow-hidden
        top-0 left-0 right-0 px-4 pt-4 flex flex-col gap-2.5
        md:left-auto md:right-5 md:w-full md:max-w-sm md:px-0
      "
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem
            toast={toast}
            onDismiss={dismissToast}
          />
        </div>
      ))}
    </div>
  );
}