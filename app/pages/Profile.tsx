"use client";

import React from 'react';
import { useRouter } from "next/navigation";
import { mockUser, UserProfile } from "../lib/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Leaf, 
  Award, 
  ShoppingBag,
  Droplets,
  Recycle,
  Zap,
  Loader2,
  ChevronRight,
  Lock
} from "lucide-react";
import { motion } from "framer-motion";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  threshold: number;
  field: keyof UserProfile; 
}

const achievements: Achievement[] = [
  { id: 'first_purchase', title: 'Первый спасенный', description: 'Сделали первый осознанный заказ', icon: ShoppingBag, threshold: 1, field: 'total_orders' },
  { id: 'eco_warrior_10', title: 'Эко-Воин', description: 'Спасли 10 продуктов от утилизации', icon: Award, threshold: 10, field: 'total_orders' },
  { id: 'coin_collector_100', title: 'Коллекционер', description: 'Заработали 100 Eco Coins', icon: Zap, threshold: 100, field: 'eco_coins' },
  { id: 'waste_warrior_10kg', title: 'Хранитель Земли', description: 'Предотвратили 10кг отходов', icon: Recycle, threshold: 10, field: 'total_waste_prevented_kg' },
];

export default function ProfilePage() {
  const router = useRouter();
  const user = mockUser;
  const isLoading = false;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f6f3]">
        <Loader2 className="w-10 h-10 animate-spin text-[#4A7C59]" />
      </div>
    );
  }

  // --- ЗАЩИТА ОТ NULL (Экран входа) ---
  if (!user) {
    return (
      <div className="min-h-screen bg-[#f8f6f3] flex items-center justify-center p-6 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="w-20 h-20 bg-white rounded-[2rem] shadow-xl flex items-center justify-center mx-auto mb-6 text-gray-300">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-3">Профиль закрыт</h2>
          <p className="text-gray-500 text-sm mb-8 max-w-[280px] mx-auto">
            Войдите в аккаунт, чтобы отслеживать свой эко-прогресс и достижения.
          </p>
          <Button 
            onClick={() => router.push('/login')} 
            className="bg-black text-white h-14 px-10 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-[#4A7C59] transition-all"
          >
            Войти в профиль
          </Button>
        </motion.div>
      </div>
    );
  }

  // Безопасный расчет достижений (используем ?? 0 на случай если поля не заданы)
  const unlockedCount = achievements.filter(a => {
    const value = user[a.field] ?? 0;
    return typeof value === 'number' && value >= a.threshold;
  }).length;

  const currentLevel = Math.floor(unlockedCount / 2) + 1;

  return (
    <div className="min-h-screen bg-[#f8f6f3] py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Аватар и Имя */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="relative inline-block">
            <div className="w-24 h-24 bg-gradient-to-br from-[#4A7C59] to-[#2d4d37] rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl rotate-3 hover:rotate-0 transition-transform">
              <Leaf className="w-12 h-12 text-white -rotate-3" />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-[#C4E86B] text-black text-[10px] font-black px-2 py-1 rounded-lg border-2 border-[#f8f6f3] shadow-sm">
              LVL {currentLevel}
            </div>
          </div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter text-gray-900 mt-2">
            {user.full_name}
          </h1>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-1">
            {user.city} <span className="mx-2 text-gray-200">|</span> {user.email}
          </p>
        </motion.div>

        {/* Главная карточка Eco Coins */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
          <Card className="mb-8 overflow-hidden bg-black text-white border-0 shadow-2xl rounded-[2.5rem]">
            <div className="p-8 text-center relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#C4E86B]/10 rounded-full blur-3xl" />
              <Zap className="w-16 h-16 mx-auto mb-4 text-[#C4E86B] animate-pulse" />
              <p className="text-gray-400 text-[9px] uppercase tracking-[0.3em] font-black mb-1">Ваш Эко-Баланс</p>
              <p className="text-7xl font-black italic">{user.eco_coins ?? 0}</p>
              <button className="mt-8 bg-[#C4E86B] text-black px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:scale-105 transition-all flex items-center gap-2 mx-auto">
                Магазин бонусов <ChevronRight size={14} />
              </button>
            </div>
          </Card>
        </motion.div>

        {/* Статистика влияния */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <ImpactStatCard 
            icon={Recycle} 
            value={`${(user.total_waste_prevented_kg ?? 0).toFixed(1)} кг`} 
            label="Спасенная еда" 
            color="text-emerald-600" 
            bg="bg-emerald-50"
            delay={0.2}
          />
          <ImpactStatCard 
            icon={Droplets} 
            value={`${(user.total_co2_saved_kg ?? 0).toFixed(1)} кг`} 
            label="CO₂ спасено" 
            color="text-blue-600" 
            bg="bg-blue-50"
            delay={0.3}
          />
          <ImpactStatCard 
            icon={ShoppingBag} 
            value={user.total_orders ?? 0} 
            label="Заказов сделано" 
            color="text-amber-600" 
            bg="bg-amber-50"
            delay={0.4}
          />
        </div>

        {/* Секция достижений */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-black uppercase italic tracking-tighter text-gray-900 flex items-center gap-2">
              <Award className="text-[#C4E86B]" size={20} /> Достижения
            </h2>
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">
              {unlockedCount} / {achievements.length}
            </span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {achievements.map((a, i) => {
              const val = user[a.field] ?? 0;
              const isUnlocked = typeof val === 'number' && val >= a.threshold;
              return (
                <AchievementItem 
                  key={a.id} 
                  achievement={a} 
                  isUnlocked={isUnlocked} 
                  index={i}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Вспомогательные компоненты ---

function ImpactStatCard({ icon: Icon, value, label, color, bg, delay }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
      <Card className="border-0 shadow-sm rounded-[2rem] bg-white overflow-hidden group hover:shadow-xl transition-all duration-500">
        <CardContent className="p-8 text-center">
          <div className={`w-14 h-14 ${bg} ${color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all`}>
            <Icon className="w-7 h-7" />
          </div>
          <p className="text-2xl font-black text-gray-900">{value}</p>
          <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest mt-2">{label}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function AchievementItem({ achievement, isUnlocked, index }: any) {
  const Icon = achievement.icon;
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }} 
      animate={{ opacity: 1, scale: 1 }} 
      transition={{ delay: 0.5 + index * 0.1 }}
      className={`p-6 rounded-[2.5rem] text-center border-2 transition-all relative group ${
        isUnlocked 
          ? 'bg-white border-green-50 shadow-sm' 
          : 'bg-gray-50/50 border-transparent grayscale opacity-30'
      }`}
    >
      <div className={`w-12 h-12 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 ${
        isUnlocked ? 'bg-black text-[#C4E86B] shadow-xl shadow-green-100' : 'bg-gray-200 text-gray-400'
      }`}>
        <Icon size={20} />
      </div>
      <h3 className="text-[10px] font-black text-gray-900 mb-1 leading-tight uppercase tracking-tight">{achievement.title}</h3>
      <p className="text-[9px] text-gray-400 leading-tight font-medium px-2">{achievement.description}</p>
      
      {isUnlocked && (
        <div className="absolute top-4 right-4 p-1">
          <div className="bg-[#C4E86B] rounded-full w-2 h-2" />
        </div>
      )}
    </motion.div>
  );
}