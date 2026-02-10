import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Пытаемся достать куку авторизации
  // Имя 'eco_market_users_db' должно совпадать с тем, что мы прописали в AuthContext
  const authCookie = request.cookies.get('eco_market_users_db');
  
  const { pathname } = request.nextUrl;

  // 1. Если пользователь пытается зайти в профиль, но куки нет — гоним на логин
  if (pathname.startsWith('/profile') && !authCookie) {
    const loginUrl = new URL('/login', request.url);
    // Можно добавить параметр, чтобы после логина его вернуло обратно
    // loginUrl.searchParams.set('from', pathname); 
    return NextResponse.redirect(loginUrl);
  }

  // 2. Если пользователь УЖЕ залогинен (кука есть), но лезет на страницу логина
  if (pathname.startsWith('/login') && authCookie) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  return NextResponse.next();
}

// Настраиваем, какие пути должен проверять этот файл
export const config = {
  matcher: [
    '/profile/:path*', // Все страницы внутри профиля
    '/login',          // Страница входа
  ],
};