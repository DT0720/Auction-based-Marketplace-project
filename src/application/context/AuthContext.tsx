'use client'; // Required for App Router client-side context

import React, { createContext, useState, useEffect } from 'react';
import { User } from '@/domain/entities/User';
import Cookies from 'js-cookie';
import { CookieEnum } from '@/domain/enums/CookieEnum';

interface AuthContextProps {
  user: User | null;
  currentBalance: number;
  isAuthenticated: boolean;
  buyer_seller_id: number;
  login: (token: string, user: User, credit: number, buyer_seller_id: number) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [buyer_seller_id, setBuyerSellerId] = useState(0);

  // Restore user session on load
  useEffect(() => {
    const token = Cookies.get(CookieEnum.AuthToken); // Get token from cookie
    if (token) {
      try {
        // Decode or verify the token as needed
        const decodedUser = JSON.parse(atob(token.split('.')[1])); // Parse JWT payload (base64-decoded)
        setUser(decodedUser.user); // Set user from token
        setCurrentBalance(decodedUser.credit ?? 0); // Set credit from token
        setBuyerSellerId(decodedUser.buyer_seller_id ?? 0); // Set buyer_seller_id from token
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to decode token:', error);
        Cookies.remove(CookieEnum.AuthToken); // Remove the cookie if decoding fails
      }
    }
    setLoading(false); // Loading completed
  }, []);

  const login = (token: string, user: User, credit: number, buyer_seller_id: number) => {
    if(token){
      Cookies.set(CookieEnum.AuthToken, token, { 
        expires: 7,
        path: '/' , 
        secure: process.env.NODE_ENV === 'production',
      }); // Set the cookie
      setBuyerSellerId(buyer_seller_id ?? 0);
      setCurrentBalance(credit ?? 0);
      setUser(user);
      setIsAuthenticated(true);
    }
  };

  const logout = () => {
    Cookies.remove(CookieEnum.AuthToken); // Remove the cookie
    setBuyerSellerId(0);
    setCurrentBalance(0);
    setUser(null);
    setIsAuthenticated(false);
  };

  if (loading) {
    return null; 
  }

  return (
    <AuthContext.Provider value={{ user, currentBalance ,isAuthenticated, buyer_seller_id ,login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

