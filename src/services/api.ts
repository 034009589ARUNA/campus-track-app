// src/services/api.ts (or api.js)
import axios from 'axios';

// Replace with your actual backend URL
const API_BASE_URL = 'http://192.168.1.100:3000/api'; // Use your computer's IP for testing on device
// const API_BASE_URL = 'http://localhost:3000/api'; // Use this for emulator/simulator

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  async (config) => {
    // Get token from AsyncStorage (we'll set this up next)
    // const token = await AsyncStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      console.log('API Error:', error.response.data);
    } else if (error.request) {
      // No response received
      console.log('Network Error:', error.request);
    }
    return Promise.reject(error);
  }
);

export default api;