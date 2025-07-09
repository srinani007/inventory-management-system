import axios from 'axios';

const api = axios.create({
  withCredentials: true, // ✅ Required for secure cookie/token usage
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.url.startsWith('/api/auth')) {
    config.baseURL = 'http://localhost:8081';
  } else if (config.url.startsWith('/api/orders')) {
    config.baseURL = 'http://localhost:8083';
  } else if (config.url.startsWith('/api/notifications')) {
    config.baseURL = 'http://localhost:8084';
  } else {
    config.baseURL = 'http://localhost:8082'; // inventory
  }

  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('auth');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
