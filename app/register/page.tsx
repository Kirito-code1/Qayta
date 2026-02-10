"use client";

import React, { useState } from 'react';
import { useAuth } from '@/app/lib/AuthContext';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Store, User as UserIcon, ArrowRight, MapPin } from "lucide-react";

// Список городов для выбора
const CITIES = ["Ташкент", "Самарканд", "Бухара", "Фергана", "Наманган", "Андижан", "Нукус"];

export default function RegisterPage() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    full_name: '', 
    email: '', 
    password: '', 
    city: '', // Новое поле
    role: 'user' as 'user' | 'admin'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Проверка выбора города
    if (!formData.city) {
      alert("Пожалуйста, выберите город проживания");
      return;
    }

    const newUser = {
      ...formData,
      eco_coins: 0,
      id: Date.now() 
    };

    const db = JSON.parse(localStorage.getItem('eco_market_users_db') || '[]');
    
    if (db.find((u: any) => u.email === newUser.email)) {
      alert("Этот Email уже зарегистрирован!");
      return;
    }

    db.push(newUser);
    localStorage.setItem('eco_market_users_db', JSON.stringify(db));

    login(newUser);

    window.location.href = newUser.role === 'admin' ? '/seller/dashboard' : '/profile';
  };

  return (
    <div className="min-h-screen bg-[#f8f6f3] flex items-center justify-center p-6 text-black">
      <div className="max-w-md w-full bg-white rounded-[3rem] p-10 shadow-xl border border-gray-100">
        <h1 className="text-3xl font-black uppercase italic text-center mb-8 tracking-tighter">Регистрация</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Выбор роли */}
          <div className="flex gap-4 mb-6">
            <button type="button" onClick={() => setFormData({...formData, role: 'user'})}
              className={`flex-1 p-4 rounded-3xl border-2 transition-all duration-300 ${formData.role === 'user' ? 'border-[#C4E86B] bg-[#C4E86B]/5' : 'border-gray-50'}`}>
              <UserIcon className={`mx-auto mb-2 ${formData.role === 'user' ? 'text-[#4A7C59]' : 'text-gray-300'}`} />
              <span className="text-[10px] font-black uppercase block text-center tracking-widest">Покупатель</span>
            </button>
            <button type="button" onClick={() => setFormData({...formData, role: 'admin'})}
              className={`flex-1 p-4 rounded-3xl border-2 transition-all duration-300 ${formData.role === 'admin' ? 'border-[#C4E86B] bg-[#C4E86B]/5' : 'border-gray-50'}`}>
              <Store className={`mx-auto mb-2 ${formData.role === 'admin' ? 'text-[#4A7C59]' : 'text-gray-300'}`} />
              <span className="text-[10px] font-black uppercase block text-center tracking-widest">Продавец</span>
            </button>
          </div>

          <div className="space-y-3">
            <Input 
              placeholder="Имя" 
              required 
              onChange={e => setFormData({...formData, full_name: e.target.value})} 
              className="h-14 rounded-2xl bg-gray-50 border-none px-6 font-medium focus:ring-2 ring-[#C4E86B]" 
            />
            
            <Input 
              type="email" 
              placeholder="Email" 
              required 
              onChange={e => setFormData({...formData, email: e.target.value})} 
              className="h-14 rounded-2xl bg-gray-50 border-none px-6 font-medium focus:ring-2 ring-[#C4E86B]" 
            />

            {/* Выбор города */}
            <div className="relative">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
                <MapPin size={18} />
              </div>
              <select 
                required
                className="w-full h-14 rounded-2xl bg-gray-50 border-none px-12 font-medium appearance-none focus:ring-2 ring-[#C4E86B] text-gray-500"
                onChange={e => setFormData({...formData, city: e.target.value})}
                defaultValue=""
              >
                <option value="" disabled>Выберите город</option>
                {CITIES.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <Input 
              type="password" 
              placeholder="Пароль" 
              required 
              onChange={e => setFormData({...formData, password: e.target.value})} 
              className="h-14 rounded-2xl bg-gray-50 border-none px-6 font-medium focus:ring-2 ring-[#C4E86B]" 
            />
          </div>

          <Button type="submit" className="w-full h-16 bg-black text-white rounded-[2rem] font-black uppercase mt-6 hover:bg-[#4A7C59] transition-colors shadow-lg shadow-black/10">
            Создать аккаунт <ArrowRight className="ml-2" />
          </Button>

          <p className="text-center text-[10px] font-black uppercase text-gray-400 tracking-widest mt-6">
            Уже есть аккаунт? <a href="/login" className="text-black underline">Войти</a>
          </p>
        </form>
      </div>
    </div>
  );
}