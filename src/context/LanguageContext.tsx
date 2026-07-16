'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
export type Lang = 'ar' | 'en';
interface LangCtx { lang: Lang; setLang: (l: Lang) => void; dir: 'rtl' | 'ltr'; isAr: boolean; }
const Ctx = createContext<LangCtx>({ lang: 'ar', setLang: () => {}, dir: 'rtl', isAr: true });
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('ar');
  useEffect(() => {
    const saved = localStorage.getItem('gi_lang') as Lang | null;
    if (saved === 'ar' || saved === 'en') setLangState(saved);
  }, []);
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);
  const setLang = useCallback((l: Lang) => { setLangState(l); localStorage.setItem('gi_lang', l); }, []);
  return <Ctx.Provider value={{ lang, setLang, dir: lang === 'ar' ? 'rtl' : 'ltr', isAr: lang === 'ar' }}>{children}</Ctx.Provider>;
}
export const useLanguage = () => useContext(Ctx);
