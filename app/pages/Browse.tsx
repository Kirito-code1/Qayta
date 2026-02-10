"use client";

import React, { useState, useEffect } from 'react';
import { getAllProducts, Product } from '@/app/lib/mockData';
import { useAuth } from '@/app/lib/AuthContext';
import { 
  Search, 
  Filter, 
  MapPin, 
  SearchX, 
  PlusCircle, 
  ChevronRight,
  ShoppingBag
} from "lucide-react";
import Link from 'next/link';

// Категории для фильтрации
const CATEGORIES = ["Все", "Выпечка", "Овощи", "Фрукты", "Молочное", "Готовая еда"];
const CITIES = ["Все", "Ташкент", "Самарканд", "Бухара", "Фергана"];

export default function BrowsePage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Состояния фильтров
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("Все");
  const [activeCity, setActiveCity] = useState("Все");

  useEffect(() => {
    // Симуляция небольшой задержки для красоты (чтобы увидеть скелетоны)
    const loadData = () => {
      const data = getAllProducts();
      setProducts(data);
      setFilteredProducts(data);
      setLoading(false);
    };
    
    const timer = setTimeout(loadData, 600);
    return () => clearTimeout(timer);
  }, []);

  // Логика фильтрации
  useEffect(() => {
    let result = products;

    if (searchTerm) {
      result = result.filter(p => 
        (p.title || p.title || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (activeCategory !== "Все") {
      result = result.filter(p => p.category === activeCategory.toLowerCase());
    }

    if (activeCity !== "Все") {
      // Предполагаем, что у товара есть поле city, если нет — фильтр пропустит
      result = result.filter(p => (p as any).city === activeCity);
    }

    setFilteredProducts(result);
  }, [searchTerm, activeCategory, activeCity, products]);

  return (
    <div className="min-h-screen bg-[#FBFBFB] pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Хедер страницы и Поиск */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-5xl font-black tracking-tighter uppercase italic italic">Маркет</h1>
            <p className="text-gray-400 text-xs font-black uppercase tracking-[0.2em] mt-2">
              Спасайте еду — получайте выгоду
            </p>
          </div>

          <div className="relative w-full md:w-96">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
            <input 
              type="text"
              placeholder="Поиск продуктов..."
              className="w-full h-16 pl-14 pr-6 rounded-[2rem] bg-white border border-gray-100 shadow-sm focus:ring-2 ring-[#C4E86B] outline-none transition-all font-medium"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Панель фильтров */}
        <div className="flex flex-wrap items-center gap-3 mb-10">
          <div className="flex items-center gap-2 mr-4 text-gray-400 text-[10px] font-black uppercase tracking-widest">
            <Filter size={14} /> Категории:
          </div>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                activeCategory === cat 
                ? 'bg-black text-white shadow-lg' 
                : 'bg-white text-gray-400 border border-gray-100 hover:border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Сетка товаров или Пустое состояние */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <ProductSkeleton key={i} />)}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <EmptyState 
            isAdmin={user?.role === 'admin'} 
            onReset={() => {
              setSearchTerm("");
              setActiveCategory("Все");
              setActiveCity("Все");
            }} 
          />
        )}
      </div>
    </div>
  );
}

// --- Вспомогательные компоненты ---

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group bg-white rounded-[2.5rem] p-4 border border-gray-50 hover:border-white hover:shadow-2xl transition-all duration-500 flex flex-col h-full">
      <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-gray-100 mb-4">
        <img 
          src={product.image || product.image_url} 
          alt={product.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black uppercase">
          -{Math.round(((product.original_price - product.discounted_price) / product.original_price) * 100)}%
        </div>
      </div>

      <div className="px-2 flex-1 flex flex-col">
        <div className="flex items-center gap-1 text-[9px] font-black text-[#4A7C59] uppercase tracking-tighter mb-1">
          <MapPin size={10} /> {product.seller_name}
        </div>
        <h3 className="font-black text-lg leading-tight mb-2 group-hover:text-[#4A7C59] transition-colors">
          {product.title || product.name}
        </h3>
        
        <div className="mt-auto pt-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-gray-400 line-through font-bold">{product.original_price} сум</p>
            <p className="text-xl font-black tracking-tighter">{product.discounted_price} сум</p>
          </div>
          <button className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center hover:bg-[#C4E86B] hover:text-black transition-all">
            <ShoppingBag size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div className="bg-white rounded-[2.5rem] p-4 border border-gray-50 animate-pulse">
      <div className="aspect-square bg-gray-100 rounded-[2rem] mb-4" />
      <div className="h-4 bg-gray-100 rounded-full w-2/3 mb-3" />
      <div className="h-3 bg-gray-50 rounded-full w-1/2" />
      <div className="mt-6 flex justify-between items-center">
        <div className="h-6 bg-gray-100 rounded-lg w-20" />
        <div className="w-10 h-10 bg-gray-50 rounded-xl" />
      </div>
    </div>
  );
}

function EmptyState({ isAdmin, onReset }: { isAdmin: boolean, onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center animate-in fade-in zoom-in duration-500">
      <div className="w-32 h-32 bg-gray-50 rounded-[3rem] flex items-center justify-center text-gray-200 mb-8">
        <SearchX size={64} />
      </div>
      <h2 className="text-3xl font-black uppercase italic mb-3 tracking-tighter">Ничего не найдено</h2>
      <p className="text-gray-400 text-sm max-w-xs mb-10 font-medium">
        Попробуйте изменить параметры поиска или фильтры.
      </p>
      
      {isAdmin ? (
        <Link href="/seller/add-product">
          <button className="bg-black text-white px-10 h-16 rounded-[1.5rem] font-black uppercase text-xs tracking-widest hover:bg-[#4A7C59] transition-all flex items-center gap-3">
            <PlusCircle size={20} /> Добавить свой товар
          </button>
        </Link>
      ) : (
        <button 
          onClick={onReset}
          className="bg-black text-white px-10 h-16 rounded-[1.5rem] font-black uppercase text-xs tracking-widest hover:bg-gray-800 transition-all"
        >
          Сбросить все фильтры
        </button>
      )}
    </div>
  );
}