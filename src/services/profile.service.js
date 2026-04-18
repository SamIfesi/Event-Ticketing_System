import api from './api';

const ProfileService = {
  async getProfile() {
    const response = await api.get('/profile');
    return response.data.data; //{profile}
  },

  async updateProfile({ name, avatar }) {
    const response = await api.put('/profile', { name, avatar });
    return response.data.data; //{user}
  },

  async changePassword({ currentPassword, newPassword, confirmPassword }) {
    const response = await api.post('/profile/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
      confirm_password: confirmPassword,
    });
    return response.data; // return {success. message}
  },

  async requestEmailChange(newEmail) {
    const response = await api.post('/profile/change-email', {
      email: newEmail,
    });
    return response.data; // return {success, message}
    // backend sends otp to the new email nothing changes yet
  },

  async confirmEmailChange(otp) {
    const response = await api.post('/profile/confirm-email-change', { otp });
    return response.data; // return {success, message}
    // user submits the otp they received at the new email, backend verifies otp, changes email, and returns success or failure
  },

  async getBookings(params = {}) {
    const response = await api.get('/profile/bookings', { params });
    return response.data.data; // return {bookings[]} - optional filter by  payment_status
  },

  async getTickets(params = {}) {
    const response = await api.get('/profile/tickets', { params });
    return response.data.data; // return {tickets[]} - optional filter by upcoming | past | all
  },

  async getActivity(params = {}) {
    const response = await api.get('/profile/activity', { params });
    return response.data.data; // return {activity[]}
  },
};
export default ProfileService;
