import api from './api';

const BookingsService = {
  // create a pending booking and return Paystack details for payment
  // react then opens paystack popup using the access_code
  async createBooking({ ticketTypeId, quantity }) {
    const response = await api.post('/bookings', {
      ticket_type_id: ticketTypeId,
      quantity,
    });
    return response.data.data; // return {booking_id, reference, amount, authorization_url, access_code}
  },

  // called after the paystack popup closes successfully.
  // PHP verifes with Paystack, marks booking paid, issues tickets, and returns the tickets to the client.
  async verifyPayment({ reference }) {
    const response = await api.post('/bookings/verify', { reference });
    return response.data.data;
  },

  async getMyBookings() {
    const response = await api.get('/bookings/mine');
    return response.data.data; // return {bookings[]}
  },

  async getBooking(id) {
    const response = await api.get(`/bookings/${id}`);
    return response.data.data; // return {booking} - includes tickets[]
  },
};
export default BookingsService;
