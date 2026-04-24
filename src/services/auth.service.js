// All functions return response.data.data (the payload) on success.
// Errors propagate as-is so the caller (hook / component) can inspect
// error.response.data.message and error.response.data.errors.

import api from './api';

const AuthService = {
  async register({ name, email, password }) {
    const response = await api.post('/auth/register', {
      name,
      email,
      password,
    });
    return response.data.data; // returns {user, token, message}
  },

  async verifyEmail(otp) {
    const response = await api.post('/auth/verify-email', { otp });
    return response.data; // returns {success, message}
  },

  async resendOtp() {
    const response = await api.post('/auth/resend-otp');
    return response.data.data; // returns {success, message}
  },

  async login({email, password}) {
    const response = await api.post('/auth/login', { email, password });
    return response.data.data; // returns {user, token, email_verified, message}
  },

  async logout() {
    const response = await api.post('/auth/logout');
    return response.data; // returns {success, message}
  },

  async me() {
    const response = await api.get('/auth/me');
    return response.data.data; // returns {user}
  },

  async forgotPassword(email) {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data; // returns {success, message}
  },

  async verifyForgotOtp({ email, otp }) {
    const response = await api.post('/auth/verify-forgot-otp', {email, otp});
    return response.data; // returns {success, message}
  },

  async resetPassword({ email, otp, password }) {
    const response = await api.post('/auth/reset-password', {email, otp, password});
    return response.data; // returns {success, message}
  },
};

export default AuthService;