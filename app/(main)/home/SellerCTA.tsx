"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from "framer-motion";
import { Store, TrendingUp, Users, ArrowRight, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/app/lib/LanguageContext'; // Импорт хука

interface Benefit {
  icon: LucideIcon;
  textKey: any; // Ключ перевода
}

const benefits: Benefit[] = [
  { icon: TrendingUp, textKey: "seller_benefit_1" },
  { icon: Users, textKey: "seller_benefit_2" },
  { icon: Store, textKey: "seller_benefit_3" }
];

export default function SellerCTA() {
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-gradient-to-br from-[#f8f6f3] to-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Левая часть: Текст и преимущества */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-[#C4E86B]/20 text-[#2E2E2E] px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest mb-6">
              <Store className="w-4 h-4" />
              {t('seller_badge')}
            </div>
            
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 leading-tight tracking-tighter italic uppercase">
              {t('seller_title_1')}
              <span className="text-[#4A7C59]">{t('seller_title_2')}</span>
            </h2>
            
            <p className="text-gray-400 font-bold uppercase text-[12px] tracking-tight mb-8 leading-relaxed max-w-lg">
              {t('seller_subtitle')}
            </p>
            
            <div className="space-y-6 mb-10">
              {benefits.map((item, i) => (
                <div key={i} className="flex items-start gap-4 group">
                  <div className="w-10 h-10 bg-white shadow-sm border border-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#C4E86B] transition-colors duration-300">
                    <item.icon className="w-5 h-5 text-black" />
                  </div>
                  <span className="text-gray-600 font-black uppercase text-[10px] tracking-widest leading-snug pt-2">
                    {t(item.textKey)}
                  </span>
                </div>
              ))}
            </div>
            
            <Link href="/become-a-seller">
              <Button size="lg" className="bg-black hover:bg-[#4A7C59] text-white px-10 py-8 text-[12px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95">
                {t('seller_btn')}
                <ArrowRight className="w-5 h-5 ml-3" />
              </Button>
            </Link>
          </motion.div>
          
          {/* Правая часть: Визуал */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative h-[550px] w-full rounded-[3rem] overflow-hidden shadow-2xl grayscale hover:grayscale-0 transition-all duration-700">
              <Image
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=700&fit=crop"
                alt="Business owner"
                fill
                className="object-cover"
              />
            </div>
            
            {/* Floating stats card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
              className="absolute -bottom-8 -left-8 bg-white rounded-[2.5rem] shadow-2xl p-8 border border-gray-50 max-w-[300px]"
            >
              <div className="flex items-center gap-5 mb-4">
                <div className="w-14 h-14 bg-[#C4E86B] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#C4E86B]/30">
                  <TrendingUp className="w-7 h-7 text-black" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{t('seller_stat_label')}</p>
                  <p className="text-4xl font-black text-gray-900 tracking-tighter">85%</p>
                </div>
              </div>
              <p className="text-[9px] font-bold text-gray-400 leading-relaxed uppercase tracking-wider">
                {t('seller_stat_desc')}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}