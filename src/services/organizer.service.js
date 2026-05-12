import api from "./api";

const OrganizerService = {
  async getMyEvents() {
    const response = await api.get('/organizer/events');
    return response.data.data; // returns {events: []}
  },

  async createEvent(eventData){
    const response = await api.post('/events', eventData);
   return response.data.data; // returns {event} 
  },

  async updateEvent(id, eventData){
    const response = await api.put(`/events/${id}`, eventData);
    return response.data.data; // returns {event}
  },

  async deleteEvent(id){
    const response = await api.delete(`/events/${id}`);
    return response.data; // returns {success, message: 'Event deleted successfully'}
  },

  async getEventBookings(eventId){
    const response = await api.get(`/organizer/events/${eventId}/bookings`);
    return response.data.data; // returns {bookings: []}
  },

  async getCheckinList(eventId){
    const response = await api.get(`/organizers/events/${eventId}/checkins`);
    return response.data.data; // returns {summary: {total, checked_in, remaining}, tickets: []}
  }
}
export default OrganizerService;