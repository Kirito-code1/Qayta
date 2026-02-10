"use client";

import React, { useState } from 'react';
import Link from "next/link";
import { useAuth } from '@/app/lib/AuthContext';
import { useLanguage } from '@/app/lib/LanguageContext'; // Импорт хука
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Leaf, ArrowRight, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const { t } = useLanguage(); // Используем переводчик
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const db = JSON.parse(localStorage.getItem('eco_market_users_db') || '[]');
    const foundUser = db.find((u: any) => u.email === formData.email && u.password === formData.password);
    
    if (!foundUser) {
      setError(t('login_error')); // Ошибка теперь тоже переводится
      return;
    }

    login(foundUser);
    window.location.href = foundUser.role === 'admin' ? '/seller/dashboard' : '/profile';
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4 text-black">
      <div className="max-w-md w-full bg-white rounded-[3rem] p-10 shadow-xl border border-gray-50">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[#C4E86B] rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#C4E86B]/20">
            <Leaf size={32} className="text-black" />
          </div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter">
            {t('login_title')}
          </h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-500 rounded-2xl text-[10px] font-black uppercase flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4" autoComplete="off">
          <div className="space-y-1">
            <Input 
              type="email" 
              placeholder={t('login_email')} 
              required 
              className="h-14 rounded-2xl bg-gray-50 border-none px-6 font-bold uppercase text-[10px] tracking-widest focus-visible:ring-[#C4E86B]"
              onChange={e => setFormData({...formData, email: e.target.value})} 
            />
          </div>
          <div className="space-y-1">
            <Input 
              type="password" 
              placeholder={t('login_pass')} 
              required 
              className="h-14 rounded-2xl bg-gray-50 border-none px-6 font-bold uppercase text-[10px] tracking-widest focus-visible:ring-[#C4E86B]"
              onChange={e => setFormData({...formData, password: e.target.value})} 
            />
          </div>
          
          <Button type="submit" className="w-full h-16 bg-black hover:bg-[#4A7C59] text-white rounded-[2rem] font-black uppercase tracking-[0.2em] transition-all shadow-lg shadow-black/10 active:scale-95">
            {t('login_btn')} <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </form>

        <p className="mt-8 text-[10px] font-black uppercase text-gray-400 text-center tracking-widest">
          {t('login_no_acc')}{" "}
          <Link href="/register" className="text-black underline underline-offset-4 decoration-[#C4E86B] decoration-2 hover:text-[#4A7C59] transition-colors">
            {t('login_create')}
          </Link>
        </p>
      </div>
    </div>
  );
}