"use client";

import React, { useState, useEffect } from 'react'; // Добавил useEffect для синхронизации
import { useAuth } from '@/app/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { deleteUserAccount } from '@/app/lib/mockData';
import { 
  MapPin, Calendar, Edit3, Settings, 
  LogOut, Trash2, Save, X, ChevronRight, Leaf, Award, AlertTriangle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Список городов для выбора (такой же как в регистрации)
const CITIES = ["Ташкент", "Самарканд", "Бухара", "Фергана", "Наманган", "Андижан", "Нукус"];

export default function ProfilePage() {
  const { user, logout, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Инициализируем стейт данными пользователя
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    city: user?.city || 'Ташкент' // Добавили город
  });

  // Обновляем стейт формы, если данные пользователя загрузились позже
  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        email: user.email || '',
        city: user.city || 'Ташкент'
      });
    }
  }, [user]);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (updateUser) {
      updateUser(formData); // Теперь сохраняет и новый город
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
        <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden mb-8 transition-all">
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
                    className="h-10 rounded-xl font-bold"
                  />
                  {/* Выбор города при редактировании */}
                  <select 
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="w-full h-10 rounded-xl bg-gray-50 border-none px-3 text-xs font-bold uppercase tracking-widest outline-none"
                  >
                    {CITIES.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <>
                  <h1 className="text-4xl font-black tracking-tighter uppercase italic">{user.full_name}</h1>
                  <div className="flex items-center gap-4 mt-2 text-gray-400 text-xs font-bold uppercase tracking-widest">
                    {/* ТЕПЕРЬ ТУТ ДИНАМИЧЕСКИЙ ГОРОД */}
                    <span className="flex items-center gap-1">
                      <MapPin size={12} /> {user.city || 'Не указан'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> 2026
                    </span>
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button onClick={handleUpdate} className="bg-black text-white rounded-2xl px-6 h-12 font-black uppercase text-[10px] tracking-widest">
                    <Save size={14} className="mr-2" /> Сохранить
                  </Button>
                  <Button onClick={() => setIsEditing(false)} variant="outline" className="rounded-2xl h-12 border-gray-100 uppercase text-[10px] font-black">
                    <X size={14} />
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)} className="bg-black text-white rounded-2xl px-8 h-12 font-black uppercase text-[10px] tracking-widest hover:bg-[#4A7C59] transition-all">
                  <Edit3 size={14} className="mr-2" /> Редактировать
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatBox icon={<Leaf className="text-emerald-600" />} val="12.5 кг" label="Спасено еды" />
          <StatBox icon={<Award className="text-amber-600" />} val="Gold" label="Эко статус" />
          <StatBox icon={<div className="text-xl">💰</div>} val={user.eco_coins || 0} label="Eco-Coins" />
        </div>

        {/* Секция действий */}
        <div className="bg-white rounded-[2.5rem] p-4 border border-gray-100 space-y-2">
           <ProfileOption icon={<Settings size={20} />} title="Безопасность и пароль" />
           <ProfileOption icon={<LogOut size={20} />} title="Выйти из системы" onClick={logout} />
           
           <div className="pt-4 mt-4 border-t border-gray-50">
             <button 
               onClick={() => setIsDeleteModalOpen(true)}
               className="w-full flex items-center justify-between p-6 hover:bg-red-50 transition-all rounded-[1.5rem] group"
             >
               <div className="flex items-center gap-4 font-black uppercase text-xs tracking-widest text-red-500">
                 <Trash2 size={20} /> Удалить аккаунт навсегда
               </div>
               <ChevronRight size={18} className="text-red-200 group-hover:text-red-500" />
             </button>
           </div>
        </div>
      </div>

      {/* Модалка удаления (без изменений) */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={() => setIsDeleteModalOpen(false)} />
          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl border border-red-50">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-red-50 rounded-[2rem] flex items-center justify-center text-red-500 mb-6">
                <AlertTriangle size={40} />
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tighter italic mb-4">Удалить аккаунт?</h2>
              <p className="text-gray-500 text-sm font-medium mb-8">
                Это действие <span className="text-red-500 font-bold underline">необратимо</span>.
              </p>
              <div className="flex flex-col w-full gap-3">
                <button onClick={confirmDelete} className="w-full h-14 bg-red-500 text-white rounded-2xl font-black uppercase text-[11px] tracking-widest">
                  Да, удалить всё
                </button>
                <button onClick={() => setIsDeleteModalOpen(false)} className="w-full h-14 bg-gray-50 text-gray-500 rounded-2xl font-black uppercase text-[11px] tracking-widest">
                  Отмена
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatBox({ icon, val, label }: any) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 flex flex-col items-center text-center">
      <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">{icon}</div>
      <p className="text-2xl font-black">{val}</p>
      <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mt-1">{label}</p>
    </div>
  );
}

function ProfileOption({ icon, title, onClick }: any) {
  return (
    <button onClick={onClick} className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-all rounded-[1.5rem]">
      <div className="flex items-center gap-4 font-black uppercase text-xs tracking-widest text-gray-900">
        {icon} {title}
      </div>
      <ChevronRight size={18} className="text-gray-200" />
    </button>
  );
}