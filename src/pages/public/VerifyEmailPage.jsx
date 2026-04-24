import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useAuth } from '../../hooks/useAuth';
import OTPInput from '../../components/auth/OTPInput';
import Button from '../../components/ui/Button';
import { Mail, X } from 'lucide-react';
import { Link } from 'react-router-dom';

function useResendTimer(initialSeconds = 60) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [canResend, setCanResend] = useState(false);
  const timerRef = useRef(null);

  function startTimer() {
    setSeconds(initialSeconds);
    setCanResend(false);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, []);
  return { seconds, canResend, startTimer };
}

export default function VerifyEmailPage() {
  const user = useAuthStore((state) => state.user);
  const { verifyEmail, resendOtp, loading, error } = useAuth();

  const [otp, setOtp] = useState('');
  const { seconds, canResend, startTimer } = useResendTimer(60);
  const disabled = otp.length !== 6;

  async function handleComplete(value) {
    if (loading) return;
    await verifyEmail(value);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (otp.length < 6 || loading) return;
    await verifyEmail(otp);
  }

  async function handleResend() {
    if (!canResend) return;
    await resendOtp();
    setOtp('');
    startTimer();
  }

  function maskEmail(email) {
    if (!email) return '';
    const [local, domain] = email.split('@');
    return `${local[0]}${'*'.repeat(Math.min(local.length - 1, 4))}@${domain}`;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-main-bg px-6 py-12">
      <div className="flex flex-col items-center mb-8">
        <div className="w-14 h-14 rounded-card bg-accent-text border border-accent-border flex items-center justify-center mb-4">
          <Mail size={26} color="var(--color-accent)" />
        </div>
        <h1 className="text-2xl font-bolde text-primary tracking-tight">
          Check your email
        </h1>
        <p className="text-sm text-secondary mt-2 text-center max-w-[22rem] leading-relaxed">
          We sent a 6-digit verification code to{' '}
          <span className="font-semiBold text-primary">
            {maskEmail(user?.email)}
          </span>
          . Enter the code below to verify your email address.
        </p>
      </div>

      {error && (
        <div
          className="mb-6 flex items-start gap-2.5 rounded-btn border border-error/30 bg-error/8 px-4 py-3"
          role="alert"
        >
          <X size={17} className="text-error" />
          <p className="text-sm font-medium text-error">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <OTPInput
          value={otp}
          onChange={setOtp}
          onComplete={handleComplete}
          error={Boolean(error)}
          disabled={loading}
          className="mb-7"
          autoFocus
        />

        <Button
          type="submit"
          variant="primary"
          size="md"
          loading={loading}
          disabled={disabled || loading}
          className="w-full"
        >
          Verify email
        </Button>
      </form>

      <div className="mt-6 text-center">
        {canResend ? (
          <button
            onClick={handleResend}
            disabled={loading}
            className="text-sm font-semibold text-accent hover:text-accent-hover transition-colors duration-189 disabled:opacity-50 touch-manipulation"
          >
            Resend new code
          </button>
        ) : (
          <p className="text-sm text-muted">
            Resend new code in{' '}
            <span className="font-semibold tabular-nums text-secondary">
              {seconds}s
            </span>
          </p>
        )}
      </div>
      <p className="mt-6 text-center text-sm text-secondary">
        Wrong account?{' '}
        <Link
          to="/login"
          className="font-semibold text-accent hover:text-accent-hover transition-colors duration-180 touch-manipulation"
        >
          Sign out
        </Link>
      </p>
    </div>
  );
}
