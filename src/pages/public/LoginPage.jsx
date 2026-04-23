import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import logo from '../../../public/assets/icons/logos.svg';

export default function LoginPage() {
  const { login, loading, error, fieldErrors } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    await login({ email, password });
  }

  return (
    <div className="min-h-screen flex items-start justify-center bg-main-bg px-4 py-12">
      <div className="w-full max-w-[26.25rem]">
        <div className="flex flex-col items-start mb-8">
          <img src={logo} alt="Ticketer Logo" className="mb-8 self-center" />
          <h1 className="text-3xl font-bold text-primary tracking-tight">
            Welcome <span className="text-accent-hover">Back</span>
          </h1>
          <p className="mt-1 text-sm text-secondary">
            Sign in to your account to continue
          </p>
        </div>

        <div className="bg-card border border-border rounded-card shadow-shadow-md px-6 py-8">
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
            className="flex flex-col gap-5"
          >
            {/* Email */}
            <Input
              label="Email address"
              type="email"
              id="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={fieldErrors.email}
              icon={<Mail size={17} />}
              disabled={loading}
            />

            {/* Password */}
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="••••••••"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={fieldErrors.password}
              icon={<Lock size={17} />}
              disabled={loading}
              right={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="text-muted hover:text-primary transition-color duration-180 touch-manipulation"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              }
            />

            {/* forgotten password link */}
            <div className="flex justify-end -mt-2">
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-accent hover:text-accent-hover transition-colors duration-180"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={loading}
              disabled={!email || !password}
              className="w-full mt-1"
            >
              Sign in
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-secondary">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-semibold text-accent hover:text-accent-hover transition-colors duration-180"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
