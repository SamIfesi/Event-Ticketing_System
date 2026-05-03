import api from './api';

const OrgApplicationService = {
  // POST /api/org_applications
  // Attendee sunbmits an application to become an organizer
  async submitApplication({ org_name, event_types, phone, reason }) {
    const response = await api.post('/org_applications', {
      org_name,
      event_types,
      phone,
      reason,
    });
    return response.data; // {success, message}
  },

  // GET /api/org_applications/mine
  // ATtendee checks the status of their own application
  async getMyApplication() {
    const response = await api.get('/org_applications/mine');
    return response.data.data; // { application } or {application: null}
  },

  // GET /api/admin/org_applications
  // Admin views all application with optional status filter
  async getMyApplications() {
    const response = await api.get('/api/admin/org_applications');
    return response.data.data; // { applications[], pagination }
  },

  // PUT /api/admin/org_applications/:id/approve
  async approveApplication(id){
    const response = await api.put(`/api/admin/org_applications/${id}/approve`);
    return response.data; //{ success, message }
  },

  // PUT /api/admin/org_applications/:id/reject
  async rejectApplication(id){
    const response = await api.put(`/api/admin/org_applications/${id}/reject`);
    return response.data; //{ success, message }
  },
};

export default OrgApplicationService;
