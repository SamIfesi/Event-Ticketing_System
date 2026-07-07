import api from './api';

const OrganizerService = {
  async getMyEvents() {
    const response = await api.get('/organizer/events', { skipLoader: true });
    return response.data.data; // returns {events: []}
  },

  // NEW — single event for edit/manage page.
  // Accepts either the numeric event id OR a slug — the backend
  // (EventController::showOwn) resolves whichever is passed.
  // Always returns the event's real numeric id in the response,
  // which must be used for any mutation call below.
  async getMyEvent(slugOrId) {
    const response = await api.get(`/organizer/events/${slugOrId}`);
    return response.data.data; // returns {event} - includes ticket_types[]
  },

  async createEvent(eventData) {
    const response = await api.post('/events', eventData);
    return response.data.data; // returns {event}
  },

  async updateEvent(id, eventData){
    const response = await api.put(`/events/${id}`, eventData);
    return response.data.data; // returns {event}
  },

  async deleteEvent(id) {
    const response = await api.delete(`/events/${id}`);
    return response.data; // returns {status, message: 'Event cancelled successfully...'}
  },

  async getEventBookings(eventId) {
    const response = await api.get(`/organizer/events/${eventId}/bookings`);
    return response.data.data; // returns {bookings: []}
  },

  async getCheckinList(eventId) {
    const response = await api.get(`/organizer/events/${eventId}/checkins`);
    return response.data.data; // returns {summary: {total, checked_in, remaining}, tickets: []}
  }
}
export default OrganizerService;
