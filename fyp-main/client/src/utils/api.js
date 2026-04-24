import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
};

// User APIs
export const userAPI = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  getGuides: () => api.get('/users/guides'),
};

// Group APIs
export const groupAPI = {
  create: (data) => api.post('/groups', data),
  getAll: (params) => api.get('/groups', { params }),
  getById: (id) => api.get(`/groups/${id}`),
  join: (id) => api.post(`/groups/${id}/join`),
  approveRequest: (groupId, userId) => api.post(`/groups/${groupId}/approve-request`, { userId }),
  rejectRequest: (groupId, userId) => api.post(`/groups/${groupId}/reject-request`, { userId }),
  leave: (id) => api.post(`/groups/${id}/leave`),
  delete: (id) => api.delete(`/groups/${id}`),
  assignGuide: (data) => api.post('/groups/assign-guide', data),
  removeMember: (groupId, memberId) => api.post(`/groups/${groupId}/remove-member`, { memberId }),
};

// Project APIs
export const projectAPI = {
  createProposal: (data) => api.post('/projects/proposal', data),
  updateProposal: (id, data) => api.put(`/projects/${id}/update-proposal`, data),
  getAll: (params) => api.get('/projects', { params }),
  getById: (id) => api.get(`/projects/${id}`),
  approveProposal: (id) => api.put(`/projects/${id}/approve`),
  rejectProposal: (id, data) => api.put(`/projects/${id}/reject`, data),
  updatePhase: (id, phase) => api.put(`/projects/${id}/phase`, { phase }),
};

// Deliverable / FTR APIs
export const deliverableAPI = {
  schedule: (data) => api.post('/deliverables/schedule', data),
  getProjectDeliverables: (projectId) => api.get(`/deliverables/project/${projectId}`),
  submit: (id, data) => {
    // If data contains a File, use FormData for multipart upload
    if (data.file) {
      const formData = new FormData();
      formData.append('file', data.file);
      if (data.documentUrl) formData.append('documentUrl', data.documentUrl);
      formData.append('uploadType', 'deliverables');
      return api.put(`/deliverables/${id}/submit`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
    return api.put(`/deliverables/${id}/submit`, data);
  },
  grade: (id, data) => api.put(`/deliverables/${id}/grade`, data),
};

// Evaluation APIs
export const evaluationAPI = {
  create: (data) => api.post('/evaluations', data),
  getAll: (params) => api.get('/evaluations', { params }),
  getById: (id) => api.get(`/evaluations/${id}`),
  update: (id, data) => api.put(`/evaluations/${id}`, data),
  delete: (id) => api.delete(`/evaluations/${id}`),
};



// Notification APIs
export const notificationAPI = {
  getAll: (params) => api.get('/notifications', { params }),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  delete: (id) => api.delete(`/notifications/${id}`),
};

// Dashboard APIs
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getAnalytics: (params) => api.get('/dashboard/analytics', { params }),
  getProgressAnalytics: () => api.get('/dashboard/progress-analytics'),
};

// Public APIs (no auth required)
export const publicAPI = {
  searchProjects: (params) => api.get('/public/projects/search', { params }),
  autocomplete: (query) => api.get('/public/projects/autocomplete', { params: { query } }),
  previewProject: (id) => api.get(`/public/projects/${id}/preview`),
};



// Meeting APIs
export const meetingAPI = {
  create: (data) => api.post('/meetings', data),
  getAll: (params) => api.get('/meetings', { params }),
  getById: (id) => api.get(`/meetings/${id}`),
  update: (id, data) => api.put(`/meetings/${id}`, data),
  updateStatus: (id, status) => api.put(`/meetings/${id}/status`, { status }),
  delete: (id) => api.delete(`/meetings/${id}`),
  getUpcoming: () => api.get('/meetings/upcoming'),
};



export default api;
