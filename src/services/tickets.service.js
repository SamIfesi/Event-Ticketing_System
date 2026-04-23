import api from './api';

const TicketsService = {
  async getTicket(id){
    const response = await api.get(`/tickets/${id}`);
    return response.data.data; // return {ticket} includes qr_code_url (raw token is stripped by backend)
  },

  async getTicketsByBooking(bookingId){
    const response = await api.get(`/tickets/booking/${bookingId}`)
    return response.data.data; // return {tickets[]} - all tickets under one booking each with qr_code_url
  },

  async checkin(qrToken){
    const response = await api.post('tickets/checkin', {qr_token: qrToken});
    return response.data.data //return {attendee_name, ticket_type, evemt_title, checked_in_at}
  },
}
export default TicketsService;