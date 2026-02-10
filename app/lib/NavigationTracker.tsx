"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from './AuthContext'; 
import { pagesConfig } from '../page.config';

export default function NavigationTracker() {
    const pathname = usePathname();
    const { isAuthenticated } = useAuth(); // Используем наш новый автономный AuthContext
    
    const { Pages, mainPage } = pagesConfig;
    const mainPageKey = mainPage ?? Object.keys(Pages)[0];

    useEffect(() => {
        if (!pathname) return;

        let pageName: string | null = null;

        // 1. Логика определения страницы
        if (pathname === '/' || pathname === '') {
            pageName = mainPageKey;
        } else {
            // Извлекаем первый сегмент пути (например, 'products' из '/products/123')
            const pathSegment = pathname.replace(/^\//, '').split('/')[0];
            const pageKeys = Object.keys(Pages);
            
            // Ищем совпадение в конфигурации страниц (без учета регистра)
            const matchedKey = pageKeys.find(
                key => key.toLowerCase() === pathSegment.toLowerCase()
            );
            pageName = matchedKey || null;
        }

        // 2. Локальное логирование для разработки
        if (isAuthenticated && pageName) {
            if (process.env.NODE_ENV === 'development') {
                console.log(`[Offline Analytics] Пользователь перешел на: ${pageName}`);
            }

            // Здесь в будущем можно добавить сохранение истории переходов в localStorage,
            // если тебе понадобится статистика посещений без бэкенда.
        }
    }, [pathname, isAuthenticated, Pages, mainPageKey]);

    return null;
}