import api from './api';

const TicketsService = {
  async getTicket(id) {
    const response = await api.get(`/tickets/${id}`);
    return response.data.data; // return {ticket} includes qr_code_url (raw token is stripped by backend)
  },

  async getTicketsByBooking(bookingId) {
    const response = await api.get(`/tickets/booking/${bookingId}`);
    return response.data.data; // return {tickets[]} - all tickets under one booking each with qr_code_url
  },

  async checkin(qrToken) {
    const response = await api.post('tickets/checkin', { qr_token: qrToken });
    return response.data.data; // return {attendee_name, ticket_type, event_title, checked_in_at}
  },

  // ── PDF Download ──────────────────────────────────────────
  // Streams binary PDF from the backend. Must use responseType: 'blob'
  // because Axios defaults to JSON. Creates a temporary object URL and
  // triggers a browser download, then cleans up memory.
  async downloadTicket(bookingId) {
    const response = await api.get(`/bookings/${bookingId}/ticket`, {
      responseType: 'blob',
      skipLoader: true,
    });

    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `Ticketer_Ticket_#${String(bookingId).padStart(6, '0')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return true;
  },

  // ── PDF status check ──────────────────────────────────────
  // Returns { ticket_generated: bool, download_url: string | null }
  // Call this before attempting a download so the UI can show a
  // "still generating…" state when the worker hasn't finished yet.
  async getTicketStatus(bookingId) {
    const response = await api.get(`/bookings/${bookingId}/ticket/status`, {skipLoader: true});
    return response.data.data;
  },
};

export default TicketsService;
