"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext<any>(undefined);

const SESSION_KEY = 'eco_market_current_session'; 
const DB_KEY = 'eco_market_users_db'; // Ключ нашей "базы данных"

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const router = useRouter();

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

  const login = (userData: any) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
    setIsAuthenticated(false);
    router.push('/login');
  };

  // ОБНОВЛЕННАЯ ФУНКЦИЯ УДАЛЕНИЯ
  const deleteAccount = () => {
    if (!user) return;

    // 1. Достаем всех пользователей
    const db = JSON.parse(localStorage.getItem(DB_KEY) || '[]');

    // 2. Удаляем текущего пользователя из массива по email
    const updatedDb = db.filter((u: any) => u.email !== user.email);

    // 3. Сохраняем обновленный список обратно в базу
    localStorage.setItem(DB_KEY, JSON.stringify(updatedDb));

    // 4. Очищаем сессию и сбрасываем состояние
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
    setIsAuthenticated(false);

    // 5. Уводим на главную
    window.location.href = '/';
  };

  const updateUser = (newData: Partial<any>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...newData };
    
    // Обновляем в сессии
    localStorage.setItem(SESSION_KEY, JSON.stringify(updatedUser));
    
    // Обновляем в базе данных
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