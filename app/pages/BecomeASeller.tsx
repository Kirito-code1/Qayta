"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { mockUser, updateUserInfo } from "../lib/mockData"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Store, 
  MapPin, 
  CheckCircle,
  Upload,
  Loader2,
  Lock,
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";

const businessTypes = [
  { id: "restaurant", label: "Ресторан" },
  { id: "grocery_store", label: "Продуктовый магазин" },
  { id: "bakery", label: "Пекарня" },
  { id: "cafe", label: "Кафе / Кофейня" },
  { id: "individual", label: "Частный продавец" },
  { id: "other", label: "Другое" }
];

export default function BecomeASeller() {
  const router = useRouter();
  
  // Состояние формы (инициализируем безопасно)
  const [formData, setFormData] = useState({
    business_name: '',
    business_type: '',
    description: '',
    address: '',
    city: mockUser?.city || '',
    phone: mockUser?.phone || '',
    email: mockUser?.email || ''
  });
  
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // --- ЗАЩИТА ОТ NULL ---
  if (!mockUser) {
    return (
      <div className="min-h-screen bg-[#f8f6f3] flex items-center justify-center p-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="w-20 h-20 bg-white rounded-[2rem] shadow-xl flex items-center justify-center mx-auto mb-6 text-gray-300">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-3">Нужна авторизация</h2>
          <p className="text-gray-500 text-sm mb-8 max-w-[300px] mx-auto">
            Только зарегистрированные пользователи могут открывать свои магазины.
          </p>
          <Button 
            onClick={() => router.push('/login')} 
            className="bg-black text-white h-14 px-10 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-[#4A7C59] transition-all"
          >
            Войти и продолжить
          </Button>
        </motion.div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    
    // Имитация задержки
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Обновляем роль пользователя на 'admin' (продавца)
    updateUserInfo({ role: 'admin' });
    
    setIsPending(false);
    setIsSuccess(true);

    setTimeout(() => {
      router.push("/seller-dashboard"); // Исправил путь на твой дашборд
    }, 2000);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#f8f6f3] flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="max-w-md w-full mx-4 shadow-2xl border-0 rounded-[3rem] overflow-hidden bg-white">
            <CardContent className="pt-16 pb-16 text-center">
              <div className="w-24 h-24 bg-[#C4E86B] rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-lg shadow-green-100">
                <CheckCircle className="w-12 h-12 text-black" />
              </div>
              <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-4">Добро пожаловать!</h2>
              <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-10 px-6">
                Ваш магазин успешно зарегистрирован. Подготавливаем рабочее место...
              </p>
              <div className="flex justify-center">
                <Loader2 className="animate-spin text-black" size={32} />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f6f3]">
      {/* Шапка */}
      <div className="bg-black text-white py-24 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C4E86B] opacity-10 blur-[100px] rounded-full" />
        <div className="container mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-20 h-20 bg-[#C4E86B] rounded-[2rem] flex items-center justify-center mx-auto mb-8">
              <Store className="w-10 h-10 text-black" />
            </div>
            <h1 className="text-5xl font-black uppercase italic tracking-tighter mb-6">Станьте партнером</h1>
            <p className="text-[10px] text-gray-400 uppercase font-black tracking-[0.3em] max-w-lg mx-auto leading-relaxed">
              Начните продавать излишки продуктов, сокращайте отходы и развивайте свой бренд вместе с нами.
            </p>
          </motion.div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 -mt-16 pb-24">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-2xl border-0 rounded-[3rem] overflow-hidden bg-white">
            <CardHeader className="pt-12 pb-6">
              <CardTitle className="text-xl font-black uppercase italic tracking-tighter text-center">Профиль магазина</CardTitle>
            </CardHeader>
            <CardContent className="p-10">
              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Загрузка лого */}
                <div className="flex flex-col items-center group">
                  <div 
                    className="w-32 h-32 rounded-[2.5rem] bg-gray-50 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-100 cursor-pointer group-hover:border-[#C4E86B] transition-all duration-500 shadow-inner"
                    onClick={() => document.getElementById('logo-upload')?.click()}
                  >
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo" className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-500" />
                    ) : (
                      <Upload className="w-8 h-8 text-gray-200 group-hover:text-[#C4E86B] transition-colors" />
                    )}
                  </div>
                  <input id="logo-upload" type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                  <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mt-4">Логотип бренда</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="md:col-span-2 space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Название заведения</Label>
                    <Input 
                      placeholder="НАПР: GREEN CAFE"
                      value={formData.business_name} 
                      onChange={(e) => setFormData({...formData, business_name: e.target.value})} 
                      required 
                      className="h-14 rounded-2xl bg-gray-50 border-none font-bold text-xs tracking-widest uppercase focus-visible:ring-2 focus-visible:ring-[#C4E86B]"
                    />
                  </div>
                  
                  <div className="md:col-span-2 space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Категория бизнеса</Label>
                    <Select value={formData.business_type} onValueChange={(v) => setFormData({...formData, business_type: v})}>
                      <SelectTrigger className="h-14 rounded-2xl bg-gray-50 border-none font-bold text-[10px] tracking-widest uppercase focus:ring-2 focus:ring-[#C4E86B]">
                        <SelectValue placeholder="ВЫБЕРИТЕ ТИП..." />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-none shadow-2xl">
                        {businessTypes.map(type => (
                          <SelectItem key={type.id} value={type.id} className="text-[10px] font-black uppercase tracking-widest py-3">
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="md:col-span-2 space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Описание</Label>
                    <Textarea 
                      placeholder="ОПИШИТЕ ВАШУ МИССИЮ И ПРОДУКТЫ..."
                      value={formData.description} 
                      onChange={(e) => setFormData({...formData, description: e.target.value})} 
                      rows={4} 
                      className="rounded-2xl bg-gray-50 border-none font-bold text-xs tracking-widest uppercase focus-visible:ring-2 focus-visible:ring-[#C4E86B] resize-none"
                    />
                  </div>
                  
                  <div className="md:col-span-2 space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Точный адрес</Label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C4E86B]" />
                      <Input 
                        placeholder="УЛИЦА, НОМЕР ДОМА"
                        value={formData.address} 
                        onChange={(e) => setFormData({...formData, address: e.target.value})} 
                        className="pl-12 h-14 rounded-2xl bg-gray-50 border-none font-bold text-xs tracking-widest uppercase focus-visible:ring-2 focus-visible:ring-[#C4E86B]" 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Город</Label>
                    <Input 
                      value={formData.city} 
                      onChange={(e) => setFormData({...formData, city: e.target.value})} 
                      required 
                      className="h-14 rounded-2xl bg-gray-50 border-none font-bold text-xs tracking-widest uppercase focus-visible:ring-2 focus-visible:ring-[#C4E86B]" 
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Контактный телефон</Label>
                    <Input 
                      placeholder="+998"
                      value={formData.phone} 
                      onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                      className="h-14 rounded-2xl bg-gray-50 border-none font-bold text-xs tracking-widest uppercase focus-visible:ring-2 focus-visible:ring-[#C4E86B]" 
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-black hover:bg-[#4A7C59] py-8 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] shadow-xl transition-all active:scale-[0.98] group"
                  disabled={isPending || !formData.business_name || !formData.business_type}
                >
                  {isPending ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <span className="flex items-center gap-2">
                      Открыть магазин <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}