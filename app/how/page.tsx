"use client";

import React from 'react';
import { 
  Search, 
  ShoppingBasket, 
  Truck, 
  Leaf, 
  ArrowRight, 
  ChevronRight,
  CheckCircle2,
  Clock,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HowItWorksPage() {
  const steps = [
    {
      id: "01",
      title: "Найдите продукты поблизости",
      description: "Откройте нашу AI-карту и найдите свежие продукты в магазинах и кафе вашего района, которые скоро могут быть списаны.",
      icon: <Search className="w-8 h-8 text-[#4A7C59]" />,
      color: "bg-emerald-50",
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "02",
      title: "Забронируйте со скидкой до 70%",
      description: "Выберите нужные товары и оформите быстрый заказ через приложение. Вы экономите деньги и спасаете еду от утилизации.",
      icon: <ShoppingBasket className="w-8 h-8 text-[#C4E86B]" />,
      color: "bg-lime-50",
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "03",
      title: "Заберите заказ или выберите доставку",
      description: "Приходите в магазин в указанное время или доверьте это нашим курьерам. Никаких очередей — ваш пакет уже собран.",
      icon: <Truck className="w-8 h-8 text-[#2E2E2E]" />,
      color: "bg-slate-50",
      image: "https://images.unsplash.com/photo-1586769852044-692d6e3703f0?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "04",
      title: "Получайте Eco-Coins",
      description: "За каждый спасенный заказ мы начисляем бонусы, которые можно потратить на новые покупки или благотворительность.",
      icon: <Leaf className="w-8 h-8 text-emerald-600" />,
      color: "bg-green-50",
      image: "https://img.freepik.com/free-vector/plant-growth-from-coin_78370-4507.jpg?semt=ais_hybrid&w=740&q=80"
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden bg-[#f8f6f3]">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-tight mb-6">
              Как работает <span className="text-[#4A7C59]">QAYTA</span>?
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              Мы создали мост между сознательными потребителями и магазинами, чтобы ни один продукт не пропал зря. Это просто, выгодно и полезно для планеты.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/browse">
                <Button className="bg-[#4A7C59] hover:bg-[#3d6b4a] text-white px-8 py-7 rounded-2xl text-lg font-bold shadow-lg">
                  Начать покупки
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
        {/* Декоративный элемент фона */}
        <div className="absolute right-[-10%] top-0 w-1/2 h-full bg-[#C4E86B]/20 rounded-full blur-3xl -z-0" />
      </section>

      {/* Steps Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="space-y-32">
            {steps.map((step, index) => (
              <div key={step.id} className={`flex flex-col md:items-center gap-12 ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
                {/* Text Content */}
                <div className="flex-1 space-y-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-full shadow-sm">
                    <span className="text-2xl font-black text-[#4A7C59]">{step.id}</span>
                    <div className="w-1 h-1 bg-gray-300 rounded-full" />
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Шаг процесса</span>
                  </div>
                  <h2 className="text-4xl font-black text-gray-900">{step.title}</h2>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-gray-700 font-medium">
                      <CheckCircle2 className="w-5 h-5 text-[#4A7C59]" /> Безопасно и проверено
                    </li>
                    <li className="flex items-center gap-3 text-gray-700 font-medium">
                      <CheckCircle2 className="w-5 h-5 text-[#4A7C59]" /> Экономия времени
                    </li>
                  </ul>
                </div>

                {/* Image / Visual */}
                <div className="flex-1 relative group">
                  <div className={`absolute inset-0 ${step.color} rounded-[40px] transform rotate-3 transition-transform group-hover:rotate-0 duration-500`} />
                  <div className="relative overflow-hidden rounded-[40px] aspect-video md:aspect-square shadow-2xl">
                    <img 
                      src={step.image} 
                      alt={step.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="absolute bottom-6 left-6 p-4 bg-white/90 backdrop-blur rounded-2xl">
                      {step.icon}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-gray-50 py-20 border-y border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center">
                <Clock className="w-8 h-8 text-[#4A7C59]" />
              </div>
              <h3 className="text-xl font-bold">Свежесть гарантирована</h3>
              <p className="text-gray-500">Все товары проходят проверку качества перед публикацией в приложении.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-[#4A7C59]" />
              </div>
              <h3 className="text-xl font-bold">Безопасная оплата</h3>
              <p className="text-gray-500">Платите онлайн или при получении. Мы защищаем ваши данные.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center">
                <Leaf className="w-8 h-8 text-[#4A7C59]" />
              </div>
              <h3 className="text-xl font-bold">Эко-вклад</h3>
              <p className="text-gray-500">Следите за своим прогрессом и количеством CO2, которое вы помогли сэкономить.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="bg-[#2E2E2E] rounded-[60px] p-12 md:p-24 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#C4E86B] rounded-full blur-[120px] opacity-20" />
            <div className="max-w-3xl mx-auto relative z-10">
              <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
                Готовы сделать первый шаг к осознанности?
              </h2>
              <p className="text-xl text-gray-400 mb-12">
                Присоединяйтесь к тысячам людей в Узбекистане, которые уже спасают еду и экономят бюджет каждый день.
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <Link href="/browse">
                  <Button className="bg-[#C4E86B] hover:bg-lime-300 text-[#2E2E2E] px-10 py-8 rounded-2xl text-xl font-bold">
                    Найти продукты
                  </Button>
                </Link>
                <Link href="/become-a-seller">
                  <Button variant="outline" className="border-gray-600 text-gray-600 hover:bg-white hover:text-black px-10 py-8 rounded-2xl text-xl font-bold">
                    Стать партнером
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}