import api from './api'

const EventsService = {
  async getEvents(param = {}) {
    const response = await api.get('/events', { param });
    return response.data.data; // returns {events: [], pagination: {}}
  },

  async getEvent(id) {
    const response = await api.get(`/events/${id}`);
    return response.data.data; // returns {event} - includes ticket_types[]
  }

}
export default EventsService;