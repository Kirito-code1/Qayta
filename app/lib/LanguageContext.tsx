"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, LangType } from './translations';

interface LanguageContextType {
  lang: LangType;
  setLang: (lang: LangType) => void;
  t: (key: keyof typeof translations['ru']) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<LangType>('ru');

  // Сохраняем выбор в localStorage, чтобы при перезагрузке язык не слетал
  useEffect(() => {
    const savedLang = localStorage.getItem('app_lang') as LangType;
    if (savedLang) setLang(savedLang);
  }, []);

  const changeLang = (newLang: LangType) => {
    setLang(newLang);
    localStorage.setItem('app_lang', newLang);
  };

  const t = (key: keyof typeof translations['ru']) => {
    return translations[lang][key] || translations['ru'][key];
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