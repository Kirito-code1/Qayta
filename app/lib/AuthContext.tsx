"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext<any>(undefined);

const SESSION_KEY = 'eco_market_current_session'; 
const DB_KEY = 'eco_market_users_db';
const COOKIE_NAME = 'eco_market_users_db';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const session = localStorage.getItem(SESSION_KEY);
    if (session) {
      try {
        setUser(JSON.parse(session));
        setIsAuthenticated(true);
      } catch (e) {
        localStorage.removeItem(SESSION_KEY);
      }
    }
    setIsLoadingAuth(false);
  }, []);

  const login = (userData: any) => {
    // Сохраняем для фронтенда
    localStorage.setItem(SESSION_KEY, JSON.stringify(userData));
    // Сохраняем КУКУ для Middleware (сервера) на 7 дней
    document.cookie = `${COOKIE_NAME}=true; path=/; max-age=604800; SameSite=Lax`;
    
    setUser(userData);
    setIsAuthenticated(true);
    router.push('/profile');
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    // Удаляем куку
    document.cookie = `${COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    
    setUser(null);
    setIsAuthenticated(false);
    router.push('/login');
  };

  const updateUser = (newData: Partial<any>) => {
    if (!user) return;
    const updatedUser = { ...user, ...newData };
    localStorage.setItem(SESSION_KEY, JSON.stringify(updatedUser));
    
    const db = JSON.parse(localStorage.getItem(DB_KEY) || '[]');
    const updatedDb = db.map((u: any) => u.email === user.email ? updatedUser : u);
    localStorage.setItem(DB_KEY, JSON.stringify(updatedDb));

    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoadingAuth, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);