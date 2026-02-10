"use client";

import React, { useState } from 'react';
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from '../app/lib/AuthContext'; // Используем наш автономный контекст
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
  Search,
  Menu,
  User,
  ShoppingBag,
  Store,
  LogOut,
  ChevronDown,
  MapPin,
  Globe,
  HelpCircle
} from "lucide-react";
import { useI18n } from '@/app/(main)/hooks/useI18n';

interface LayoutProps {
  children: React.ReactNode;
  currentPageName?: string;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Берем всё необходимое из нашего нового AuthContext
  const { user, isAuthenticated, logout, login } = useAuth();
  
  const { 
    t, 
    language, 
    setLanguage, 
    availableLanguages, 
    availableLanguagesLong 
  } = useI18n();

  // Имитируем проверку продавца: если роль admin, показываем дашборд
  const isSeller = user?.role === 'admin';

  const navLinks = [
    { label: t('browse'), page: "browse", icon: Search },
    { label: t('map'), page: "map", icon: MapPin },
    { label: t('how_it_works'), page: "", hash: "how", icon: HelpCircle }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#C4E86B] rounded-xl flex items-center justify-center">
                <span className="text-2xl font-bold text-[#2E2E2E]">Q</span>
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">QAYTA</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map(link => (
                <Link
                  key={link.page + (link.hash || '')}
                  href={link.page === "" ? "/" + link.hash : `/${link.page}${link.hash || ''}`}
                  className={`text-gray-600 hover:text-[#4A7C59] transition-colors font-medium ${
                    pathname === `/${link.page}` ? 'text-[#2E2E2E] font-bold' : ''
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {isSeller ? (
                <Link
                  href="/seller-dashboard"
                  className="text-gray-600 hover:text-[#4A7C59] transition-colors font-medium flex items-center gap-1"
                >
                  <Store className="w-4 h-4" />
                  Дашборд
                </Link>
              ) : (
                <Link
                  href="/become-a-seller"
                  className="text-gray-600 hover:text-[#4A7C59] transition-colors font-medium"
                >
                  Стать продавцом
                </Link>
              )}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Globe className="w-5 h-5 text-gray-600" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {availableLanguages.map((lang: string) => (
                    <DropdownMenuItem 
                      key={lang} 
                      onClick={() => setLanguage(lang as any)} 
                    >
                      {availableLanguagesLong[lang as keyof typeof availableLanguagesLong]}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {isAuthenticated && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-[#C4E86B]/20 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-[#2E2E2E]" />
                      </div>
                      <span className="hidden sm:inline text-gray-700">
                        {user.full_name?.split(' ')[0]}
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-3 py-2">
                      <p className="font-medium text-gray-900">{user.full_name}</p>
                      <p className="text-xs text-[#4A7C59] font-bold">{user.eco_coins} Eco-Coins</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push("/profile")}>
                      <User className="w-4 h-4 mr-2" /> Профиль
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/my-orders")}>
                      <ShoppingBag className="w-4 h-4 mr-2" /> Заказы
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-red-600">
                      <LogOut className="w-4 h-4 mr-2" /> Выход
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  onClick={login}
                  className="bg-[#C4E86B] hover:bg-lime-300 text-[#2E2E2E] rounded-full px-6"
                >
                  Вход
                </Button>
              )}

              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <nav className="flex flex-col gap-4 mt-8">
                    {navLinks.map(link => (
                      <Link
                        key={link.page}
                        href={`/${link.page}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100"
                      >
                        <link.icon className="w-5 h-5 text-gray-500" />
                        <span className="font-medium">{link.label}</span>
                      </Link>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-gray-900 text-white py-12 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">© 2026 QAYTA. Эко-система будущего.</p>
        </div>
      </footer>
    </div>
  );
}