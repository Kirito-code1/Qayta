"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext<any>(undefined);

const SESSION_KEY = 'eco_market_current_session'; 
const DB_KEY = 'eco_market_users_db'; 
// Имя куки должно совпадать с тем, что ты указал в middleware.ts
const COOKIE_NAME = 'eco_market_users_db'; 

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const router = useRouter();

  // Синхронизация состояния при загрузке
  useEffect(() => {
    const session = localStorage.getItem(SESSION_KEY);
    if (session) {
      try {
        const parsedUser = JSON.parse(session);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (e) {
        localStorage.removeItem(SESSION_KEY);
      }
    }
    setIsLoadingAuth(false);
  }, []);

  // Вспомогательная функция для куки (чтобы middleware видел сессию)
  const setAuthCookie = (value: string, days: number) => {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${COOKIE_NAME}=${value}; expires=${expires}; path=/`;
  };

  const deleteAuthCookie = () => {
    document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  };

  const login = (userData: any) => {
    // 1. Сохраняем в localStorage для клиента
    localStorage.setItem(SESSION_KEY, JSON.stringify(userData));
    // 2. Ставим куку для Middleware (сервера)
    setAuthCookie('true', 7); 
    
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    deleteAuthCookie(); // Удаляем куку, чтобы Middleware снова блокировал доступ
    setUser(null);
    setIsAuthenticated(false);
    router.push('/login');
  };

  const deleteAccount = () => {
    if (!user) return;

    const db = JSON.parse(localStorage.getItem(DB_KEY) || '[]');
    const updatedDb = db.filter((u: any) => u.email !== user.email);
    localStorage.setItem(DB_KEY, JSON.stringify(updatedDb));

    localStorage.removeItem(SESSION_KEY);
    deleteAuthCookie(); // Важно удалить и куку тоже
    
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = '/';
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
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoadingAuth, 
      login, 
      logout, 
      deleteAccount, 
      updateUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);