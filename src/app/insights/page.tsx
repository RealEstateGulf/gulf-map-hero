'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Clock, ArrowLeft } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useIsMobile } from '@/hooks/useResponsive';
import { useScrollReveal, rv } from '@/hooks/useScrollReveal';
import { useLanguage } from '@/context/LanguageContext';
import { useT } from '@/hooks/useT';
import { useContent } from '@/hooks/useContent';
import { articles, type ArticleCategory } from '@/data/articles';
import Navbar from '@/components/map/Navbar';
import FooterSection from '@/components/sections/FooterSection';

type DbPost = {
  id: string; slug: string; titleAr: string; titleEn: string;
  excerptAr: string; excerptEn: string; coverImage?: string | null;
  category: string; readTime: number; featured: boolean;
};

export default function InsightsPage() {
  const { t } = useTheme();
  const isMobile = useIsMobile();
  const { dir, isAr } = useLanguage();
  const tr = useT();
  const { get } = useContent('insights');
  const [cat, setCat] = useState<ArticleCategory | 'all'>('all');
  const filtered = cat === 'all' ? articles : articles.filter(a => a.category === cat);
  const featured = articles[0];
  const [dbPosts, setDbPosts] = useState<DbPost[]>([]);

  useEffect(() => {
    fetch('/api/insights')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setDbPosts(data); })
      .catch(() => {});
  }, []);

  const CATEGORIES: { code: ArticleCategory | 'all'; label: string }[] = [
    { code: 'all', label: tr('insights.all') },
    { code: 'market', label: isAr ? 'تحليل السوق' : 'Market Analysis' },
    { code: 'guide', label: isAr ? 'دليل الاستثمار' : 'Investment Guide' },
    { code: 'cities', label: isAr ? 'المدن التركية' : 'Turkish Cities' },
    { code: 'legal', label: isAr ? 'قانوني وإداري' : 'Legal & Admin' },
    { code: 'tips', label: isAr ? 'نصائح وخبرات' : 'Tips & Expertise' },
  ];

  return (
    <main style={{ background: t.bg, direction: dir, minHeight: '100vh' }}>
      <Navbar />

      {/* Hero */}
      <div style={{ background: '#060606', borderBottom: `1px solid ${t.gold4}`, padding: isMobile ? '110px 18px 52px' : '130px 32px 70px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <p style={{ color: t.gold, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ width: 28, height: 1, background: t.gold, display: 'inline-block' }} />
            {get('hero.title', isAr, tr('insights.title'))}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1.2fr', gap: isMobile ? 28 : 56, alignItems: 'center' }}>
            <div>
              <h1 style={{ fontFamily: "'Marcellus', serif", color: '#fff', fontSize: isMobile ? 'clamp(1.8rem,7vw,2.6rem)' : 'clamp(2.4rem,4vw,3.2rem)', lineHeight: 1.2, marginBottom: 14 }}>
                {isAr ? 'تحليلات وبصيرة' : 'Analysis & Insight'}
                <br /><em style={{ color: t.gold }}>{isAr ? 'للمستثمر الذكي' : 'For the Smart Investor'}</em>
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', lineHeight: 1.85, maxWidth: 400 }}>
                {get('hero.subtitle', isAr,
                  isAr
                    ? 'أعمق تحليلات سوق العقارات التركية — مكتوبة بخبرة ميدانية حقيقية، لمساعدتك في اتخاذ قرارات أفضل.'
                    : 'In-depth Turkish real estate market analysis — written with real field expertise to help you make better decisions.'
                )}
              </p>
            </div>
            {/* Featured article teaser */}
            <Link href={`/insights/${featured.slug}`} style={{ textDecoration: 'none' }}>
              <div style={{
                position: 'relative', height: isMobile ? 220 : 260, borderRadius: 8, overflow: 'hidden',
                border: `1px solid ${t.gold4}`, transition: 'border-color 0.3s',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = t.gold3; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = t.gold4; }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={featured.photo} alt={featured.titleAr} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.6s cubic-bezier(0.22,1,0.36,1)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.05)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'; }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)' }} />
                <div style={{ position: 'absolute', top: 12, right: 12 }}>
                  <span style={{ background: t.gold, color: t.goldText, fontSize: '0.58rem', fontWeight: 700, padding: '3px 10px', borderRadius: 3, letterSpacing: '0.1em' }}>
                    {isAr ? 'الأحدث' : 'Latest'}
                  </span>
                </div>
                <div style={{ position: 'absolute', bottom: 0, right: 0, left: 0, padding: '14px 16px' }}>
                  <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.62rem', marginBottom: 6 }}>{featured.categoryAr} · {featured.readTime} {tr('insights.readTime')}</div>
                  <div style={{ fontFamily: "'Marcellus', serif", color: '#fff', fontSize: '0.95rem', lineHeight: 1.4 }}>{featured.titleAr}</div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Filter chips */}
      <div style={{ background: t.altBg, borderBottom: `1px solid ${t.border}`, padding: `0 ${isMobile ? 18 : 32}px` }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 4, overflowX: 'auto', padding: '0', scrollbarWidth: 'none' }}>
          {CATEGORIES.map(({ code, label }) => (
            <button
              key={code}
              onClick={() => setCat(code)}
              style={{
                background: cat === code ? t.gold : 'none',
                border: 'none', color: cat === code ? t.goldText : t.txt3,
                fontSize: '0.75rem', fontWeight: cat === code ? 700 : 400,
                padding: '14px 16px', cursor: 'pointer', whiteSpace: 'nowrap',
                borderBottom: cat === code ? 'none' : '2px solid transparent',
                transition: 'all 0.2s', fontFamily: 'inherit',
              }}
              onMouseEnter={e => { if (cat !== code) { e.currentTarget.style.color = t.gold; e.currentTarget.style.borderBottomColor = t.gold3; } }}
              onMouseLeave={e => { if (cat !== code) { e.currentTarget.style.color = t.txt3; e.currentTarget.style.borderBottomColor = 'transparent'; } }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* DB Posts (from admin) */}
      {dbPosts.length > 0 && (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '36px 18px 0' : '60px 32px 0' }}>
          <p style={{ color: t.gold, fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 20, height: 1, background: t.gold, display: 'inline-block' }} />
            {isAr ? 'أحدث المقالات' : 'Latest Articles'}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: 20, marginBottom: 40 }}>
            {dbPosts.map(post => (
              <Link key={post.id} href={`/insights/${post.slug}`} style={{ textDecoration: 'none' }}>
                <article style={{
                  background: t.altBg, border: `1px solid ${t.border}`,
                  borderRadius: 8, overflow: 'hidden',
                  transition: 'border-color 0.3s, transform 0.35s cubic-bezier(0.22,1,0.36,1)',
                  height: '100%', display: 'flex', flexDirection: 'column',
                }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = t.gold3; el.style.transform = 'translateY(-4px)'; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = t.border; el.style.transform = 'translateY(0)'; }}
                >
                  <div style={{ height: 180, overflow: 'hidden', position: 'relative', flexShrink: 0, background: 'rgba(212,175,55,0.06)' }}>
                    {post.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={post.coverImage} alt={isAr ? post.titleAr : post.titleEn} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: t.gold, fontSize: '2rem', opacity: 0.3 }}>✦</span>
                      </div>
                    )}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)' }} />
                    <span style={{ position: 'absolute', top: 10, right: 10, background: t.gold, color: '#000', fontSize: '0.55rem', fontWeight: 700, padding: '2px 8px', borderRadius: 3 }}>
                      {isAr ? 'جديد' : 'NEW'}
                    </span>
                  </div>
                  <div style={{ padding: '18px 18px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h2 style={{ fontFamily: "'Marcellus', serif", color: t.txt, fontSize: '0.95rem', lineHeight: 1.5, margin: '0 0 10px', flex: 1, direction: isAr ? 'rtl' : 'ltr' }}>
                      {isAr ? post.titleAr : post.titleEn}
                    </h2>
                    <p style={{ color: t.txt4, fontSize: '0.76rem', lineHeight: 1.7, margin: '0 0 14px', direction: isAr ? 'rtl' : 'ltr' }}>
                      {(isAr ? post.excerptAr : post.excerptEn).slice(0, 100)}{(isAr ? post.excerptAr : post.excerptEn).length > 100 ? '...' : ''}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: `1px solid ${t.border}` }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: t.txt4, fontSize: '0.65rem' }}>
                        <Clock size={11} />{post.readTime} {tr('insights.readTime')}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: t.gold, fontSize: '0.65rem', fontWeight: 600 }}>
                        {tr('insights.readMore')} <ArrowLeft size={11} />
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Articles grid */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '36px 18px 60px' : '60px 32px 100px' }}>
        <ArticlesGrid articles={filtered} t={t} isMobile={isMobile} isAr={isAr} tr={tr} />
      </div>

      <FooterSection />
    </main>
  );
}

function ArticlesGrid({ articles, t, isMobile, isAr, tr }: {
  articles: typeof import('@/data/articles').articles;
  t: any; isMobile: boolean; isAr: boolean; tr: (key: any) => string;
}) {
  const { ref, visible } = useScrollReveal();
  return (
    <div ref={ref} style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: 20 }}>
      {articles.map((article, i) => (
        <Link key={article.slug} href={`/insights/${article.slug}`} style={{ textDecoration: 'none' }}>
          <article style={{
            ...rv(visible, 0.07 * (i % 6)),
            background: t.altBg, border: `1px solid ${t.border}`,
            borderRadius: 8, overflow: 'hidden',
            transition: 'border-color 0.3s, transform 0.35s cubic-bezier(0.22,1,0.36,1)',
            height: '100%', display: 'flex', flexDirection: 'column',
          }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = t.gold3; el.style.transform = 'translateY(-4px)'; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = t.border; el.style.transform = 'translateY(0)'; }}
          >
            <div style={{ height: 180, overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={article.photo} alt={article.titleAr} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.6s cubic-bezier(0.22,1,0.36,1)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.05)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'; }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)' }} />
              <span style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)', color: t.gold, fontSize: '0.58rem', fontWeight: 600, padding: '3px 10px', borderRadius: 3 }}>
                {article.categoryAr}
              </span>
            </div>
            <div style={{ padding: '18px 18px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <h2 style={{ fontFamily: "'Marcellus', serif", color: t.txt, fontSize: '0.95rem', lineHeight: 1.5, margin: '0 0 10px', flex: 1 }}>
                {article.titleAr}
              </h2>
              <p style={{ color: t.txt4, fontSize: '0.76rem', lineHeight: 1.7, margin: '0 0 14px' }}>
                {article.excerpt.slice(0, 100)}...
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: `1px solid ${t.border}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: t.txt4, fontSize: '0.65rem' }}>
                  <Clock size={11} />
                  {article.readTime} {tr('insights.readTime')}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: t.gold, fontSize: '0.65rem', fontWeight: 600 }}>
                  {tr('insights.readMore')} <ArrowLeft size={11} />
                </div>
              </div>
            </div>
          </article>
        </Link>
      ))}
    </div>
  );
}
