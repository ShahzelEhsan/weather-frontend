// lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Optional: Add a response interceptor for global error handling
api.interceptors.response.use(
  response => response,
  error => {
    // You can customize global error handling here
    console.error('API error:', error);
    return Promise.reject(error);
  }
);

export default api;
