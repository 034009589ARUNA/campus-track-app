import axios from 'axios';
import { Platform } from 'react-native';
import { Chat, Message } from '../../types/chat';

// ===== CONFIG - AUTO-DETECT ENVIRONMENT =====
const getApiUrl = () => {
  // CHANGE THIS to your actual machine IP if 10.0.2.2 doesn't work
  // Run: ipconfig (on Windows) to find your IPv4 Address
  const BACKEND_IP = '192.168.0.200'; // <-- CHANGE THIS if needed
  const BACKEND_PORT = 5000;
  
  const baseUrl = `http://${BACKEND_IP}:${BACKEND_PORT}/api/chat`;
  
  console.log('📱 Platform:', Platform.OS);
  console.log('🌐 Backend URL:', baseUrl);
  console.log('💡 If this fails, update BACKEND_IP in chatService.ts');
  
  return baseUrl;
};

const API_URL = getApiUrl();

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    console.log('📤 REQUEST:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ REQUEST ERROR:', error.message);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('✅ RESPONSE:', response.status);
    return response;
  },
  (error) => {
    console.error('❌ RESPONSE ERROR:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else if (error.request) {
      console.error('No response received');
      console.error('🚨 Check if backend is running at:', API_URL);
    }
    return Promise.reject(error);
  }
);

export const getChats = async (userId: string): Promise<Chat[]> => {
  try {
    console.log('\n🔍 Fetching chats for userId:', userId);
    
    if (!userId) {
      throw new Error('userId is required');
    }

    const response = await axiosInstance.get(`/user/${userId}`);
    const chats = response.data?.data || response.data || [];
    
    console.log('✅ Found', chats.length, 'chats');
    return chats;
  } catch (error) {
    console.error('❌ Error fetching chats:');
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNREFUSED') {
        console.error('Connection refused - backend not running or wrong IP');
      } else if (error.code === 'ETIMEDOUT') {
        console.error('Request timeout - backend not responding');
      } else if (error.message === 'Network Error') {
        console.error('Network error - check IP address and network connection');
        console.error('Expected backend at:', API_URL);
      }
    }
    throw error;
  }
};

export const getMessages = async (chatId: string): Promise<Message[]> => {
  try {
    console.log('\n🔍 Fetching messages for chatId:', chatId);
    
    if (!chatId) {
      throw new Error('chatId is required');
    }

    const response = await axiosInstance.get(`/${chatId}/messages`);
    const messages = response.data?.data || response.data || [];
    
    console.log('✅ Found', messages.length, 'messages');
    return messages;
  } catch (error) {
    console.error('❌ Error fetching messages:', error instanceof Error ? error.message : error);
    throw error;
  }
};