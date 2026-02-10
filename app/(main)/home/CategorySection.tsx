"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from "framer-motion";
import { 
  UtensilsCrossed, 
  Coffee, 
  Croissant, 
  Milk, 
  Beef,
  Apple,
  Package,
  Sparkles,
  Shirt,
  Laptop,
  Home,
  MoreHorizontal,
  LucideIcon
} from "lucide-react";

// Типизация для объекта категории
interface Category {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
}

const categories: Category[] = [
  { id: "food", label: "Prepared Food", icon: UtensilsCrossed, color: "bg-orange-100 text-orange-600" },
  { id: "beverages", label: "Beverages", icon: Coffee, color: "bg-amber-100 text-amber-600" },
  { id: "bakery", label: "Bakery", icon: Croissant, color: "bg-yellow-100 text-yellow-700" },
  { id: "dairy", label: "Dairy", icon: Milk, color: "bg-blue-100 text-blue-600" },
  { id: "meat", label: "Meat & Fish", icon: Beef, color: "bg-red-100 text-red-600" },
  { id: "produce", label: "Fresh Produce", icon: Apple, color: "bg-green-100 text-green-600" },
  { id: "pantry", label: "Pantry", icon: Package, color: "bg-stone-100 text-stone-600" },
  { id: "cosmetics", label: "Cosmetics", icon: Sparkles, color: "bg-pink-100 text-pink-600" },
  { id: "clothing", label: "Clothing", icon: Shirt, color: "bg-purple-100 text-purple-600" },
  { id: "electronics", label: "Electronics", icon: Laptop, color: "bg-slate-100 text-slate-600" },
  { id: "home", label: "Home & Garden", icon: Home, color: "bg-teal-100 text-teal-600" },
  { id: "other", label: "Other", icon: MoreHorizontal, color: "bg-gray-100 text-gray-600" }
];

export default function CategorySection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Browse by Category
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find great deals across all categories. From fresh food to fashion, 
            discover quality products at unbeatable prices.
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
              {/* Исправлено: href вместо to, удален createPageUrl для простоты */}
              <Link
                href={`/browse?category=${category.id}`}
                className="group flex flex-col items-center p-6 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100 h-full"
              >
                <div className={`w-14 h-14 ${category.color} rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <category.icon className="w-7 h-7" />
                </div>
                <span className="text-sm font-medium text-gray-700 text-center">
                  {category.label}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}