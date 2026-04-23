import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, OctagonAlert } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import PasswordStrength from './PasswordStrength';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import logo from '/assets/icons/logos.svg';

export default function RegisterPage() {
  const { register, loading, error, fieldErrors } = useAuth();

  const [form, setForm] = useState({
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState({
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    await register({ name, email, password });
  }
  // const isValid =
  //   name.trim().length >= 3 && email.trim() && password.length >= 8;

  return (
    <div className="min-h-screen flex items-start justify-center bg-main-bg px-6 py-12">
      <div className="w-full max-w-[26.25rem]">
        <div className="flex flex-col items-start mb-8">
          <img src={logo} alt="Ticketer Logo" className="mb-8 self-center" />
          <h1 className="text-3xl font-bold text-primary tracking-tight">
            Create your <span className="text-accent-hover">account</span>
          </h1>
          <p className="mt-1 text-sm text-secondary">
            Free to join. Start discovering events today.
          </p>
        </div>

        <div className="bg-main-bg pt-4 pb-8">
          {error && (
            <div
              role="alert"
              className="mb-5 flex items-start gap-2.5 rounded-btn border border-error/30 bg-error/8 px-4 py-3"
            >
              <OctagonAlert size={17} className="text-error" />
              <p className="text-sm font-medium text-error">{error}</p>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-5"
          >
            <Input
              label="Fullname"
              type="text"
              id="name"
              placeholder="John Doe"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={fieldErrors.name}
              icon={<User size={17} />}
              disabled={loading}
            />

            <Input
              label="Email"
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

            <div>
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
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                    className="text-muted hover:text-primary transition-color duration-180 touch-manipulation"
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                }
              />
              <PasswordStrength password={password} />

              <Input
                className="mt-4"
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
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                    className="text-muted hover:text-primary transition-color duration-180 touch-manipulation"
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                }
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
