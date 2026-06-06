// GoogleSignInButton — wraps @react-oauth/google's useGoogleLogin hook.
//
// Uses the implicit flow which returns an access_token.
// The backend calls Google's /oauth2/v3/userinfo to verify it
// and fetch the profile — simple, no extra parsing needed.
//
// Props:
//   onSuccess(accessToken) — called with the Google access token string
//   onError(message)       — called with a human-readable error
//   loading                — disables button while parent is processing
//   label                  — button text
//
// Place this file at: src/components/auth/GoogleSignInButton.jsx

import { useGoogleLogin } from '@react-oauth/google';
import { useState } from 'react';
import googleLogo from '../../assets/icons/google-logo.svg';
import Spinner from '../loaders/Spinner';

function GoogleLogo({ size = 18 }) {
  return (
    <img src={googleLogo} alt="Google Logo" className="shrink-0" width={size} height={size} />
  );
}

export default function GoogleSignInButton({
  onSuccess,
  onError,
  loading = false,
  label = 'Continue with Google',
}) {
  const [pending, setPending] = useState(false);
  const isDisabled = loading || pending;

  const login = useGoogleLogin({
    flow: 'implicit',
    onSuccess: (tokenResponse) => {
      setPending(false);
      onSuccess?.(tokenResponse.access_token);
    },
    onError: (err) => {
      setPending(false);
      if (err?.type !== 'popup_closed' && err?.error !== 'popup_closed_by_user') {
        onError?.('Google sign-in failed. Please try again.');
      }
    },
    onNonOAuthError: (err) => {
      setPending(false);
      if (err?.type === 'popup_blocked') {
        onError?.('Popup was blocked. Please allow popups for this site and try again.');
      }
    },
  });

  function handleClick() {
    if (isDisabled) return;
    setPending(true);
    setTimeout(() => setPending(false), 8000); // safety fallback
    login();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isDisabled}
      className="w-full h-12 flex items-center justify-center gap-3 bg-card border border-border rounded-card text-sm font-semibold text-primary hover:bg-border hover:border-accent/30 transition-all duration-180 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[.98] touch-manipulation select-none"
    >
      {pending ? <Spinner /> : <GoogleLogo size={18} />}
      <span>{pending ? 'Opening Google…' : label}</span>
    </button>
  );
}