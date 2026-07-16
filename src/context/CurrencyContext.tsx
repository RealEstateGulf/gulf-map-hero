'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';

export type CurrencyCode = 'USD' | 'AED' | 'SAR' | 'KWD' | 'QAR' | 'EUR' | 'TRY';

export const CURRENCIES: { code: CurrencyCode; symbol: string; nameAr: string; flag: string; rate: number }[] = [
  { code: 'USD', symbol: '$',    nameAr: 'دولار أمريكي',   flag: '🇺🇸', rate: 1      },
  { code: 'AED', symbol: 'د.إ', nameAr: 'درهم إماراتي',   flag: '🇦🇪', rate: 3.67   },
  { code: 'SAR', symbol: 'ر.س', nameAr: 'ريال سعودي',    flag: '🇸🇦', rate: 3.75   },
  { code: 'KWD', symbol: 'د.ك', nameAr: 'دينار كويتي',   flag: '🇰🇼', rate: 0.306  },
  { code: 'QAR', symbol: 'ر.ق', nameAr: 'ريال قطري',     flag: '🇶🇦', rate: 3.64   },
  { code: 'EUR', symbol: '€',   nameAr: 'يورو',            flag: '🇪🇺', rate: 0.92   },
  { code: 'TRY', symbol: '₺',   nameAr: 'ليرة تركية',     flag: '🇹🇷', rate: 35.8   },
];

interface CurrencyCtx {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  formatPrice: (usd: number) => string;
  convert: (usd: number) => number;
  currencyInfo: typeof CURRENCIES[number];
}

const Ctx = createContext<CurrencyCtx>({
  currency: 'USD',
  setCurrency: () => {},
  formatPrice: (u) => `$${u.toLocaleString('en-US')}`,
  convert: (u) => u,
  currencyInfo: CURRENCIES[0],
});

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>('USD');

  useEffect(() => {
    const saved = localStorage.getItem('gi_currency') as CurrencyCode | null;
    if (saved && CURRENCIES.find(c => c.code === saved)) setCurrencyState(saved);
  }, []);

  const setCurrency = useCallback((c: CurrencyCode) => {
    setCurrencyState(c);
    localStorage.setItem('gi_currency', c);
  }, []);

  const currencyInfo = CURRENCIES.find(c => c.code === currency)!;

  const convert = useCallback((usd: number) => usd * currencyInfo.rate, [currencyInfo.rate]);

  const formatPrice = useCallback((usd: number): string => {
    const amount = usd * currencyInfo.rate;
    const sym = currencyInfo.symbol;
    if (currency === 'TRY') {
      return amount >= 1_000_000
        ? `${(amount / 1_000_000).toFixed(1)}M ${sym}`
        : `${Math.round(amount).toLocaleString('en-US')} ${sym}`;
    }
    if (currency === 'KWD') return `${sym} ${Math.round(amount).toLocaleString('en-US')}`;
    if (currency === 'USD' || currency === 'EUR') return `${sym}${Math.round(amount).toLocaleString('en-US')}`;
    return `${Math.round(amount).toLocaleString('en-US')} ${sym}`;
  }, [currency, currencyInfo]);

  return <Ctx.Provider value={{ currency, setCurrency, formatPrice, convert, currencyInfo }}>{children}</Ctx.Provider>;
}

export const useCurrency = () => useContext(Ctx);
export const parseUSD = (priceStr: string): number => parseInt(priceStr.replace(/[^0-9]/g, ''), 10) || 0;
