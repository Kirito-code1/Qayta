"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from "framer-motion";
import { format, differenceInDays } from "date-fns";
import { Clock, MapPin, Store, Percent, LucideIcon } from "lucide-react";

// Импортируем ваши UI компоненты
import { Badge } from "@/components/ui/badge";

import { Product, DiscountReason } from "../lib/mockData";

interface ProductCardProps {
  product: Product;
  index?: number;
}

const discountReasonLabels: Record<DiscountReason, string> = {
  expiring_soon: "Expiring Soon",
  damaged_packaging: "Packaging Imperfect",
  overstock: "Overstock",
  outdated_collection: "Last Season",
  seasonal: "Seasonal",
  other: "Special Deal"
};

const discountReasonColors: Record<DiscountReason, string> = {
  expiring_soon: "bg-amber-100 text-amber-700 border-amber-200",
  damaged_packaging: "bg-blue-100 text-blue-700 border-blue-200",
  overstock: "bg-purple-100 text-purple-700 border-purple-200",
  outdated_collection: "bg-pink-100 text-pink-700 border-pink-200",
  seasonal: "bg-teal-100 text-teal-700 border-teal-200",
  other: "bg-gray-100 text-gray-700 border-gray-200"
};

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  // Расчет процента скидки
  const discount = Math.round(
    ((product.original_price - product.discounted_price) / product.original_price) * 100
  );
  
  // Расчет дней до истечения срока
  const daysUntilExpiry = product.expiration_date 
    ? differenceInDays(new Date(product.expiration_date), new Date())
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      viewport={{ once: true }}
    >
      <Link 
        href={`/products/${product.id}`}
        className="group block bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 hover:-translate-y-1"
      >
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <Store className="w-16 h-16 text-gray-300" />
            </div>
          )}
          
          {/* Discount badge */}
          <div className="absolute top-4 left-4 z-10">
            <div className="bg-[#4A7C59] text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
              <Percent className="w-3.5 h-3.5" />
              {discount}% OFF
            </div>
          </div>
          
          {/* Expiry warning */}
          {daysUntilExpiry !== null && daysUntilExpiry <= 3 && daysUntilExpiry >= 0 && (
            <div className="absolute top-4 right-4 z-10">
              <div className="bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {daysUntilExpiry === 0 ? "Today" : `${daysUntilExpiry}d left`}
              </div>
            </div>
          )}
          
          {/* Quantity left */}
          {product.quantity_available <= 5 && product.quantity_available > 0 && (
            <div className="absolute bottom-4 left-4 right-4 z-10">
              <div className="bg-black/70 backdrop-blur-sm text-white text-center py-2 rounded-xl text-sm font-medium">
                Only {product.quantity_available} left!
              </div>
            </div>
          )}
        </div>
        
        <div className="p-5 flex flex-col h-full">
          {/* Reason Badge */}
          <div className="mb-3">
            <Badge 
              variant="outline" 
              className={`${discountReasonColors[product.discount_reason] || discountReasonColors.other} border font-medium`}
            >
              {discountReasonLabels[product.discount_reason] || discountReasonLabels.other}
            </Badge>
          </div>
          
          <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-[#4A7C59] transition-colors min-h-[3.5rem]">
            {product.title}
          </h3>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Store className="w-4 h-4 text-gray-400" />
              <span className="truncate font-medium">{product.seller_name}</span>
            </div>
            
            {product.location && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="truncate">{product.location}</span>
              </div>
            )}
          </div>
          
          <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#4A7C59]">
                ${product.discounted_price.toFixed(2)}
              </span>
              <span className="text-gray-400 line-through text-sm">
                ${product.original_price.toFixed(2)}
              </span>
            </div>
          </div>
          
          {product.expiration_date && daysUntilExpiry! > 3 && (
            <p className="text-[10px] uppercase tracking-wider text-gray-400 mt-3 font-semibold">
              Best by {format(new Date(product.expiration_date), "MMM d, yyyy")}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}