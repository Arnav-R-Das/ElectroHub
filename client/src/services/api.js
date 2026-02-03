import axios from 'axios';

// Creating axios instance
const API = axios.create({
  baseURL:  process.env.REACT_APP_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Handling Errors
API.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        // Server responded with error status
        console.error('API Error:', error.response.status, error.response.data);
      } else if (error.request) {
        // Request made but no response
        console.error('Network Error:', error.request);
      } else {
        // Something else happened
        console.error('Error:', error.message);
      }
      return Promise.reject(error);
    }
);


// Template API functions
const templateAPI = {
  
  // CREATE one
  createTemplate: async (data) => {
    try {
      const response = await API.post('/routerTemplate', data);
      return response.data;
    } catch (error) {
      console.error('Error creating template:', error);
      throw error;
    }
  },

  // READ all
  getAllTemplates: async () => {
    try {
      const response = await API.get('/routerTemplate');
      return response.data;
    } catch (error) {
      console.error('Error fetching templates:', error);
      throw error;
    }
  },

  // READ one
  getTemplate: async (id) => {
    try {
      const response = await API.get(`/routerTemplate/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching template:', error);
      throw error;
    }
  },

  // UPDATE one
  updateTemplate: async (id, data) => {
    try {
      const response = await API.patch(`/routerTemplate/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating template:', error);
      throw error;
    }
  },

  // DELETE one
  deleteTemplate: async (id) => {
    try {
      const response = await API.delete(`/routerTemplate/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting template:', error);
      throw error;
    }
  },
};

export default templateAPI;