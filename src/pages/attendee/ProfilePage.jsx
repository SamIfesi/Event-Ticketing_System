import { useEffect, useState } from 'react';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Camera,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Shield,
  Bell,
  LogOut,
  Edit3,
  Save,
  X,
  KeyRound,
  AtSign,
} from 'lucide-react';
import { useProfile } from '../../hooks/useProfile';
import { useAuth } from '../../hooks/useAuth';
import { useAuthStore } from '../../store/authStore';
import { formatShortDate } from '../../utils/formatDate';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import OTPInput from '../../components/auth/OTPInput';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Footer from '../../components/layout/Footer';
import Badge from '../../components/ui/Badge';

// ── Section wrapper ───────────────────────────────────────────
function Section({ title, description, children }) {
  return (
    <div className="bg-card border border-border rounded-card overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <h2 className="text-sm font-bold text-primary">{title}</h2>
        {description && (
          <p className="text-xs text-muted mt-0.5">{description}</p>
        )}
      </div>
      <div className="px-5 py-5">{children}</div>
    </div>
  );
}

// ── Avatar ────────────────────────────────────────────────────
function Avatar({ name, avatar, size = 'lg' }) {
  const dim = size === 'lg' ? 'w-20 h-20' : 'w-12 h-12';
  const text = size === 'lg' ? 'text-2xl' : 'text-base';

  if (avatar) {
    return (
      <img
        src={avatar}
        alt={name}
        className={`${dim} rounded-full object-cover border-2 border-border`}
      />
    );
  }
  return (
    <div
      className={`${dim} rounded-full bg-accent-text border-2 border-accent-border flex items-center justify-center shrink-0`}
    >
      <span className={`${text} font-black text-accent`}>
        {name?.charAt(0)?.toUpperCase() ?? '?'}
      </span>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────
function ProfileSkeleton() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      <div className="bg-card border border-border rounded-card p-5">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-border shrink-0" />
          <div className="flex flex-col gap-2 flex-1">
            <div className="h-5 bg-border rounded w-40" />
            <div className="h-3 bg-border rounded w-56" />
            <div className="h-5 bg-border rounded w-16 mt-1" />
          </div>
        </div>
      </div>
      {[0, 1, 2].map((i) => (
        <div key={i} className="bg-card border border-border rounded-card p-5">
          <div className="h-4 bg-border rounded w-32 mb-4" />
          <div className="flex flex-col gap-3">
            <div className="h-12 bg-border rounded" />
            <div className="h-12 bg-border rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Change Password form ──────────────────────────────────────
function ChangePasswordForm({ onSubmit, loading }) {
  const [current, setCurrent] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const match = confirm.length > 0 && newPw === confirm;
  const canSubmit = current.length >= 1 && newPw.length >= 8 && match;

  function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit({ currentPassword: current, newPassword: newPw, confirmPassword: confirm });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
      <Input
        label="New password"
        type={showNew ? 'text' : 'password'}
        value={newPw}
        onChange={(e) => setNewPw(e.target.value)}
        disabled={loading}
        helper="Minimum 8 characters"
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
            className={`text-xs font-medium mt-1.5 ${
              match ? 'text-success' : 'text-error'
            }`}
          >
            {match ? 'Passwords match' : 'Passwords do not match'}
          </p>
        )}
      </div>
      <Button
        type="submit"
        variant="primary"
        size="sm"
        loading={loading}
        disabled={!canSubmit}
        className="self-start"
      >
        Update password
      </Button>
    </form>
  );
}

// ── Email Change form ──────────────────────────────────────────
function ChangeEmailForm({
  currentEmail,
  onRequest,
  onConfirm,
  onCancel,
  pending,
  loading,
  otp,
  setOtp,
}) {
  const [newEmail, setNewEmail] = useState('');

  function handleRequest(e) {
    e.preventDefault();
    if (!newEmail || newEmail === currentEmail) return;
    onRequest(newEmail);
  }

  if (pending) {
    return (
      <div className="flex flex-col gap-4">
        <div className="p-3 bg-accent-text border border-accent-border rounded-btn">
          <p className="text-xs font-semibold text-accent">Verification code sent</p>
          <p className="text-xs text-secondary mt-0.5">
            Enter the 6-digit code sent to{' '}
            <span className="font-semibold">{newEmail}</span>.
          </p>
        </div>
        <OTPInput
          value={otp}
          onChange={setOtp}
          onComplete={onConfirm}
          disabled={loading}
          autoFocus
        />
        <div className="flex items-center gap-3 mt-1">
          <Button
            variant="primary"
            size="sm"
            loading={loading}
            disabled={otp.length !== 6}
            onClick={() => onConfirm(otp)}
          >
            Confirm change
          </Button>
          <Button variant="ghost" size="sm" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleRequest} className="flex flex-col gap-4">
      <Input
        label="New email address"
        type="email"
        value={newEmail}
        onChange={(e) => setNewEmail(e.target.value)}
        placeholder={currentEmail}
        disabled={loading}
        icon={<AtSign size={16} />}
        helper="A verification code will be sent to the new address."
      />
      <Button
        type="submit"
        variant="secondary"
        size="sm"
        loading={loading}
        disabled={!newEmail || newEmail === currentEmail}
        className="self-start"
      >
        Send verification code
      </Button>
    </form>
  );
}

// ── Main page ─────────────────────────────────────────────────
export default function ProfilePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [emailOtp, setEmailOtp] = useState('');

  const user = useAuthStore((state) => state.user);
  const { logout } = useAuth();

  const {
    profile,
    profileLoading,
    fetchProfile,
    loading,
    updateProfile,
    changePassword,
    emailChangePending,
    requestEmailChange,
    confirmEmailChange,
    cancelEmailChange,
  } = useProfile();

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (profile) {
      setNameInput(profile.name ?? user?.name ?? '');
    }
  }, [profile]);

  async function handleSaveName() {
    if (!nameInput.trim() || nameInput === profile?.name) {
      setEditingName(false);
      return;
    }
    await updateProfile({ name: nameInput.trim() });
    setEditingName(false);
  }

  async function handleConfirmEmail(otp) {
    await confirmEmailChange(otp);
    setEmailOtp('');
  }

  const displayName = profile?.name ?? user?.name ?? '—';
  const displayEmail = profile?.email ?? user?.email ?? '—';
  const memberSince = profile?.created_at ?? user?.created_at;
  const role = profile?.role ?? user?.role ?? 'attendee';

  return (
    <div className="flex flex-col min-h-screen bg-main-bg">
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-primary tracking-tight">
            My Profile
          </h1>
          <p className="text-sm text-secondary mt-1">
            Manage your account details and security settings.
          </p>
        </div>

        {profileLoading ? (
          <ProfileSkeleton />
        ) : (
          <div className="flex flex-col gap-6">

            {/* ── Identity card ────────────────────────────────── */}
            <div className="bg-card border border-border rounded-card p-5">
              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  <Avatar name={displayName} avatar={profile?.avatar} size="lg" />
                  <button
                    className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-accent border-2 border-card flex items-center justify-center hover:bg-accent-hover transition-colors touch-manipulation"
                    title="Change avatar"
                  >
                    <Camera size={12} className="text-white" strokeWidth={2.5} />
                  </button>
                </div>

                <div className="flex-1 min-w-0">
                  {editingName ? (
                    <div className="flex items-center gap-2">
                      <input
                        autoFocus
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveName();
                          if (e.key === 'Escape') setEditingName(false);
                        }}
                        className="flex-1 h-9 px-3 bg-main-bg border border-accent rounded-btn text-sm font-bold text-primary focus:outline-none focus:ring-2 focus:ring-accent/30"
                      />
                      <button
                        onClick={handleSaveName}
                        disabled={loading}
                        className="w-8 h-8 flex items-center justify-center rounded-btn bg-accent text-white hover:bg-accent-hover transition-colors disabled:opacity-50"
                      >
                        <Save size={14} strokeWidth={2.5} />
                      </button>
                      <button
                        onClick={() => {
                          setEditingName(false);
                          setNameInput(profile?.name ?? '');
                        }}
                        className="w-8 h-8 flex items-center justify-center rounded-btn border border-border text-muted hover:text-primary transition-colors"
                      >
                        <X size={14} strokeWidth={2.5} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-black text-primary truncate">
                        {displayName}
                      </h2>
                      <button
                        onClick={() => setEditingName(true)}
                        className="text-muted hover:text-accent transition-colors touch-manipulation"
                        title="Edit name"
                      >
                        <Edit3 size={14} strokeWidth={2} />
                      </button>
                    </div>
                  )}

                  <p className="text-sm text-secondary truncate mt-0.5">
                    {displayEmail}
                  </p>

                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-accent-text text-accent capitalize">
                      {role}
                    </span>
                    {profile?.email_verified ? (
                      <span className="inline-flex items-center gap-1 text-xs text-success">
                        <CheckCircle2 size={11} strokeWidth={2.5} />
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-warning">
                        <AlertCircle size={11} strokeWidth={2.5} />
                        Unverified
                      </span>
                    )}
                    {memberSince && (
                      <span className="text-xs text-muted">
                        Member since {formatShortDate(memberSince)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats strip */}
              {(profile?.booking_count != null ||
                profile?.ticket_count != null) && (
                <div className="mt-4 pt-4 border-t border-border flex items-center gap-6">
                  {profile?.booking_count != null && (
                    <div className="text-center">
                      <p className="text-lg font-black text-primary">
                        {profile.booking_count}
                      </p>
                      <p className="text-xs text-muted">Bookings</p>
                    </div>
                  )}
                  {profile?.ticket_count != null && (
                    <div className="text-center">
                      <p className="text-lg font-black text-primary">
                        {profile.ticket_count}
                      </p>
                      <p className="text-xs text-muted">Tickets</p>
                    </div>
                  )}
                  {profile?.events_attended != null && (
                    <div className="text-center">
                      <p className="text-lg font-black text-primary">
                        {profile.events_attended}
                      </p>
                      <p className="text-xs text-muted">Events attended</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── Change password ───────────────────────────────── */}
            <Section
              title="Change Password"
              description="Keep your account secure with a strong password."
            >
              <ChangePasswordForm
                onSubmit={changePassword}
                loading={loading}
              />
            </Section>

            {/* ── Change email ──────────────────────────────────── */}
            <Section
              title="Email Address"
              description="Change the email address associated with your account."
            >
              <ChangeEmailForm
                currentEmail={displayEmail}
                onRequest={requestEmailChange}
                onConfirm={handleConfirmEmail}
                onCancel={() => {
                  cancelEmailChange();
                  setEmailOtp('');
                }}
                pending={emailChangePending}
                loading={loading}
                otp={emailOtp}
                setOtp={setEmailOtp}
              />
            </Section>

            {/* ── Account info ──────────────────────────────────── */}
            <Section title="Account Information">
              <div className="flex flex-col gap-0 divide-y divide-border">
                {[
                  { label: 'Account ID', value: `#${String(profile?.id ?? user?.id ?? 0).padStart(6, '0')}` },
                  { label: 'Role', value: <span className="capitalize">{role}</span> },
                  {
                    label: 'Email verified',
                    value: profile?.email_verified ? (
                      <span className="flex items-center gap-1 text-success text-xs font-semibold">
                        <CheckCircle2 size={12} /> Verified
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-warning text-xs font-semibold">
                        <AlertCircle size={12} /> Not verified
                      </span>
                    ),
                  },
                  {
                    label: 'Member since',
                    value: memberSince ? formatShortDate(memberSince) : '—',
                  },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between py-3"
                  >
                    <span className="text-xs text-muted">{label}</span>
                    <span className="text-xs font-semibold text-primary">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </Section>

            {/* ── Danger / sign out ─────────────────────────────── */}
            <div className="bg-card border border-error/20 rounded-card px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-primary">Sign out</p>
                <p className="text-xs text-muted mt-0.5">
                  You'll need to sign in again to access your account.
                </p>
              </div>
              <Button
                variant="danger"
                size="sm"
                icon={<LogOut size={15} />}
                onClick={logout}
              >
                Sign out
              </Button>
            </div>

          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}