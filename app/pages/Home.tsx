"use client";

import React from 'react';
import { mockProducts } from "../lib/mockData"; 
import HeroSection from '../(main)/home/HeroSection';
import CategorySection from '../(main)/home/CategorySection';
import FeaturedProducts from '../(main)/home/FeaturedProducts';
import HowItWorks from '../(main)/home/HowItWorks';
import ImpactSection from '../(main)/home/ImpactSection';
import SellerCTA from '../(main)/home/SellerCTA';

export default function Home() {
  // Данные загружаются мгновенно из локального файла
  const products = mockProducts.slice(0, 8);
  const isLoading = false; 

  return (
    <div className="min-h-screen bg-[#f8f6f3]">
      {/* Главный баннер */}
      <HeroSection />

      {/* Сетка категорий */}
      <CategorySection />

      {/* Секция с товарами */}
      <FeaturedProducts products={products} isLoading={isLoading} />

      {/* Инструкция: как это работает */}
      <HowItWorks />

      {/* Секция о влиянии на экологию */}
      <ImpactSection />

      {/* Призыв стать продавцом */}
      <SellerCTA />
    </div>
  );
}