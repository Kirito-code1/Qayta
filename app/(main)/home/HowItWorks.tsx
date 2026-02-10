"use client";

import React from 'react';
import { motion } from "framer-motion";
import { Search, ShoppingCart, Smile, Leaf, LucideIcon } from "lucide-react";
import { useLanguage } from '@/app/lib/LanguageContext';

interface Step {
  icon: LucideIcon;
  titleKey: any; // Ключ для заголовка
  descKey: any;  // Ключ для описания
  color: string;
}

const steps: Step[] = [
  {
    icon: Search,
    titleKey: "step1_title",
    descKey: "step1_desc",
    color: "bg-blue-100 text-blue-600"
  },
  {
    icon: ShoppingCart,
    titleKey: "step2_title",
    descKey: "step2_desc",
    color: "bg-purple-100 text-purple-600"
  },
  {
    icon: Smile,
    titleKey: "step3_title",
    descKey: "step3_desc",
    color: "bg-amber-100 text-amber-600"
  },
  {
    icon: Leaf,
    titleKey: "step4_title",
    descKey: "step4_desc",
    color: "bg-green-100 text-green-600"
  }
];

export default function HowItWorks() {
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-black uppercase italic text-gray-900 mb-4"
          >
            {t('how_title')}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="text-gray-400 font-black uppercase text-[10px] tracking-widest max-w-2xl mx-auto"
          >
            {t('how_subtitle')}
          </motion.p>
        </div>
        
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Линия-коннектор */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gray-50" aria-hidden="true" />
              )}
              
              <div className="relative text-center z-10 group">
                {/* Иконка */}
                <div className={`w-24 h-24 ${step.color} rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:rotate-6 transition-all duration-300`}>
                  <step.icon className="w-10 h-10" />
                </div>

                {/* Порядковый номер */}
                <div className="absolute top-0 right-1/2 translate-x-12 -translate-y-2 w-8 h-8 bg-black text-white rounded-xl flex items-center justify-center text-xs font-black shadow-lg border-2 border-white">
                  {index + 1}
                </div>

                <h3 className="text-sm font-black uppercase tracking-tighter text-gray-900 mb-3">
                  {t(step.titleKey)}
                </h3>
                <p className="text-gray-500 text-[10px] font-bold uppercase leading-relaxed px-4 md:px-0 tracking-tight">
                  {t(step.descKey)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}