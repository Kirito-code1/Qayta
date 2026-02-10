"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from "next/navigation";
import { mockProducts, saveProductMock, Product } from "../lib/mockData";
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
  ArrowLeft,
  Upload,
  Loader2,
  Check
} from "lucide-react";
import { motion } from "framer-motion";

const categories = [
  { id: "food", label: "Prepared Food" },
  { id: "bakery", label: "Bakery" },
  { id: "produce", label: "Fresh Produce" },
  { id: "other", label: "Other" }
];

function AddProductForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    original_price: '',
    discounted_price: '',
    quantity_available: '',
  });
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Загрузка данных для редактирования
  useEffect(() => {
    if (editId) {
      const product = mockProducts.find((p: Product) => p.id === editId);
      if (product) {
        setFormData({
          title: product.title,
          description: product.description || '',
          category: product.category || '',
          original_price: product.original_price.toString(),
          discounted_price: product.discounted_price.toString(),
          quantity_available: product.quantity_available.toString(),
        });
        setImagePreview(product.image_url);
      }
    }
  }, [editId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Имитация задержки сети
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // ПРЕОБРАЗОВАНИЕ ТИПОВ: переводим строки из формы в числа для mockData
    saveProductMock({
      ...formData,
      id: editId || undefined,
      original_price: parseFloat(formData.original_price) || 0,
      discounted_price: parseFloat(formData.discounted_price) || 0,
      quantity_available: parseInt(formData.quantity_available) || 0,
      image_url: imagePreview || "https://images.unsplash.com/photo-1506617420156-8e4536971650?w=400",
      status: 'active'
    });
    
    setIsSubmitting(false);
    setSuccess(true);
    
    // Перенаправление обратно в дашборд
    setTimeout(() => {
      router.push("/dashboard");
    }, 1500);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f6f3] py-8 font-sans text-[#2D2D2D]">
      <div className="container mx-auto px-4 max-w-2xl">
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-gray-500 mb-6 hover:text-[#4A7C59] transition-colors"
        >
          <ArrowLeft size={20} /> 
          <span className="font-medium">Назад к управлению</span>
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-0 shadow-xl overflow-hidden rounded-3xl">
            <CardHeader className="bg-white border-b border-gray-50">
              <CardTitle className="text-xl font-bold">
                {editId ? "Редактировать товар" : "Создать новое объявление"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {success ? (
                <div className="text-center py-12">
                  <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }}
                    className="w-20 h-20 bg-green-50 text-[#4A7C59] rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <Check size={40} strokeWidth={3} />
                  </motion.div>
                  <h2 className="text-2xl font-bold mb-2">Объявление сохранено!</h2>
                  <p className="text-gray-500">Сейчас вы будете перенаправлены в дашборд...</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Секция фото */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold uppercase tracking-wider text-gray-500">Фотография товара</Label>
                    <div 
                      className="aspect-[16/9] bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer overflow-hidden relative group hover:border-[#4A7C59] transition-all"
                      onClick={() => document.getElementById('img-input')?.click()}
                    >
                      {imagePreview ? (
                        <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                      ) : (
                        <>
                          <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <Upload className="text-[#4A7C59]" size={20} />
                          </div>
                          <span className="text-sm font-medium text-gray-600">Загрузить изображение</span>
                          <span className="text-xs text-gray-400 mt-1">JPG, PNG до 5 МБ</span>
                        </>
                      )}
                      <input type="file" id="img-input" hidden accept="image/*" onChange={handleImageChange} />
                    </div>
                  </div>

                  {/* Основная инфа */}
                  <div className="grid gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="font-semibold text-gray-700">Название</Label>
                      <Input 
                        id="title"
                        placeholder="Например: Сет круассанов (4 шт)" 
                        className="rounded-xl border-gray-200 focus:ring-[#4A7C59]"
                        value={formData.title} 
                        onChange={e => setFormData({...formData, title: e.target.value})}
                        required 
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="font-semibold text-gray-700">Старая цена ($)</Label>
                        <Input 
                          type="number" 
                          step="0.01"
                          placeholder="0.00" 
                          className="rounded-xl border-gray-200"
                          value={formData.original_price}
                          onChange={e => setFormData({...formData, original_price: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-semibold text-gray-700">Цена со скидкой ($)</Label>
                        <Input 
                          type="number" 
                          step="0.01"
                          placeholder="0.00" 
                          className="rounded-xl border-gray-200"
                          value={formData.discounted_price}
                          onChange={e => setFormData({...formData, discounted_price: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="font-semibold text-gray-700">Количество</Label>
                        <Input 
                          type="number" 
                          placeholder="1" 
                          className="rounded-xl border-gray-200"
                          value={formData.quantity_available}
                          onChange={e => setFormData({...formData, quantity_available: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-semibold text-gray-700">Категория</Label>
                        <Select 
                          value={formData.category} 
                          onValueChange={v => setFormData({...formData, category: v})}
                        >
                          <SelectTrigger className="rounded-xl border-gray-200">
                            <SelectValue placeholder="Выбрать..." />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map(c => (
                              <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="font-semibold text-gray-700">Описание (необязательно)</Label>
                      <Textarea 
                        placeholder="Опишите состояние, срок годности или состав..." 
                        className="rounded-xl border-gray-200 min-h-[100px]"
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit"
                    className="w-full bg-[#4A7C59] hover:bg-[#3D6B4A] text-white py-7 rounded-2xl text-lg font-bold shadow-lg shadow-green-100 transition-all active:scale-[0.98]" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="animate-spin" />
                        <span>Сохранение...</span>
                      </div>
                    ) : (
                      editId ? "Обновить данные" : "Опубликовать объявление"
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default function AddProductPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#f8f6f3]">
        <Loader2 className="animate-spin text-[#4A7C59] w-10 h-10" />
      </div>
    }>
      <AddProductForm />
    </Suspense>
  );
}