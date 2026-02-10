"use client";

import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import { useAuth } from '@/app/lib/AuthContext';
import { saveProductMock } from "@/app/lib/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";

export default function AddProductPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return alert("Войдите в систему!");
    
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    
    const productData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as string,
      original_price: Number(formData.get('original_price')),
      discounted_price: Number(formData.get('discounted_price')),
      quantity_available: Number(formData.get('quantity') || 1),
      image: imagePreview || "https://images.unsplash.com/photo-1506617420156-8e4536971650?w=500",
      sellerEmail: user.email,
      status: 'active'
    };

    saveProductMock(productData);

    setTimeout(() => {
      setIsLoading(false);
      router.push('/seller/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-6 text-black">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-400 mb-8 uppercase text-[10px] font-black hover:text-black">
          <ArrowLeft size={16} /> Назад
        </button>

        <form onSubmit={handleSubmit} className="bg-white rounded-[3rem] p-8 md:p-12 shadow-sm border border-gray-100 space-y-8">
          <h1 className="text-4xl font-black uppercase italic tracking-tighter">Новый товар</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Фото</label>
              <div className="relative aspect-square bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-100 overflow-hidden group hover:border-[#C4E86B] cursor-pointer">
                {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover" /> : <div className="flex flex-col items-center justify-center h-full"><Upload className="text-gray-300" size={24} /></div>}
                <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
            </div>

            <div className="space-y-6">
              <Input name="title" placeholder="НАЗВАНИЕ" required className="h-14 rounded-2xl bg-gray-50 border-none font-bold uppercase" />
              <div className="grid grid-cols-2 gap-4">
                <Input name="original_price" type="number" placeholder="СТАРАЯ ЦЕНА" required className="h-14 rounded-2xl bg-gray-50 border-none font-bold" />
                <Input name="discounted_price" type="number" placeholder="НОВАЯ ЦЕНА" required className="h-14 rounded-2xl bg-[#C4E86B]/20 border-none font-black" />
              </div>
              <select name="category" className="w-full h-14 rounded-2xl bg-gray-50 px-6 font-black text-[10px] uppercase outline-none">
                <option value="Выпечка">Выпечка</option>
                <option value="Готовая еда">Готовая еда</option>
                <option value="Продукты">Продукты</option>
              </select>
            </div>
          </div>

          <Textarea name="description" placeholder="ОПИСАНИЕ..." className="min-h-[120px] rounded-[2rem] bg-gray-50 border-none p-6 font-bold text-xs uppercase" />
          
          <Button disabled={isLoading} type="submit" className="w-full h-20 bg-black text-white rounded-[2rem] font-black uppercase tracking-[0.2em] hover:bg-[#4A7C59]">
            {isLoading ? <Loader2 className="animate-spin" /> : "Опубликовать"}
          </Button>
        </form>
      </div>
    </div>
  );
}