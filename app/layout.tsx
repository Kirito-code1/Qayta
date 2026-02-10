import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { AuthProvider } from "./lib/AuthContext"; 
import { QueryProvider } from "./lib/QueryProvider"; 
import { Toaster } from "@/components/ui/toaster";
import NavigationTracker from "./lib/NavigationTracker";
import LayoutClient from "@/components/LayoutClient"; // Импортируем наш новый визуальный каркас

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
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <AuthProvider>
            <NavigationTracker />
            {/* Оборачиваем все дочерние страницы в визуальный Layout */}
            <LayoutClient>
              {children}
            </LayoutClient>
            <Toaster />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}