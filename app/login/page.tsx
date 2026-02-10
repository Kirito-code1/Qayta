"use client";

import React, { useState } from 'react';
import Link from "next/link";
import { useAuth } from '@/app/lib/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Leaf, ArrowRight, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 1. Берем список всех пользователей из "базы"
    const db = JSON.parse(localStorage.getItem('eco_market_users_db') || '[]');
    
    // 2. Ищем пользователя с таким email и паролем
    const foundUser = db.find((u: any) => u.email === formData.email && u.password === formData.password);
    
    if (!foundUser) {
      setError("АККАУНТ НЕ НАЙДЕН ИЛИ НЕВЕРНЫЙ ПАРОЛЬ");
      return;
    }

    // 3. Если нашли — входим (создаем сессию)
    login(foundUser);

    // 4. Редирект по роли
    window.location.href = foundUser.role === 'admin' ? '/seller/dashboard' : '/profile';
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

        <form onSubmit={handleLogin} className="space-y-4" autoComplete="off">
          <Input type="email" placeholder="EMAIL" required className="h-14 rounded-2xl bg-gray-50 border-none px-6"
            onChange={e => setFormData({...formData, email: e.target.value})} />
          <Input type="password" placeholder="ПАРОЛЬ" required className="h-14 rounded-2xl bg-gray-50 border-none px-6"
            onChange={e => setFormData({...formData, password: e.target.value})} />
          <Button type="submit" className="w-full h-16 bg-black text-white rounded-[2rem] font-black uppercase tracking-widest">
            АВТОРИЗАЦИЯ <ArrowRight className="ml-2" />
          </Button>
        </form>

        <p className="mt-8 text-[10px] font-black uppercase text-gray-400 text-center">
          НЕТ АККАУНТА? <Link href="/register" className="text-black underline decoration-[#C4E86B] decoration-2">СОЗДАТЬ</Link>
        </p>
      </div>
    </div>
  );
}