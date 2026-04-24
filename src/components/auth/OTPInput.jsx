import { useRef, useEffect } from 'react';

const OTP_LENGTH = 6;

export default function OTPInput({
  value = '',
  onChange,
  onComplete,
  error = false,
  disabled = false,
  autoFocus = true,
  className = '',
}) {
  const digits = Array.from({ length: OTP_LENGTH }, (_, i) => value[i] ?? '');
  const inputRefs = useRef(Array.from({ length: OTP_LENGTH }, () => null));

  useEffect(() => {
    if (autoFocus) {
      inputRefs.current[0]?.focus();
    }
  }, [autoFocus]);

  // fire onComplete when all 6 digits are present
  useEffect(() => {
    if (value.length === OTP_LENGTH && onComplete) {
      onComplete(value);
    }
  }, [onComplete, value]);

  function focusAt(index) {
    inputRefs.current[index]?.focus();
  }

  function updateDigit(index, char) {
    const next = digits.map((d, i) => (i === index ? char : d));
    onChange(next.join(''));
  }

  function handleChange(e, index) {
    const raw = e.target.value.replace(/\D/g, '');
    if (!raw) return;

    const char = raw[raw.length - 1];
    updateDigit(index, char);

    if (index < OTP_LENGTH - 1) {
      focusAt(index + 1);
    }
  }

  function handleKeyDown(e, index) {
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (digits[index]) {
        updateDigit(index, '');
      } else if (index > 0) {
        const next = digits.map((d, i) => (i === index - 1 ? '' : d));
        onChange(next.join(''));
        focusAt(index - 1);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      focusAt(index - 1);
    } else if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      focusAt(index + 1);
    }
  }

  function handlePaste(e) {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, OTP_LENGTH);
    if (!pasted) return;

    const next = Array.from({ length: OTP_LENGTH }, (_, i) => pasted[i] ?? '');
    onChange(next.join(''));

    focusAt(Math.min(pasted.length, OTP_LENGTH - 1));
  }

  return (
    <div
      className={`flex justify-center gap-3 ${className}`}
      role="group"
      aria-label="One-time password input"
    >
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          aria-label={`Digit ${index + 1} of ${OTP_LENGTH}`}
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          className={`w-12 h-14
            text-center text-xl font-bold bg-card text-primary border-2 rounded-btn outline-none transition-all duration-180 caret-transparent select-none touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed
            ${
              error
                ? 'border-error ring-2 ring-error/25'
                : digit
                  ? 'border-accent ring-2 ring-accent/20'
                  : 'border-border focus:border-accent focus:ring-2 focus:ring-accent/20'
            }`}
        />
      ))}
    </div>
  );
}
