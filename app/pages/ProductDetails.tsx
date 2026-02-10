"use client";

import React, { useState, Suspense } from 'react';
import { mockProducts, mockUser, Product } from "../lib/mockData";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  ArrowLeft, 
  Minus, 
  Plus, 
  Check, 
  Zap, 
  Leaf,
  ShieldCheck,
  Store
} from "lucide-react";
import { motion } from "framer-motion";

const discountReasonLabels: Record<string, string> = {
  expiring_soon: "Срок истекает",
  damaged_packaging: "Уценка упаковки",
  overstock: "Излишки",
  seasonal: "Сезонное",
  other: "Спецпредложение"
};

function ProductDetailsContent() {
  const searchParams = useSearchParams();
  const productId = searchParams.get('id');
  
  const [quantity, setQuantity] = useState(1);
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);

  // Находим товар в наших заглушках
  const product = mockProducts.find(p => p.id === productId);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f6f3] p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-400">Товар не найден</h2>
        <Link href="/browse"><Button className="bg-[#4A7C59]">Вернуться к поиску</Button></Link>
      </div>
    );
  }

  const discount = Math.round(((product.original_price - product.discounted_price) / product.original_price) * 100);
  
  // Расчет экологических баллов для интерфейса
  const ecoCoinsToEarn = Math.round(product.discounted_price * 0.1 * quantity);
  const wasteSavedKg = (quantity * 0.4).toFixed(1);

  const handleOrder = () => {
    setIsOrdering(true);
    // Имитируем сетевую задержку
    setTimeout(() => {
      setIsOrdering(false);
      setOrderSuccess(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#f8f6f3] pb-20">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Link href="/browse" className="inline-flex items-center gap-2 text-gray-500 mb-8 hover:text-[#4A7C59] transition-colors font-medium">
          <ArrowLeft className="w-5 h-5" /> Назад к покупкам
        </Link>
        
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Левая колонка: Изображение */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="sticky top-28"
          >
            <div className="aspect-square rounded-[2.5rem] overflow-hidden bg-white shadow-xl shadow-gray-200/50 border border-white">
              <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" />
              <div className="absolute top-6 left-6 bg-[#4A7C59] text-white px-5 py-2 rounded-2xl font-black text-lg shadow-lg">
                -{discount}%
              </div>
            </div>
          </motion.div>
          
          {/* Правая колонка: Инфо */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge className="bg-amber-100 text-amber-700 border-0 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {discountReasonLabels[product.category || 'other'] || "Специальная цена"}
              </Badge>
              <h1 className="text-5xl font-black text-gray-900 leading-tight">{product.title}</h1>
              <p className="text-gray-500 text-lg leading-relaxed">{product.description || "Этот товар был отобран специально для нашей платформы, чтобы предотвратить пищевые отходы. Свежесть и качество гарантированы."}</p>
            </div>

            <div className="flex items-center gap-6 bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase mb-1">Ваша цена</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-black text-[#4A7C59]">{product.discounted_price}₽</span>
                  <span className="text-xl text-gray-300 line-through font-bold">{product.original_price}₽</span>
                </div>
              </div>
              <div className="h-12 w-px bg-gray-100 hidden sm:block" />
              <div className="hidden sm:block">
                <p className="text-xs font-bold text-gray-400 uppercase mb-1">Вы экономите</p>
                <p className="text-xl font-bold text-amber-600">{product.original_price - product.discounted_price}₽</p>
              </div>
            </div>

            {/* Эко-виджет */}
            <div className="bg-gradient-to-br from-green-600 to-[#2d4d37] p-8 rounded-[2rem] text-white shadow-lg shadow-green-100 relative overflow-hidden">
              <div className="relative z-10 flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Zap className="text-yellow-400 w-6 h-6 fill-yellow-400" />
                    <span className="font-black text-xl">+{ecoCoinsToEarn} Eco Coins</span>
                  </div>
                  <p className="text-green-100 text-sm opacity-90">За спасение {wasteSavedKg}кг продуктов</p>
                </div>
                <Leaf className="w-20 h-20 text-white/10 absolute -right-4 -bottom-4" />
              </div>
            </div>

            {/* Контролы покупки */}
            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900">Количество</span>
                <div className="flex items-center gap-6 bg-gray-50 p-2 rounded-2xl">
                  <Button variant="ghost" size="icon" onClick={() => setQuantity(q => Math.max(1, q-1))} className="hover:bg-white rounded-xl h-10 w-10"><Minus size={18}/></Button>
                  <span className="text-xl font-bold w-4 text-center">{quantity}</span>
                  <Button variant="ghost" size="icon" onClick={() => setQuantity(q => Math.min(product.quantity_available, q+1))} className="hover:bg-white rounded-xl h-10 w-10"><Plus size={18}/></Button>
                </div>
              </div>
              
              <div className="space-y-4 pt-2">
                 <Button 
                    className="w-full bg-[#4A7C59] hover:bg-[#3d6b4a] py-8 text-xl font-bold rounded-2xl shadow-lg shadow-green-100 transition-all active:scale-95"
                    onClick={() => setShowOrderDialog(true)}
                  >
                    Забронировать за {(product.discounted_price * quantity)}₽
                  </Button>
                  <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-2">
                    <ShieldCheck size={14} className="text-green-500" /> Оплата при получении в магазине
                  </p>
              </div>
            </div>

            {/* Информация о продавце (заглушка) */}
            <div className="flex items-center gap-4 p-6 rounded-2xl border border-dashed border-gray-200">
              <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400">
                <Store size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">Продавец</p>
                <p className="font-bold text-gray-900">Eco-Store Central</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Диалог заказа */}
      <Dialog open={showOrderDialog} onOpenChange={setShowOrderDialog}>
        <DialogContent className="rounded-[2rem] sm:max-w-md border-0">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-center">{orderSuccess ? "Готово!" : "Бронирование"}</DialogTitle>
          </DialogHeader>
          {orderSuccess ? (
             <div className="text-center space-y-6 py-6">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                  <Check size={48} strokeWidth={3}/>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Продукт спасен!</h3>
                  <p className="text-gray-500">Покажите этот экран или назовите имя на кассе. Мы начислили вам {ecoCoinsToEarn} баллов.</p>
                </div>
                <Link href="/profile" className="block">
                  <Button className="w-full bg-gray-900 py-6 rounded-xl font-bold">В профиль</Button>
                </Link>
             </div>
          ) : (
            <div className="space-y-6 py-4">
               <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Ваше имя</label>
                    <Input placeholder="Иван Иванов" className="h-12 rounded-xl bg-gray-50 border-0" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Когда заберете?</label>
                    <Input type="time" className="h-12 rounded-xl bg-gray-50 border-0" defaultValue="18:00" />
                  </div>
               </div>
               
               <div className="bg-green-50 p-4 rounded-xl space-y-2">
                 <div className="flex justify-between text-sm font-bold">
                   <span className="text-gray-500">Итого к оплате</span>
                   <span className="text-[#4A7C59]">{product.discounted_price * quantity}₽</span>
                 </div>
               </div>

               <Button 
                 className="w-full bg-[#4A7C59] py-6 rounded-xl font-bold text-lg" 
                 onClick={handleOrder}
                 disabled={isOrdering}
               >
                 {isOrdering ? "Обработка..." : "Подтвердить бронь"}
               </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function ProductDetailsPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center animate-pulse text-gray-400 font-bold">Загрузка данных товара...</div>}>
      <ProductDetailsContent />
    </Suspense>
  );
}