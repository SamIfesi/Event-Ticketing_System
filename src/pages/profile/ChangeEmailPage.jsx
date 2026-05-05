import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mail,
  AtSign,
  ArrowLeft,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { useProfile } from '../../hooks/useProfile';
import { useAuthStore } from '../../store/authStore';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import OTPInput from '../../components/auth/OTPInput';

// Step 1 — enter new email
function StepEnterEmail({ currentEmail, onSubmit, loading, error }) {
  const [newEmail, setNewEmail] = useState('');
  const isValid = newEmail.trim().length > 0 && newEmail !== currentEmail;

  function handleSubmit(e) {
    e.preventDefault();
    if (!isValid) return;
    onSubmit(newEmail.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Current email chip */}
      <div className="p-3 bg-main-bg border border-border rounded-btn flex items-center gap-2">
        <Mail size={14} className="text-muted shrink-0" />
        <div className="min-w-0">
          <p className="text-[10px] text-muted uppercase font-bold tracking-wide">
            Current email
          </p>
          <p className="text-sm font-semibold text-primary truncate">
            {currentEmail}
          </p>
        </div>
      </div>

      <Input
        label="New email address"
        type="email"
        value={newEmail}
        onChange={(e) => setNewEmail(e.target.value)}
        placeholder="you@example.com"
        disabled={loading}
        icon={<AtSign size={16} />}
        helper="We'll send a 6-digit verification code to this address."
      />

      {error && (
        <div className="p-3 bg-error/10 border border-error/30 rounded-btn">
          <p className="text-xs text-error font-medium">{error}</p>
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        size="md"
        loading={loading}
        disabled={!isValid}
        className="w-full"
        iconRight={<ArrowRight size={16} />}
      >
        Send verification code
      </Button>
    </form>
  );
}

// Step 2 — enter OTP
function StepVerifyOtp({ newEmail, onConfirm, onBack, loading, error }) {
  const [otp, setOtp] = useState('');

  return (
    <div className="flex flex-col gap-5">
      <div className="p-3 bg-accent-text border border-accent-border rounded-btn">
        <p className="text-xs font-bold text-accent">Code sent</p>
        <p className="text-xs text-secondary mt-0.5">
          Enter the 6-digit code sent to{' '}
          <span className="font-semibold text-primary">{newEmail}</span>.
        </p>
      </div>

      <OTPInput
        value={otp}
        onChange={setOtp}
        onComplete={onConfirm}
        disabled={loading}
        autoFocus
      />

      {error && (
        <div className="p-3 bg-error/10 border border-error/30 rounded-btn">
          <p className="text-xs text-error font-medium">{error}</p>
        </div>
      )}

      <Button
        variant="primary"
        size="md"
        loading={loading}
        disabled={otp.length !== 6}
        onClick={() => onConfirm(otp)}
        className="w-full"
      >
        Confirm email change
      </Button>

      <button
        onClick={onBack}
        disabled={loading}
        className="text-sm font-medium text-secondary hover:text-primary transition-colors text-center"
      >
        Use a different email
      </button>
    </div>
  );
}

// Step 3 — success
function StepDone({ onFinish }) {
  return (
    <div className="flex flex-col items-center gap-5 py-8 text-center">
      <div className="w-16 h-16 rounded-full bg-success/10 border border-success/30 flex items-center justify-center">
        <CheckCircle2 size={32} className="text-success" strokeWidth={1.75} />
      </div>
      <div>
        <p className="font-bold text-primary text-lg">Email updated!</p>
        <p className="text-sm text-secondary mt-1">
          Your email address has been changed successfully.
        </p>
      </div>
      <Button variant="primary" size="md" onClick={onFinish}>
        Back to profile
      </Button>
    </div>
  );
}

// Main page
export default function ChangeEmailPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 | 2 | 3
  const [pendingEmail, setPendingEmail] = useState('');

  const user = useAuthStore((s) => s.user);
  const {
    requestEmailChange,
    confirmEmailChange,
    cancelEmailChange,
    loading,
    error,
  } = useProfile();

  async function handleRequest(newEmail) {
    await requestEmailChange(newEmail);
    // emailChangePending will flip — move to step 2
    setPendingEmail(newEmail);
    setStep(2);
  }

  async function handleConfirm(otp) {
    await confirmEmailChange(otp);
    setStep(3);
  }

  function handleBack() {
    cancelEmailChange();
    setPendingEmail('');
    setStep(1);
  }

  const currentEmail = user?.email ?? '—';

  return (
    <div className="flex flex-col min-h-screen bg-main-bg">
      <main className="flex-1 max-w-lg mx-auto w-full px-6 py-8">
        {/* Back */}
        {step !== 3 && (
          <button
            onClick={() => (step === 2 ? handleBack() : navigate('/profile'))}
            className="inline-flex items-center gap-1.5 mb-6 text-sm font-medium text-secondary hover:text-primary transition-colors"
          >
            <ArrowLeft size={16} strokeWidth={2.5} />
            {step === 2 ? 'Use different email' : 'Back to profile'}
          </button>
        )}

        {/* Header */}
        {step !== 3 && (
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="w-14 h-14 rounded-card bg-accent-text border border-accent-border flex items-center justify-center mb-4">
              <Mail size={24} strokeWidth={1.75} className="text-accent" />
            </div>
            <h1 className="text-2xl font-bold text-primary tracking-tight">
              {step === 1 ? 'Change Email' : 'Enter verification code'}
            </h1>
            <p className="text-sm text-secondary mt-2 max-w-xs leading-relaxed">
              {step === 1
                ? 'Enter your new email address below. We will send a code to confirm.'
                : 'A 6-digit code was sent to your new email address.'}
            </p>
          </div>
        )}

        {/* Step progress dots */}
        {step !== 3 && (
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  step >= s ? 'w-8 bg-accent' : 'w-4 bg-border'
                }`}
              />
            ))}
          </div>
        )}

        {/* Steps */}
        {step === 1 && (
          <StepEnterEmail
            currentEmail={currentEmail}
            onSubmit={handleRequest}
            loading={loading}
            error={error}
          />
        )}
        {step === 2 && (
          <StepVerifyOtp
            newEmail={pendingEmail}
            onConfirm={handleConfirm}
            onBack={handleBack}
            loading={loading}
            error={error}
          />
        )}
        {step === 3 && <StepDone onFinish={() => navigate('/profile')} />}
      </main>
    </div>
  );
}
