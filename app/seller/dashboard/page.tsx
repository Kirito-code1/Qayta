"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { useAuth } from '@/app/lib/AuthContext';
import { getAllProducts } from "../../lib/mockData";
import { LayoutDashboard, Package, Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SellerDashboard() {
  const router = useRouter();
  const { user, isLoadingAuth } = useAuth();
  const [products, setProducts] = useState<any[]>([]);

  // Константа для ключа (должна совпадать с mockData.ts)
  const DB_KEY = 'eco_market_products';

  useEffect(() => {
    if (!isLoadingAuth && user) {
      // Подгружаем ВСЕ товары и оставляем только свои
      // Используем getAllProducts(), чтобы видеть и дефолтные, и сохраненные
      const myItems = getAllProducts().filter(p => p.sellerEmail === user.email);
      setProducts(myItems);
    }
  }, [user, isLoadingAuth]);

  const deleteProduct = (id: string) => {
    if (!confirm("Удалить этот товар?")) return;

    // 1. Получаем текущий список из localStorage
    const savedInStorage = JSON.parse(localStorage.getItem(DB_KEY) || '[]');
    
    // 2. Проверяем, находится ли товар в localStorage
    const isInStorage = savedInStorage.some((p: any) => p.id === id);

    if (isInStorage) {
      // Удаляем из localStorage
      const updatedStorage = savedInStorage.filter((p: any) => p.id !== id);
      localStorage.setItem(DB_KEY, JSON.stringify(updatedStorage));
    } else {
      // Если товара нет в storage, значит он "дефолтный" (из кода)
      // Чтобы "удалить" его имитацией, можно сохранить его ID в черный список 
      // или просто вывести предупреждение, что дефолтные товары не удаляются в этой версии.
      alert("Внимание: Базовые системные товары нельзя удалить из локального хранилища.");
      return;
    }

    // 3. Обновляем локальное состояние экрана, чтобы товар исчез сразу
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  if (isLoadingAuth) return (
    <div className="h-screen flex flex-col items-center justify-center gap-4 bg-[#F4F7F5]">
      <Loader2 className="animate-spin text-[#C4E86B]" size={40} />
      <div className="font-black uppercase tracking-widest text-sm text-gray-400">Загрузка данных...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F4F7F5] flex text-black">
      {/* Sidebar */}
      <aside className="w-24 md:w-72 bg-white border-r border-gray-100 flex flex-col p-6">
        <div className="flex items-center gap-3 px-2 mb-12">
          <div className="w-10 h-10 bg-[#C4E86B] rounded-xl flex items-center justify-center font-black">Q</div>
          <span className="hidden md:block font-black text-xl tracking-tighter uppercase italic">Qayta Admin</span>
        </div>
        <nav className="flex-1">
           <div className="p-4 bg-[#C4E86B] rounded-2xl flex items-center gap-4 shadow-lg shadow-lime-200/20">
             <Package size={20} /> 
             <span className="hidden md:block font-black text-[10px] uppercase tracking-widest">Товары</span>
           </div>
        </nav>
        
        {user && (
          <div className="mt-auto p-4 bg-gray-50 rounded-2xl hidden md:block">
            <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Аккаунт</p>
            <p className="text-[10px] font-bold truncate">{user.email}</p>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter">Дашборд</h1>
            <p className="text-gray-400 text-xs font-bold mt-1 uppercase tracking-wider">Управление вашими лотами</p>
          </div>
          <Button 
            onClick={() => router.push('/seller/add-product')} 
            className="h-14 bg-black text-white px-8 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-[#4A7C59] transition-all shadow-xl shadow-black/10 flex items-center gap-2"
          >
            <Plus size={18} /> Добавить товар
          </Button>
        </div>

        {/* Таблица */}
        <div className="bg-white rounded-[3rem] p-8 md:p-10 shadow-sm border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-[10px] font-black uppercase tracking-widest text-gray-300 border-b border-gray-50">
                  <th className="pb-6 px-2">Название</th>
                  <th className="pb-6">Категория</th>
                  <th className="pb-6">Цена (UZS)</th>
                  <th className="pb-6 text-right">Действие</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product.id} className="group hover:bg-gray-50/50 transition-all">
                      <td className="py-6 px-2 font-bold uppercase tracking-tight text-gray-900">
                        <div className="flex items-center gap-3">
                          {product.image && (
                            <img src={product.image} className="w-8 h-8 rounded-lg object-cover bg-gray-100" alt="" />
                          )}
                          {product.title}
                        </div>
                      </td>
                      <td className="py-6 font-bold text-gray-400 text-[10px] uppercase tracking-widest">
                        <span className="bg-gray-100 px-3 py-1 rounded-full">{product.category}</span>
                      </td>
                      <td className="py-6 font-black text-emerald-600">
                        {product.discounted_price ? product.discounted_price.toLocaleString() : '0'}
                      </td>
                      <td className="py-6 text-right">
                        <button 
                          onClick={() => deleteProduct(product.id)} 
                          className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all"
                          title="Удалить"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-32 text-center">
                      <div className="flex flex-col items-center gap-3 opacity-20">
                        <Package size={48} />
                        <p className="font-black uppercase text-xs tracking-[0.2em]">Товары не найдены</p>
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