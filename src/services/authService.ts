// src/services/authService.ts (or authService.js)
import api from './api';

export const authService = {
  // Login
  login: async (email: string, password: string, userType: string) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
        userType,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Sign Up
  signUp: async (userData: any) => {
    try {
      const response = await api.post('/auth/signup', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Verify Device
  verifyDevice: async (deviceData: any) => {
    try {
      const response = await api.post('/auth/verify-device', deviceData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Forgot Password
  forgotPassword: async (email: string) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Logout
  logout: async () => {
    try {
      const response = await api.post('/auth/logout');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};