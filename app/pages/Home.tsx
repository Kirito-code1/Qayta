"use client";

import React from 'react';
import { mockProducts } from "../lib/mockData"; // Импортируем наши заглушки
import Layout from '@/components/Layout'; 
import HeroSection from '../(main)/home/HeroSection';
import CategorySection from '../(main)/home/CategorySection';
import FeaturedProducts from '../(main)/home/FeaturedProducts';
import HowItWorks from '../(main)/home/HowItWorks';
import ImpactSection from '../(main)/home/ImpactSection';
import SellerCTA from '../(main)/home/SellerCTA';

export default function Home() {
  // Вместо useQuery и base44 используем локальные данные
  // Берем первые 8 товаров для секции "Рекомендуемое"
  const products = mockProducts.slice(0, 8);
  const isLoading = false; // Данные загружаются мгновенно

  return (
    <Layout currentPageName="Home">
      <div className="min-h-screen bg-[#f8f6f3]">
        {/* Главный баннер */}
        <HeroSection />

        {/* Сетка категорий */}
        <CategorySection />

        {/* Секция с товарами (теперь данные летят из mockData) */}
        <FeaturedProducts products={products} isLoading={isLoading} />

        {/* Инструкция: как это работает */}
        <HowItWorks />

        {/* Секция о влиянии на экологию */}
        <ImpactSection />

        {/* Призыв стать продавцом */}
        <SellerCTA />
      </div>
    </Layout>
  );
}