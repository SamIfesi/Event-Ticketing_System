import api from './api';

const NotificationService = {
  // GET /api/notifications
  // ?unread=1 to filter unread only
  // ?page=&limit=
  async getNotifications(params = {}) {
    const response = await api.get('/notifications', { params });
    return response.data.data; // { notifications[], unread_count, pagination }
  },

  // GET /api/notifications/unread
  // Lightweight — just the count for the bell badge
  async getUnreadCount() {
    const response = await api.get('/notifications/unread');
    return response.data.data; // { unread_count }
  },

  // PUT /api/notifications/:id/read
  async markRead(id) {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data; // { success, message }
  },

  // PUT /api/notifications/read-all
  async markAllRead() {
    const response = await api.put('/notifications/read-all');
    return response.data.data; // { marked_read }
  },

  // DELETE /api/notifications/:id
  async deleteNotification(id) {
    const response = await api.delete(`/notifications/${id}`);
    return response.data; // { success, message }
  },
};

export default NotificationService;
