import api from './api';

const TransactionService = {
  // GET /api/transactions/mine
  // Attendee's own payment history
  async getMyTransactions(params = {}) {
    const response = await api.get('/transactions/mine', { params });
    return response.data.data; // { transactions[], pagination }
  },

  // GET /api/organizer/transactions
  // Organizer revenue ledger
  // ?event_id=&type=&from=&to=&page=&limit=
  async getOrganizerTransactions(params = {}) {
    const response = await api.get('/organizer/transactions', { params });
    return response.data.data; // { summary, transactions[], pagination }
  },

  // GET /api/admin/transactions
  // Platform-wide audit log
  // ?user_id=&event_id=&organizer_id=&type=&from=&to=&page=&limit=
  async getAdminTransactions(params = {}) {
    const response = await api.get('/admin/transactions', { params });
    return response.data.data; // { transactions[], pagination }
  },

  // GET /api/admin/transactions/summary
  // Financial KPIs — defaults to current month
  // ?from=&to=
  async getAdminSummary(params = {}) {
    const response = await api.get('/admin/transactions/summary', { params });
    return response.data.data; // { period, totals, daily[] }
  },

  // GET /api/admin/transactions/:bookingId
  // Full audit trail for a single booking
  async getBookingAuditTrail(bookingId) {
    const response = await api.get(`/admin/transactions/${bookingId}`);
    return response.data.data; // { booking_id, audit_trail[] }
  },
};

export default TransactionService;
