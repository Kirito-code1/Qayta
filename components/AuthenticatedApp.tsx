"use client";

import { useAuth } from "../app/lib/AuthContext";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoadingAuth } = useAuth();

  // 1. Состояние загрузки
  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-[#4A7C59] rounded-full animate-spin"></div>
      </div>
    );
  }

  return <>{children}</>;
}