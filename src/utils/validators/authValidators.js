export function validateEmail(email) {
  if (!email) return 'Email is required';

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) return 'Invalid email address';
  return null;
}

export function validateOtp(otp) {
  if (!otp) return 'OTP is required';

  if (otp.length !== 6) return 'OTP must be 6 digits';

  if (!/^\d+$/.test(otp)) return 'OTP must contain only digits';

  return null;
}

export function validatePassword(password) {
  if (!password) return 'Password is required';

  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(password))
    return 'Password must contain at least one uppercase letter';
  if (!/[a-z]/.test(password))
    return 'Password must contain at least one lowercase letter';
  if (!/\d/.test(password)) return 'Password must contain at least one digit';
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
    return 'Password must contain at least one special character';

  return null;
}
