"use client";

import React from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from '@/app/lib/AuthContext';
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();

  const isSeller = user?.role === 'admin';

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 h-20 flex items-center">
        <div className="container mx-auto px-4 flex items-center justify-between">
          
          <Link href="/" className="flex items-center gap-2 font-black text-2xl tracking-tighter text-black">
            <div className="w-10 h-10 bg-[#C4E86B] rounded-xl flex items-center justify-center">Q</div>
            <span>QAYTA</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/browse" className={`text-[10px] font-black uppercase tracking-widest ${pathname === "/browse" ? 'text-black' : 'text-gray-400 hover:text-black'}`}>
              Browse
            </Link>
            
            {isAuthenticated && (
              <>
                <Link href="/profile" className={`text-[10px] font-black uppercase tracking-widest ${pathname === "/profile" ? 'text-[#4A7C59]' : 'text-gray-400 hover:text-black'}`}>
                  Профиль
                </Link>
                {isSeller && (
                  <Link href="/seller/dashboard" className={`text-[10px] font-black uppercase tracking-widest ${pathname === "/seller/dashboard" ? 'text-[#4A7C59]' : 'text-gray-400 hover:text-black'}`}>
                    Дашборд
                  </Link>
                )}
              </>
            )}
          </nav>

          <div className="flex items-center gap-4">
            {!isAuthenticated ? (
              <Link href="/login">
                <Button className="bg-black text-white rounded-2xl px-6 h-12 font-black uppercase text-[10px] tracking-widest">
                  Войти
                </Button>
              </Link>
            ) : (
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-black leading-none uppercase">{user?.full_name}</p>
                  <p className="text-[9px] text-[#4A7C59] font-bold uppercase mt-1">{user?.eco_coins} Coins</p>
                </div>
                <Link href="/profile" className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center border-2 border-[#C4E86B]">
                  <User size={18} />
                </Link>
                <button onClick={logout} className="text-gray-300 hover:text-red-500 transition-colors">
                  <LogOut size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1 bg-[#f8f6f3]">{children}</main>
    </div>
  );
}