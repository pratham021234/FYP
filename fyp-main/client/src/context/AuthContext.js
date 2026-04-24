import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../utils/api';
import { initializeSocket, disconnectSocket } from '../utils/socket';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      loadUser();
      initializeSocket(token);
    } else {
      setLoading(false);
    }
  }, [token]);

  const loadUser = async () => {
    try {
      const response = await authAPI.getProfile();
      setUser(response.data.data);
    } catch (error) {
      console.error('Failed to load user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { user, token } = response.data.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setToken(token);
      setUser(user);
      
      initializeSocket(token);
      
      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const { user, token } = response.data.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setToken(token);
      setUser(user);
      
      initializeSocket(token);
      
      toast.success('Registration successful!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    disconnectSocket();
    toast.success('Logged out successfully');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
