"use client";

import React, { useState, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { getStoredProducts, Product } from '../lib/mockData';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { MapPin, Loader2, Sparkles, Clock, DollarSign, TrendingUp } from "lucide-react";
import { differenceInDays } from "date-fns";

const MapComponent = dynamic(() => import('../../components/MapComponent'), { 
  ssr: false,
  loading: () => <div className="h-full w-full flex items-center justify-center"><Loader2 className="animate-spin text-[#4A7C59]" /></div>
});

export default function MapPage() {
  const [sortBy, setSortBy] = useState('recommended');
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setProducts(getStoredProducts());
  }, []);

  // AI-функция расчета срочности (из вашего примера)
  const calculateUrgency = (p: Product) => {
    let score = 0;
    // Срок годности
    if (p.expiration_date) {
      const daysLeft = differenceInDays(new Date(p.expiration_date), new Date());
      if (daysLeft <= 1) score += 60;
      else if (daysLeft <= 3) score += 30;
    } else if (p.discount_reason === 'expiring_soon') {
      score += 50;
    }
    // Количество
    if (p.quantity_available <= 2) score += 20;
    // Размер скидки
    const discPercent = ((p.original_price - p.discounted_price) / p.original_price) * 100;
    if (discPercent > 50) score += 20;

    return score;
  };

  const processedProducts = useMemo(() => {
    const list = products.map((p, index) => ({
      ...p,
      // Генерируем коорд. вокруг Ташкента если их нет
      coordinates: [41.3111 + (Math.random() - 0.5) * 0.08, 69.2797 + (Math.random() - 0.5) * 0.08] as [number, number],
      urgencyScore: calculateUrgency(p)
    }));

    switch (sortBy) {
      case 'urgent': return [...list].sort((a, b) => b.urgencyScore - a.urgencyScore);
      case 'discount': return [...list].sort((a, b) => (b.original_price - b.discounted_price) - (a.original_price - a.discounted_price));
      default: return list;
    }
  }, [products, sortBy]);

  const topPicks = processedProducts.slice(0, 3);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white">
      {/* Header & Controls */}
      <div className="border-b p-4 z-20">
        <div className="container mx-auto flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="text-[#4A7C59] w-6 h-6" />
              <h1 className="text-xl font-bold">Умная Карта</h1>
            </div>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-52 h-10 rounded-xl bg-gray-50 border-none ring-1 ring-gray-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recommended"><Sparkles className="inline w-4 h-4 mr-2" />AI Рекомендации</SelectItem>
                <SelectItem value="urgent"><Clock className="inline w-4 h-4 mr-2" />Самые срочные</SelectItem>
                <SelectItem value="discount"><DollarSign className="inline w-4 h-4 mr-2" />Большие скидки</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* AI Top Picks Horizontal Bar */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {topPicks.map(p => (
              <div key={p.id} className="flex-shrink-0 flex items-center gap-3 bg-gradient-to-r from-[#4A7C59]/5 to-transparent border border-[#4A7C59]/10 rounded-xl p-2 pr-4">
                <img src={p.image_url} className="w-10 h-10 rounded-lg object-cover" />
                <div>
                  <p className="text-xs font-bold truncate w-32">{p.title}</p>
                  <p className="text-[10px] text-[#4A7C59] font-bold">{p.discounted_price} сум</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 relative">
        <MapComponent products={processedProducts} />
        
        {/* Legend */}
        <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur p-4 rounded-2xl shadow-2xl z-20 border border-white/20 hidden md:block">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Уровни срочности</p>
          <div className="space-y-2">
            {[
              { c: 'bg-red-500', t: 'Критично (1-2 дня)' },
              { c: 'bg-amber-500', t: 'Срочно (3-5 дней)' },
              { c: 'bg-emerald-500', t: 'Нормально' }
            ].map(i => (
              <div key={i.t} className="flex items-center gap-2 text-xs font-bold text-gray-700">
                <div className={`w-3 h-3 rounded-full ${i.c}`} /> {i.t}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}