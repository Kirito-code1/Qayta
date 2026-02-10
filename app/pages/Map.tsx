"use client";

import React, { useState, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { getAllProducts, Product } from '../lib/mockData';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { MapPin, Loader2, Sparkles, Clock, DollarSign } from "lucide-react";
import { differenceInDays } from "date-fns";

// Динамический импорт компонента карты
const MapComponent = dynamic(() => import('../../components/MapComponent'), { 
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex flex-col items-center justify-center bg-gray-50 gap-3">
      <Loader2 className="animate-spin text-[#4A7C59] w-10 h-10" />
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Загрузка радара...</p>
    </div>
  )
});

export interface MapProduct extends Product {
  coordinates: [number, number];
  urgencyScore: number;
}

export default function MapPage() {
  const [sortBy, setSortBy] = useState('recommended');
  const [products, setProducts] = useState<Product[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // 1. Загружаем статику
    const staticData = getAllProducts();
    
    // 2. Загружаем из localStorage
    let savedData: Product[] = [];
    try {
      const localItems = localStorage.getItem('products');
      if (localItems) {
        savedData = JSON.parse(localItems).map((p: any) => ({
          ...p,
          original_price: Number(p.original_price),
          discounted_price: Number(p.discounted_price),
          // Проверяем, что координаты корректны
          coordinates: Array.isArray(p.coordinates) ? p.coordinates : null
        }));
      }
    } catch (e) {
      console.error("Local storage error:", e);
    }

    setProducts([...savedData, ...staticData]);
    setIsMounted(true);
  }, []);

  const calculateUrgency = (p: Product) => {
    let score = 0;
    if (p.expiration_date) {
      try {
        const daysLeft = differenceInDays(new Date(p.expiration_date), new Date());
        if (daysLeft <= 1) score += 60;
        else if (daysLeft <= 3) score += 30;
      } catch (e) { score += 0; }
    } else if (p.discount_reason === 'expiring_soon') {
      score += 50;
    }
    if (p.quantity_available <= 2) score += 20;
    const discPercent = ((p.original_price - p.discounted_price) / (p.original_price || 1)) * 100;
    if (discPercent > 50) score += 20;
    return score;
  };

  const processedProducts = useMemo((): MapProduct[] => {
    const list = products.map((p) => {
      // ПРИОРИТЕТ: Если у товара есть реальные координаты (из формы), используем их
      if (p.coordinates && p.coordinates[0] !== 0) {
        return {
          ...p,
          coordinates: [Number(p.coordinates[0]), Number(p.coordinates[1])] as [number, number],
          urgencyScore: calculateUrgency(p)
        };
      }

      // ФОЛБЭК: Если координат нет (старые моки), генерируем рандомные вокруг центра
      const idDigits = p.id.toString().replace(/\D/g, '');
      const latOffset = (Number(idDigits.slice(0, 3) || '500') / 1000 - 0.5) * 0.05;
      const lngOffset = (Number(idDigits.slice(3, 6) || '500') / 1000 - 0.5) * 0.05;

      return {
        ...p,
        coordinates: [41.3111 + latOffset, 69.2797 + lngOffset] as [number, number],
        urgencyScore: calculateUrgency(p)
      };
    });

    switch (sortBy) {
      case 'urgent': return [...list].sort((a, b) => b.urgencyScore - a.urgencyScore);
      case 'discount': return [...list].sort((a, b) => (b.original_price - b.discounted_price) - (a.original_price - a.discounted_price));
      default: return list;
    }
  }, [products, sortBy]);

  const topPicks = useMemo(() => processedProducts.slice(0, 5), [processedProducts]);

  if (!isMounted) return null;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white pt-16 md:pt-20">
      
      {/* Шапка */}
      <div className="bg-white border-b p-4 z-[30] shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-[#C4E86B]/20 rounded-xl animate-pulse">
                <MapPin className="text-[#4A7C59] w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-black uppercase italic tracking-tighter leading-none text-black">Умная Карта</h1>
                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-[0.2em]">Локатор скидок</span>
              </div>
            </div>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48 md:w-56 h-12 rounded-2xl bg-gray-50 border-none ring-1 ring-gray-100 font-black text-[10px] uppercase tracking-widest px-5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-none shadow-2xl p-2 bg-white">
                <SelectItem value="recommended" className="rounded-xl focus:bg-[#C4E86B]/10 text-[10px] font-black uppercase tracking-widest py-3">
                   AI Рекомендует
                </SelectItem>
                <SelectItem value="urgent" className="rounded-xl focus:bg-red-50 text-[10px] font-black uppercase tracking-widest py-3">
                   Самые срочные
                </SelectItem>
                <SelectItem value="discount" className="rounded-xl focus:bg-emerald-50 text-[10px] font-black uppercase tracking-widest py-3">
                   Большие скидки
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Top Picks Scroll */}
          <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
            {topPicks.map(p => (
              <div 
                key={p.id} 
                className="flex-shrink-0 flex items-center gap-3 bg-white border border-gray-100 rounded-2xl p-2 pr-5 hover:border-[#C4E86B] transition-all cursor-pointer group shadow-sm active:scale-95"
              >
                <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase truncate w-24 tracking-tighter text-black">{p.title}</p>
                  <p className="text-[9px] text-[#4A7C59] font-black tracking-tight">{p.discounted_price.toLocaleString()} сум</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Карта */}
      <div className="flex-1 relative z-10">
        <MapComponent products={processedProducts} />
        
        {/* Легенда */}
        <div className="absolute bottom-10 left-8 bg-white/90 backdrop-blur-xl p-6 rounded-[2.5rem] shadow-2xl z-20 border border-white hidden md:block w-64 animate-in slide-in-from-left duration-700">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-5">Уровни приоритета</p>
          <div className="space-y-4">
            {[
              { c: 'bg-red-500 shadow-red-200', t: 'Критично (1-2 дня)', desc: 'Заберите сегодня' },
              { c: 'bg-amber-500 shadow-amber-200', t: 'Срочно (3-5 дней)', desc: 'Скоро закончится' },
              { c: 'bg-emerald-500 shadow-emerald-200', t: 'Нормально', desc: 'Свежий привоз' }
            ].map(i => (
              <div key={i.t} className="flex items-center gap-4">
                <div className={`w-3.5 h-3.5 rounded-full shadow-lg ${i.c}`} />
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-800 leading-none">{i.t}</span>
                  <span className="text-[8px] font-bold text-gray-400 uppercase mt-1">{i.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}