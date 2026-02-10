"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from "framer-motion";
import { Store, TrendingUp, Users, ArrowRight, LucideIcon } from "lucide-react";

// Импортируем вашу кнопку из папки UI
import { Button } from "@/components/ui/button";

// Типизация для преимуществ
interface Benefit {
  icon: LucideIcon;
  text: string;
}

const benefits: Benefit[] = [
  { icon: TrendingUp, text: "Recover costs on products that would otherwise go to waste" },
  { icon: Users, text: "Reach thousands of value-conscious customers" },
  { icon: Store, text: "Easy listing management and order tracking" }
];

export default function SellerCTA() {
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
            <div className="inline-flex items-center gap-2 bg-[#4A7C59]/10 text-[#4A7C59] px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Store className="w-4 h-4" />
              For Businesses
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Turn surplus into
              <span className="text-[#4A7C59]"> revenue</span>
            </h2>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Whether you&apos;re a restaurant, grocery store, bakery, or brand — 
              our platform helps you sell excess inventory, reduce waste, 
              and connect with eco-conscious customers.
            </p>
            
            <div className="space-y-5 mb-10">
              {benefits.map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#4A7C59]/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                    <item.icon className="w-5 h-5 text-[#4A7C59]" />
                  </div>
                  <span className="text-gray-700 text-lg leading-snug">{item.text}</span>
                </div>
              ))}
            </div>
            
            <Link href="/become-a-seller">
              <Button size="lg" className="bg-[#4A7C59] hover:bg-[#3d6b4a] text-white px-10 py-7 text-xl rounded-full shadow-lg shadow-[#4A7C59]/20 transition-all hover:scale-105 active:scale-95">
                Start Selling Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
          
          {/* Правая часть: Визуал и плавающая карточка */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Используем компонент Image для оптимизации */}
            <div className="relative h-[500px] w-full rounded-3xl overflow-hidden shadow-2xl">
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
              className="absolute -bottom-8 -left-8 bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 max-w-[280px]"
            >
              <div className="flex items-center gap-5 mb-4">
                <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-7 h-7 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Avg. Recovery</p>
                  <p className="text-3xl font-bold text-gray-900">85%</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed font-medium">
                Of potential loss recovered through our platform
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}