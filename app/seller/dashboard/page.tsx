"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { useAuth } from '@/app/lib/AuthContext';
import { useLanguage } from '@/app/lib/LanguageContext';
import { getAllProducts } from "../../lib/mockData";
import { LayoutDashboard, Package, Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SellerDashboard() {
  const router = useRouter();
  const { user, isLoadingAuth } = useAuth();
  const { t } = useLanguage();
  const [products, setProducts] = useState<any[]>([]);

  const DB_KEY = 'eco_market_products';

  useEffect(() => {
    if (!isLoadingAuth && user) {
      const myItems = getAllProducts().filter(p => p.sellerEmail === user.email);
      setProducts(myItems);
    }
  }, [user, isLoadingAuth]);

  const deleteProduct = (id: string) => {
    if (!confirm(t('dash_delete_confirm'))) return;

    const savedInStorage = JSON.parse(localStorage.getItem(DB_KEY) || '[]');
    const isInStorage = savedInStorage.some((p: any) => p.id === id);

    if (isInStorage) {
      const updatedStorage = savedInStorage.filter((p: any) => p.id !== id);
      localStorage.setItem(DB_KEY, JSON.stringify(updatedStorage));
    } else {
      alert(t('dash_delete_error'));
      return;
    }

    setProducts(prev => prev.filter(p => p.id !== id));
  };

  if (isLoadingAuth) return (
    <div className="h-screen flex flex-col items-center justify-center gap-4 bg-[#F4F7F5]">
      <Loader2 className="animate-spin text-[#C4E86B]" size={40} />
      <div className="font-black uppercase tracking-widest text-[10px] text-gray-400">
        {t('dash_loading')}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F4F7F5] flex text-black">
      {/* Sidebar */}
      <aside className="w-24 md:w-72 bg-white border-r border-gray-100 flex flex-col p-6">
        <div className="flex items-center gap-3 px-2 mb-12">
          <div className="w-10 h-10 bg-[#C4E86B] rounded-xl flex items-center justify-center font-black shadow-lg shadow-lime-200/50">Q</div>
          <span className="hidden md:block font-black text-xl tracking-tighter uppercase italic">Qayta Admin</span>
        </div>
        <nav className="flex-1">
           <div className="p-4 bg-[#C4E86B] rounded-2xl flex items-center gap-4 shadow-xl shadow-lime-200/40 transition-transform active:scale-95 cursor-pointer">
             <Package size={20} className="text-black" /> 
             <span className="hidden md:block font-black text-[10px] uppercase tracking-[0.2em]">
               {t('dash_products')}
             </span>
           </div>
        </nav>
        
        {user && (
          <div className="mt-auto p-5 bg-gray-50 rounded-[2rem] hidden md:block border border-gray-100">
            <p className="text-[8px] font-black text-gray-300 uppercase mb-2 tracking-widest">{t('dash_acc')}</p>
            <p className="text-[10px] font-black truncate uppercase tracking-tight text-gray-600">{user.email}</p>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-5xl font-black uppercase italic tracking-tighter leading-none">
              {t('dash_title')}
            </h1>
            <p className="text-gray-400 text-[10px] font-black mt-3 uppercase tracking-[0.2em]">
              {t('dash_subtitle')}
            </p>
          </div>
          <Button 
            onClick={() => router.push('/seller/add-product')} 
            className="h-16 bg-black text-white px-10 rounded-[2rem] font-black uppercase text-[10px] tracking-[0.2em] hover:bg-[#4A7C59] transition-all shadow-2xl shadow-black/20 flex items-center gap-3 active:scale-95"
          >
            <Plus size={20} /> {t('dash_add_btn')}
          </Button>
        </div>

        {/* Таблица */}
        <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-sm border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 border-b border-gray-50">
                  <th className="pb-8 px-4">{t('dash_table_name')}</th>
                  <th className="pb-8">{t('dash_table_cat')}</th>
                  <th className="pb-8">{t('dash_table_price')}</th>
                  <th className="pb-8 text-right">{t('dash_table_action')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product.id} className="group hover:bg-gray-50/50 transition-all">
                      <td className="py-8 px-4 font-black uppercase tracking-tighter text-gray-900">
                        <div className="flex items-center gap-4">
                          {product.image && (
                            <img src={product.image} className="w-12 h-12 rounded-[1rem] object-cover bg-gray-100 shadow-sm group-hover:scale-110 transition-transform duration-500" alt="" />
                          )}
                          <span className="text-sm">{product.title}</span>
                        </div>
                      </td>
                      <td className="py-8">
                        <span className="bg-gray-50 text-gray-400 px-4 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest border border-gray-100 group-hover:bg-[#C4E86B]/10 group-hover:text-[#4A7C59] transition-colors">
                          {typeof product.category === 'string' && t('categories') ? (t('categories') as any)[product.category] || product.category : product.category}
                        </span>
                      </td>
                      <td className="py-8 font-black text-lg tracking-tighter text-black italic">
                        {product.discounted_price ? Number(product.discounted_price).toLocaleString() : '0'}
                      </td>
                      <td className="py-8 text-right">
                        <button 
                          onClick={() => deleteProduct(product.id)} 
                          className="w-12 h-12 flex items-center justify-center rounded-2xl text-gray-200 hover:text-white hover:bg-red-500 transition-all shadow-sm hover:shadow-red-200"
                          title="Удалить"
                        >
                          <Trash2 size={20} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-40 text-center">
                      <div className="flex flex-col items-center gap-4 opacity-10">
                        <Package size={64} strokeWidth={1} />
                        <p className="font-black uppercase text-xs tracking-[0.3em]">{t('dash_empty')}</p>
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