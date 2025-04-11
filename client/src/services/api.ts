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
    } catch (error: any) {
      console.error('Create job error:', error);
      
      // Extract more detailed error message if available
      if (error.response && error.response.data) {
        if (error.response.data.errors && Array.isArray(error.response.data.errors)) {
          // Handle express-validator errors
          const errorMessages = error.response.data.errors.map((err: any) => err.msg).join(', ');
          throw new Error(`Validation error: ${errorMessages}`);
        } else if (error.response.data.msg) {
          throw new Error(error.response.data.msg);
        }
      }
      
      throw error;
    }
  },

  getBusinessJobs: async () => {
    try {
      const response = await api.get('/jobs/business');
      return response.data;
    } catch (error) {
      console.error('Get business jobs error:', error);
      throw error;
    }
  },

  updateJob: async (id: string, jobData: any) => {
    try {
      const response = await api.put(`/jobs/${id}`, jobData);
      return response.data;
    } catch (error) {
      console.error('Update job error:', error);
      throw error;
    }
  },

  deleteJob: async (id: string) => {
    try {
      const response = await api.delete(`/jobs/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete job error:', error);
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

  // Update proposal status
  updateProposalStatus: async (id: string, status: string) => {
    try {
      const response = await api.patch(`/proposals/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Update proposal error:', error);
      throw error;
    }
  },

  // Withdraw proposal
  withdrawProposal: async (id: string) => {
    try {
      const response = await api.delete(`/proposals/${id}`);
      return response.data;
    } catch (error) {
      console.error('Withdraw proposal error:', error);
      throw error;
    }
  },
};

// Freelancer services
export const freelancerService = {
  getAllFreelancers: async (filters = {}) => {
    try {
      const response = await api.get('/users/freelancers', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Get freelancers error:', error);
      throw error;
    }
  },

  getFreelancerById: async (id: string) => {
    try {
      const response = await api.get(`/users/freelancers/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get freelancer error:', error);
      throw error;
    }
  },

  updateFreelancerProfile: async (id: string, profileData: any) => {
    try {
      const response = await api.put(`/users/freelancers/${id}`, profileData);
      return response.data;
    } catch (error) {
      console.error('Update freelancer error:', error);
      throw error;
    }
  },

  hireFreelancer: async (freelancerId: string, jobId: string) => {
    try {
      const response = await api.post(`/users/freelancers/${freelancerId}/hire`, { jobId });
      return response.data;
    } catch (error) {
      console.error('Hire freelancer error:', error);
      throw error;
    }
  }
};

export default api;
