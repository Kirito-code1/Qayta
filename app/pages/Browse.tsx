"use client";

import React, { useState, useEffect } from 'react';
import { getAllProducts, Product } from '@/app/lib/mockData';
import { useAuth } from '@/app/lib/AuthContext';
import { useLanguage } from '@/app/lib/LanguageContext';
import { 
  Search, 
  Filter, 
  MapPin, 
  SearchX, 
  PlusCircle, 
  ShoppingBag,
  Trash2 
} from "lucide-react";
import Link from 'next/link';

// Ключи категорий для внутренней логики
const CATEGORY_KEYS = ["all", "bakery", "vegetables", "fruits", "dairy", "ready"];

export default function BrowsePage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Состояния фильтров
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  // --- ЗАГРУЗКА ДАННЫХ ---
  useEffect(() => {
    const loadData = () => {
      // 1. Статические данные
      const staticData = getAllProducts();
      
      // 2. Локальные данные (синхронизировано с ключом 'products')
      let localData: Product[] = [];
      const localItems = localStorage.getItem('products');
      
      if (localItems) {
        try {
          const parsed = JSON.parse(localItems);
          localData = parsed.map((p: any) => ({
            ...p,
            id: p.id || `local-${Math.random()}`,
            original_price: Number(p.original_price) || 0,
            discounted_price: Number(p.discounted_price) || 0,
            // Приведение категории к ключу, если она сохранена строкой
            category: mapCategoryToKey(p.category)
          }));
        } catch (e) {
          console.error("Error parsing local products", e);
        }
      }

      // Новые товары сверху
      const combined = [...localData, ...staticData];
      setProducts(combined);
      setFilteredProducts(combined);
      setLoading(false);
    };
    
    const timer = setTimeout(loadData, 600);
    return () => clearTimeout(timer);
  }, []);

  // Хелпер для нормализации категорий
  function mapCategoryToKey(cat: string): string {
    const map: Record<string, string> = {
      "Все": "all", "Barchasi": "all",
      "Выпечка": "bakery", "Pishiriqlar": "bakery",
      "Овощи": "vegetables", "Sabzavotlar": "vegetables",
      "Фрукты": "fruits", "Mevalar": "fruits",
      "Молочное": "dairy", "Sut mahsulotlari": "dairy",
      "Готовая еда": "ready", "Tayyor ovqatlar": "ready"
    };
    return map[cat] || cat.toLowerCase();
  }

  // --- ЛОГИКА ФИЛЬТРАЦИИ ---
  useEffect(() => {
    let result = products;

    if (searchTerm) {
      result = result.filter(p => 
        (p.title || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (activeCategory !== "all") {
      result = result.filter(p => p.category === activeCategory);
    }

    setFilteredProducts(result);
  }, [searchTerm, activeCategory, products]);

  // Удаление локального товара
  const deleteProduct = (id: string) => {
    const localItems = JSON.parse(localStorage.getItem('products') || '[]');
    const updatedLocal = localItems.filter((p: any) => p.id !== id);
    localStorage.setItem('products', JSON.stringify(updatedLocal));
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#FBFBFB] pt-28 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Хедер страницы */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-6xl font-black tracking-tighter uppercase italic text-black">
              {t('market_title')}
            </h1>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2 italic">
              {t('market_subtitle')}
            </p>
          </div>

          <div className="relative w-full md:w-96">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
            <input 
              type="text"
              placeholder={t('market_search')}
              className="w-full h-16 pl-14 pr-6 rounded-[2rem] bg-white border border-gray-100 shadow-sm focus:ring-4 ring-[#C4E86B]/30 outline-none transition-all font-black text-[10px] uppercase tracking-widest"
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
            />
          </div>
        </div>

        {/* Фильтры */}
        <div className="flex flex-wrap items-center gap-3 mb-10 overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex items-center gap-2 mr-4 text-gray-400 text-[10px] font-black uppercase tracking-widest flex-shrink-0">
            <Filter size={14} /> {t('market_sort')}:
          </div>
          {CATEGORY_KEYS.map(catKey => (
            <button
              key={catKey}
              onClick={() => setActiveCategory(catKey)}
              className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex-shrink-0 ${
                activeCategory === catKey 
                ? 'bg-black text-white shadow-xl shadow-black/20 scale-105' 
                : 'bg-white text-gray-400 border border-gray-100 hover:border-gray-300'
              }`}
            >
              {catKey === "all" ? t('market_filter_all') : (t('categories') as any)[catKey]}
            </button>
          ))}
        </div>

        {/* Контент */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <ProductSkeleton key={i} />)}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onDelete={deleteProduct}
                isLocal={localStorage.getItem('products')?.includes(product.id) || product.id.toString().includes('local')}
              />
            ))}
          </div>
        ) : (
          <EmptyState 
            t={t}
            isAdmin={user?.role === 'admin'} 
            onReset={() => {
              setSearchTerm("");
              setActiveCategory("all");
            }} 
          />
        )}
      </div>
    </div>
  );
}

// --- Компоненты карточек ---

function ProductCard({ product, onDelete, isLocal }: { product: Product, onDelete: (id: string) => void, isLocal: boolean }) {
  const discount = Math.round(((product.original_price - product.discounted_price) / product.original_price) * 100);

  return (
    <div className="group bg-white rounded-[2.5rem] p-4 border border-gray-50 hover:border-white hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] transition-all duration-500 flex flex-col h-full relative">
      
      {isLocal && (
        <button 
          onClick={() => onDelete(product.id)}
          className="absolute top-6 left-6 z-20 bg-white/90 backdrop-blur-md p-2 rounded-xl text-red-500 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-500 hover:text-white"
        >
          <Trash2 size={16} />
        </button>
      )}

      <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-gray-100 mb-5">
        <img 
          src={product.image} 
          alt={product.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-3 right-3 bg-[#C4E86B] text-black px-3 py-1.5 rounded-full text-[10px] font-black uppercase shadow-lg">
          -{discount}%
        </div>
      </div>

      <div className="px-2 flex-1 flex flex-col">
        <div className="flex items-center gap-1 text-[9px] font-black text-[#4A7C59] uppercase tracking-widest mb-2">
          <MapPin size={10} /> {product.seller_name || "Eco-Partner"}
        </div>
        <h3 className="font-black text-xl leading-tight mb-4 group-hover:text-[#4A7C59] transition-colors line-clamp-2 italic uppercase tracking-tighter">
          {product.title}
        </h3>
        
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-50">
          <div>
            <p className="text-[10px] text-gray-300 line-through font-bold tracking-widest uppercase">
              {product.original_price.toLocaleString()} 
            </p>
            <p className="text-xl font-black tracking-tighter text-black italic">
              {product.discounted_price.toLocaleString()} UZS
            </p>
          </div>
          <button className="w-14 h-14 bg-black text-white rounded-[1.25rem] flex items-center justify-center hover:bg-[#C4E86B] hover:text-black hover:rotate-12 transition-all shadow-xl">
            <ShoppingBag size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div className="bg-white rounded-[2.5rem] p-4 border border-gray-50 animate-pulse">
      <div className="aspect-square bg-gray-100 rounded-[2rem] mb-5" />
      <div className="h-6 bg-gray-100 rounded-full w-2/3 mb-3 mx-2" />
      <div className="mt-8 flex justify-between items-center px-2">
        <div className="space-y-2">
          <div className="h-3 bg-gray-100 rounded-full w-12" />
          <div className="h-6 bg-gray-100 rounded-lg w-24" />
        </div>
        <div className="w-14 h-14 bg-gray-100 rounded-[1.25rem]" />
      </div>
    </div>
  );
}

function EmptyState({ isAdmin, onReset, t }: { isAdmin: boolean, onReset: () => void, t: any }) {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center animate-in fade-in zoom-in duration-700">
      <div className="w-40 h-40 bg-gray-50 rounded-[4rem] flex items-center justify-center text-gray-200 mb-8 border-4 border-white shadow-inner">
        <SearchX size={64} />
      </div>
      <h2 className="text-4xl font-black uppercase italic mb-4 tracking-tighter text-black">
        {t('market_no_products')}
      </h2>
      
      {isAdmin ? (
        <Link href="/seller/add-product">
          <button className="bg-black text-white px-12 h-20 rounded-[2rem] font-black uppercase text-[10px] tracking-[0.2em] hover:bg-[#4A7C59] transition-all flex items-center gap-4 shadow-2xl">
            <PlusCircle size={24} /> {t('market_add')}
          </button>
        </Link>
      ) : (
        <button 
          onClick={onReset}
          className="bg-black text-white px-12 h-20 rounded-[2rem] font-black uppercase text-[10px] tracking-[0.2em] hover:bg-gray-800 transition-all shadow-xl"
        >
          {t('market_reset')}
        </button>
      )}
    </div>
  );
}