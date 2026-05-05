import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import { useProfile } from '../../hooks/useProfile';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

function PasswordStrengthBar({ password }) {
  if (!password) return null;

  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const s = Math.min(score, 4);
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['', 'bg-error', 'bg-warning', 'bg-info', 'bg-success'];
  const texts = ['', 'text-error', 'text-warning', 'text-info', 'text-success'];

  return (
    <div className="mt-2 flex flex-col gap-1.5">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i <= s ? colors[s] : 'bg-border'
            }`}
          />
        ))}
      </div>
      {s > 0 && (
        <p className={`text-xs font-semibold ${texts[s]}`}>{labels[s]}</p>
      )}
    </div>
  );
}

export default function ChangePasswordPage() {
  const navigate = useNavigate();

  const [current, setCurrent] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [done, setDone] = useState(false);

  const { changePassword, loading, error } = useProfile();

  const match = confirm.length > 0 && newPw === confirm;
  const canSubmit = current.length >= 1 && newPw.length >= 8 && match;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;
    await changePassword({
      currentPassword: current,
      newPassword: newPw,
      confirmPassword: confirm,
    });
    // if no error after await, show success state
    if (!error) setDone(true);
  }

  return (
    <div className="flex flex-col min-h-screen bg-main-bg">

      <main className="flex-1 max-w-lg mx-auto w-full px-6 py-8">
        {/* Back */}
        <button
          onClick={() => navigate('/profile')}
          className="inline-flex items-center gap-1.5 mb-6 text-sm font-medium text-secondary hover:text-primary transition-colors"
        >
          <ArrowLeft size={16} strokeWidth={2.5} />
          Back to profile
        </button>

        {/* Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-14 h-14 rounded-card bg-accent-text border border-accent-border flex items-center justify-center mb-4">
            <KeyRound size={24} strokeWidth={1.75} className="text-accent" />
          </div>
          <h1 className="text-2xl font-bold text-primary tracking-tight">
            Change Password
          </h1>
          <p className="text-sm text-secondary mt-2 max-w-xs leading-relaxed">
            Choose a strong password to keep your account secure.
          </p>
        </div>

        {/* Success state */}
        {done ? (
          <div className="flex flex-col items-center gap-5 py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-success/10 border border-success/30 flex items-center justify-center">
              <CheckCircle2
                size={32}
                className="text-success"
                strokeWidth={1.75}
              />
            </div>
            <div>
              <p className="font-bold text-primary text-lg">
                Password updated!
              </p>
              <p className="text-sm text-secondary mt-1">
                Your password has been changed successfully.
              </p>
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/profile')}
            >
              Back to profile
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Current password */}
            <Input
              label="Current password"
              type={showCurrent ? 'text' : 'password'}
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              disabled={loading}
              icon={<Lock size={16} />}
              right={
                <button
                  type="button"
                  onClick={() => setShowCurrent((v) => !v)}
                  className="text-muted hover:text-primary transition-colors"
                >
                  {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />

            {/* New password */}
            <div>
              <Input
                label="New password"
                type={showNew ? 'text' : 'password'}
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                disabled={loading}
                icon={<KeyRound size={16} />}
                right={
                  <button
                    type="button"
                    onClick={() => setShowNew((v) => !v)}
                    className="text-muted hover:text-primary transition-colors"
                  >
                    {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />
              <PasswordStrengthBar password={newPw} />
            </div>

            {/* Confirm */}
            <div>
              <Input
                label="Confirm new password"
                type={showConfirm ? 'text' : 'password'}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                disabled={loading}
                icon={<Lock size={16} />}
                right={
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="text-muted hover:text-primary transition-colors"
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />
              {confirm.length > 0 && (
                <p
                  className={`text-xs font-semibold mt-1.5 ${
                    match ? 'text-success' : 'text-error'
                  }`}
                >
                  {match ? 'Passwords match ✓' : 'Passwords do not match'}
                </p>
              )}
            </div>

            {/* API error */}
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
              disabled={!canSubmit}
              className="w-full mt-1"
            >
              Update password
            </Button>
          </form>
        )}
      </main>
    </div>
  );
}
