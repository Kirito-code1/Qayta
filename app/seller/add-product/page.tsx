"use client";

import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import { PlusCircle, Camera, MapPin, Loader2, X, ChevronDown } from "lucide-react";
import dynamic from 'next/dynamic';
import { useLanguage } from '@/app/lib/LanguageContext';

const MapPicker = dynamic(() => import('@/components/MapPicker'), { 
  ssr: false,
  loading: () => <div className="h-64 bg-gray-50 animate-pulse rounded-[2.5rem]" />
});

export default function AddProductPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    original_price: '',
    discounted_price: '',
    category: 'bakery',
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
          {t('add_title')}
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
              <label className="flex flex-col items-center justify-center h-72 w-full rounded-[2.5rem] border-4 border-dashed border-gray-100 bg-white hover:bg-gray-50 hover:border-[#C4E86B] transition-all cursor-pointer">
                <div className="p-6 bg-gray-50 rounded-2xl">
                  <Camera size={32} className="text-gray-300" />
                </div>
                <span className="mt-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  {t('add_photo_label')}
                </span>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              </label>
            )}
          </div>

          {/* КАТЕГОРИЯ */}
          <div className="relative">
             <select 
              className="w-full h-16 px-8 rounded-2xl bg-white border border-gray-100 font-black uppercase text-[10px] tracking-widest outline-none appearance-none focus:ring-4 ring-[#C4E86B]/30 transition-all text-gray-500"
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              value={formData.category}
            >
              <option value="bakery">{(t('categories') as any).bakery}</option>
              <option value="fruits">{(t('categories') as any).fruits}</option>
              <option value="dairy">{(t('categories') as any).dairy}</option>
              <option value="ready">{(t('categories') as any).ready}</option>
            </select>
            <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={16} />
          </div>

          {/* НАЗВАНИЕ */}
          <input 
            type="text"
            placeholder={t('add_name_placeholder')}
            className="w-full h-16 px-8 rounded-2xl bg-white border border-gray-100 font-bold uppercase text-[10px] tracking-widest outline-none focus:ring-4 ring-[#C4E86B]/30 transition-all"
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
          />

          {/* ЦЕНЫ */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="ml-4 text-[8px] font-black uppercase text-gray-400 tracking-widest">
                {t('add_old_price')}
              </span>
              <input 
                type="number"
                placeholder="10 000"
                className="w-full h-16 px-8 rounded-2xl bg-white border border-gray-100 font-bold uppercase text-[10px] tracking-widest outline-none focus:ring-4 ring-[#C4E86B]/30 transition-all"
                onChange={(e) => setFormData({...formData, original_price: e.target.value})}
                required
              />
            </div>
            <div className="space-y-1">
              <span className="ml-4 text-[8px] font-black uppercase text-[#4A7C59] tracking-widest">
                {t('add_new_price')}
              </span>
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
                <MapPin size={14} className="text-[#4A7C59]" /> {t('add_map_label')}
              </label>
              <span className="text-[9px] font-bold text-gray-300 uppercase italic">
                {t('add_map_hint')}
              </span>
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
            {t('add_submit_btn')}
          </button>
        </form>
      </div>
    </div>
  );
}