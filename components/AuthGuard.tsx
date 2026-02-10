"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockUser } from '@/app/lib/mockData';
import { Loader2 } from 'lucide-react';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!mockUser) {
      // Если аккаунта нет — отправляем на регистрацию
      router.replace('/register');
    } else {
      setIsChecking(false);
    }
  }, [router]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f6f3]">
        <Loader2 className="w-10 h-10 animate-spin text-black" />
      </div>
    );
  }

  return <>{children}</>;
}