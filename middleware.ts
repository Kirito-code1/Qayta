import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get('eco_market_users_db');
  const { pathname } = request.nextUrl;

  // 1. Защита профиля: если нет куки — на логин
  if (pathname.startsWith('/profile') && !authCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. Если залогинен — не пускать на страницу логина (сразу в профиль)
  if (pathname.startsWith('/login') && authCookie) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Проверяем профиль (и все вложенные пути) и страницу логина
  matcher: ['/profile/:path*', '/login'],
};