"use client";

import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import { saveProductMock, mockUser, DiscountReason } from "@/app/lib/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function AddProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Обработка загрузки фото
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    
    // Подготовка данных в соответствии с нашим интерфейсом Product
    const productData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as string,
      original_price: Number(formData.get('original_price')),
      discounted_price: Number(formData.get('discounted_price')),
      quantity_available: Number(formData.get('quantity') || 1),
      discount_reason: formData.get('discount_reason') as DiscountReason,
      image: imagePreview || "https://images.unsplash.com/photo-1506617420156-8e4536971650?w=500",
      seller_name: mockUser?.full_name || "Eco Store"
    };

    // Сохраняем через нашу общую функцию в mockData
    saveProductMock(productData);

    // Имитируем задержку для солидности
    setTimeout(() => {
      setIsLoading(false);
      router.push('/seller/dashboard');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-6 text-black">
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-gray-400 mb-8 uppercase text-[10px] font-black hover:text-black transition-colors"
        >
          <ArrowLeft size={16} /> Назад
        </button>

        <form onSubmit={handleSubmit} className="bg-white rounded-[3rem] p-8 md:p-12 shadow-sm border border-gray-100 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black uppercase italic tracking-tighter">Новый товар</h1>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">Заполните данные для витрины</p>
            </div>
            <div className="bg-[#C4E86B] px-4 py-2 rounded-full hidden md:block">
               <span className="text-[10px] font-black uppercase tracking-widest">Размещение активно</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Левая колонка: Фото */}
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Фото продукта</label>
              <div className="relative aspect-square bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-100 overflow-hidden group hover:border-[#C4E86B] transition-colors cursor-pointer">
                {imagePreview ? (
                  <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full gap-3">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                      <Upload className="text-gray-300 group-hover:text-[#C4E86B] transition-colors" size={20} />
                    </div>
                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-tighter">Загрузить JPG/PNG</span>
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                />
              </div>
            </div>

            {/* Правая колонка: Основные данные */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Название</label>
                <Input name="title" placeholder="НАПР: НАБОР КРУАССАНОВ" required className="h-14 rounded-2xl bg-gray-50 border-none font-bold text-xs uppercase px-6" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Старая цена</label>
                  <Input name="original_price" type="number" placeholder="10.00" required className="h-14 rounded-2xl bg-gray-50 border-none font-bold text-xs px-6" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Новая цена</label>
                  <Input name="discounted_price" type="number" placeholder="5.00" required className="h-14 rounded-2xl bg-[#C4E86B]/10 border-none font-black text-xs px-6 focus:ring-1 focus:ring-[#C4E86B]" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Категория</label>
                <select name="category" className="w-full h-14 rounded-2xl bg-gray-50 px-6 font-black text-[10px] uppercase tracking-widest outline-none border-none appearance-none cursor-pointer">
                  <option value="Выпечка">Выпечка</option>
                  <option value="Готовая еда">Готовая еда</option>
                  <option value="Продукты">Продукты</option>
                  <option value="Напитки">Напитки</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Причина уценки</label>
                <select name="discount_reason" className="w-full h-14 rounded-2xl bg-gray-50 px-6 font-black text-[10px] uppercase tracking-widest outline-none border-none appearance-none cursor-pointer">
                  <option value="expiring_soon">Срок годности</option>
                  <option value="damaged_packaging">Упаковка</option>
                  <option value="overstock">Избыток</option>
                  <option value="seasonal">Сезонное</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Описание и условия</label>
            <Textarea name="description" placeholder="ОПИШИТЕ ТОВАР И ВРЕМЯ САМОВЫВОЗА..." className="min-h-[120px] rounded-[2rem] bg-gray-50 border-none p-6 font-bold text-xs uppercase resize-none" />
          </div>
          
          <Button 
            disabled={isLoading} 
            type="submit" 
            className="w-full h-20 bg-black text-white rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] hover:bg-[#4A7C59] transition-all active:scale-[0.98] shadow-xl"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin" size={20} />
                <span>Публикация...</span>
              </div>
            ) : "Выставить на продажу"}
          </Button>
        </form>
      </div>
    </div>
  );
}