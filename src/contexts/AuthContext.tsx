// src/contexts/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthContextType = {
  isAuthenticated: boolean;
  userType: 'student' | 'lecturer' | null;
  user: any;
  token: string | null;
  login: (token: string, user: any, userType: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<'student' | 'lecturer' | null>(null);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState<string | null>(null);

  // Check if user is logged in on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('authToken');
      const storedUser = await AsyncStorage.getItem('user');
      const storedUserType = await AsyncStorage.getItem('userType');

      if (storedToken && storedUser && storedUserType) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setUserType(storedUserType as 'student' | 'lecturer');
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    }
  };

  const login = async (authToken: string, userData: any, type: string) => {
    try {
      await AsyncStorage.setItem('authToken', authToken);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      await AsyncStorage.setItem('userType', type);

      setToken(authToken);
      setUser(userData);
      setUserType(type as 'student' | 'lecturer');
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error saving auth data:', error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('userType');

      setToken(null);
      setUser(null);
      setUserType(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userType,
        user,
        token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};