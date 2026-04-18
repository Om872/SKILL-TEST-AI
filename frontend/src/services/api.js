import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api',
});

api.interceptors.request.use((config) => {
  const token = document.cookie.split('; ').find(row => row.startsWith('token='));
  if (token) {
    config.headers.Authorization = `Bearer ${token.split('=')[1]}`;
  }
  return config;
});

export default api;
