import api from './api';

const EventsService = {
  async getEvents(params = {}) {
    const response = await api.get('/events', { params });
    return response.data.data; // returns {events: [], pagination: {}}
  },

  // Public event page — accepts either a numeric event id OR a slug. 
  async getEvent(slugOrId) {
    const response = await api.get(`/events/${slugOrId}`);
    return response.data.data; // returns {event} - includes ticket_types[]
  },

  // Organizer dashboard — accepts either a numeric id OR a slug.
  // Always returns the full event object, including the real numeric event.id,
  // which should be used for any subsequent mutation calls below.
  async getMyEvent(slugOrId) {
    const response = await api.get(`/organizer/events/${slugOrId}`);
    return response.data.data; // returns {event} - includes ticket_types[]
  },
};
export default EventsService;
