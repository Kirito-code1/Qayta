"use client";

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/app/lib/LanguageContext';
import { getAllProducts } from '@/app/lib/mockData';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Filter, 
  MapPin, 
  ShoppingBag, 
  ChevronRight, 
  LayoutGrid,
  List
} from "lucide-react";

export default function BrowsePage() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  // Загрузка товаров
  useEffect(() => {
    const data = getAllProducts();
    setProducts(data);
    setFilteredProducts(data);
  }, []);

  // Логика фильтрации
  useEffect(() => {
    let result = products;

    if (activeCategory !== "all") {
      result = result.filter(p => p.category === activeCategory);
    }

    if (searchQuery) {
      result = result.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(result);
  }, [searchQuery, activeCategory, products]);

  const categories = ["all", "bakery", "fruits", "dairy", "ready"];

  return (
    <div className="min-h-screen bg-[#FBFBFB] pt-24 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Шапка Маркета */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div className="space-y-2">
            <h1 className="text-6xl font-black uppercase italic tracking-tighter leading-none">
              {t('market_title')}
            </h1>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-1">
              {t('dash_subtitle')}
            </p>
          </div>

          {/* Поиск */}
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#4A7C59] transition-colors" size={20} />
            <Input 
              placeholder={t('market_search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-16 pl-16 pr-8 rounded-2xl bg-white border-none shadow-sm font-bold uppercase text-[10px] tracking-widest focus-visible:ring-2 ring-[#C4E86B] transition-all"
            />
          </div>
        </div>

        {/* Фильтры по категориям */}
        <div className="flex flex-wrap gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${
                activeCategory === cat 
                ? "bg-black text-white shadow-xl shadow-black/10 scale-105" 
                : "bg-white text-gray-400 border border-gray-100 hover:border-[#C4E86B] hover:text-black"
              }`}
            >
              {cat === "all" ? t('market_filter_all') : (t('categories') as any)[cat]}
            </button>
          ))}
        </div>

        {/* Сетка товаров */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <div key={product.id} className="group bg-white rounded-[2.5rem] p-4 border border-gray-100 hover:shadow-2xl hover:shadow-black/5 transition-all duration-500">
                {/* Изображение */}
                <div className="relative h-64 rounded-[2rem] overflow-hidden mb-6">
                  <img 
                    src={product.image} 
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest shadow-sm">
                    {(t('categories') as any)[product.category] || product.category}
                  </div>
                </div>

                {/* Инфо */}
                <div className="px-2 pb-2">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-black uppercase text-sm tracking-tight leading-tight max-w-[70%]">
                      {product.title}
                    </h3>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-300 line-through font-bold">
                        {Number(product.original_price).toLocaleString()}
                      </p>
                      <p className="text-lg font-black text-[#4A7C59] tracking-tighter italic">
                        {Number(product.discounted_price).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[9px] font-black text-gray-400 uppercase tracking-widest mb-6">
                    <MapPin size={12} className="text-[#C4E86B]" />
                    {product.location} <span className="opacity-30">•</span> 1.2 км {t('market_distance')}
                  </div>

                  <Button className="w-full h-14 bg-black text-white rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.2em] hover:bg-[#4A7C59] transition-all flex items-center gap-3 active:scale-95">
                    <ShoppingBag size={16} />
                    {t('market_buy_btn')}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-40 text-center">
            <div className="flex flex-col items-center gap-6 opacity-20">
              <ShoppingBag size={80} strokeWidth={1} />
              <p className="font-black uppercase text-sm tracking-[0.4em]">
                {t('market_no_products')}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}