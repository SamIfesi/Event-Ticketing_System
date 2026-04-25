// src/pages/public/ResetPasswordPage.jsx
import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { KeyRound, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import AuthService from '../../services/auth.service';
import { useUiStore } from '../../store/uiStore';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function ResetPasswordPage() {
  const toastError = useUiStore((s) => s.toastError);
  const toastSuccess = useUiStore((s) => s.toastSuccess);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const resetToken = searchParams.get('token') ?? '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If someone lands here with no token, send them back
  if (!resetToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-main-bg)] px-4">
        <div className="text-center">
          <p className="text-sm text-[var(--color-secondary)] mb-4">
            Invalid or missing reset token.
          </p>
          <Link
            to="/forgot-password"
            className="text-sm font-semibold text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]"
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

    setLoading(true);
    setError('');

    try {
      await AuthService.resetPassword(resetToken, newPassword, confirmPassword);
      toastSuccess('Password reset successfully!');
      navigate('/login');
    } catch (err) {
      const msg =
        err?.response?.data?.message ??
        'Something went wrong. Please try again.';
      setError(msg);
      toastError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-main-bg)] px-4 py-12">
      <div className="w-full max-w-[420px]">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 mb-8 text-sm font-medium text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-colors duration-150"
        >
          <ArrowLeft size={16} strokeWidth={2.5} />
          Back to sign in
        </Link>

        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-[var(--radius-card)] bg-[var(--color-accent-text)] border border-[var(--color-accent-border)] flex items-center justify-center mb-4">
            <KeyRound
              size={24}
              strokeWidth={1.75}
              className="text-[var(--color-accent)]"
            />
          </div>
          <h1 className="text-2xl font-bold text-[var(--color-primary)] tracking-tight">
            Set new password
          </h1>
          <p className="mt-2 text-sm text-[var(--color-secondary)] text-center leading-relaxed max-w-[300px]">
            Must be at least 8 characters.
          </p>
        </div>

        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-card)] shadow-[var(--color-shadow-md)] px-6 py-8">
          {error && (
            <div
              role="alert"
              className="mb-5 flex items-start gap-2.5 rounded-[var(--radius-btn)] border border-[var(--color-error)]/30 bg-[var(--color-error)]/8 px-4 py-3"
            >
              <span
                aria-hidden="true"
                className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-[var(--color-error)]"
              />
              <p className="text-sm font-medium text-[var(--color-error)]">
                {error}
              </p>
            </div>
          )}

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
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={loading}
              icon={
                <button
                  type="button"
                  onClick={() => setShowNew((v) => !v)}
                  tabIndex={-1}
                >
                  {showNew ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              }
            />

            <div className="flex flex-col gap-1.5">
              <Input
                label="Confirm new password"
                type={showConfirm ? 'text' : 'password'}
                id="confirm_password"
                placeholder="Re-enter password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                icon={
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    tabIndex={-1}
                  >
                    {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                }
              />
              {/* Inline match feedback */}
              {confirmPassword.length > 0 && (
                <p
                  className={`text-xs font-medium ${passwordsMatch ? 'text-[var(--color-success)]' : 'text-[var(--color-error)]'}`}
                >
                  {passwordsMatch
                    ? '✓ Passwords match'
                    : '✗ Passwords do not match'}
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
