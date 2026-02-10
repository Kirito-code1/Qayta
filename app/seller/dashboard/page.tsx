"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, ShoppingBag, Package, 
  BarChart3, Settings, Plus, ArrowUpRight, 
  Search, Bell, Trash2 
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SellerDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState([]);

  // Загрузка товаров
  useEffect(() => {
    const savedProducts = JSON.parse(localStorage.getItem('my_products') || '[]');
    setProducts(savedProducts);
  }, []);

  // Функция удаления
  const deleteProduct = (id: string) => {
    const updated = products.filter((p: any) => p.id !== id);
    setProducts(updated);
    localStorage.setItem('my_products', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-[#F4F7F5] flex">
      <aside className="w-24 md:w-72 bg-white border-r border-gray-100 flex flex-col p-6">
        <div className="flex items-center gap-3 px-2 mb-12">
          <div className="w-10 h-10 bg-[#C4E86B] rounded-xl flex items-center justify-center font-black">Q</div>
          <span className="hidden md:block font-black text-xl tracking-tighter uppercase italic">Qayta Admin</span>
        </div>
        <nav className="flex-1 space-y-2">
          <NavItem active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<LayoutDashboard size={20} />} label="Обзор" />
          <NavItem active={activeTab === 'products'} onClick={() => setActiveTab('products')} icon={<Package size={20} />} label="Товары" />
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto p-4 md:p-12">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Дашборд</h1>
          <Button 
            onClick={() => router.push('/seller/add-product')} 
            className="h-12 bg-black text-white px-6 rounded-2xl font-bold flex items-center gap-2"
          >
            <Plus size={18} /> Новый товар
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard label="Товаров в базе" value={products.length} trend="Live" />
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
          <h2 className="font-black text-xl uppercase italic mb-8">Ваши товары</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black uppercase tracking-widest text-gray-300 border-b border-gray-50">
                  <th className="pb-4">Название</th>
                  <th className="pb-4">Цена</th>
                  <th className="pb-4">Категория</th>
                  <th className="pb-4 text-right">Действие</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.length > 0 ? (
                  products.map((product: any) => (
                    <tr key={product.id} className="group hover:bg-gray-50 transition-colors">
                      <td className="py-5 font-bold text-gray-900">{product.title}</td>
                      <td className="py-5 font-black text-sm">{Number(product.price).toLocaleString()} UZS</td>
                      <td className="py-5 font-bold text-gray-400 text-[10px] uppercase tracking-widest">{product.category}</td>
                      <td className="py-5 text-right">
                        <button 
                          onClick={() => deleteProduct(product.id)}
                          className="p-2 text-red-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-10 text-center text-gray-400">Товаров нет</td>
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

// Вспомогательные компоненты (NavItem, StatCard и т.д. остаются как были)
function NavItem({ icon, label, active, onClick }: any) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${active ? 'bg-[#C4E86B] text-black shadow-lg shadow-lime-200/50' : 'text-gray-400 hover:text-black'}`}>
      {icon} <span className="hidden md:block font-bold text-sm uppercase tracking-widest">{label}</span>
    </button>
  );
}

function StatCard({ label, value, trend }: any) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50">
      <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4">{label}</p>
      <div className="flex justify-between items-end">
        <p className="text-3xl font-black text-gray-900">{value}</p>
        <span className="text-[10px] font-black bg-emerald-50 text-emerald-600 px-2 py-1 rounded-lg">{trend}</span>
      </div>
    </div>
  );
}