"use client";

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from './AuthContext';
import { Home, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoadingAuth } = useAuth();

  // Извлекаем имя страницы из пути (убираем первый слэш)
  const pageName = pathname ? pathname.substring(1) : "";

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="max-w-md w-full">
        <div className="text-center space-y-6">
          
          {/* Код ошибки 404 */}
          <div className="space-y-2">
            <h1 className="text-7xl font-light text-slate-300">404</h1>
            <div className="h-0.5 w-16 bg-[#4A7C59]/20 mx-auto"></div>
          </div>
          
          {/* Основное сообщение */}
          <div className="space-y-3">
            <h2 className="text-2xl font-medium text-slate-800">
              Page Not Found
            </h2>
            <p className="text-slate-600 leading-relaxed">
              The page <span className="font-medium text-slate-700 italic">"/{pageName}"</span> could not be found in this application.
            </p>
          </div>
          
          {/* Заметка для администратора */}
          {!isLoadingAuth && isAuthenticated && user?.role === 'admin' && (
            <div className="mt-8 p-5 bg-white rounded-2xl border border-orange-100 shadow-sm animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-start space-x-3 text-left">
                <div className="flex-shrink-0 mt-1">
                  <AlertCircle className="w-5 h-5 text-orange-500" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-900">Admin Note</p>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    This page hasn't been implemented yet. You can ask the AI to generate the 
                    <code className="bg-slate-100 px-1 rounded text-orange-700 mx-1">{pageName || 'index'}</code> 
                    component in the chat.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Кнопка возврата */}
          <div className="pt-6">
            <Button 
              onClick={() => router.push('/')}
              variant="outline"
              className="rounded-full px-8 py-6 border-slate-200 hover:bg-[#4A7C59] hover:text-white transition-all duration-300"
            >
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}