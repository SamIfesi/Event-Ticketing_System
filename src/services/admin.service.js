import api from './api';

const AdminService = {
  async getStats() {
    const response = await api.get('/admin/stats');
    return response.data.data; // return {users, events, bookings, tickets, recents_activity[]}
  },

  async getUsers(params = {}) {
    const response = await api.get('/admin/users', { params });
    return response.data.data; // return {users[], pagination}
  },

  async getUser(id) {
    const response = await api.get(`/admin/users/${id}`);
    return response.data.data; // return {user} - includes booking_summary and organizer_summary
  },

  async updateUserRole(id, role) {
    const response = await api.put(`/admin/users/${id}/role`, { role });
    return response.data; // return {success, message}
  },

  async updateUserStatus(id, isActive) {
    const response = await api.put(`/admin/users/${id}/status`, {
      is_active: isActive ? 1 : 0,
    });
    return response.data; // return {success, message}
  },

  async getEvents(params = {}) {
    const response = await api.get('/admin/events', { params });
    return response.data.data; // return {events[], pagination}
  },

  async updateEventStatus(id, status) {
    const response = await api.put(`/admin/events/${id}/status`, { status });
    return response.data; // return {success, message}
  }
};
export default AdminService;
