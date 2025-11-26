// utils/api.js
import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000, // 10 seconds timeout
});
// baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
// Request interceptor to add auth token
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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    
    if (error.code === 'ECONNABORTED') {
      error.message = 'Request timeout - server is not responding';
    } else if (error.response?.status === 429) {
      error.message = 'Too many requests, please try again later.';
    } else if (error.response?.status === 404) {
      error.message = 'API endpoint not found - check server connection';
    } else if (!error.response) {
      error.message = 'Network error - cannot connect to server';
    }
    
    return Promise.reject(error);
  }
);

export default api;



// src/utils/api.js
// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:5000/api"
// });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default api;


