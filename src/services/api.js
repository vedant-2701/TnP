import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_BASE_URL = 'http://localhost:8080';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include token
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      logout();
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const login = async (username, password) => {
  try {
    const response = await api.post('/tnp/auth/login', {
      username,
      password,
    });
    
    if (response.data.token) {
      setToken(response.data.token);
      return response.data;
    }
    throw new Error('No token received');
  } catch (error) {
    throw error;
  }
};

export const validateToken = async () => {
  try {
    const token = getToken();
    if (!token) return false;

    // Check if token is expired
    const decodedToken = jwtDecode(token);
    if (decodedToken.exp && decodedToken.exp * 1000 < Date.now()) {
      logout();
      return false;
    }

    // Verify token with backend
    const response = await api.post('/tnp/auth/validate-token');
    return response.data.valid;
  } catch (error) {
    logout();
    return false;
  }
};

export const setToken = (token) => {
  const secure = window.location.protocol === 'https:';
  document.cookie = `jwt=${token}; max-age=${24 * 60 * 60}; path=/; ${secure ? 'secure;' : ''} samesite=strict`;
};

export const getToken = () => {
  const match = document.cookie.match(/jwt=([^;]+)/);
  return match ? match[1] : null;
};

export const logout = () => {
  document.cookie = 'jwt=; max-age=0; path=/;';
  localStorage.removeItem('user');
  window.location.href = '/';
};