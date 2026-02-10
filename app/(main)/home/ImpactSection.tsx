"use client";

import React from 'react';
import { motion } from "framer-motion";
import { Leaf, Droplets, DollarSign, Recycle, LucideIcon } from "lucide-react";
import { useLanguage } from '@/app/lib/LanguageContext';

interface StatItem {
  icon: LucideIcon;
  value: string;
  labelKey: any; // Ключи перевода
  sublabelKey: any;
}

const stats: StatItem[] = [
  { icon: Recycle, value: "50K+", labelKey: "stat_prod_label", sublabelKey: "stat_prod_sub" },
  { icon: DollarSign, value: "$2M+", labelKey: "stat_save_label", sublabelKey: "stat_save_sub" },
  { icon: Droplets, value: "100K", labelKey: "stat_water_label", sublabelKey: "stat_water_sub" },
  { icon: Leaf, value: "25 t", labelKey: "stat_co2_label", sublabelKey: "stat_co2_sub" }
];

export default function ImpactSection() {
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-[#4A7C59] relative overflow-hidden">
      {/* Декоративный фоновый паттерн */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 border-2 border-white rounded-full" />
        <div className="absolute bottom-10 right-10 w-96 h-96 border-2 border-white rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white rounded-full" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-black italic uppercase text-white mb-4 tracking-tighter">
              {t('impact_title')}
            </h2>
            <p className="text-white/70 font-black uppercase text-[10px] tracking-[0.2em] max-w-2xl mx-auto">
              {t('impact_subtitle')}
            </p>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ 
                delay: index * 0.1, 
                type: "spring", 
                stiffness: 100 
              }}
              viewport={{ once: true }}
              className="group bg-white/10 backdrop-blur-md rounded-[2.5rem] p-8 text-center border border-white/20 hover:bg-white/15 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-white/20 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 group-hover:rotate-6 transition-transform duration-300">
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              
              <p className="text-4xl md:text-5xl font-black text-white mb-4 tabular-nums tracking-tighter">
                {stat.value}
              </p>
              
              <div className="space-y-2">
                <p className="text-white font-black uppercase text-[12px] tracking-widest leading-none">
                  {t(stat.labelKey)}
                </p>
                <p className="text-white/50 font-bold uppercase text-[8px] tracking-[0.15em] leading-relaxed">
                  {t(stat.sublabelKey)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}