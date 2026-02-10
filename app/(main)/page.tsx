"use client";

import { mockProducts } from "@/app/lib/mockData"; // Импортируем данные
import HeroSection from "./home/HeroSection";
import FeaturedProducts from "./home/FeaturedProducts";
import CategorySection from "./home/CategorySection";
import HowItWorks from "./home/HowItWorks";
import ImpactSection from "./home/ImpactSection";
import SellerCTA from "./home/SellerCTA";

export default function Home() {
  // Выбираем несколько товаров для отображения (например, первые 8)
  const products = mockProducts.slice(0, 8);
  const isLoading = false; // В автономном режиме данные грузятся мгновенно

  return (
    <div className="min-h-screen">
      <HeroSection />
      <CategorySection />
      
      {/* Теперь передаем обязательные пропсы */}
      <FeaturedProducts products={products} isLoading={isLoading} />
      
      <HowItWorks />
      <ImpactSection />
      <SellerCTA />
    </div>
  );
}