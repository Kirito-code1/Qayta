"use client";

import React from 'react';
import { motion } from "framer-motion";
import { Search, ShoppingCart, Smile, Leaf, LucideIcon } from "lucide-react";

// Типизация для шага
interface Step {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
}

const steps: Step[] = [
  {
    icon: Search,
    title: "Discover Deals",
    description: "Browse products from local stores, restaurants, and brands at discounted prices.",
    color: "bg-blue-100 text-blue-600"
  },
  {
    icon: ShoppingCart,
    title: "Place Your Order",
    description: "Reserve your items online and choose pickup or delivery options.",
    color: "bg-purple-100 text-purple-600"
  },
  {
    icon: Smile,
    title: "Enjoy & Save",
    description: "Get quality products at a fraction of the price. More money in your pocket!",
    color: "bg-amber-100 text-amber-600"
  },
  {
    icon: Leaf,
    title: "Make an Impact",
    description: "Every purchase helps reduce waste and supports sustainable consumption.",
    color: "bg-green-100 text-green-600"
  }
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            How It Works
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="text-gray-600 max-w-2xl mx-auto"
          >
            Join thousands of smart shoppers saving money while helping the planet
          </motion.p>
        </div>
        
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Линия-коннектор (только для десктопа) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gray-100" aria-hidden="true" />
              )}
              
              <div className="relative text-center z-10">
                {/* Иконка */}
                <div className={`w-24 h-24 ${step.color} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl transform group-hover:rotate-6 transition-transform`}>
                  <step.icon className="w-10 h-10" />
                </div>

                {/* Порядковый номер */}
                <div className="absolute top-0 right-1/2 translate-x-12 -translate-y-2 w-8 h-8 bg-[#4A7C59] text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md border-2 border-white">
                  {index + 1}
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed px-4 md:px-0">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}