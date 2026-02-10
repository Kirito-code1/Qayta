"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/lib/AuthContext';
import { useLanguage } from '@/app/lib/LanguageContext';
import { deleteUserAccount } from '@/app/lib/mockData';
import { 
  MapPin, Calendar, Edit3, Settings, 
  LogOut, Trash2, Save, X, ChevronRight, Leaf, Award, AlertTriangle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProfilePage() {
  const { user, logout, updateUser } = useAuth();
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    city: user?.city || ''
  });

  const citiesList = t('cities') as unknown as string[];

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        email: user.email || '',
        city: user.city || ''
      });
    }
  }, [user]);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (updateUser) {
      updateUser(formData);
      setIsEditing(false);
    }
  };

  const confirmDelete = () => {
    if (user?.email) {
      deleteUserAccount(user.email);
      localStorage.removeItem('eco_market_auth_data');
      if (logout) logout();
      setTimeout(() => {
        window.location.replace('/');
      }, 100);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#FBFBFB] py-16 px-4 relative">
      <div className="max-w-4xl mx-auto">
        
        {/* Карточка профиля */}
        <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="h-32 bg-gradient-to-r from-[#C4E86B] to-[#4A7C59] opacity-20" />
          <div className="px-10 pb-10 -mt-12 flex flex-col md:flex-row items-end gap-6">
            <div className="w-32 h-32 bg-white p-2 rounded-[2.5rem] shadow-xl">
              <div className="w-full h-full bg-[#C4E86B] rounded-[2rem] flex items-center justify-center text-4xl font-black italic">
                {user.full_name?.charAt(0)}
              </div>
            </div>
            
            <div className="flex-1 mb-2">
              {isEditing ? (
                <div className="space-y-2 max-w-xs">
                  <Input 
                    value={formData.full_name} 
                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                    className="h-10 rounded-xl font-black uppercase text-[10px] tracking-widest"
                  />
                  <select 
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="w-full h-10 rounded-xl bg-gray-50 border-none px-3 text-[10px] font-black uppercase tracking-widest outline-none ring-[#C4E86B] focus:ring-2"
                  >
                    <option value="" disabled>{t('reg_city')}</option>
                    {citiesList.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <>
                  <h1 className="text-4xl font-black tracking-tighter uppercase italic">{user.full_name}</h1>
                  <div className="flex items-center gap-4 mt-2 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} className="text-[#4A7C59]" /> {user.city || t('prof_city_none')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} className="text-[#4A7C59]" /> 2026
                    </span>
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button onClick={handleUpdate} className="bg-black text-white rounded-2xl px-6 h-12 font-black uppercase text-[10px] tracking-widest">
                    <Save size={14} className="mr-2" /> {t('prof_save')}
                  </Button>
                  <Button onClick={() => setIsEditing(false)} variant="outline" className="rounded-2xl h-12 border-gray-100 uppercase text-[10px] font-black">
                    <X size={14} />
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)} className="bg-black text-white rounded-2xl px-8 h-12 font-black uppercase text-[10px] tracking-widest hover:bg-[#4A7C59] transition-all">
                  <Edit3 size={14} className="mr-2" /> {t('prof_edit')}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatBox icon={<Leaf size={24} className="text-[#4A7C59]" />} val="12.5 кг" label={t('prof_stat_food')} />
          <StatBox icon={<Award size={24} className="text-amber-600" />} val="Gold" label={t('prof_stat_status')} />
          <StatBox icon={<div className="text-2xl">💰</div>} val={user.eco_coins || 0} label="Eco-Coins" />
        </div>

        {/* Секция действий */}
        <div className="bg-white rounded-[2.5rem] p-4 border border-gray-100 space-y-2">
           <ProfileOption icon={<Settings size={20} />} title={t('prof_safety')} />
           <ProfileOption icon={<LogOut size={20} />} title={t('prof_logout')} onClick={logout} />
           
           <div className="pt-4 mt-4 border-t border-gray-50">
             <button 
               onClick={() => setIsDeleteModalOpen(true)}
               className="w-full flex items-center justify-between p-6 hover:bg-red-50 transition-all rounded-[1.5rem] group"
             >
               <div className="flex items-center gap-4 font-black uppercase text-[10px] tracking-widest text-red-500">
                 <Trash2 size={20} /> {t('prof_delete_btn')}
               </div>
               <ChevronRight size={18} className="text-red-200 group-hover:text-red-500" />
             </button>
           </div>
        </div>
      </div>

      {/* Модалка удаления */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={() => setIsDeleteModalOpen(false)} />
          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl border border-red-50">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-red-50 rounded-[2rem] flex items-center justify-center text-red-500 mb-6">
                <AlertTriangle size={40} />
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tighter italic mb-4">{t('prof_modal_title')}</h2>
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-8">
                {t('prof_modal_desc')}
              </p>
              <div className="flex flex-col w-full gap-3">
                <button onClick={confirmDelete} className="w-full h-14 bg-red-500 text-white rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-red-600 transition-colors">
                  {t('prof_modal_confirm')}
                </button>
                <button onClick={() => setIsDeleteModalOpen(false)} className="w-full h-14 bg-gray-50 text-gray-400 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-gray-100 transition-colors">
                  {t('prof_modal_cancel')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Вспомогательные компоненты без изменений логики, только стили
function StatBox({ icon, val, label }: any) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 flex flex-col items-center text-center group hover:border-[#C4E86B] transition-all">
      <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">{icon}</div>
      <p className="text-2xl font-black tracking-tighter">{val}</p>
      <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest mt-1">{label}</p>
    </div>
  );
}

function ProfileOption({ icon, title, onClick }: any) {
  return (
    <button onClick={onClick} className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-all rounded-[1.5rem] group">
      <div className="flex items-center gap-4 font-black uppercase text-[10px] tracking-widest text-gray-900">
        <span className="text-[#4A7C59] group-hover:scale-110 transition-transform">{icon}</span> {title}
      </div>
      <ChevronRight size={18} className="text-gray-200 group-hover:text-black transition-colors" />
    </button>
  );
}