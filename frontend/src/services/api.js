import axios from 'axios';

const PRODUCTION_API = 'https://edulumix-backend.onrender.com/api';
const LOCAL_API = 'http://localhost:5000/api';

function getBaseURL() {
  if (typeof window === 'undefined') return PRODUCTION_API;
  const host = window.location?.hostname || '';
  if (host === 'localhost' || host === '127.0.0.1') return LOCAL_API;
  return PRODUCTION_API;
}

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - fix API URL + add token
api.interceptors.request.use(
  (config) => {
    config.baseURL = getBaseURL();
    const token = localStorage.getItem('edulumix_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('edulumix_token');
      localStorage.removeItem('edulumix_user');
      
      // Only redirect if not already on auth pages
      if (!window.location.pathname.includes('/login') && 
          !window.location.pathname.includes('/signup')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
