import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://192.168.65.36:3000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('@auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const get = async <T>(endpoint: string, params?: any): Promise<T> => {
  try {
    const response = await api.get<T>(endpoint, { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const post = async <T>(endpoint: string, data?: any): Promise<T> => {
  try {
    const response = await api.post<T>(endpoint, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const put = async <T>(endpoint: string, data?: any): Promise<T> => {
  try {
    const response = await api.put<T>(endpoint, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const patch = async <T>(endpoint: string, data?: any): Promise<T> => {
  try {
    const response = await api.patch<T>(endpoint, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const del = async <T>(endpoint: string): Promise<T> => {
  try {
    const response = await api.delete<T>(endpoint);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api; 