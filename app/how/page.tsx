"use client";

import React from 'react';
import { useLanguage } from '@/app/lib/LanguageContext';
import { 
  Search, 
  ShoppingBasket, 
  Truck, 
  Leaf, 
  ChevronRight,
  CheckCircle2,
  Clock,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HowItWorksPage() {
  const { t } = useLanguage();

  const steps = [
    {
      id: "01",
      title: (t('steps') as any).s1_t,
      description: (t('steps') as any).s1_d,
      icon: <Search className="w-8 h-8 text-[#4A7C59]" />,
      color: "bg-emerald-50",
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "02",
      title: (t('steps') as any).s2_t,
      description: (t('steps') as any).s2_d,
      icon: <ShoppingBasket className="w-8 h-8 text-[#C4E86B]" />,
      color: "bg-lime-50",
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "03",
      title: (t('steps') as any).s3_t,
      description: (t('steps') as any).s3_d,
      icon: <Truck className="w-8 h-8 text-[#2E2E2E]" />,
      color: "bg-slate-50",
      image: "https://images.unsplash.com/photo-1586769852044-692d6e3703f0?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "04",
      title: (t('steps') as any).s4_t,
      description: (t('steps') as any).s4_d,
      icon: <Leaf className="w-8 h-8 text-emerald-600" />,
      color: "bg-green-50",
      image: "https://img.freepik.com/free-vector/plant-growth-from-coin_78370-4507.jpg?semt=ais_hybrid&w=740&q=80"
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden bg-[#f8f6f3]">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <h1 className="text-6xl md:text-8xl font-black text-gray-900 leading-[0.9] mb-8 uppercase italic tracking-tighter">
              {t('how_hero_title').split('QAYTA')[0]}
              <span className="text-[#4A7C59]">QAYTA</span>
              {t('how_hero_title').split('QAYTA')[1]}?
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-10 font-medium max-w-2xl">
              {t('how_hero_sub')}
            </p>
            <Link href="/browse">
              <Button className="h-20 bg-black hover:bg-[#4A7C59] text-white px-10 rounded-[2rem] text-lg font-black uppercase tracking-widest shadow-2xl transition-all active:scale-95">
                {t('how_start_btn')}
                <ChevronRight className="ml-2 w-6 h-6" />
              </Button>
            </Link>
          </div>
        </div>
        <div className="absolute right-[-10%] top-0 w-1/2 h-full bg-[#C4E86B]/20 rounded-full blur-[120px] -z-0" />
      </section>

      {/* Steps Section */}
      <section className="py-32">
        <div className="container mx-auto px-4">
          <div className="space-y-40">
            {steps.map((step, index) => (
              <div key={step.id} className={`flex flex-col md:items-center gap-16 ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
                <div className="flex-1 space-y-8">
                  <div className="inline-flex items-center gap-4 px-6 py-3 bg-white border border-gray-100 rounded-full shadow-sm">
                    <span className="text-3xl font-black text-[#4A7C59]">{step.id}</span>
                    <div className="w-1.5 h-1.5 bg-gray-200 rounded-full" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{t('how_step_label')}</span>
                  </div>
                  <h2 className="text-5xl font-black text-gray-900 leading-tight uppercase italic tracking-tighter">{step.title}</h2>
                  <p className="text-xl text-gray-600 leading-relaxed font-medium">
                    {step.description}
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-4 text-gray-900 font-black uppercase text-xs tracking-widest">
                      <CheckCircle2 className="w-6 h-6 text-[#C4E86B]" /> {t('how_check_safe')}
                    </li>
                    <li className="flex items-center gap-4 text-gray-900 font-black uppercase text-xs tracking-widest">
                      <CheckCircle2 className="w-6 h-6 text-[#C4E86B]" /> {t('how_check_time')}
                    </li>
                  </ul>
                </div>

                <div className="flex-1 relative group">
                  <div className={`absolute inset-0 ${step.color} rounded-[3rem] transform rotate-3 transition-transform group-hover:rotate-0 duration-700`} />
                  <div className="relative overflow-hidden rounded-[3.5rem] aspect-square shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)]">
                    <img 
                      src={step.image} 
                      alt={step.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/5" />
                    <div className="absolute bottom-8 left-8 p-6 bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-2xl">
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
      <section className="bg-gray-50 py-32 border-y border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center border border-gray-100">
                <Clock className="w-10 h-10 text-[#4A7C59]" />
              </div>
              <h3 className="text-2xl font-black uppercase italic tracking-tighter">{t('how_trust_fresh')}</h3>
              <p className="text-gray-500 font-medium leading-relaxed">{t('how_trust_fresh_txt')}</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center border border-gray-100">
                <ShieldCheck className="w-10 h-10 text-[#4A7C59]" />
              </div>
              <h3 className="text-2xl font-black uppercase italic tracking-tighter">{t('how_trust_pay')}</h3>
              <p className="text-gray-500 font-medium leading-relaxed">{t('how_trust_pay_txt')}</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center border border-gray-100">
                <Leaf className="w-10 h-10 text-[#4A7C59]" />
              </div>
              <h3 className="text-2xl font-black uppercase italic tracking-tighter">{t('how_trust_eco')}</h3>
              <p className="text-gray-500 font-medium leading-relaxed">{t('how_trust_eco_txt')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32">
        <div className="container mx-auto px-4">
          <div className="bg-[#1A1A1A] rounded-[4rem] p-12 md:p-32 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#C4E86B] rounded-full blur-[150px] opacity-10" />
            <div className="max-w-4xl mx-auto relative z-10">
              <h2 className="text-5xl md:text-8xl font-black mb-10 leading-[0.9] uppercase italic tracking-tighter">
                {t('how_cta_title')}
              </h2>
              <p className="text-xl text-gray-400 mb-16 max-w-2xl mx-auto font-medium">
                {t('how_cta_sub')}
              </p>
              <div className="flex flex-wrap justify-center gap-8">
                <Link href="/browse">
                  <Button className="h-20 bg-[#C4E86B] hover:bg-white text-black px-12 rounded-[2rem] text-lg font-black uppercase tracking-widest transition-all active:scale-95">
                    {t('how_start_btn')}
                  </Button>
                </Link>
                <Link href="/become-a-seller">
                  <Button variant="outline" className="h-20 border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800 px-12 rounded-[2rem] text-lg font-black uppercase tracking-widest transition-all">
                    {t('how_cta_seller')}
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