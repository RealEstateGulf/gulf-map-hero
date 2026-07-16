'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Luxhom exact palette (from post-9.css):
// bg:      #090909  (--e-global-color-6e54641)
// surface: #121212  (--e-global-color-32e1c9d / d5efdc6)
// card:    #1E1E1E  (--e-global-color-dd29169)
// txt:     #FFFFFF  (--e-global-color-primary)
// txt2:    #DBDBDB  (--e-global-color-secondary)
// txt3:    #929292  (--e-global-color-text)
// accent:  #D9BAA0  (--e-global-color-5046f92)  ← warm sand, NOT gold
// accent2: #DFC4AE  (--e-global-color-a4982e1)
// accent3: #E4CEBB  (--e-global-color-fe452c7)
// accent4: #E9D7C9  (--e-global-color-9938a3b)
// accent5: #F2E6DD  (--e-global-color-e8bc4af)

export interface ThemeTokens {
  name: 'dark' | 'luxhom';
  bg: string;       // page bg
  altBg: string;    // alternating section bg
  navbar: string;
  surface: string;
  modal: string;
  card: string;
  cardHover: string;
  overlay: string;
  expanded: string;
  txt: string;
  txt2: string;
  txt3: string;
  txt4: string;
  border: string;
  border2: string;
  // Accent (Luxhom warm sand #D9BAA0, NOT yellow)
  gold: string;
  gold2: string;
  gold3: string;
  gold4: string;
  gold5: string;
  gold6: string;
  goldText: string;
  btn: string;
  btnBorder: string;
  imgGrad: string;
  shadow: string;
  shadowModal: string;
  headerGrad: string;
}

// Dark (default) — exact Luxhom dark palette
const DARK: ThemeTokens = {
  name: 'dark',
  bg: '#090909',
  altBg: '#121212',
  navbar: 'rgba(9,9,9,0.96)',
  surface: 'rgba(18,18,18,0.98)',
  modal: '#1E1E1E',
  card: '#121212',
  cardHover: 'rgba(217,186,160,0.05)',
  overlay: 'rgba(9,9,9,0.72)',
  expanded: '#242424',
  txt: '#FFFFFF',
  txt2: '#DBDBDB',
  txt3: '#929292',
  txt4: 'rgba(255,255,255,0.30)',
  border: 'rgba(255,255,255,0.07)',
  border2: 'rgba(255,255,255,0.12)',
  gold: '#D9BAA0',                       // Luxhom --e-global-color-5046f92
  gold2: '#DFC4AE',                      // --e-global-color-a4982e1
  gold3: 'rgba(217,186,160,0.38)',
  gold4: 'rgba(217,186,160,0.18)',
  gold5: 'rgba(217,186,160,0.09)',
  gold6: 'rgba(217,186,160,0.04)',
  goldText: '#090909',                   // dark text on accent button
  btn: 'rgba(255,255,255,0.05)',
  btnBorder: 'rgba(255,255,255,0.10)',
  imgGrad: 'linear-gradient(to top, rgba(9,9,9,0.88) 0%, rgba(9,9,9,0) 50%)',
  shadow: '0 2px 24px rgba(0,0,0,0.45)',
  shadowModal: '0 24px 80px rgba(0,0,0,0.7)',
  headerGrad: 'linear-gradient(to bottom, rgba(9,9,9,0.88) 0%, rgba(9,9,9,0.4) 70%, transparent 100%)',
};

// Light — Luxhom cream palette
const LUXHOM: ThemeTokens = {
  name: 'luxhom',
  bg: '#F2E6DD',      // --e-global-color-e8bc4af (lightest cream)
  altBg: '#FFFFFF',
  navbar: 'rgba(255,255,255,0.97)',
  surface: 'rgba(255,255,255,0.96)',
  modal: '#FFFFFF',
  card: '#FFFFFF',
  cardHover: 'rgba(217,186,160,0.08)',
  overlay: 'rgba(9,9,9,0.50)',
  expanded: '#FFFFFF',
  txt: '#090909',
  txt2: '#242424',
  txt3: '#929292',
  txt4: 'rgba(9,9,9,0.38)',
  border: 'rgba(0,0,0,0.07)',
  border2: 'rgba(0,0,0,0.13)',
  gold: '#D9BAA0',
  gold2: '#DFC4AE',
  gold3: 'rgba(217,186,160,0.50)',
  gold4: 'rgba(217,186,160,0.28)',
  gold5: 'rgba(217,186,160,0.14)',
  gold6: 'rgba(217,186,160,0.06)',
  goldText: '#090909',
  btn: 'rgba(0,0,0,0.05)',
  btnBorder: 'rgba(0,0,0,0.12)',
  imgGrad: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 48%)',
  shadow: '0 2px 24px rgba(0,0,0,0.07)',
  shadowModal: '0 20px 60px rgba(0,0,0,0.14)',
  headerGrad: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.2) 70%, transparent 100%)',
};

interface ThemeContextValue {
  t: ThemeTokens;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({ t: DARK, toggle: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [t, setT] = useState<ThemeTokens>(DARK);

  useEffect(() => {
    document.body.style.background = t.bg;
    document.body.style.color = t.txt;
  }, [t]);

  const toggle = () => setT(prev => (prev.name === 'dark' ? LUXHOM : DARK));

  return <ThemeContext.Provider value={{ t, toggle }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
