"use client";

import React from 'react';
import { mockOrders, Order } from "../lib/mockData";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Store,
  Calendar,
  ShoppingBag,
  Truck,
  ArrowRight
} from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale"; // Добавлена локализация
import { motion } from "framer-motion";

// Конфигурация статусов с поддержкой всех ключей из mockData
const statusConfig: Record<string, any> = {
  pending: { label: "Ожидает", color: "bg-yellow-50 text-yellow-700 border-yellow-200", icon: Clock },
  confirmed: { label: "Подтвержден", color: "bg-blue-50 text-blue-700 border-blue-200", icon: CheckCircle },
  active: { label: "В работе", color: "bg-indigo-50 text-indigo-700 border-indigo-200", icon: Package },
  completed: { label: "Завершен", color: "bg-green-50 text-green-700 border-green-200", icon: CheckCircle },
  cancelled: { label: "Отменен", color: "bg-red-50 text-red-700 border-red-200", icon: XCircle }
};

export default function MyOrders() {
  // Используем данные из заглушек
  const orders = mockOrders;
  const isLoading = false;

  return (
    <div className="min-h-screen bg-[#f8f6f3] py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <header className="mb-10">
            <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Мои заказы</h1>
            <p className="text-gray-500 font-medium">История ваших покупок и статус текущих бронирований</p>
          </header>
          
          {orders.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100 shadow-sm"
            >
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-12 h-12 text-gray-200" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Заказов пока нет</h3>
              <p className="text-gray-400 mb-8 max-w-xs mx-auto">Начните спасать планету и экономить деньги прямо сейчас!</p>
              <Link href="/browse">
                <Button className="bg-[#4A7C59] hover:bg-[#3d6b4a] px-8 py-6 rounded-2xl font-bold text-lg transition-all active:scale-95 shadow-lg shadow-green-100">
                  Перейти в каталог
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {orders.map((order: Order, index: number) => {
                const status = statusConfig[order.status] || statusConfig.pending;
                const StatusIcon = status.icon;
                
                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-1 rounded-[2rem] border-0 shadow-sm hover:shadow-xl hover:shadow-gray-200/40 transition-all group overflow-hidden bg-white">
                      <div className="flex flex-col sm:flex-row p-6 gap-6 items-center sm:items-start">
                        {/* Изображение товара */}
                        <div className="w-28 h-28 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                          {order.product_image ? (
                            <img
                              src={order.product_image}
                              alt={order.product_title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-10 h-10 text-gray-200" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 text-center sm:text-left space-y-3">
                          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-3">
                            <div>
                              <h3 className="text-xl font-black text-gray-900 leading-tight mb-1">{order.product_title}</h3>
                              <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                <Store className="w-3.5 h-3.5" />
                                <span>{order.buyer_name} (Продавец)</span>
                              </div>
                            </div>
                            <Badge className={`${status.color} border py-1 px-4 rounded-full text-[10px] font-black uppercase tracking-widest`}>
                              <StatusIcon className="w-3 h-3 mr-1.5" />
                              {status.label}
                            </Badge>
                          </div>
                          
                          <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-sm text-gray-600 font-medium bg-gray-50 p-3 rounded-xl">
                            <div className="flex items-center gap-1.5">
                              <Package className="w-4 h-4 text-gray-400" />
                              <span>{order.quantity} шт.</span>
                            </div>
                            
                            <div className="flex items-center gap-1.5 border-l border-gray-200 pl-4">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span>{format(new Date(order.created_date), "d MMM", { locale: ru })}</span>
                            </div>
                            
                            <div className="flex items-center gap-1.5 border-l border-gray-200 pl-4">
                              <ShoppingBag className="w-4 h-4 text-gray-400" />
                              <span className="capitalize">Самовывоз</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="sm:text-right flex flex-row sm:flex-col items-baseline sm:items-end gap-2 sm:gap-0 pt-2 sm:pt-0 min-w-[100px] border-t sm:border-0 w-full sm:w-auto justify-center">
                          <p className="text-3xl font-black text-[#4A7C59]">
                            {order.total_price}₽
                          </p>
                          <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                            ID: {order.id.slice(0, 8)}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}