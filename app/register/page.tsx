"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/lib/AuthContext';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Store, User as UserIcon, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { refreshAuth } = useAuth();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    city: '',
    phone: '',
    role: 'user' as 'user' | 'admin'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

   if (!formData.full_name.trim() || !formData.email.trim() || !formData.password.trim()) {
  return alert('Please fill in all fields');
}

    const newUser = {
      ...formData,
      eco_coins: 0,
      total_waste_prevented_kg: 0,
      total_co2_saved_kg: 0,
      total_orders: 0
    };

   try {
  localStorage.setItem('eco_market_auth_data', JSON.stringify(newUser));
} catch (error) {
  console.error('Error saving data to local storage:', error);
  return alert('Error saving data to local storage');
}

    refreshAuth();

    // Redirect based on role
    if (formData.role === 'admin') {
      router.push('/seller/dashboard');
    } else {
      router.push('/profile');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f6f3] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[3rem] p-10 shadow-xl border border-gray-100">
        <h1 className="text-3xl font-black uppercase italic tracking-tighter text-center mb-8">Create an account</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4 mb-6">
            <button 
              type="button"
              onClick={() => setFormData({...formData, role: 'user'})}
              className={`flex-1 p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${formData.role === 'user' ? 'border-[#C4E86B] bg-[#C4E86B]/5' : 'border-gray-50 opacity-50'}`}
            >
              <UserIcon size={20} />
              <span className="text-[10px] font-black uppercase tracking-widest">Customer</span>
            </button>
            <button 
              type="button"
              onClick={() => setFormData({...formData, role: 'admin'})}
              className={`flex-1 p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${formData.role === 'admin' ? 'border-[#C4E86B] bg-[#C4E86B]/5' : 'border-gray-50 opacity-50'}`}
            >
              <Store size={20} />
              <span className="text-[10px] font-black uppercase tracking-widest">Seller</span>
            </button>
          </div>

          <Input placeholder="Full name" required className="h-14 rounded-2xl bg-gray-50 border-none font-bold text-xs px-6 uppercase" 
            onChange={e => setFormData({...formData, full_name: e.target.value})} />
          
          <Input type="email" placeholder="Email" required className="h-14 rounded-2xl bg-gray-50 border-none font-bold text-xs px-6 uppercase"
            onChange={e => setFormData({...formData, email: e.target.value})} />

          <Input type="password" placeholder="Password" required className="h-14 rounded-2xl bg-gray-50 border-none font-bold text-xs px-6"
            onChange={e => setFormData({...formData, password: e.target.value})} />

          <Button type="submit" className="w-full h-16 bg-black text-white rounded-[2rem] font-black uppercase text-[10px] tracking-[0.2em] mt-4 hover:bg-[#4A7C59] transition-all">
            Create an account <ArrowRight className="ml-2" size={16} />
          </Button>
        </form>
      </div>
    </div>
  );
}
