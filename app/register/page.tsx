"use client";

import React, { useState } from 'react';
import { useAuth } from '@/app/lib/AuthContext';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Store, User as UserIcon, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    full_name: '', email: '', password: '', role: 'user' as 'user' | 'admin'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newUser = {
      ...formData,
      eco_coins: 0,
      id: Date.now() // Уникальный ID для порядка
    };

    // 1. Получаем текущую "базу данных" пользователей
    const db = JSON.parse(localStorage.getItem('eco_market_users_db') || '[]');
    
    // 2. Проверяем, нет ли уже такого email
    if (db.find((u: any) => u.email === newUser.email)) {
      alert("Этот Email уже зарегистрирован!");
      return;
    }

    // 3. Сохраняем в базу
    db.push(newUser);
    localStorage.setItem('eco_market_users_db', JSON.stringify(db));

    // 4. Входим (создаем сессию)
    login(newUser);

    // 5. Редирект
    window.location.href = newUser.role === 'admin' ? '/seller/dashboard' : '/profile';
  };

  return (
    <div className="min-h-screen bg-[#f8f6f3] flex items-center justify-center p-6 text-black">
      <div className="max-w-md w-full bg-white rounded-[3rem] p-10 shadow-xl">
        <h1 className="text-3xl font-black uppercase italic text-center mb-8">Регистрация</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4 mb-6">
            <button type="button" onClick={() => setFormData({...formData, role: 'user'})}
              className={`flex-1 p-4 rounded-2xl border-2 transition-all ${formData.role === 'user' ? 'border-[#C4E86B] bg-[#C4E86B]/5' : 'border-gray-50'}`}>
              <UserIcon className="mx-auto mb-2" />
              <span className="text-[10px] font-black uppercase block text-center">Покупатель</span>
            </button>
            <button type="button" onClick={() => setFormData({...formData, role: 'admin'})}
              className={`flex-1 p-4 rounded-2xl border-2 transition-all ${formData.role === 'admin' ? 'border-[#C4E86B] bg-[#C4E86B]/5' : 'border-gray-50'}`}>
              <Store className="mx-auto mb-2" />
              <span className="text-[10px] font-black uppercase block text-center">Продавец</span>
            </button>
          </div>
          <Input placeholder="Имя" required onChange={e => setFormData({...formData, full_name: e.target.value})} className="h-14 rounded-2xl bg-gray-50 border-none" />
          <Input type="email" placeholder="Email" required onChange={e => setFormData({...formData, email: e.target.value})} className="h-14 rounded-2xl bg-gray-50 border-none" />
          <Input type="password" placeholder="Пароль" required onChange={e => setFormData({...formData, password: e.target.value})} className="h-14 rounded-2xl bg-gray-50 border-none" />
          <Button type="submit" className="w-full h-16 bg-black text-white rounded-[2rem] font-black uppercase mt-4">
            Создать аккаунт <ArrowRight className="ml-2" />
          </Button>
        </form>
      </div>
    </div>
  );
}