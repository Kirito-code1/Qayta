import React from 'react';
import { Button } from "@/components/ui/button";
import { Leaf, ShoppingBag, TrendingDown } from "lucide-react";
import Link from 'next/link';
import { createPageUrl } from "../../utils/index";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#f8f6f3] via-white to-[#e8f5e9] min-h-[85vh] flex items-center">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#4A7C59]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-[#4A7C59]/10 text-[#4A7C59] px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Leaf className="w-4 h-4" />
              Save food, save money, save the planet
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6">
              Great products,
              <span className="text-[#4A7C59]"> tiny prices</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-lg leading-relaxed">
              Discover amazing deals on quality products from local stores. 
              Reduce waste while saving up to 70% on food and goods.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link href={createPageUrl("Browse")}>
                <Button size="lg" className="bg-[#4A7C59] hover:bg-[#3d6b4a] text-white px-8 py-6 text-lg rounded-full shadow-lg shadow-[#4A7C59]/25 transition-all hover:scale-105">
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Start Shopping
                </Button>
              </Link>
              <Link href={createPageUrl("BecomeASeller")}>
                <Button size="lg" variant="outline" className="border-2 border-gray-200 px-8 py-6 text-lg rounded-full hover:bg-gray-50 transition-all">
                  Sell Your Products
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center gap-8 mt-12 pt-8 border-t border-gray-100">
              <div>
                <p className="text-3xl font-bold text-gray-900">50K+</p>
                <p className="text-gray-500 text-sm">Products saved</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">2K+</p>
                <p className="text-gray-500 text-sm">Happy sellers</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-[#4A7C59]">70%</p>
                <p className="text-gray-500 text-sm">Avg. savings</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=700&fit=crop"
                alt="Fresh groceries"
                className="rounded-3xl shadow-2xl object-cover w-full max-w-md ml-auto"
              />
              
              {/* Floating cards */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="absolute -left-8 top-20 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3"
              >
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">60% OFF</p>
                  <p className="text-sm text-gray-500">Organic bread</p>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute -right-4 bottom-32 bg-white rounded-2xl shadow-xl p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                    <Leaf className="w-4 h-4 text-amber-600" />
                  </div>
                  <span className="text-sm font-medium">Eco Impact</span>
                </div>
                <p className="text-2xl font-bold text-[#4A7C59]">12 tons</p>
                <p className="text-xs text-gray-500">Food saved this week</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}