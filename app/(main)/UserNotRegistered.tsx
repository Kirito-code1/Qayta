"use client";

import React from 'react';
import { AlertTriangle, LogOut, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from './hooks/useI18n';
const UserNotRegisteredError = () => {
  const { t } = useI18n();

  // Примечание: Вам нужно будет добавить эти ключи в translations в hooks/useI18n.ts
  // Если их там нет, хук просто вернет название ключа.
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gradient-to-b from-white to-slate-50 px-4">
      <div className="max-w-md w-full p-8 bg-white rounded-3xl shadow-xl border border-slate-100">
        <div className="text-center">
          {/* Иконка */}
          <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-2xl bg-orange-100 text-orange-600">
            <AlertTriangle className="w-10 h-10" />
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            {t('access_restricted' as any) || "Access Restricted"}
          </h1>
          
          <p className="text-slate-600 mb-8">
            {t('not_registered_desc' as any) || "You are not registered to use this application. Please contact the administrator to request access."}
          </p>

          {/* Список рекомендаций */}
          <div className="p-6 bg-slate-50 rounded-2xl text-left text-sm text-slate-600 mb-8">
            <p className="font-semibold mb-3 text-slate-900">
              {t('error_suggestions' as any) || "If you believe this is an error, you can:"}
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                <span>Verify you are logged in with the correct account</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                <span>Contact the app administrator for access</span>
              </li>
            </ul>
          </div>

          {/* Кнопки действий */}
          <div className="flex flex-col gap-3">
            <Button 
              variant="default" 
              className="bg-[#4A7C59] hover:bg-[#3d6b4a] rounded-full py-6"
              onClick={() => window.location.href = 'mailto:admin@qayta.com'}
            >
              <Mail className="w-4 h-4 mr-2" />
              Contact Admin
            </Button>
            
            <Button 
              variant="outline" 
              className="rounded-full py-6"
              onClick={() => {
                // Логика выхода (например, очистка localStorage или вызов API)
                localStorage.removeItem('qayta_lang'); // пример
                window.location.href = '/';
              }}
            >
              <LogOut className="w-4 h-4 mr-2" />
              {t('logout') || "Logout"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserNotRegisteredError;