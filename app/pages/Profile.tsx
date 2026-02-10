"use client";

import React from 'react';
import { useRouter } from "next/navigation";
import { useLanguage } from '@/app/lib/LanguageContext';
import { useAuth } from '@/app/lib/AuthContext';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Leaf, Award, ShoppingBag, Droplets, Recycle, Zap, Loader2, ChevronRight, Lock
} from "lucide-react";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { user, isLoadingAuth } = useAuth();

  // Конфигурация достижений (теперь только ключи)
  const achievementConfigs = [
    { id: 'first_purchase', icon: ShoppingBag, threshold: 1, field: 'total_orders' },
    { id: 'eco_warrior', icon: Award, threshold: 10, field: 'total_orders' },
    { id: 'collector', icon: Zap, threshold: 100, field: 'eco_coins' },
    { id: 'earth_keeper', icon: Recycle, threshold: 10, field: 'total_waste_prevented_kg' },
  ];

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f6f3]">
        <Loader2 className="w-10 h-10 animate-spin text-[#4A7C59]" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f8f6f3] flex items-center justify-center p-6 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="w-20 h-20 bg-white rounded-[2rem] shadow-xl flex items-center justify-center mx-auto mb-6 text-gray-300">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-3">{t('prof_closed')}</h2>
          <p className="text-gray-500 text-sm mb-8 max-w-[280px] mx-auto">{t('prof_closed_text')}</p>
          <Button 
            onClick={() => router.push('/login')} 
            className="bg-black text-white h-14 px-10 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-[#4A7C59] transition-all"
          >
            {t('prof_login_btn')}
          </Button>
        </motion.div>
      </div>
    );
  }

  const unlockedCount = achievementConfigs.filter(a => (user as any)[a.field] >= a.threshold).length;
  const currentLevel = Math.floor(unlockedCount / 2) + 1;

  return (
    <div className="min-h-screen bg-[#f8f6f3] pt-28 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Аватар */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="relative inline-block">
            <div className="w-24 h-24 bg-black rounded-[2.5rem] flex items-center justify-center mx-auto mb-4 shadow-2xl rotate-3 hover:rotate-0 transition-all border-4 border-white">
              <Leaf className="w-10 h-10 text-[#C4E86B]" />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-[#C4E86B] text-black text-[9px] font-black px-3 py-1 rounded-full border-2 border-[#f8f6f3] shadow-md">
              {t('prof_lvl')} {currentLevel}
            </div>
          </div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter text-gray-900 mt-4">
            {user.full_name}
          </h1>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">
            {user.city} <span className="mx-2 text-gray-200">|</span> {user.email}
          </p>
        </motion.div>

        {/* Эко Баланс */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="mb-10 overflow-hidden bg-black text-white border-0 shadow-2xl rounded-[3rem]">
            <div className="p-10 text-center relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#C4E86B]/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
              <Zap className="w-12 h-12 mx-auto mb-4 text-[#C4E86B]" />
              <p className="text-gray-500 text-[10px] uppercase tracking-[0.3em] font-black mb-2">{t('prof_balance')}</p>
              <p className="text-8xl font-black italic tracking-tighter leading-none mb-8">{user.eco_coins ?? 0}</p>
              <button className="bg-[#C4E86B] text-black px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all flex items-center gap-3 mx-auto shadow-xl shadow-lime-900/20 active:scale-95">
                {t('prof_bonus_shop')} <ChevronRight size={16} />
              </button>
            </div>
          </Card>
        </motion.div>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <ImpactStatCard 
            icon={Recycle} 
            value={`${(user.total_waste_prevented_kg ?? 0).toFixed(1)} kg`} 
            label={t('prof_stat_food')} 
            bg="bg-white" 
            delay={0.2} 
          />
          <ImpactStatCard 
            icon={Droplets} 
            value={`${(user.total_co2_saved_kg ?? 0).toFixed(1)} kg`} 
            label={t('prof_stat_co2')} 
            bg="bg-white" 
            delay={0.3} 
          />
          <ImpactStatCard 
            icon={ShoppingBag} 
            value={user.total_orders ?? 0} 
            label={t('prof_stat_orders')} 
            bg="bg-white" 
            delay={0.4} 
          />
        </div>

        {/* Достижения */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-4">
            <h2 className="text-2xl font-black uppercase italic tracking-tighter text-gray-900">
              {t('prof_achievements')}
            </h2>
            <div className="px-4 py-1 bg-gray-200 rounded-full font-black text-[10px]">
              {unlockedCount} / {achievementConfigs.length}
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {achievementConfigs.map((a, i) => {
              const val = (user as any)[a.field] ?? 0;
              const isUnlocked = val >= a.threshold;
              const trans = (t('achievements') as any)[a.id];
              return (
                <div 
                  key={a.id}
                  className={`p-6 rounded-[2.5rem] text-center border-2 transition-all relative group ${
                    isUnlocked ? 'bg-white border-lime-100 shadow-sm' : 'bg-gray-100/50 border-transparent opacity-40 grayscale'
                  }`}
                >
                  <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                    isUnlocked ? 'bg-black text-[#C4E86B]' : 'bg-gray-200 text-gray-400'
                  }`}>
                    <a.icon size={24} />
                  </div>
                  <h3 className="text-[10px] font-black text-gray-900 mb-1 uppercase tracking-tight">{trans.t}</h3>
                  <p className="text-[9px] text-gray-400 leading-tight font-bold uppercase tracking-tighter">{trans.d}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function ImpactStatCard({ icon: Icon, value, label, bg, delay }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
      <div className={`${bg} p-8 rounded-[2.5rem] text-center border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group`}>
        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#C4E86B] transition-colors">
          <Icon className="w-6 h-6 text-gray-400 group-hover:text-black" />
        </div>
        <p className="text-3xl font-black text-gray-900 tracking-tighter italic">{value}</p>
        <p className="text-[10px] text-gray-400 uppercase font-black tracking-[0.2em] mt-2">{label}</p>
      </div>
    </motion.div>
  );
}