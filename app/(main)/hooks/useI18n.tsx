"use client";

import { useState, useEffect, useCallback } from 'react';

// 1. Создаем тип на основе английского перевода для автодополнения
type TranslationKeys = keyof typeof translations.en;
type Language = 'en' | 'uz' | 'ru';

export const translations = {
  en: {
    'app_name': 'QAYTA',
    'browse': 'Browse',
    'map': 'Map',
    'how_it_works': 'How It Works',
    'sell_on_qayta': 'Sell on QAYTA',
    'seller_dashboard': 'Seller Dashboard',
    'sign_in': 'Sign In',
    'my_profile': 'My Profile',
    'my_orders': 'My Orders',
    'logout': 'Logout',
    'search_placeholder': 'Search products, stores...',
    'sort_by': 'Sort by',
    'newest_first': 'Newest First',
    'biggest_discount': 'Biggest Discount',
    'price_low_to_high': 'Price: Low to High',
    'price_high_to_low': 'Price: High to Low',
    'expiring_soon': 'Expiring Soon',
    'filters': 'Filters',
    'active_filters': '{count} active',
    'category': 'Category',
    'discount_reason': 'Discount Reason',
    'price_range': 'Price Range: ${min} - ${max}',
    'clear_all_filters': 'Clear All Filters',
    'products_found': '{count} products found',
    'loading': 'Loading...',
    'no_products_found': 'No products found',
    'no_products_found_description': 'Try adjusting your filters or search terms',
    'all_categories': 'All Categories',
    'prepared_food': 'Prepared Food',
    'beverages': 'Beverages',
    'bakery': 'Bakery',
    'dairy': 'Dairy',
    'meat_fish': 'Meat & Fish',
    'fresh_produce': 'Fresh Produce',
    'pantry': 'Pantry',
    'cosmetics': 'Cosmetics',
    'clothing': 'Clothing',
    'electronics': 'Electronics',
    'home_garden': 'Home & Garden',
    'other': 'Other',
    'all_reasons': 'All Reasons',
    'expiring_soon_reason': 'Expiring Soon',
    'imperfect_packaging': 'Imperfect Packaging',
    'overstock': 'Overstock',
    'last_season': 'Last Season',
    'seasonal': 'Seasonal',
    'footer_tagline': 'Connecting conscious consumers with great deals while reducing waste. Save money, save the planet, one purchase at a time.',
    'shop': 'Shop',
    'browse_all': 'Browse All',
    'food': 'Food',
    'sellers': 'Sellers',
    'become_a_seller': 'Become a Seller',
    'footer_legal': '© {year} QAYTA. All rights reserved.',
    'footer_motto': 'Reducing waste, one deal at a time 🌱'
  },
  uz: {
    'app_name': 'QAYTA',
    'browse': 'Ko\'rib chiqish',
    'map': 'Xarita',
    'how_it_works': 'Qanday ishlaydi',
    'sell_on_qayta': 'QAYTA\'da sotish',
    'seller_dashboard': 'Sotuvchi paneli',
    'sign_in': 'Kirish',
    'my_profile': 'Mening profilim',
    'my_orders': 'Mening buyurtmalarim',
    'logout': 'Chiqish',
    'search_placeholder': 'Mahsulotlarni, do\'konlarni qidirish...',
    'sort_by': 'Saralash',
    'newest_first': 'Eng yangilari',
    'biggest_discount': 'Eng katta chegirma',
    'price_low_to_high': 'Narx: arzonidan qimmatiga',
    'price_high_to_low': 'Narx: qimmatidan arzoniga',
    'expiring_soon': 'Yaqinda tugaydi',
    'filters': 'Filtrlar',
    'active_filters': '{count} faol',
    'category': 'Kategoriya',
    'discount_reason': 'Chegirma sababi',
    'price_range': 'Narxlar oralig\'i: ${min} - ${max}',
    'clear_all_filters': 'Barcha filtrlarni tozalash',
    'products_found': '{count} mahsulot topildi',
    'loading': 'Yuklanmoqda...',
    'no_products_found': 'Mahsulotlar topilmadi',
    'no_products_found_description': 'Filtrlarni yoki qidiruv so\'zlaringizni o\'zgartirib ko\'ring',
    'all_categories': 'Barcha kategoriyalar',
    'prepared_food': 'Tayyor ovqat',
    'beverages': 'Ichimliklar',
    'bakery': 'Non mahsulotlari',
    'dairy': 'Sut mahsulotlari',
    'meat_fish': 'Go\'sht va baliq',
    'fresh_produce': 'Yangi mahsulotlar',
    'pantry': 'Oziq-ovqat',
    'cosmetics': 'Kosmetika',
    'clothing': 'Kiyim-kechak',
    'electronics': 'Elektronika',
    'home_garden': 'Uy va bog\'',
    'other': 'Boshqa',
    'all_reasons': 'Barcha sabablar',
    'expiring_soon_reason': 'Yaroqlilik muddati tugayapti',
    'imperfect_packaging': 'Qadoqi nuqsonli',
    'overstock': 'Ortiqcha zaxira',
    'last_season': 'O\'tgan mavsum',
    'seasonal': 'Mavsumiy',
    'footer_tagline': 'Ongli iste\'molchilarni ajoyib takliflar bilan bog\'lash orqali chiqindilarni kamaytirish. Pulni tejang, sayyorani asrang, bir vaqtning o\'zida.',
    'shop': 'Do\'kon',
    'browse_all': 'Barchasini ko\'rish',
    'food': 'Oziq-ovqat',
    'sellers': 'Sotuvchilar',
    'become_a_seller': 'Sotuvchi bo\'lish',
    'footer_legal': '© {year} QAYTA. Barcha huquqlar himoyalangan.',
    'footer_motto': 'Chiqindini kamaytiramiz, bir vaqtda bitta kelishuv bilan 🌱'
  },
  ru: {
    'app_name': 'QAYTA',
    'browse': 'Обзор',
    'map': 'Карта',
    'how_it_works': 'Как это работает',
    'sell_on_qayta': 'Продать на QAYTA',
    'seller_dashboard': 'Панель продавца',
    'sign_in': 'Войти',
    'my_profile': 'Мой профиль',
    'my_orders': 'Мои заказы',
    'logout': 'Выйти',
    'search_placeholder': 'Искать товары, магазины...',
    'sort_by': 'Сортировать по',
    'newest_first': 'Сначала новые',
    'biggest_discount': 'Самая большая скидка',
    'price_low_to_high': 'Цена: от низкой к высокой',
    'price_high_to_low': 'Цена: от высокой к низкой',
    'expiring_soon': 'Срок годности истекает',
    'filters': 'Фильтры',
    'active_filters': '{count} активно',
    'category': 'Категория',
    'discount_reason': 'Причина скидки',
    'price_range': 'Диапазон цен: ${min} - ${max}',
    'clear_all_filters': 'Очистить все фильтры',
    'products_found': 'Найдено {count} товаров',
    'loading': 'Загрузка...',
    'no_products_found': 'Товары не найдены',
    'no_products_found_description': 'Попробуйте изменить фильтры или условия поиска',
    'all_categories': 'Все категории',
    'prepared_food': 'Готовая еда',
    'beverages': 'Напитки',
    'bakery': 'Выпечка',
    'dairy': 'Молочные продукты',
    'meat_fish': 'Мясо и рыба',
    'fresh_produce': 'Свежие продукты',
    'pantry': 'Бакалея',
    'cosmetics': 'Косметика',
    'clothing': 'Одежда',
    'electronics': 'Электроника',
    'home_garden': 'Дом и сад',
    'other': 'Другое',
    'all_reasons': 'Все причины',
    'expiring_soon_reason': 'Истекает срок годности',
    'imperfect_packaging': 'Поврежденная упаковка',
    'overstock': 'Избыток товара',
    'last_season': 'Прошлый сезон',
    'seasonal': 'Сезонный',
    'footer_tagline': 'Соединяем сознательных потребителей с выгодными предложениями, сокращая количество отходов. Экономьте деньги, спасайте планету, одна покупка за раз.',
    'shop': 'Магазин',
    'browse_all': 'Смотреть все',
    'food': 'Еда',
    'sellers': 'Продавцы',
    'become_a_seller': 'Стать продавцом',
    'footer_legal': '© {year} QAYTA. Все права защищены.',
    'footer_motto': 'Сокращаем отходы, одна сделка за раз 🌱'
  },
};

export const useI18n = () => {
  // Инициализируем 'en', чтобы избежать Hydration Error. 
  // Реальный язык подгрузим в useEffect.
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('qayta_lang') as Language;
    if (saved && translations[saved]) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('qayta_lang', lang);
  };

  // Обернули в useCallback, чтобы избежать лишних ререндеров
  const t = useCallback((key: TranslationKeys, params: Record<string, string | number> = {}) => {
    let translation = translations[language][key] || key;

    Object.keys(params).forEach(param => {
      const val = String(params[param]);
      // Обработка параметров вида {count} и $min
      translation = translation.replace(`{${param}}`, val);
      translation = translation.replace(`$${param}`, val);
    });

    return translation;
  }, [language]);

  return {
    t,
    language,
    setLanguage,
    availableLanguages: Object.keys(translations) as Language[],
    availableLanguagesLong: { en: 'English', uz: 'O\'zbek', ru: 'Русский' }
  };
};