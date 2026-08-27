// GoogleSignInButton — ID-token flow via @react-oauth/google's <GoogleLogin>.
//
// Why this instead of useGoogleLogin (implicit flow):
// useGoogleLogin opens a popup and polls `popup.closed` from our own page
// to detect completion. A Cross-Origin-Opener-Policy header (which we need
// for other reasons) blocks that read, so the SDK can't tell "closed
// because it succeeded" from "closed because the user cancelled" — it
// reports popup_closed either way, even on success.
//
// <GoogleLogin> instead renders Google's own Identity Services button/flow
// and hands us a signed ID token (a JWT) via onSuccess. Nothing in that
// path depends on reading properties of a cross-origin popup, so COOP
// doesn't interfere with it.
//
// Trade-off: Google renders this button itself (via an iframe), so we
// lose full control over its exact visual style — only the props Google
// exposes (theme, size, shape, text, width) are customizable. It still
// reads as a "Google" button and sits fine inline with the rest of the form.
//
// Place this file at: src/components/auth/GoogleSignInButton.jsx

import { GoogleLogin } from '@react-oauth/google';
import { useState } from 'react';

export default function GoogleSignInButton({
  onSuccess,
  onError,
  loading = false,
  label = 'Continue with Google',
}) {
  const [pending, setPending] = useState(false);
  const isDisabled = loading || pending;

  function handleSuccess(credentialResponse) {
    setPending(false);
    const idToken = credentialResponse?.credential;

    if (!idToken) {
      onError?.('Google sign-in failed. Please try again.');
      return;
    }

    onSuccess?.(idToken);
  }

  function handleError() {
    setPending(false);
    onError?.('Google sign-in failed. Please try again.');
  }

  // Google's button text presets: 'signin_with' | 'signup_with' | 'continue_with' | 'signin'
  const text = label.toLowerCase().includes('sign up')
    ? 'signup_with'
    : 'signin_with';

  return (
    <div className="w-full flex justify-center">
      {isDisabled ? (
        <div className="w-full h-11 flex items-center justify-center border border-border rounded-card text-sm text-muted">
          Signing in…
        </div>
      ) : (
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          text={text}
          shape="rectangular"
          theme="outline"
          size="large"
          logo_alignment="left"
        />
      )}
    </div>
  );
}