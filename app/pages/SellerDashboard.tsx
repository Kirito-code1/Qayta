"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  mockUser, 
  mockProducts, 
  mockOrders, 
  Product, 
  Order 
} from "../lib/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Package,
  ShoppingBag,
  DollarSign,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  Store,
  Lock
} from "lucide-react";
import { motion } from "framer-motion";

type OrderStatus = 'pending' | 'completed' | 'cancelled' | 'active' | 'confirmed';

const orderStatusConfig: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: "Ожидает", color: "bg-yellow-100 text-yellow-700", icon: Clock },
  active: { label: "В работе", color: "bg-blue-100 text-blue-700", icon: Clock },
  confirmed: { label: "Подтвержден", color: "bg-indigo-100 text-indigo-700", icon: CheckCircle },
  completed: { label: "Завершен", color: "bg-green-100 text-green-700", icon: CheckCircle },
  cancelled: { label: "Отменен", color: "bg-red-100 text-red-700", icon: XCircle }
};

export default function SellerDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("products");

  // --- ЗАЩИТА ОТ NULL ---
  // Если юзера нет, показываем экран блокировки
  if (!mockUser) {
    return (
      <div className="min-h-screen bg-[#f8f6f3] flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center mx-auto mb-6 text-[#4A7C59]">
            <Lock size={40} />
          </div>
          <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-4">Доступ закрыт</h2>
          <p className="text-gray-500 text-sm font-medium mb-8">
            Чтобы управлять своими товарами и видеть заказы, необходимо войти в аккаунт.
          </p>
          <Link href="/login" className="w-full inline-block">
            <Button className="w-full bg-black text-white h-14 rounded-2xl font-bold uppercase text-[10px] tracking-widest">
              Войти в систему
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Безопасное получение данных
  const products = mockProducts || [];
  const orders = mockOrders || [];

  const totalRevenue = orders
    .filter(o => o.status === 'completed')
    .reduce((sum, o) => sum + (o.total_price || 0), 0);

  const handleDeleteProduct = (id: string) => {
    // Здесь должна быть логика удаления из localStorage
    alert(`Товар ${id} будет удален`);
  };

  return (
    <div className="min-h-screen bg-[#f8f6f3] py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Шапка дашборда */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-black uppercase italic tracking-tighter text-gray-900">Дашборд</h1>
            <p className="text-gray-500 flex items-center gap-2 mt-1 text-[10px] font-black uppercase tracking-widest">
              <Store size={14} className="text-[#C4E86B]" /> 
              {mockUser?.full_name || "Пользователь"} • {mockUser?.city || "Город не указан"}
            </p>
          </div>
          <Link href="/add-product">
            <Button className="bg-black hover:bg-[#4A7C59] text-white px-8 h-14 rounded-2xl shadow-lg transition-all active:scale-95 text-[10px] font-black uppercase tracking-widest">
              <Plus className="w-5 h-5 mr-2 text-[#C4E86B]" /> Добавить товар
            </Button>
          </Link>
        </div>

        {/* Сетка статистики */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard label="Товары" value={products.length} icon={Package} color="text-blue-600 bg-blue-50" />
          <StatCard label="Заказы" value={orders.length} icon={ShoppingBag} color="text-purple-600 bg-purple-50" />
          <StatCard label="Eco Coins" value={mockUser?.eco_coins ?? 0} icon={CheckCircle} color="text-amber-600 bg-amber-50" />
          <StatCard label="Выручка" value={`${totalRevenue.toLocaleString()} сум`} icon={DollarSign} color="text-green-600 bg-green-50" />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white/50 backdrop-blur border-none p-1 rounded-2xl inline-flex shadow-sm">
            <TabsTrigger value="products" className="rounded-xl px-8 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-black data-[state=active]:text-white transition-all">
              Мои товары
            </TabsTrigger>
            <TabsTrigger value="orders" className="rounded-xl px-8 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-black data-[state=active]:text-white transition-all">
              Заказы
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <div className="grid gap-4">
              {products.length === 0 ? (
                <EmptyState message="У вас пока нет добавленных товаров" />
              ) : (
                products.map((p) => (
                  <ProductItem key={p.id} product={p} onDelete={() => handleDeleteProduct(p.id)} />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="orders">
            <div className="grid gap-4">
              {orders.length === 0 ? (
                <EmptyState message="Заказов пока не поступало" />
              ) : (
                orders.map((o) => (
                  <OrderItem 
                    key={o.id} 
                    order={o} 
                    onStatusChange={(val) => console.log(o.id, val)} 
                  />
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// --- ВСПОМОГАТЕЛЬНЫЕ КОМПОНЕНТЫ С ЗАЩИТОЙ ---

function StatCard({ label, value, icon: Icon, color }: any) {
  return (
    <motion.div whileHover={{ y: -5 }}>
      <Card className="border-0 shadow-sm rounded-[2rem] overflow-hidden">
        <CardContent className="p-6 flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}>
            <Icon size={20} />
          </div>
          <div>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-xl font-black text-gray-900">{value}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ProductItem({ product, onDelete }: { product: Product, onDelete: () => void }) {
  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-all rounded-[1.5rem] overflow-hidden bg-white">
      <CardContent className="p-4 flex items-center gap-4">
        <div className="w-14 h-14 rounded-xl bg-gray-50 overflow-hidden shrink-0 border border-gray-100">
          <img src={product.image_url || product.image} className="w-full h-full object-cover" alt="" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm text-gray-900 truncate uppercase">{product.title || product.name}</h3>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">
            {product.discounted_price?.toLocaleString()} сум <span className="mx-1 text-gray-200">•</span> Сток: {product.quantity_available} шт.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/add-product?edit=${product.id}`}>
            <Button variant="outline" size="icon" className="w-10 h-10 rounded-xl border-gray-100 text-gray-400 hover:text-[#C4E86B] hover:bg-black transition-all">
              <Eye size={16} />
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onDelete}
            className="w-10 h-10 rounded-xl border-gray-100 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function OrderItem({ order, onStatusChange }: { order: Order; onStatusChange: (s: string) => void }) {
  const status = orderStatusConfig[order.status] || orderStatusConfig.pending;
  const StatusIcon = status.icon;

  return (
    <Card className="border-0 shadow-sm rounded-[1.5rem] overflow-hidden bg-white">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gray-50 overflow-hidden shrink-0">
              <img src={order.product_image} className="w-full h-full object-cover" alt="" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-900 uppercase">{order.product_title}</h3>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">
                {order.buyer_name} <span className="mx-1 text-gray-200">•</span> ID: {order.id.slice(0, 8)}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between md:justify-end gap-6">
            <div className="text-right">
              <p className="text-[9px] text-gray-300 font-black uppercase tracking-widest mb-1">Итого</p>
              <p className="text-sm font-black text-gray-900">{order.total_price?.toLocaleString()} сум</p>
            </div>
            <Select defaultValue={order.status} onValueChange={onStatusChange}>
              <SelectTrigger className={`w-36 rounded-xl border-0 font-black text-[9px] uppercase tracking-widest h-10 ${status.color}`}>
                <div className="flex items-center gap-2">
                  <StatusIcon size={12} />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-none shadow-2xl bg-white">
                {Object.keys(orderStatusConfig).map(key => (
                  <SelectItem key={key} value={key} className="text-[10px] font-black uppercase tracking-widest py-3 focus:bg-[#C4E86B] focus:text-black">
                    {orderStatusConfig[key].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-24 bg-white/40 rounded-[3rem] border-2 border-dashed border-gray-100">
      <Package className="w-12 h-12 text-gray-200 mx-auto mb-4" />
      <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">{message}</p>
    </div>
  );
}