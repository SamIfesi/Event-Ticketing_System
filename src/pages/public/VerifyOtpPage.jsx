// src/pages/public/VerifyOtpPage.jsx
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
// import { useAuthStore } from '../../store/authStore';
import { ShieldCheck, ArrowLeft, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import OTPInput from '../../components/auth/OTPInput';
import Button from '../../components/ui/Button';

export default function VerifyOtpPage() {
  const { loading, error, resendOtp, verifyForgotOtp } = useAuth();
  const [otp, setOtp] = useState('');
  const disabled = otp.length !== 6;
  // const location = useLocation();

  // const email = location.state?.email ?? '';
  // // If someone lands here directly with no email, send them back
  // if (!email) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-main-bg px-4">
  //       <div className="text-center">
  //         <p className="text-sm text-secondary mb-4">
  //           Session expired or invalid access.
  //         </p>
  //         <Link
  //           to="/forgot-password"
  //           className="text-sm font-semibold text-accent hover:text-accent-hover"
  //         >
  //           Start over
  //         </Link>
  //       </div>
  //     </div>
  //   );
  // }

  async function handleComplete(value) {
    if (loading) return;
    await verifyForgotOtp(value);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (otp.length < 6 || loading) return;
    await verifyForgotOtp(otp);
  }

  async function handleResend() {
    await resendOtp();
    setOtp('');
  }

  return (
    <div className="min-h-screen flex items-start justify-center bg-main-bg px-7 py-12">
      <div className="w-full max-w-[420px]">
        <Link
          to="/forgot-password"
          className="inline-flex items-center gap-1.5 mb-8 text-sm font-medium text-secondary hover:text-primary transition-colors duration-150"
        >
          <ArrowLeft size={16} strokeWidth={2.5} />
          Back
        </Link>

        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-card bg-accent-text border border-accent-border flex items-center justify-center mb-4">   
            <ShieldCheck size={24} strokeWidth={1.75} className="text-accent" />
          </div>
          <h1 className="text-2xl font-bold text-primary tracking-tight">
            Enter verification code
          </h1>
          <p className="mt-2 text-sm text-secondary text-center leading-relaxed max-w-[300px]">
            We sent a 6-digit code to{' '}
            {/* <span className="font-semibold text-primary">{email}</span>. It */}
            expires in 30 minutes.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-5 flex items-start gap-2.5 rounded-btn border border-error/30 bg-error/8 px-4 py-3"
          >
            <span
              aria-hidden="true"
              className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-error"
            />
            <p className="text-sm font-medium text-error">{error}</p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          noValidate
          // className="flex flex-col gap-5"
        >
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
            Verify code
          </Button>
        </form>

        <p className="mt-5 text-center text-xs text-muted">
          Didn't receive it?{' '}
          <button
            onClick={handleResend}
            className="font-semibold text-accent hover:text-accent-hover transition-colors duration-150"
          >
            Resend code
          </button>
        </p>
      </div>
    </div>
  );
}
