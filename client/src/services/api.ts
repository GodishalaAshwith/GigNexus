import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (userData: any) => {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/users/me');
      return response.data;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  },

  updateProfile: async (profileData: any) => {
    const response = await axios.put('/api/users/profile', profileData, {
      headers: {
        'x-auth-token': localStorage.getItem('token')
      }
    });
    return response.data;
  }


};

// Job services
export const jobService = {
  getAllJobs: async (filters = {}) => {
    try {
      const response = await api.get('/jobs', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Get jobs error:', error);
      throw error;
    }
  },

  getJobById: async (id: string) => {
    try {
      const response = await api.get(`/jobs/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get job error:', error);
      throw error;
    }
  },

  createJob: async (jobData: any) => {
    try {
      const response = await api.post('/jobs', jobData);
      return response.data;
    } catch (error) {
      console.error('Create job error:', error);
      throw error;
    }
  },
};

// Proposal services
export const proposalService = {
  // Submit a new proposal
  submitProposal: async (proposalData: any) => {
    try {
      const response = await api.post('/proposals', proposalData);
      return response.data;
    } catch (error) {
      console.error('Submit proposal error:', error);
      throw error;
    }
  },

  // Get proposals for a specific job
  getProposalsForJob: async (jobId: string) => {
    try {
      const response = await api.get(`/proposals/job/${jobId}`);
      return response.data;
    } catch (error) {
      console.error('Get proposals error:', error);
      throw error;
    }
  },

  // Get all proposals submitted by the current freelancer
  getMyProposals: async () => {
    try {
      const response = await api.get('/proposals/my');
      return response.data;
    } catch (error) {
      console.error('Get my proposals error:', error);
      throw error;
    }
  },

  // Update proposal status (for businesses)
  updateProposalStatus: async (proposalId: string, status: string) => {
    try {
      const response = await api.patch(`/proposals/${proposalId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Update proposal status error:', error);
      throw error;
    }
  }
};

export default api;
