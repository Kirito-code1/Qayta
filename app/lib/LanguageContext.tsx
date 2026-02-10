"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, LangType } from './translations';

// Тип ключа — это любая строка, которая есть в нашем русском словаре
type TranslationKey = keyof typeof translations['ru'];

interface LanguageContextType {
  lang: LangType;
  setLang: (lang: LangType) => void;
  // Мы меняем возвращаемый тип на any, так как t может вернуть 
  // и строку, и объект (как в случае с achievements), и массив (как cities)
  t: (key: TranslationKey) => any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<LangType>('ru');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('app_lang') as LangType;
      if (savedLang && translations[savedLang]) {
        setLang(savedLang);
      }
    }
  }, []);

  const changeLang = (newLang: LangType) => {
    setLang(newLang);
    localStorage.setItem('app_lang', newLang);
  };

  const t = (key: TranslationKey): any => {
    // 1. Берем перевод на текущем языке
    // 2. Если его нет, берем русский (как основной)
    // 3. Если и там нет (маловероятно), возвращаем сам ключ
    const translation = translations[lang][key] || translations['ru'][key];
    return translation !== undefined ? translation : key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: changeLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};