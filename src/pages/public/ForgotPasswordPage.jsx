// src/pages/public/ForgotPasswordPage.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function ForgotPasswordPage() {
  const { error, loading, fieldErrors, forgotPassword } = useAuth();

  const [email, setEmail] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    await forgotPassword({ email });
  }

  return (
    <div className="min-h-screen flex items-start justify-center bg-main-bg px-8 py-12">
      <div className="w-full max-w-[420px]">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 mb-4 text-sm font-medium text-secondary hover:text-primary transition-colors duration-150"
        >
          <ArrowLeft size={16} strokeWidth={2.5} />
          Back to sign in
        </Link>

        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-card bg-accent-text border border-accent-border flex items-center justify-center mb-4">
            <Mail size={24} strokeWidth={1.75} className="text-accent" />
          </div>
          <h1 className="text-2xl font-bold text-primary tracking-tight">
            Forgot your password?
          </h1>
          <p className="mt-2 text-sm text-secondary text-center leading-relaxed max-w-[300px]">
            Enter your email and we'll send you a 6-digit verification code.
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
          className="flex flex-col gap-5"
        >
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
          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={loading}
            disabled={!email}
            className="w-full mt-1"
          >
            Send code
          </Button>
        </form>
      </div>
    </div>
  );
}
