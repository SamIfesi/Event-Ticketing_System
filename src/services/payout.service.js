import api from './api';

const PayoutService = {
  // GET /api/admin/payouts
  // All payouts platform-wide
  // ?status=pending|processing|paid|failed|frozen|cancelled&page=&limit=
  async getPayouts(params = {}) {
    const response = await api.get('/admin/payouts', { params });
    return response.data.data; // { payouts[], pagination }
  },

  // GET /api/admin/payouts/pending
  // Events that have ended + hold period passed but not yet paid out
  // This is the admin's action queue
  async getPendingPayouts() {
    const response = await api.get('/admin/payouts/pending');
    return response.data.data; // { payouts[] }
  },

  // POST /api/admin/payouts/:eventId/trigger
  // Manually trigger a payout for a specific event
  async triggerPayout(eventId) {
    const response = await api.post(`/admin/payouts/${eventId}/trigger`);
    return response.data.data; // { event_id, transfer_code, amount }
  },

  // POST /api/admin/payouts/:eventId/freeze
  // Freeze a payout — stops auto worker from paying it out
  // Body: { reason }
  async freezePayout(eventId, reason) {
    const response = await api.post(`/admin/payouts/${eventId}/freeze`, {
      reason,
    });
    return response.data; // { success, message }
  },

  // POST /api/admin/payouts/:eventId/unfreeze
  // Unfreeze a payout — goes back to pending for next worker run
  async unfreezePayout(eventId) {
    const response = await api.post(`/admin/payouts/${eventId}/unfreeze`);
    return response.data; // { success, message }
  },

  // POST /api/admin/payouts/:eventId/refund-all
  // Refund every paid attendee for a cancelled event
  // Platform absorbs Paystack charges
  // Body: { reason } — optional note shown in audit log
  async refundAll(eventId, reason = '') {
    const response = await api.post(`/admin/payouts/${eventId}/refund-all`, {
      reason,
    });
    return response.data.data; // { refunded, failed, errors[] }
  },

  // POST /api/admin/organizers/:id/clear-flag
  // Clear organizer flag and reset strike count to 0
  async clearOrganizerFlag(organizerId) {
    const response = await api.post(
      `/admin/organizers/${organizerId}/clear-flag`
    );
    return response.data; // { success, message }
  },
};

export default PayoutService;
