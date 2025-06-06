import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@/services/authService';
import { ApiError } from '@/types/api';

export type UserRole = 'admin' | 'pm' | 'employee';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  fullName: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('user');
    const accessToken = authService.getAccessToken();
    
    if (savedUser && accessToken) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        authService.clearTokens();
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await authService.login({ email, password });
      
      // Get updated user from localStorage
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      
      setIsLoading(false);
      return true;
    } catch (error) {
      setIsLoading(false);
      const apiError = error as ApiError;
      setError(apiError.message || 'Login failed');
      return false;
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setError(null);
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};