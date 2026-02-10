"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from '@/app/products/ProductCard';
import { useLanguage } from '@/app/lib/LanguageContext'; // Импорт хука
import { Product } from "../../lib/mockData";

interface FeaturedProductsProps {
  products: Product[];
  isLoading: boolean;
}

export default function FeaturedProducts({ products = [], isLoading }: FeaturedProductsProps) {
  const { t } = useLanguage(); // Используем переводчик

  return (
    <section className="py-20 bg-gradient-to-b from-white to-[#f8f6f3]">
      <div className="container mx-auto px-4">
        
        {/* Заголовок секции */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#4A7C59] mb-3">
              <Sparkles className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                {t('featured_badge')}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              {t('featured_title')}
            </h2>
          </div>
          
          <Link href="/browse">
            <Button variant="ghost" className="text-[#4A7C59] font-black uppercase text-[10px] tracking-widest hover:text-[#3d6b4a] hover:bg-[#4A7C59]/10 rounded-2xl">
              {t('featured_view_all')}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
        
        {/* Состояние загрузки */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 p-2">
                <Skeleton className="aspect-square rounded-[1.5rem]" />
                <div className="p-5 space-y-3">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-3 w-32" />
                  <div className="flex justify-between items-center pt-2">
                    <Skeleton className="h-8 w-20 rounded-xl" />
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
            className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-gray-200"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-full mb-4">
              <Sparkles className="w-8 h-8 text-gray-200" />
            </div>
            <p className="text-gray-400 font-black uppercase text-[10px] tracking-[0.2em]">
              {t('featured_empty')}
            </p>
          </motion.div>
        ) : (
          /* Список товаров */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {products.slice(0, 8).map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}