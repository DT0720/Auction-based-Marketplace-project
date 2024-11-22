'use client'; // Required for App Router client-side context

import React, { createContext, useState, useEffect } from 'react';
import { saveToken, getToken, removeToken } from '@/lib/session/auth';
import { User } from '@/domain/entities/User';

interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Restore user session on load
  useEffect(() => {
    const token = getToken();
    if (token) {
      try {
        // Decode or verify the token as needed
        const decodedUser = JSON.parse(atob(token.split('.')[1])); // Parse JWT payload (base64-decoded)
        setUser(decodedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Invalid token:', error);
        removeToken();
      }
    }
  }, []);

  const login = (token: string, user: User) => {
    saveToken(token); // Save token in localStorage
    setUser(user);
    setIsAuthenticated(true);
  };

  const logout = () => {
    removeToken(); // Clear token from localStorage
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

