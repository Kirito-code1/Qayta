"use client";

import React, { useState } from 'react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Leaf, ArrowRight, AlertCircle } from "lucide-react";
import { useAuth } from '@/app/lib/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth(); // Берем метод из контекста
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Пробуем найти данные в обоих возможных ключах для страховки
    const rawData = localStorage.getItem('eco_market_auth_data') || localStorage.getItem('eco_market_user');
    
    if (!rawData) {
      setError("АККАУНТ НЕ НАЙДЕН. НУЖНО ЗАРЕГИСТРИРОВАТЬСЯ.");
      return;
    }

    const savedUser = JSON.parse(rawData);

    // Проверяем совпадение
    if (savedUser.email === formData.email && savedUser.password === formData.password) {
      // Сохраняем актуальные данные в правильный ключ через контекст
      login(); 
      
      // Принудительный редирект
      if (savedUser.role === 'admin') {
        window.location.href = '/seller-dashboard';
      } else {
        window.location.href = '/profile';
      }
    } else {
      setError("НЕВЕРНЫЙ EMAIL ИЛИ ПАРОЛЬ");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4 text-black">
      <div className="max-w-md w-full bg-white rounded-[3rem] p-10 shadow-xl border border-gray-50">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[#C4E86B] rounded-[2rem] flex items-center justify-center mx-auto mb-6">
            <Leaf size={32} />
          </div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter">Войти</h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-500 rounded-2xl text-[10px] font-black uppercase flex items-center gap-2">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <Input 
            type="email" placeholder="EMAIL" required 
            className="h-14 rounded-2xl bg-gray-50 border-none font-bold text-xs px-6 uppercase" 
            onChange={e => setFormData({...formData, email: e.target.value})}
          />
          <Input 
            type="password" placeholder="ПАРОЛЬ" required 
            className="h-14 rounded-2xl bg-gray-50 border-none font-bold text-xs px-6" 
            onChange={e => setFormData({...formData, password: e.target.value})}
          />
          <Button type="submit" className="w-full h-16 bg-black text-white rounded-[2rem] font-black uppercase text-[10px] tracking-[0.3em] hover:bg-[#4A7C59] transition-all">
            АВТОРИЗАЦИЯ <ArrowRight className="ml-2" size={16} />
          </Button>
        </form>

        <p className="mt-8 text-[10px] font-black uppercase text-gray-400 text-center">
          НОВЫЙ ПОЛЬЗОВАТЕЛЬ? <Link href="/register" className="text-black underline decoration-[#C4E86B] decoration-2 underline-offset-4">СОЗДАТЬ АККАУНТ</Link>
        </p>
      </div>
    </div>
  );
}