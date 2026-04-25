// src/pages/public/ResetPasswordPage.jsx
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { KeyRound, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import PasswordStrength from './PasswordStrength'

export default function ResetPasswordPage() {
  const { resetPassword, loading, error } = useAuth();

  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get('token') ?? '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // If someone lands here with no token, send them back
  if (!resetToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-main-bg px-4">
        <div className="text-center">
          <p className="text-sm text-secondary mb-4">
            Invalid or missing reset token.
          </p>
          <Link
            to="/forgot-password"
            className="text-sm font-semibold text-accent hover:text-accent-hover"
          >
            Start over
          </Link>
        </div>
      </div>
    );
  }

  const passwordsMatch =
    confirmPassword.length > 0 && newPassword === confirmPassword;
  const canSubmit = newPassword.length >= 8 && passwordsMatch;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;
    await resetPassword({ resetToken, newPassword, confirmPassword });
  }

  return (
    <div className="min-h-screen flex items-start justify-center bg-main-bg px-7 py-12">
      <div className="w-full max-w-[26.25rem]">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 mb-4 text-sm font-medium text-secondary hover:text-primary transition-colors duration-150"
        >
          <ArrowLeft size={16} strokeWidth={2.5} />
          Back to sign in
        </Link>

        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-card bg-accent-text border border-accent-border flex items-center justify-center mb-4">
            <KeyRound size={24} strokeWidth={1.75} className="text-accent" />
          </div>
          <h1 className="text-2xl font-bold text-primary tracking-tight">
            Set new password
          </h1>
          <p className="mt-2 text-sm text-secondary text-center leading-relaxed max-w-[300px]">
            Must be at least 8 characters.
          </p>
        </div>

        <div className="bg-main-bg">
          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-5"
          >
            <Input
              label="New password"
              type={showNew ? 'text' : 'password'}
              id="new_password"
              placeholder="Min. 8 characters"
              autoComplete="new_password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              error={Boolean(error)}
              disabled={loading}
              icon={<KeyRound size={17} strokeWidth={3} className='text-accent/70'/>}
              right={
                <button
                  type="button"
                  onClick={() => setShowNew((v) => !v)}
                  aria-label={showNew ? 'Hide Password' : 'Show Password'}
                  className="text-muted hover:text-primary transition-color duration-180 touch-manipulation"
                >
                  {showNew ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              }
            />
            <PasswordStrength password={newPassword}/>

            <div className="flex flex-col gap-1.5">
            <Input
              label="Confirm password"
              type={showConfirm ? 'text' : 'password'}
              id="confirm_password"
              placeholder="Re-enter Password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={Boolean(error)}
              disabled={loading}
              // icon={<KeyRound size={17} strokeWidth={3} className='text-accent/70'/>}
              right={
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  aria-label={showConfirm ? 'Hide Password' : 'Show Password'}
                  className="text-muted hover:text-primary transition-color duration-180 touch-manipulation"
                >
                  {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              }
            />
              {/* Inline match feedback */}
              {confirmPassword.length > 0 && (
                <p
                  className={`text-xs font-medium ${passwordsMatch ? 'text-success' : 'text-error'}`}
                >
                  {passwordsMatch
                    ? 'Passwords match'
                    : 'Passwords do not match'}
                </p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={loading}
              disabled={!canSubmit}
              className="w-full mt-1"
            >
              Reset password
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
