'use client';

import { useState, useMemo } from 'react';
import { TrendingUp, DollarSign, Calendar, ChevronDown } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useIsMobile } from '@/hooks/useResponsive';
import { useScrollReveal, rv } from '@/hooks/useScrollReveal';
import { useCurrency } from '@/context/CurrencyContext';
import { useLanguage } from '@/context/LanguageContext';
import { useT } from '@/hooks/useT';
import Navbar from '@/components/map/Navbar';
import FooterSection from '@/components/sections/FooterSection';

const SLIDER_CONFIG = {
  price: { min: 50_000, max: 3_000_000, step: 10_000, default: 400_000 },
  rent: { min: 200, max: 15_000, step: 100, default: 1_800 },
  appreciation: { min: 0, max: 15, step: 0.5, default: 6 },
  years: { min: 1, max: 20, step: 1, default: 10 },
  expenses: { min: 0, max: 30, step: 1, default: 15 },
};

function calcROI(priceUSD: number, rentUSD: number, appreciation: number, years: number, expenses: number) {
  const grossAnnualRent = rentUSD * 12;
  const grossYield = (grossAnnualRent / priceUSD) * 100;
  const netAnnualRent = grossAnnualRent * (1 - expenses / 100);
  const netYield = (netAnnualRent / priceUSD) * 100;
  const monthlyNet = rentUSD * (1 - expenses / 100);
  const finalValue = priceUSD * Math.pow(1 + appreciation / 100, years);
  const capitalGain = finalValue - priceUSD;
  const totalRentNet = netAnnualRent * years;
  const totalReturn = capitalGain + totalRentNet;
  const totalROI = (totalReturn / priceUSD) * 100;

  const table = Array.from({ length: years }, (_, i) => {
    const yr = i + 1;
    const val = priceUSD * Math.pow(1 + appreciation / 100, yr);
    const cumRent = netAnnualRent * yr;
    return { yr, val, cumRent, total: (val - priceUSD) + cumRent };
  });

  return { grossYield, netYield, monthlyNet, finalValue, capitalGain, totalRentNet, totalReturn, totalROI, table };
}

export default function CalculatorPage() {
  const { t } = useTheme();
  const isMobile = useIsMobile();
  const { formatPrice } = useCurrency();
  const { dir, isAr } = useLanguage();
  const tr = useT();
  const [price, setPrice] = useState(SLIDER_CONFIG.price.default);
  const [rent, setRent] = useState(SLIDER_CONFIG.rent.default);
  const [appreciation, setAppreciation] = useState(SLIDER_CONFIG.appreciation.default);
  const [years, setYears] = useState(SLIDER_CONFIG.years.default);
  const [expenses, setExpenses] = useState(SLIDER_CONFIG.expenses.default);

  const res = useMemo(() => calcROI(price, rent, appreciation, years, expenses), [price, rent, appreciation, years, expenses]);

  const sliderStyle = (val: number, min: number, max: number) => ({
    background: `linear-gradient(to ${dir === 'rtl' ? 'left' : 'right'}, ${t.gold} 0%, ${t.gold} ${((val - min) / (max - min)) * 100}%, rgba(255,255,255,0.08) ${((val - min) / (max - min)) * 100}%, rgba(255,255,255,0.08) 100%)`,
  });

  return (
    <main style={{ background: t.bg, direction: dir, minHeight: '100vh' }}>
      <Navbar />
      <style>{`
        input[type=range] { -webkit-appearance: none; width: 100%; height: 4px; border-radius: 2px; outline: none; cursor: pointer; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 20px; height: 20px; border-radius: 50%; background: ${t.gold}; cursor: pointer; box-shadow: 0 2px 8px rgba(217,186,160,0.4); }
        input[type=range]::-moz-range-thumb { width: 20px; height: 20px; border-radius: 50%; background: ${t.gold}; cursor: pointer; border: none; }
      `}</style>

      {/* Hero */}
      <div style={{ background: '#060606', borderBottom: `1px solid ${t.gold4}`, padding: isMobile ? '110px 20px 52px' : '130px 32px 70px', textAlign: 'center' }}>
        <p style={{ color: t.gold, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          <span style={{ width: 28, height: 1, background: t.gold, display: 'inline-block' }} />
          {tr('calc.hero.badge')}
          <span style={{ width: 28, height: 1, background: t.gold, display: 'inline-block' }} />
        </p>
        <h1 style={{ fontFamily: "'Marcellus', serif", color: '#fff', fontSize: isMobile ? 'clamp(1.8rem,7vw,2.8rem)' : 'clamp(2.4rem,4vw,3.4rem)', lineHeight: 1.2, marginBottom: 14 }}>
          {tr('calc.title')}<br /><em style={{ color: t.gold }}>{isAr ? 'قبل أن تتخذ قرارك' : 'Before You Decide'}</em>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', lineHeight: 1.85, maxWidth: 480, margin: '0 auto' }}>
          {tr('calc.subtitle')}
        </p>
      </div>

      {/* Main calculator */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '36px 18px 60px' : '60px 32px 100px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 28 : 36, alignItems: 'start' }}>

          {/* ── Inputs ──────────────────────────────── */}
          <div style={{ background: t.altBg, border: `1px solid ${t.border}`, borderRadius: 10, padding: isMobile ? '24px 20px' : '36px 32px' }}>
            <h2 style={{ fontFamily: "'Marcellus', serif", color: t.txt, fontSize: '1.1rem', margin: '0 0 28px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <DollarSign size={18} color={t.gold} strokeWidth={1.4} />
              {tr('calc.sliders.title')}
            </h2>

            {[
              { label: tr('calc.price'), val: price, set: setPrice, cfg: SLIDER_CONFIG.price, fmt: (v: number) => formatPrice(v) },
              { label: tr('calc.rent'), val: rent, set: setRent, cfg: SLIDER_CONFIG.rent, fmt: (v: number) => formatPrice(v) },
            ].map(({ label, val, set, cfg, fmt }) => (
              <div key={label} style={{ marginBottom: 26 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ color: t.txt3, fontSize: '0.82rem' }}>{label}</span>
                  <span style={{ fontFamily: "'Marcellus', serif", color: t.gold, fontSize: '1rem' }}>{fmt(val)}</span>
                </div>
                <input type="range" min={cfg.min} max={cfg.max} step={cfg.step} value={val}
                  onChange={e => set(Number(e.target.value))}
                  style={sliderStyle(val, cfg.min, cfg.max)} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                  <span style={{ color: t.txt4, fontSize: '0.62rem' }}>{fmt(cfg.min)}</span>
                  <span style={{ color: t.txt4, fontSize: '0.62rem' }}>{fmt(cfg.max)}</span>
                </div>
              </div>
            ))}

            {/* Appreciation */}
            <div style={{ marginBottom: 26 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ color: t.txt3, fontSize: '0.82rem' }}>{tr('calc.appreciation')}</span>
                <span style={{ fontFamily: "'Marcellus', serif", color: t.gold, fontSize: '1rem' }}>{appreciation}%</span>
              </div>
              <input type="range" min={0} max={15} step={0.5} value={appreciation}
                onChange={e => setAppreciation(Number(e.target.value))}
                style={sliderStyle(appreciation, 0, 15)} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                <span style={{ color: t.txt4, fontSize: '0.62rem' }}>0%</span>
                <span style={{ color: t.gold3, fontSize: '0.62rem' }}>{isAr ? 'متوسط إسطنبول: 6-8%' : 'Istanbul avg: 6-8%'}</span>
                <span style={{ color: t.txt4, fontSize: '0.62rem' }}>15%</span>
              </div>
            </div>

            {/* Years */}
            <div style={{ marginBottom: 26 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ color: t.txt3, fontSize: '0.82rem' }}>{tr('calc.years')}</span>
                <span style={{ fontFamily: "'Marcellus', serif", color: t.gold, fontSize: '1rem' }}>{years} {tr('unit.year')}</span>
              </div>
              <input type="range" min={1} max={20} step={1} value={years}
                onChange={e => setYears(Number(e.target.value))}
                style={sliderStyle(years, 1, 20)} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                <span style={{ color: t.txt4, fontSize: '0.62rem' }}>1 {tr('unit.year')}</span>
                <span style={{ color: t.txt4, fontSize: '0.62rem' }}>20 {tr('unit.year')}</span>
              </div>
            </div>

            {/* Expenses */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ color: t.txt3, fontSize: '0.82rem' }}>{tr('calc.expenses')}</span>
                <span style={{ fontFamily: "'Marcellus', serif", color: t.gold, fontSize: '1rem' }}>{expenses}%</span>
              </div>
              <input type="range" min={0} max={30} step={1} value={expenses}
                onChange={e => setExpenses(Number(e.target.value))}
                style={sliderStyle(expenses, 0, 30)} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                <span style={{ color: t.txt4, fontSize: '0.62rem' }}>0%</span>
                <span style={{ color: t.gold3, fontSize: '0.62rem' }}>{isAr ? 'الافتراضي: 15%' : 'Default: 15%'}</span>
                <span style={{ color: t.txt4, fontSize: '0.62rem' }}>30%</span>
              </div>
            </div>
          </div>

          {/* ── Results ──────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Main numbers */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {[
                { label: tr('calc.grossYield'), value: `${res.grossYield.toFixed(2)}%`, highlight: true },
                { label: tr('calc.netYield'), value: `${res.netYield.toFixed(2)}%`, highlight: false },
                { label: tr('calc.monthlyNet'), value: formatPrice(res.monthlyNet), highlight: false },
                { label: `${tr('calc.finalValue')} ${years} ${tr('calc.finalValueSuffix')}`, value: formatPrice(res.finalValue), highlight: false },
              ].map(({ label, value, highlight }) => (
                <div key={label} style={{
                  background: highlight ? 'linear-gradient(135deg, rgba(217,186,160,0.12) 0%, rgba(217,186,160,0.04) 100%)' : t.altBg,
                  border: `1px solid ${highlight ? t.gold3 : t.border}`,
                  borderRadius: 8, padding: '18px 16px',
                }}>
                  <div style={{ color: t.txt4, fontSize: '0.68rem', marginBottom: 8, lineHeight: 1.4 }}>{label}</div>
                  <div style={{ fontFamily: "'Marcellus', serif", color: highlight ? t.gold : t.txt, fontSize: '1.3rem', lineHeight: 1 }}>{value}</div>
                </div>
              ))}
            </div>

            {/* Summary box */}
            <div style={{ background: t.altBg, border: `1px solid ${t.border}`, borderRadius: 8, padding: '20px 18px' }}>
              <h3 style={{ fontFamily: "'Marcellus', serif", color: t.txt, fontSize: '0.95rem', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <TrendingUp size={15} color={t.gold} /> {tr('calc.results.title')}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: tr('calc.totalRent'), val: formatPrice(res.totalRentNet) },
                  { label: tr('calc.capitalGain'), val: formatPrice(res.capitalGain) },
                  { label: tr('calc.totalReturn'), val: formatPrice(res.totalReturn), bold: true },
                  { label: tr('calc.totalROI'), val: `${res.totalROI.toFixed(1)}%`, bold: true, gold: true },
                ].map(({ label, val, bold, gold }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10, borderBottom: `1px solid ${t.border}` }}>
                    <span style={{ color: t.txt3, fontSize: '0.8rem' }}>{label}</span>
                    <span style={{ fontFamily: bold ? "'Marcellus', serif" : 'inherit', color: gold ? t.gold : t.txt, fontSize: bold ? '1rem' : '0.86rem', fontWeight: bold ? 700 : 400 }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <a href="/contact" style={{
              background: t.gold, borderRadius: 6, padding: '14px 20px',
              color: t.goldText, fontSize: '0.78rem', fontWeight: 700,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              textDecoration: 'none', display: 'block', textAlign: 'center',
              transition: 'opacity 0.2s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.85'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1'; }}
            >
              {tr('calc.cta.sub')}
            </a>
          </div>
        </div>

        {/* Year-by-year table */}
        <YearTable res={res} years={years} t={t} isMobile={isMobile} formatPrice={formatPrice} isAr={isAr} tr={tr} />
      </div>

      <FooterSection />
    </main>
  );
}

function YearTable({ res, years, t, isMobile, formatPrice, isAr, tr }: {
  res: ReturnType<typeof calcROI>; years: number; t: any; isMobile: boolean; formatPrice: (n: number) => string; isAr: boolean; tr: (key: any) => string;
}) {
  const { ref, visible } = useScrollReveal();
  const [open, setOpen] = useState(false);
  return (
    <div ref={ref} style={{ ...rv(visible, 0), marginTop: 36 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 8, background: 'none',
          border: `1px solid ${t.border}`, borderRadius: 6, padding: '11px 18px',
          color: t.txt2, fontSize: '0.82rem', cursor: 'pointer', marginBottom: 0,
          fontFamily: 'inherit', transition: 'border-color 0.2s, color 0.2s',
        }}
        onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = t.gold3; el.style.color = t.gold; }}
        onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = t.border; el.style.color = t.txt2; }}
      >
        <Calendar size={14} />
        {open ? tr('calc.hideTable') : tr('calc.showTable')} ({years} {isAr ? 'سنة' : 'years'})
        <ChevronDown size={14} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
      </button>

      <div style={{ maxHeight: open ? '1200px' : 0, overflow: 'hidden', transition: 'max-height 0.5s cubic-bezier(0.22,1,0.36,1)' }}>
        <div style={{ marginTop: 16, border: `1px solid ${t.border}`, borderRadius: 8, overflow: 'hidden' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: isMobile ? '60px 1fr 1fr' : '60px 1fr 1fr 1fr',
            background: '#060606', borderBottom: `1px solid ${t.border}`,
            padding: '12px 16px', gap: 8,
          }}>
            {[tr('calc.table.year'), tr('calc.table.propertyValue'), tr('calc.table.rentIncome'), !isMobile ? tr('calc.table.totalReturn') : null].filter(Boolean).map(h => (
              <div key={h!} style={{ color: t.txt4, fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{h}</div>
            ))}
          </div>
          {res.table.map(({ yr, val, cumRent, total }) => (
            <div key={yr} style={{
              display: 'grid', gridTemplateColumns: isMobile ? '60px 1fr 1fr' : '60px 1fr 1fr 1fr',
              padding: '12px 16px', gap: 8,
              background: yr % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent',
              borderBottom: `1px solid ${t.border}`,
              transition: 'background 0.15s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(217,186,160,0.04)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = yr % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent'; }}
            >
              <div style={{ color: t.gold, fontFamily: "'Marcellus', serif", fontSize: '0.88rem' }}>{yr}</div>
              <div style={{ color: t.txt2, fontSize: '0.82rem' }}>{formatPrice(val)}</div>
              <div style={{ color: t.txt2, fontSize: '0.82rem' }}>{formatPrice(cumRent)}</div>
              {!isMobile && <div style={{ color: total > 0 ? '#4ade80' : '#f87171', fontSize: '0.82rem', fontWeight: 600 }}>{formatPrice(total)}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
