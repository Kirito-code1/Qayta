"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from '@/app/products/ProductCard';

// 1. Импортируем наш единый тип из mockData
import { Product } from "../../lib/mockData";

interface FeaturedProductsProps {
  products: Product[]; // Теперь типы совпадают
  isLoading: boolean;
}

export default function FeaturedProducts({ products = [], isLoading }: FeaturedProductsProps) {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-[#f8f6f3]">
      <div className="container mx-auto px-4">
        
        {/* Заголовок секции */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#4A7C59] mb-3">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-medium uppercase tracking-wide">Лучшие предложения</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Выбор редакции
            </h2>
          </div>
          
          <Link href="/browse">
            <Button variant="ghost" className="text-[#4A7C59] hover:text-[#3d6b4a] hover:bg-[#4A7C59]/10 rounded-full">
              Смотреть все
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
        
        {/* Состояние загрузки */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden border border-gray-100 p-2">
                <Skeleton className="aspect-square rounded-2xl" />
                <div className="p-5 space-y-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-32" />
                  <div className="flex justify-between items-center pt-2">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-10 w-10 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-full mb-4">
              <Sparkles className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-gray-500 text-lg">Товаров пока нет. Загляните позже!</p>
          </motion.div>
        ) : (
          /* Список товаров */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {products.slice(0, 8).map((product, index) => (
              // ВАЖНО: Убедитесь, что внутри ProductCard 
              // используются поля product.title и product.discounted_price
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}