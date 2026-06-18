import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useProfile } from '../../hooks/useProfile';
import { useAuthStore } from '../../store/authStore';
import { useUiStore } from '../../store/uiStore';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import ImageUpload from '../../components/ui/ImageUpload';
import api from '../../services/api';

export default function EditProfilePage() {
  const toastSuccess = useUiStore((state) => state.toastSuccess);

  const navigate = useNavigate();
  const [done, setDone] = useState(false);

  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const isVerified = useAuthStore((s) => s.isVerified);
  const setAuth = useAuthStore((s) => s.setAuth);

  const {
    profile,
    profileLoading,
    fetchProfile,
    updateProfile,
    loading,
    error,
  } = useProfile();

  const [name, setName] = useState('');

  useEffect(() => {
    if (!user) return;
    fetchProfile();
  }, [user, fetchProfile]);

  useEffect(() => {
    if (profile) setName(profile.name ?? '');
  }, [profile]);

  const displayName = profile?.name ?? user?.name ?? '';
  const displayEmail = profile?.email ?? user?.email ?? '';
  const canSubmit = name.trim().length >= 2 && name.trim() !== displayName;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;
    await updateProfile({ name: name.trim() });
    if (!error) setDone(true);
  }

  async function handleAvatarUpload({ publicId, secureUrl }) {
    await api.post('/cloudinary/avatar', {
      public_id: publicId,
      secure_url: secureUrl,
    });
    setAuth({ user: { ...user, avatar: secureUrl }, token, isVerified });
    toastSuccess('Avatar Updated!');
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
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-2xl font-bold text-primary tracking-tight">
            Edit Profile
          </h1>
          <p className="text-sm text-secondary mt-1">
            Update your display name.
          </p>
        </div>

        {/* Success */}
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
              <p className="font-bold text-primary text-lg">Profile updated!</p>
              <p className="text-sm text-secondary mt-1">
                Your changes have been saved.
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
          <>
            {/* Avatar */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative shrink-0">
                <ImageUpload
                  type="avatar"
                  currentUrl={profile?.avatar}
                  onUploaded={handleAvatarUpload}
                />
              </div>
              <p className="text-xs text-muted mt-3">{displayEmail}</p>
            </div>

            {/* Form */}
            {profileLoading ? (
              <div className="animate-pulse flex flex-col gap-4">
                <div className="h-12 bg-border rounded-card" />
                <div className="h-10 bg-border rounded-btn w-32" />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <Input
                  label="Full name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  icon={<User size={16} />}
                  placeholder="Your full name"
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
                  disabled={!canSubmit}
                  className="w-full"
                >
                  Save changes
                </Button>
              </form>
            )}
          </>
        )}
      </main>
    </div>
  );
}
