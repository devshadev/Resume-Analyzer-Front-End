import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/api',
  withCredentials: true,
});

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
  logout:   ()     => api.post('/auth/logout'),
  getMe:    ()     => api.get('/auth/me'),
};

export const analysisApi = {
  run:           (formData) => api.post('/analysis/run', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getReports:    ()         => api.get('/analysis/reports'),
  getReport:     (id)       => api.get(`/analysis/reports/${id}`),
  deleteReport:  (id)       => api.delete(`/analysis/reports/${id}`),
  getRelevantJobs: (reportId) => api.get(`/jobs/relevant/${reportId}`),
};

export default api;