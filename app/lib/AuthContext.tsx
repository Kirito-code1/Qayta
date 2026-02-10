"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { getStoredUser, UserProfile } from './mockData';

// Интерфейс, который теперь СТРОГО соответствует твоему Layout
interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoadingAuth: boolean;
  logout: () => void;
  login: () => void;
  refreshAuth: () => void; // Теперь название совпадает!
  updateUser: (newData: Partial<UserProfile>) => void;
  deleteAccount: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_KEY = 'eco_market_auth_data';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const router = useRouter();

  // Функция обновления состояния (теперь называется refreshAuth)
  const refreshAuth = () => {
    setIsLoadingAuth(true);
    const localUser = getStoredUser();
    if (localUser) {
      setUser(localUser);
      setIsAuthenticated(true);
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
    setIsLoadingAuth(false);
  };

  useEffect(() => {
    refreshAuth();
  }, []);

  const login = () => {
    refreshAuth();
  };

  const updateUser = (newData: Partial<UserProfile>) => {
    const currentData = getStoredUser();
    if (!currentData) return;
    
    const updatedUser = { ...currentData, ...newData };
    setUser(updatedUser);
    localStorage.setItem(AUTH_KEY, JSON.stringify(updatedUser));
  };

  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    setUser(null);
    setIsAuthenticated(false);
    router.push('/login');
  };

  const deleteAccount = () => {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem('eco_market_products');
    setUser(null);
    setIsAuthenticated(false);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoadingAuth,
      logout,
      login,
      refreshAuth, // Передаем её в провайдер
      updateUser,
      deleteAccount
    }}>
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