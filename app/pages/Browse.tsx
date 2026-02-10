"use client";

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from "next/navigation";
import { mockProducts, Product } from "../lib/mockData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Search, SlidersHorizontal, Leaf, Store, ShoppingCart } from "lucide-react";

// --- КОМПОНЕНТ КАРТОЧКИ ТОВАРА ---
function LocalProductCard({ product }: { product: Product }) {
  // Вычисляем скидку, если она есть
  const hasDiscount = product.original_price > product.discounted_price;
  const discount = hasDiscount 
    ? Math.round((1 - product.discounted_price / product.original_price) * 100) 
    : 0;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-[#C4E86B] hover:shadow-xl transition-all duration-500">
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img 
          src={product.image_url} 
          alt={product.title} 
          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110" 
        />
        {hasDiscount && (
          <div className="absolute top-3 left-3 bg-[#C4E86B] text-[#2E2E2E] px-2 py-1 rounded-lg text-[10px] font-black shadow-sm">
            -{discount}%
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-center gap-1.5 mb-2">
          <Store className="w-3 h-3 text-gray-400" />
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider truncate">
            {product.seller_name || "Eco Store"}
          </span>
        </div>
        
        <h3 className="font-bold text-sm mb-2 text-gray-900 line-clamp-1 group-hover:text-[#4A7C59] transition-colors">
          {product.title}
        </h3>
        
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-lg font-black text-[#2E2E2E]">
            {product.discounted_price.toLocaleString()} сум
          </span>
          {hasDiscount && (
            <span className="text-[11px] text-gray-300 line-through font-medium">
              {product.original_price.toLocaleString()}
            </span>
          )}
        </div>

        <Button className="w-full bg-[#F1FDE6] hover:bg-[#C4E86B] text-[#2E2E2E] border-none rounded-xl h-10 text-[10px] font-black uppercase tracking-widest transition-all gap-2">
          <ShoppingCart size={14} />
          Заказать
        </Button>
      </div>
    </div>
  );
}

// --- ОСНОВНОЙ КОНТЕНТ ---
const categories = [
  { id: "all", label: "Все" },
  { id: "bakery", label: "Выпечка" },
  { id: "dairy", label: "Молочное" },
  { id: "produce", label: "Овощи/Фрукты" },
  { id: "ready", label: "Готовая еда" }
];

function BrowseContent() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [priceRange, setPriceRange] = useState([0, 500000]);
  const [sortBy, setSortBy] = useState('newest');
  
  // Состояние для товаров из localStorage
  const [realProducts, setRealProducts] = useState<Product[]>([]);

  useEffect(() => {
    // 1. Подгружаем товары, созданные через Dashboard
    const saved = JSON.parse(localStorage.getItem('my_products') || '[]');
    
    // 2. Маппим их под интерфейс Product
    const formatted: Product[] = saved.map((p: any) => ({
      id: p.id,
      title: p.title,
      // Делаем фейковую "старую цену" для красоты дизайна, если её нет
      original_price: p.original_price ? Number(p.original_price) : Number(p.price) * 1.2,
      discounted_price: Number(p.price),
      image_url: p.image,
      category: p.category || 'all',
      seller_name: "Ваш Магазин",
      items_left: 5
    }));

    setRealProducts(formatted);
  }, []);

  // Фильтрация и сортировка объединенного массива
  const filteredProducts = useMemo(() => {
    const allItems = [...realProducts, ...mockProducts];

    return allItems
      .filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = category === 'all' || p.category === category;
        const matchesPrice = p.discounted_price >= priceRange[0] && p.discounted_price <= priceRange[1];
        return matchesSearch && matchesCategory && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === 'price_low') return a.discounted_price - b.discounted_price;
        if (sortBy === 'price_high') return b.discounted_price - a.discounted_price;
        return 0;
      });
  }, [search, category, priceRange, sortBy, realProducts]);

  const Filters = () => (
    <div className="space-y-8">
      <div>
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Категория</h4>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all ${
                category === cat.id 
                ? 'bg-[#C4E86B] text-[#2E2E2E] shadow-lg shadow-lime-100' 
                : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between mb-4">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Бюджет</h4>
          <span className="text-[10px] font-black text-[#4A7C59]">до {priceRange[1].toLocaleString()} сум</span>
        </div>
        <Slider 
          value={priceRange} 
          onValueChange={setPriceRange} 
          max={500000} 
          step={1000} 
          className="py-4"
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FBFBFB]">
      {/* Поисковая панель */}
      <div className="bg-white/80 backdrop-blur-xl sticky top-0 z-40 border-b border-gray-50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-[#C4E86B] transition-colors" />
            <Input
              placeholder="Поиск свежих продуктов..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 h-12 rounded-2xl border-none bg-gray-50 text-sm font-medium focus-visible:ring-2 focus-visible:ring-[#C4E86B]/30 transition-all"
            />
          </div>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="h-12 px-5 rounded-2xl border-gray-100 lg:hidden text-[10px] font-black uppercase tracking-widest gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                Фильтры
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="font-black uppercase italic text-2xl">Настройки</SheetTitle>
              </SheetHeader>
              <div className="mt-10"><Filters /></div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="flex gap-12">
          {/* Сайдбар для ПК */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-28">
              <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-8">Каталог</h2>
              <Filters />
            </div>
          </aside>

          {/* Основная сетка */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-2xl border border-gray-50 shadow-sm">
              <div className="flex items-center gap-2 px-2">
                <Leaf className="w-4 h-4 text-[#4A7C59]" />
                <span className="font-black text-gray-400 text-[10px] uppercase tracking-[0.2em]">
                  Найдено: {filteredProducts.length}
                </span>
              </div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-44 h-10 border-none bg-gray-50 rounded-xl text-[10px] font-black uppercase tracking-widest">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-gray-50 font-bold">
                  <SelectItem value="newest">По новизне</SelectItem>
                  <SelectItem value="price_low">Сначала дешевле</SelectItem>
                  <SelectItem value="price_high">Сначала дороже</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* ГРИД СИСТЕМА */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
                {filteredProducts.map((product) => (
                  <LocalProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-gray-200">
                <p className="font-black uppercase tracking-widest text-gray-300">Ничего не нашли...</p>
                <Button 
                  variant="link" 
                  onClick={() => {setSearch(''); setCategory('all'); setPriceRange([0, 500000])}}
                  className="mt-2 text-[#4A7C59] font-bold"
                >
                  Сбросить фильтры
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

// --- ЭКСПОРТ С ЛОАДЕРОМ ---
export default function BrowsePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#C4E86B] border-t-transparent rounded-full animate-spin" />
          <p className="font-black uppercase tracking-[0.3em] text-[10px] text-gray-400">Загрузка маркета...</p>
        </div>
      </div>
    }>
      <BrowseContent />
    </Suspense>
  );
}