"use client";

import React from 'react';
import { motion } from "framer-motion";
import { Leaf, Droplets, DollarSign, Recycle, LucideIcon } from "lucide-react";

// Интерфейс для данных статистики
interface StatItem {
  icon: LucideIcon;
  value: string;
  label: string;
  sublabel: string;
}

const stats: StatItem[] = [
  { icon: Recycle, value: "50K+", label: "Products Saved", sublabel: "From going to waste" },
  { icon: DollarSign, value: "$2M+", label: "Customer Savings", sublabel: "Total money saved" },
  { icon: Droplets, value: "100K", label: "Liters of Water", sublabel: "Conserved" },
  { icon: Leaf, value: "25 tons", label: "CO₂ Prevented", sublabel: "Carbon footprint reduced" }
];

export default function ImpactSection() {
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
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Together, We Make a Difference
            </h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Every purchase on our platform contributes to a more sustainable future
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
              className="group bg-white/10 backdrop-blur-md rounded-3xl p-8 text-center border border-white/20 hover:bg-white/15 transition-colors"
            >
              {/* Контейнер иконки с легкой анимацией при наведении на карточку */}
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              
              <p className="text-4xl md:text-5xl font-bold text-white mb-2 tabular-nums">
                {stat.value}
              </p>
              
              <div className="space-y-1">
                <p className="text-white font-semibold text-lg">{stat.label}</p>
                <p className="text-white/60 text-sm leading-relaxed">{stat.sublabel}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}