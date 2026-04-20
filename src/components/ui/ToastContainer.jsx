import { useEffect, useState } from 'react';
import { useUiStore } from '../../store/uiStore';
import { CheckCircle, XCircle, X, AlertTriangle, Info } from 'lucide-react';

const TOAST_CONFIG = {
  success: { icon: CheckCircle, colorVar: 'var(--color-success)' },
  error: { icon: XCircle, colorVar: 'var(--color-error)' },
  warning: { icon: AlertTriangle, colorVar: 'var(--color-warning)' },
  info: { icon: Info, colorVar: 'var(--color-info)' },
};

function ToastItem({ toast, onDismiss, isMobile }) {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const config = TOAST_CONFIG[toast.type] ?? TOAST_CONFIG.info;
  const Icon = config.icon;

  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  function dismiss() {
    setLeaving(true);
    setTimeout(() => onDismiss(toast.id), 280);
  }

  const enterTransform = 'translateY(0)    translateX(0)';
  const mobileExit = 'translateY(100%)    translateX(0)';
  const desktopExit = 'translateY(0)    translateX(100% + 1.5rem)';

  const transform =
    visible && !leaving ? enterTransform : isMobile ? desktopExit : mobileExit;

  return (
    <>
      <div
        role="alert"
        aria-live="polite"
        onClick={dismiss}
        style={{
          transform,
          opacity: visible && !leaving ? 1 : 0,
          transition: leaving
            ? 'transform 280ms cubic-bezier(0.4,0,1,1), opacity 280ms ease'
            : 'transform 360ms cubic-bezier(0.16,1,0.3,1), opacity 300ms ease',
        }}
        className="relative flex items-start gap-3 w-full bg-card border border-border rounded-card shadow-lg px-4 py-3.5 cursor-pointer overflow-hidden active:brightness-95 touch-manipulation"
      ></div>
    </>
  );
}
