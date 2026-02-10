"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from "framer-motion";
import { useLanguage } from '@/app/lib/LanguageContext'; // Импортируем хук
import { 
  UtensilsCrossed, Coffee, Croissant, Milk, Beef, Apple,
  Package, Sparkles, Shirt, Laptop, Home, MoreHorizontal, LucideIcon
} from "lucide-react";

interface Category {
  id: string;
  translationKey: any; // Ключ из нашего словаря
  icon: LucideIcon;
  color: string;
}

const categories: Category[] = [
  { id: "food", translationKey: "cat_food", icon: UtensilsCrossed, color: "bg-orange-100 text-orange-600" },
  { id: "beverages", translationKey: "cat_beverages", icon: Coffee, color: "bg-amber-100 text-amber-600" },
  { id: "bakery", translationKey: "cat_bakery", icon: Croissant, color: "bg-yellow-100 text-yellow-700" },
  { id: "dairy", translationKey: "cat_dairy", icon: Milk, color: "bg-blue-100 text-blue-600" },
  { id: "meat", translationKey: "cat_meat", icon: Beef, color: "bg-red-100 text-red-600" },
  { id: "produce", translationKey: "cat_produce", icon: Apple, color: "bg-green-100 text-green-600" },
  { id: "pantry", translationKey: "cat_pantry", icon: Package, color: "bg-stone-100 text-stone-600" },
  { id: "cosmetics", translationKey: "cat_cosmetics", icon: Sparkles, color: "bg-pink-100 text-pink-600" },
  { id: "clothing", translationKey: "cat_clothing", icon: Shirt, color: "bg-purple-100 text-purple-600" },
  { id: "electronics", translationKey: "cat_electronics", icon: Laptop, color: "bg-slate-100 text-slate-600" },
  { id: "home", translationKey: "cat_home", icon: Home, color: "bg-teal-100 text-teal-600" },
  { id: "other", translationKey: "cat_other", icon: MoreHorizontal, color: "bg-gray-100 text-gray-600" }
];

export default function CategorySection() {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('cat_title')}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('cat_subtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              viewport={{ once: true }}
            >
              <Link
                href={`/browse?category=${category.id}`}
                className="group flex flex-col items-center p-6 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100 h-full"
              >
                <div className={`w-14 h-14 ${category.color} rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <category.icon className="w-7 h-7" />
                </div>
                <span className="text-sm font-black uppercase tracking-tighter text-gray-700 text-center">
                  {t(category.translationKey)}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}