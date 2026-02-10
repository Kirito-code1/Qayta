"use client";

import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import { PlusCircle, Camera, MapPin, Loader2, X } from "lucide-react";
import dynamic from 'next/dynamic';

// Загружаем карту динамически, чтобы Next.js не ругался на отсутствие window
const MapPicker = dynamic(() => import('@/components/MapPicker'), { 
  ssr: false,
  loading: () => <div className="h-64 bg-gray-50 animate-pulse rounded-[2.5rem]" />
});

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    original_price: '',
    discounted_price: '',
    category: 'выпечка',
    coordinates: [41.3111, 69.2797] as [number, number]
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newProduct = {
      ...formData,
      id: Date.now().toString(),
      image: imagePreview || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
      seller_name: "Мой Магазин",
      created_at: new Date().toISOString()
    };

    // Сохраняем в localStorage
    const existing = JSON.parse(localStorage.getItem('products') || '[]');
    localStorage.setItem('products', JSON.stringify([...existing, newProduct]));

    setTimeout(() => {
      router.push('/browse');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#FBFBFB] pt-24 pb-20 px-4">
      <div className="max-w-xl mx-auto">
        <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-8 text-black text-center md:text-left">
          Добавить товар
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* ФОТО ТОВАРА */}
          <div className="relative group">
            {imagePreview ? (
              <div className="relative h-72 w-full rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl">
                <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                <button 
                  type="button"
                  onClick={() => setImagePreview(null)}
                  className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white p-2 rounded-full hover:bg-red-500 transition-all"
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-72 w-full rounded-[2.5rem] border-4 border-dashed border-gray-200 bg-white hover:bg-gray-50 hover:border-[#C4E86B] transition-all cursor-pointer">
                <div className="p-6 bg-gray-50 rounded-2xl">
                  <Camera size={32} className="text-gray-400" />
                </div>
                <span className="mt-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Загрузите фото товара</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              </label>
            )}
          </div>

          {/* НАЗВАНИЕ */}
          <input 
            type="text"
            placeholder="Что продаем?"
            className="w-full h-16 px-8 rounded-2xl bg-white border border-gray-100 font-bold uppercase text-[10px] tracking-widest outline-none focus:ring-4 ring-[#C4E86B]/30 transition-all"
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
          />

          {/* ЦЕНЫ */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="ml-4 text-[8px] font-black uppercase text-gray-400 tracking-widest">Старая цена</span>
              <input 
                type="number"
                placeholder="10 000"
                className="w-full h-16 px-8 rounded-2xl bg-white border border-gray-100 font-bold uppercase text-[10px] tracking-widest outline-none focus:ring-4 ring-[#C4E86B]/30 transition-all"
                onChange={(e) => setFormData({...formData, original_price: e.target.value})}
                required
              />
            </div>
            <div className="space-y-1">
              <span className="ml-4 text-[8px] font-black uppercase text-[#4A7C59] tracking-widest">Новая цена</span>
              <input 
                type="number"
                placeholder="5 000"
                className="w-full h-16 px-8 rounded-2xl bg-white border border-gray-100 font-bold uppercase text-[10px] tracking-widest outline-none focus:ring-4 ring-[#C4E86B]/30 transition-all"
                onChange={(e) => setFormData({...formData, discounted_price: e.target.value})}
                required
              />
            </div>
          </div>

          {/* КАРТА */}
          <div className="pt-6 space-y-3">
            <div className="flex items-center justify-between px-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                <MapPin size={14} className="text-[#4A7C59]" /> Где забрать?
              </label>
              <span className="text-[9px] font-bold text-gray-400 uppercase italic">Ткните пальцем в карту</span>
            </div>
            
            <div className="h-64 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-xl relative z-10 ring-1 ring-black/5">
              <MapPicker 
                onChange={(coords) => setFormData({...formData, coordinates: coords})} 
              />
            </div>
          </div>

          {/* КНОПКА ОТПРАВКИ */}
          <button 
            type="submit"
            disabled={loading}
            className="w-full h-20 bg-black text-white rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] hover:bg-[#4A7C59] active:scale-95 transition-all flex items-center justify-center gap-3 mt-10 shadow-2xl shadow-black/20"
          >
            {loading ? <Loader2 className="animate-spin" /> : <PlusCircle size={20} />}
            Выставить на продажу
          </button>
        </form>
      </div>
    </div>
  );
}