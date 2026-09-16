'use client';

import { useState, useMemo } from 'react';
import { TrendingUp, DollarSign, Calendar, ChevronDown } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useIsMobile } from '@/hooks/useResponsive';
import { useScrollReveal, rv } from '@/hooks/useScrollReveal';
import { useCurrency } from '@/context/CurrencyContext';
import { useLanguage } from '@/context/LanguageContext';
import { useT } from '@/hooks/useT';
import ROIValueChart from './ROIValueChart';

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
  // Years of net rent alone (no appreciation) needed to recoup the purchase price.
  const paybackYears = netAnnualRent > 0 ? priceUSD / netAnnualRent : Infinity;

  const table = Array.from({ length: years }, (_, i) => {
    const yr = i + 1;
    const val = priceUSD * Math.pow(1 + appreciation / 100, yr);
    const capitalGainAtYear = val - priceUSD;
    const cumRent = netAnnualRent * yr;
    return { yr, val, capitalGainAtYear, cumRent, total: capitalGainAtYear + cumRent };
  });

  return { grossYield, netYield, monthlyNet, finalValue, capitalGain, totalRentNet, totalReturn, totalROI, paybackYears, table };
}

interface Props {
  /** Pre-fill the price slider, e.g. from a listing's own price. */
  initialPrice?: number;
  /** Pre-fill the rent slider from a listing's average monthly rent (USD), if set. */
  initialMonthlyRent?: number;
  /** Pre-fill the appreciation rate from the listing's city (avgAppreciationRate), if set. */
  initialAppreciationRate?: number;
  /** Hide the CTA button pointing to /contact — used when already embedded in a page that has its own CTA nearby. */
  hideCta?: boolean;
  /** Freeze every parameter as a read-only figure instead of a draggable slider,
   * and show the value-projection chart. Used for the per-listing embed, where
   * price/rent are the listing's real numbers rather than a what-if scenario. */
  locked?: boolean;
}

export default function ROICalculator({ initialPrice, initialMonthlyRent, initialAppreciationRate, hideCta, locked }: Props) {
  const { t } = useTheme();
  const isMobile = useIsMobile();
  const { formatPrice } = useCurrency();
  const { dir, isAr } = useLanguage();
  const tr = useT();

  const startPrice = initialPrice && initialPrice > 0
    ? Math.min(Math.max(initialPrice, SLIDER_CONFIG.price.min), SLIDER_CONFIG.price.max)
    : SLIDER_CONFIG.price.default;
  const startRent = initialMonthlyRent && initialMonthlyRent > 0
    ? Math.min(Math.max(initialMonthlyRent, SLIDER_CONFIG.rent.min), SLIDER_CONFIG.rent.max)
    : SLIDER_CONFIG.rent.default;
  const startAppreciation = initialAppreciationRate && initialAppreciationRate > 0
    ? Math.min(Math.max(initialAppreciationRate, SLIDER_CONFIG.appreciation.min), SLIDER_CONFIG.appreciation.max)
    : SLIDER_CONFIG.appreciation.default;

  const [price, setPrice] = useState(startPrice);
  const [rent, setRent] = useState(startRent);
  const [appreciation, setAppreciation] = useState(startAppreciation);
  const [years, setYears] = useState(SLIDER_CONFIG.years.default);
  const [expenses, setExpenses] = useState(SLIDER_CONFIG.expenses.default);

  const res = useMemo(() => calcROI(price, rent, appreciation, years, expenses), [price, rent, appreciation, years, expenses]);

  const sliderStyle = (val: number, min: number, max: number) => ({
    background: `linear-gradient(to ${dir === 'rtl' ? 'left' : 'right'}, ${t.gold} 0%, ${t.gold} ${((val - min) / (max - min)) * 100}%, rgba(255,255,255,0.08) ${((val - min) / (max - min)) * 100}%, rgba(255,255,255,0.08) 100%)`,
  });

  // Locked mode swaps the draggable <input type=range> for a plain, non-interactive
  // bar with the same fill — same look, but nothing to drag. A plain function
  // (not a component) so it doesn't get remounted with fresh state on every render.
  const paramTrack = (args: { val: number; min: number; max: number; step: number; onChange: (v: number) => void }) =>
    locked ? (
      <div style={{ height: 4, borderRadius: 2, ...sliderStyle(args.val, args.min, args.max) }} />
    ) : (
      <input type="range" min={args.min} max={args.max} step={args.step} value={args.val}
        onChange={e => args.onChange(Number(e.target.value))}
        style={sliderStyle(args.val, args.min, args.max)} />
    );

  return (
    <div>
      <style>{`
        input[type=range] { -webkit-appearance: none; width: 100%; height: 4px; border-radius: 2px; outline: none; cursor: pointer; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 20px; height: 20px; border-radius: 50%; background: ${t.gold}; cursor: pointer; box-shadow: 0 2px 8px rgba(217,186,160,0.4); }
        input[type=range]::-moz-range-thumb { width: 20px; height: 20px; border-radius: 50%; background: ${t.gold}; cursor: pointer; border: none; }
      `}</style>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : (locked ? '1fr 1fr 1fr' : '1fr 1fr'), gap: isMobile ? 28 : 36, alignItems: 'stretch' }}>

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
              {paramTrack({ val, min: cfg.min, max: cfg.max, step: cfg.step, onChange: set })}
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
            {paramTrack({ val: appreciation, min: 0, max: 15, step: 0.5, onChange: setAppreciation })}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              <span style={{ color: t.txt4, fontSize: '0.62rem' }}>0%</span>
              <span style={{ color: t.gold3, fontSize: '0.62rem' }}>
                {initialAppreciationRate
                  ? (isAr ? 'متوسط المنطقة' : 'Region avg')
                  : (isAr ? 'متوسط إسطنبول: 6-8%' : 'Istanbul avg: 6-8%')}
              </span>
              <span style={{ color: t.txt4, fontSize: '0.62rem' }}>15%</span>
            </div>
          </div>

          {/* Years */}
          <div style={{ marginBottom: 26 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ color: t.txt3, fontSize: '0.82rem' }}>{tr('calc.years')}</span>
              <span style={{ fontFamily: "'Marcellus', serif", color: t.gold, fontSize: '1rem' }}>{years} {tr('unit.year')}</span>
            </div>
            {paramTrack({ val: years, min: 1, max: 20, step: 1, onChange: setYears })}
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
            {paramTrack({ val: expenses, min: 0, max: 30, step: 1, onChange: setExpenses })}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              <span style={{ color: t.txt4, fontSize: '0.62rem' }}>0%</span>
              <span style={{ color: t.gold3, fontSize: '0.62rem' }}>{isAr ? 'الافتراضي: 15%' : 'Default: 15%'}</span>
              <span style={{ color: t.txt4, fontSize: '0.62rem' }}>30%</span>
            </div>
          </div>
        </div>

        {/* ── Results ──────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Current figures — where the investment stands today, no projection involved */}
          <div style={{ background: t.altBg, border: `1px solid ${t.border}`, borderRadius: 8, padding: '20px 18px' }}>
            <h3 style={{ fontFamily: "'Marcellus', serif", color: t.txt, fontSize: '0.95rem', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <DollarSign size={15} color={t.gold} /> {tr('calc.currentMetrics.title')}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: tr('calc.initialInvestment'), val: formatPrice(price) },
                { label: tr('calc.grossYield'), val: `${res.grossYield.toFixed(2)}%` },
                { label: tr('calc.netYield'), val: `${res.netYield.toFixed(2)}%` },
                { label: tr('calc.monthlyNet'), val: formatPrice(res.monthlyNet) },
                {
                  label: tr('calc.paybackPeriod'),
                  val: Number.isFinite(res.paybackYears)
                    ? `${res.paybackYears.toFixed(1)} ${isAr ? 'سنة' : 'yrs'}`
                    : '—',
                  bold: true, gold: true,
                },
              ].map(({ label, val, bold, gold }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10, borderBottom: `1px solid ${t.border}` }}>
                  <span style={{ color: t.txt3, fontSize: '0.8rem' }}>{label}</span>
                  <span style={{ fontFamily: bold ? "'Marcellus', serif" : 'inherit', color: gold ? t.gold : t.txt, fontSize: bold ? '1rem' : '0.86rem', fontWeight: bold ? 700 : 400 }}>{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Projection — everything that depends on the appreciation rate + holding period */}
          <div style={{ background: t.altBg, border: `1px solid ${t.border}`, borderRadius: 8, padding: '20px 18px' }}>
            <h3 style={{ fontFamily: "'Marcellus', serif", color: t.txt, fontSize: '0.95rem', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <TrendingUp size={15} color={t.gold} /> {tr('calc.projection.title')} {years} {tr('calc.finalValueSuffix')}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: `${tr('calc.finalValue')} ${years} ${tr('calc.finalValueSuffix')}`, val: formatPrice(res.finalValue) },
                { label: tr('calc.capitalGain'), val: formatPrice(res.capitalGain) },
                { label: tr('calc.totalRent'), val: formatPrice(res.totalRentNet) },
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
          {!hideCta && (
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
          )}
        </div>

        {/* ── Value-over-time chart — own column, in place of the empty gap ── */}
        {locked && (
          <div style={{ background: t.altBg, border: `1px solid ${t.border}`, borderRadius: 8, padding: '20px 18px' }}>
            <ROIValueChart
              data={res.table.map(row => ({ yr: row.yr, val: row.val }))}
              formatPrice={formatPrice}
              title={isAr ? `توقع قيمة العقار خلال ${years} سنوات` : `Projected property value over ${years} years`}
              isAr={isAr}
            />
          </div>
        )}
      </div>

      {/* Year-by-year table */}
      <YearTable res={res} years={years} t={t} isMobile={isMobile} formatPrice={formatPrice} isAr={isAr} tr={tr} />
    </div>
  );
}

function YearTable({ res, years, t, isMobile, formatPrice, isAr, tr }: {
  res: ReturnType<typeof calcROI>; years: number; t: ReturnType<typeof useTheme>['t']; isMobile: boolean; formatPrice: (n: number) => string; isAr: boolean; tr: ReturnType<typeof useT>;
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
        <div style={{ marginTop: 16, border: `1px solid ${t.border}`, borderRadius: 8, overflow: 'auto' }}>
          <div style={{ minWidth: isMobile ? 480 : undefined }}>
            <div style={{
              display: 'grid', gridTemplateColumns: isMobile ? '50px 1fr 1fr 1fr' : '60px 1fr 1fr 1fr 1fr',
              background: '#060606', borderBottom: `1px solid ${t.border}`,
              padding: '12px 16px', gap: 8,
            }}>
              {[
                tr('calc.table.year'),
                tr('calc.table.propertyValue'),
                !isMobile ? tr('calc.table.capitalGain') : null,
                tr('calc.table.rentIncome'),
                tr('calc.table.totalReturn'),
              ].filter(Boolean).map(h => (
                <div key={h!} style={{ color: t.txt4, fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{h}</div>
              ))}
            </div>
            {res.table.map(({ yr, val, capitalGainAtYear, cumRent, total }) => (
              <div key={yr} style={{
                display: 'grid', gridTemplateColumns: isMobile ? '50px 1fr 1fr 1fr' : '60px 1fr 1fr 1fr 1fr',
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
                {!isMobile && <div style={{ color: t.txt2, fontSize: '0.82rem' }}>{formatPrice(capitalGainAtYear)}</div>}
                <div style={{ color: t.txt2, fontSize: '0.82rem' }}>{formatPrice(cumRent)}</div>
                <div style={{ color: total > 0 ? '#4ade80' : '#f87171', fontSize: '0.82rem', fontWeight: 600 }}>{formatPrice(total)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
