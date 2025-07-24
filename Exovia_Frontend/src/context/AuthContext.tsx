import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  isFirstLogin: boolean;
  emailNotifications?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (profileData: { name?: string; email?: string; emailNotifications?: boolean }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const { user } = await authAPI.getProfile();
          console.log('Profile response:', user);
          setUser(user);
        } catch (err) {
          console.error('Error loading user:', err);
          // Don't remove token immediately, just set loading to false
          // This prevents infinite loading states
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const { token, user } = await authAPI.login({ email, password });
      console.log('Login response:', { token, user });
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setError(null);
      const { token, user } = await authAPI.register({ name, email, password });
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (profileData: { name?: string; email?: string; emailNotifications?: boolean }) => {
    try {
      setError(null);
      const { user: updatedUser } = await authAPI.updateProfile(profileData);
      setUser(updatedUser);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Profile update failed');
      throw err;
    }
  };

  // Heartbeat mechanism to keep user active
  useEffect(() => {
    if (!token || !user) return;

    const heartbeatInterval = setInterval(async () => {
      try {
        await authAPI.heartbeat();
      } catch (error) {
        console.error('Heartbeat failed:', error);
      }
    }, 30000); // Send heartbeat every 30 seconds

    return () => clearInterval(heartbeatInterval);
  }, [token, user]);

  return (
    <AuthContext.Provider value={{ user, token, loading, error, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 