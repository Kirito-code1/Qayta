"use client";

import React, { useState } from 'react';
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from '@/app/lib/AuthContext'; 
import { useLanguage } from '@/app/lib/LanguageContext'; // Импорт нашего контекста
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Search, Menu, User, ShoppingBag, Store, LogOut,
  ChevronDown, MapPin, Globe, HelpCircle
} from "lucide-react";

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const { lang, setLang, t } = useLanguage(); // Используем наш переводчик
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isSeller = user?.role === 'admin';

  const langMap: Record<string, { label: string, flag: string }> = {
    ru: { label: 'Русский', flag: '🇷🇺' },
    uz: { label: "O'zbekcha", flag: '🇺🇿' },
    en: { label: 'English', flag: '🇺🇸' }
  };

  const navLinks = [
    { label: t('browse'), page: "/browse", icon: Search },
    { label: t('map'), page: "/map", icon: MapPin },
    { label: t('how_it_works'), page: "/how", icon: HelpCircle }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-[100]">
        <div className="container mx-auto px-4 h-16 md:h-24 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-11 h-11 bg-[#C4E86B] rounded-2xl flex items-center justify-center shadow-lg shadow-[#C4E86B]/20 group-hover:rotate-6 transition-transform text-[#2E2E2E] text-2xl font-black">
              Q
            </div>
            <span className="text-xl font-black text-gray-900 hidden sm:block tracking-tighter italic uppercase">Qayta</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link key={link.page} href={link.page} className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] transition-all ${pathname === link.page ? 'bg-black text-white shadow-xl shadow-black/10' : 'text-gray-400 hover:text-black hover:bg-gray-50'}`}>
                {link.label}
              </Link>
            ))}
            {isSeller && (
              <Link href="/seller/dashboard" className="ml-4 flex items-center gap-2 px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] text-[#4A7C59] bg-[#C4E86B]/10 border border-[#C4E86B]/20">
                <Store className="w-4 h-4" /> {t('dashboard')}
              </Link>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            
            {/* LANGUAGE SELECTOR */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-2xl gap-3 px-4 h-12 border border-transparent hover:border-gray-100 bg-gray-50/50 transition-all">
                  <span className="text-xl leading-none">{langMap[lang].flag}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest hidden lg:inline">{langMap[lang].label}</span>
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-[2rem] p-3 bg-white/90 backdrop-blur-md shadow-2xl border-none w-48 mt-2 animate-in fade-in zoom-in duration-200">
                <div className="px-3 py-2 mb-1 text-[8px] font-black uppercase text-gray-400 tracking-widest">{t('select_lang')}</div>
                {Object.entries(langMap).map(([code, { label, flag }]) => (
                  <DropdownMenuItem key={code} onClick={() => setLang(code as any)} className="rounded-xl font-black uppercase text-[10px] py-3 px-4 cursor-pointer focus:bg-[#C4E86B] flex items-center gap-3 mb-1 transition-colors">
                    <span className="text-lg">{flag}</span>
                    <span className="flex-1">{label}</span>
                    {lang === code && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* USER BLOCK */}
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-3 px-3 py-6 rounded-2xl hover:bg-gray-50 transition-all outline-none">
                    <div className="w-9 h-9 bg-[#C4E86B] rounded-xl flex items-center justify-center shadow-md font-black uppercase">{user.full_name?.charAt(0)}</div>
                    <div className="hidden lg:flex flex-col items-start leading-none text-left">
                      <span className="text-[10px] font-black uppercase tracking-tighter">{user.full_name?.split(' ')[0]}</span>
                      <span className="text-[8px] font-bold text-[#4A7C59] uppercase mt-1 tracking-widest">{user.eco_coins || 0} {t('eco_coins')}</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-300" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 rounded-[2rem] border-none shadow-2xl p-3 mt-2 bg-white z-[110]">
                  <div className="px-4 py-4 mb-2 bg-gray-50 rounded-[1.5rem]">
                    <p className="font-black uppercase text-xs tracking-tight">{user.full_name}</p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">{user.email}</p>
                  </div>
                  <DropdownMenuItem onClick={() => router.push("/profile")} className="rounded-xl py-3 font-black uppercase text-[10px] tracking-widest focus:bg-gray-50 cursor-pointer"><User className="w-4 h-4 mr-3 text-gray-400" /> {t('profile')}</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/my-orders")} className="rounded-xl py-3 font-black uppercase text-[10px] tracking-widest focus:bg-gray-50 cursor-pointer"><ShoppingBag className="w-4 h-4 mr-3 text-gray-400" /> {t('orders')}</DropdownMenuItem>
                  <DropdownMenuSeparator className="my-2 bg-gray-50" />
                  <DropdownMenuItem onClick={logout} className="rounded-xl py-3 font-black uppercase text-[10px] tracking-widest text-red-500 focus:bg-red-50 cursor-pointer"><LogOut className="w-4 h-4 mr-3" /> {t('logout')}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => router.push('/login')} className="bg-black hover:bg-[#4A7C59] text-white rounded-2xl px-8 h-12 font-black uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-black/10 transition-all">
                {t('login')}
              </Button>
            )}

            {/* Mobile Nav */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden rounded-2xl"><Menu className="w-6 h-6" /></Button>
              </SheetTrigger>
              <SheetContent side="right" className="rounded-l-[3rem] p-8 border-none shadow-2xl bg-white w-[300px]">
                <div className="flex flex-col h-full">
                  <div className="text-2xl font-black uppercase italic mb-12 tracking-tighter">Меню</div>
                  <nav className="flex flex-col gap-3 flex-1">
                    {navLinks.map(link => (
                      <Link key={link.page} href={link.page} onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-4 p-5 rounded-[1.8rem] transition-all ${pathname === link.page ? 'bg-[#C4E86B] text-black shadow-lg shadow-[#C4E86B]/30' : 'bg-gray-50 text-gray-500'}`}>
                        <link.icon className="w-5 h-5" />
                        <span className="font-black uppercase text-[10px] tracking-widest">{link.label}</span>
                      </Link>
                    ))}
                    <div className="h-px bg-gray-100 my-4" />
                    <button onClick={() => { setMobileMenuOpen(false); router.push(isAuthenticated ? '/profile' : '/login'); }} className="flex items-center gap-4 p-5 rounded-[1.8rem] bg-black text-white">
                      <User className="w-5 h-5" />
                      <span className="font-black uppercase text-[10px] tracking-widest">{isAuthenticated ? t('profile') : t('login')}</span>
                    </button>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1 relative bg-[#FBFBFB]">{children}</main>

      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="container mx-auto px-4 flex flex-col items-center">
          <div className="text-xl font-black uppercase italic mb-4">Qayta<span className="text-[#C4E86B]">.</span></div>
          <p className="text-gray-400 text-[9px] font-black uppercase tracking-[0.3em]">© 2026 Сделано с заботой о будущем</p>
        </div>
      </footer>
    </div>
  );
}