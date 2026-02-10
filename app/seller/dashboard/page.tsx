"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { useAuth } from '@/app/lib/AuthContext';
import { 
  LayoutDashboard, Package, Plus, Trash2, Loader2, 
  ShoppingBag, BarChart3, ChevronRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SellerDashboard() {
  const router = useRouter();
  const { user, isLoadingAuth } = useAuth();
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState<any[]>([]);

  // Ключ базы данных должен совпадать с тем, что в AddProduct
  const DB_KEY = 'eco_market_products';

  // 1. Загрузка товаров именно этого продавца
  useEffect(() => {
    if (!isLoadingAuth && user) {
      const loadProducts = () => {
        try {
          const allProducts = JSON.parse(localStorage.getItem(DB_KEY) || '[]');
          // Фильтруем: только те товары, чей sellerEmail совпадает с текущим юзером
          const myProducts = allProducts.filter((p: any) => p.sellerEmail === user.email);
          setProducts(myProducts);
        } catch (error) {
          console.error('Ошибка загрузки:', error);
          setProducts([]);
        }
      };
      loadProducts();
    }
  }, [user, isLoadingAuth]);

  // 2. Функция удаления товара из общей базы
  const deleteProduct = (id: string) => {
    if (!confirm("Вы уверены, что хотите удалить этот товар?")) return;

    try {
      const allProducts = JSON.parse(localStorage.getItem(DB_KEY) || '[]');
      // Удаляем товар из общего списка
      const updatedAll = allProducts.filter((p: any) => p.id !== id);
      localStorage.setItem(DB_KEY, JSON.stringify(updatedAll));

      // Обновляем локальное состояние (только свои оставшиеся товары)
      setProducts(updatedAll.filter((p: any) => p.sellerEmail === user?.email));
    } catch (error) {
      alert("Ошибка при удалении");
    }
  };

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F7F5]">
        <Loader2 className="animate-spin text-[#C4E86B]" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7F5] flex text-black">
      {/* Боковая панель */}
      <aside className="w-24 md:w-72 bg-white border-r border-gray-100 flex flex-col p-6">
        <div className="flex items-center gap-3 px-2 mb-12">
          <div className="w-10 h-10 bg-[#C4E86B] rounded-xl flex items-center justify-center font-black">Q</div>
          <span className="hidden md:block font-black text-xl tracking-tighter uppercase italic">Qayta Admin</span>
        </div>
        
        <nav className="flex-1 space-y-2">
          <NavItem 
            active={activeTab === 'overview'} 
            onClick={() => setActiveTab('overview')} 
            icon={<LayoutDashboard size={20} />} 
            label="Обзор" 
          />
          <NavItem 
            active={activeTab === 'products'} 
            onClick={() => setActiveTab('products')} 
            icon={<Package size={20} />} 
            label="Товары" 
          />
        </nav>

        <div className="mt-auto p-4 bg-gray-50 rounded-3xl hidden md:block">
          <p className="text-[8px] font-black uppercase text-gray-400 mb-1">Продавец</p>
          <p className="text-xs font-bold truncate">{user?.full_name}</p>
        </div>
      </aside>

      {/* Основной контент */}
      <main className="flex-1 overflow-y-auto p-4 md:p-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase italic">Дашборд</h1>
            <p className="text-gray-400 text-sm font-medium mt-1">Управляйте своими предложениями</p>
          </div>
          <Button 
            onClick={() => router.push('/seller/add-product')} 
            className="h-14 bg-black hover:bg-[#4A7C59] text-white px-8 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-3 transition-all shadow-xl shadow-black/10"
          >
            <Plus size={18} /> Новый товар
          </Button>
        </header>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard label="Ваши товары" value={products.length} trend="Активны" />
          <StatCard label="Eco-Coins" value={user?.eco_coins || 0} trend="Баланс" />
        </div>

        {/* Таблица товаров */}
        <div className="bg-white rounded-[3rem] p-8 md:p-10 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-black text-xl uppercase italic tracking-tighter">Ваш ассортимент</h2>
            <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
              Всего: {products.length}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black uppercase tracking-widest text-gray-300 border-b border-gray-50">
                  <th className="pb-6 px-4">Товар</th>
                  <th className="pb-6">Категория</th>
                  <th className="pb-6">Цена (UZS)</th>
                  <th className="pb-6 text-right">Действие</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product.id} className="group hover:bg-gray-50/50 transition-all">
                      <td className="py-6 px-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                            <img src={product.image} alt="" className="w-full h-full object-cover" />
                          </div>
                          <span className="font-bold text-gray-900 text-sm uppercase tracking-tight">
                            {product.title}
                          </span>
                        </div>
                      </td>
                      <td className="py-6">
                        <span className="px-3 py-1 bg-gray-100 rounded-full text-[9px] font-black uppercase tracking-tighter text-gray-500">
                          {product.category}
                        </span>
                      </td>
                      <td className="py-6">
                        <div className="flex flex-col">
                          <span className="text-gray-300 line-through text-[10px]">
                            {Number(product.original_price).toLocaleString()}
                          </span>
                          <span className="font-black text-sm text-emerald-600">
                            {Number(product.discounted_price).toLocaleString()}
                          </span>
                        </div>
                      </td>
                      <td className="py-6 text-right">
                        <button 
                          onClick={() => deleteProduct(product.id)}
                          className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-20 text-center">
                      <div className="flex flex-col items-center opacity-20">
                        <Package size={48} className="mb-4" />
                        <p className="text-xs font-black uppercase tracking-widest">Список пуст</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

// Вспомогательные компоненты
function NavItem({ icon, label, active, onClick }: any) {
  return (
    <button 
      onClick={onClick} 
      className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${
        active 
          ? 'bg-[#C4E86B] text-black shadow-lg shadow-lime-200/50 scale-[1.02]' 
          : 'text-gray-400 hover:text-black hover:bg-gray-50'
      }`}
    >
      <span className={active ? 'scale-110 transition-transform' : ''}>{icon}</span>
      <span className="hidden md:block font-black text-[10px] uppercase tracking-[0.15em]">{label}</span>
    </button>
  );
}

function StatCard({ label, value, trend }: any) {
  return (
    <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4 flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-[#C4E86B]" /> {label}
      </p>
      <div className="flex justify-between items-end">
        <p className="text-4xl font-black text-gray-900 tracking-tighter">{value}</p>
        <span className="text-[8px] font-black bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full uppercase tracking-widest">
          {trend}
        </span>
      </div>
    </div>
  );
}