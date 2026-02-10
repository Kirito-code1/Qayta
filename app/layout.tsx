import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { AuthProvider } from "./lib/AuthContext"; 
import { LanguageProvider } from "./lib/LanguageContext"; // Импортируем провайдер языка
import { QueryProvider } from "./lib/QueryProvider"; 
import { Toaster } from "@/components/ui/toaster";
import NavigationTracker from "./lib/NavigationTracker";
import LayoutClient from "@/components/LayoutClient";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "QAYTA - Smart Shopping",
  description: "Save money, save the planet",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <QueryProvider>
          {/* LanguageProvider должен быть выше AuthProvider или рядом, 
              чтобы AuthContext тоже мог использовать переводы если нужно */}
          <LanguageProvider>
            <AuthProvider>
              <NavigationTracker />
              {/* LayoutClient теперь будет брать данные из LanguageProvider */}
              <LayoutClient>
                {children}
              </LayoutClient>
              <Toaster />
            </AuthProvider>
          </LanguageProvider>
        </QueryProvider>
      </body>
    </html>
  );
}