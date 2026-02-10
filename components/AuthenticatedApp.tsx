"use client";

import { useAuth } from "../app/lib/AuthContext";
import UserNotRegisteredError from "../app/(main)/UserNotRegistered";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // 1. Состояние загрузки
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-[#4A7C59] rounded-full animate-spin"></div>
      </div>
    );
  }

  // 2. Обработка ошибок доступа
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } 
    
    if (authError.type === 'auth_required') {
      navigateToLogin();
      return (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <p className="text-slate-600 animate-pulse">Redirecting to login...</p>
        </div>
      );
    }
  }

  return <>{children}</>;
}