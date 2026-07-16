'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { Clock, ArrowRight, Calendar, User } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useIsMobile } from '@/hooks/useResponsive';
import { useLanguage } from '@/context/LanguageContext';
import { useT } from '@/hooks/useT';
import { getArticle, articles } from '@/data/articles';
import Navbar from '@/components/map/Navbar';
import FooterSection from '@/components/sections/FooterSection';

type DbPost = {
  id: string; slug: string; titleAr: string; titleEn: string;
  excerptAr: string; excerptEn: string; contentAr: string; contentEn: string;
  coverImage?: string | null; category: string; readTime: number;
};

export default function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const staticArticle = getArticle(slug);
  const { t } = useTheme();
  const isMobile = useIsMobile();
  const { dir, isAr } = useLanguage();
  const tr = useT();
  const [dbPost, setDbPost] = useState<DbPost | null>(null);
  const [loading, setLoading] = useState(!staticArticle);

  useEffect(() => {
    if (staticArticle) return; // static article found, no need to fetch
    fetch(`/api/insights/${slug}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setDbPost(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug, staticArticle]);

  if (loading) {
    return (
      <main style={{ background: t.bg, direction: dir, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Navbar />
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>Yükleniyor...</div>
      </main>
    );
  }

  // DB post rendering
  if (dbPost) {
    const title = isAr ? dbPost.titleAr : dbPost.titleEn;
    const content = isAr ? dbPost.contentAr : dbPost.contentEn;
    const paragraphs = content.split('\n\n').filter(Boolean);
    return (
      <main style={{ background: t.bg, direction: dir, minHeight: '100vh' }}>
        <Navbar />
        <div style={{ maxWidth: 800, margin: '0 auto', padding: isMobile ? '100px 18px 60px' : '130px 32px 80px' }}>
          <Link href="/insights" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: t.gold, fontSize: '0.75rem', textDecoration: 'none', marginBottom: 32 }}>
            <ArrowRight size={13} style={{ transform: isAr ? 'none' : 'rotate(180deg)' }} />
            {isAr ? 'العودة إلى المقالات' : 'Back to Articles'}
          </Link>
          {dbPost.coverImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={dbPost.coverImage} alt={title} style={{ width: '100%', height: 360, objectFit: 'cover', borderRadius: 10, marginBottom: 36, display: 'block' }} />
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18, flexWrap: 'wrap' }}>
            <span style={{ background: t.gold, color: '#000', fontSize: '0.6rem', fontWeight: 700, padding: '3px 10px', borderRadius: 3 }}>{dbPost.category}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: t.txt4, fontSize: '0.7rem' }}><Clock size={12} />{dbPost.readTime} {tr('insights.readTime')}</div>
          </div>
          <h1 style={{ fontFamily: "'Marcellus', serif", color: t.txt, fontSize: isMobile ? '1.6rem' : '2.2rem', lineHeight: 1.3, marginBottom: 20 }}>{title}</h1>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {paragraphs.map((p, i) => (
              <p key={i} style={{ color: t.txt2, fontSize: '0.95rem', lineHeight: 1.9, margin: 0 }}>{p}</p>
            ))}
          </div>
        </div>
        <FooterSection />
      </main>
    );
  }

  if (!staticArticle) {
    return (
      <main style={{ background: t.bg, direction: dir, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Navbar />
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: 16 }}>Makale bulunamadı</p>
          <Link href="/insights" style={{ color: t.gold, textDecoration: 'none' }}>← Geri dön</Link>
        </div>
      </main>
    );
  }

  const article = staticArticle;
  const related = articles.filter(a => a.slug !== slug && a.category === article.category).slice(0, 3);
  const paragraphs = article.content.split('\n\n').filter(Boolean);

  return (
    <main style={{ background: t.bg, direction: dir, minHeight: '100vh' }}>
      <Navbar />

      {/* Hero image */}
      <div style={{ position: 'relative', height: isMobile ? '55vw' : '45vh', overflow: 'hidden', maxHeight: 480, marginTop: 64 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={article.photo} alt={article.titleAr} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)' }} />
        <div style={{ position: 'absolute', bottom: 0, right: 0, left: 0, padding: isMobile ? '20px 18px' : '32px 48px' }}>
          <span style={{ background: t.gold, color: t.goldText, fontSize: '0.58rem', fontWeight: 700, padding: '3px 10px', borderRadius: 3, letterSpacing: '0.1em', display: 'inline-block', marginBottom: 10 }}>
            {article.categoryAr}
          </span>
          <h1 style={{ fontFamily: "'Marcellus', serif", color: '#fff', fontSize: isMobile ? 'clamp(1.3rem,5vw,2rem)' : 'clamp(1.8rem,3vw,2.8rem)', lineHeight: 1.3, margin: 0, maxWidth: 800 }}>
            {article.titleAr}
          </h1>
        </div>
      </div>

      {/* Article content */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: isMobile ? '28px 18px 60px' : '48px 32px 80px' }}>

        {/* Meta */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 36, paddingBottom: 24, borderBottom: `1px solid ${t.border}`, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: t.gold5, border: `1px solid ${t.gold4}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={16} color={t.gold} strokeWidth={1.4} />
            </div>
            <div>
              <div style={{ color: t.txt, fontSize: '0.82rem', fontWeight: 600 }}>{article.author.name}</div>
              <div style={{ color: t.txt4, fontSize: '0.68rem' }}>{article.author.role}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: t.txt4, fontSize: '0.72rem' }}>
            <Calendar size={13} />
            {new Date(article.date).toLocaleDateString(isAr ? 'ar-SA' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: t.txt4, fontSize: '0.72rem' }}>
            <Clock size={13} />
            {article.readTime} {tr('insights.readTime')}
          </div>
        </div>

        {/* Excerpt */}
        <p style={{ fontFamily: "'Marcellus', serif", color: t.txt2, fontSize: isMobile ? '1rem' : '1.1rem', lineHeight: 1.85, marginBottom: 32, fontStyle: 'italic' }}>
          {article.excerpt}
        </p>

        {/* Content paragraphs */}
        <div>
          {paragraphs.map((para, i) => {
            const isBold = para.startsWith('**') && para.includes(':**');
            if (isBold) {
              const [, boldPart, rest] = para.match(/\*\*(.+?)\*\*:?\s*(.*)/) ?? ['', '', para];
              return (
                <div key={i} style={{ marginBottom: 22 }}>
                  <div style={{ fontFamily: "'Marcellus', serif", color: t.gold, fontSize: '1rem', marginBottom: 8 }}>{boldPart}</div>
                  {rest && <p style={{ color: t.txt2, fontSize: '0.9rem', lineHeight: 1.9, margin: 0 }}>{rest}</p>}
                </div>
              );
            }
            if (para.startsWith('*') && para.endsWith('*')) {
              return <p key={i} style={{ color: t.txt3, fontSize: '0.82rem', lineHeight: 1.85, margin: '0 0 14px', paddingRight: 14, borderRight: `2px solid ${t.gold3}`, fontStyle: 'italic' }}>{para.replace(/\*/g, '')}</p>;
            }
            return <p key={i} style={{ color: t.txt2, fontSize: '0.9rem', lineHeight: 1.9, margin: '0 0 20px' }}>{para}</p>;
          })}
        </div>

        {/* CTA box */}
        <div style={{ background: t.altBg, border: `1px solid ${t.gold4}`, borderRadius: 8, padding: '24px 24px', marginTop: 40 }}>
          <p style={{ fontFamily: "'Marcellus', serif", color: t.txt, fontSize: '1rem', marginBottom: 12 }}>
            {tr('insights.cta.title')}
          </p>
          <p style={{ color: t.txt3, fontSize: '0.82rem', lineHeight: 1.75, marginBottom: 18 }}>
            {tr('insights.cta.sub')}
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <a href="/contact" style={{ background: t.gold, borderRadius: 5, color: t.goldText, fontSize: '0.75rem', fontWeight: 700, padding: '10px 20px', textDecoration: 'none', letterSpacing: '0.06em', transition: 'opacity 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.85'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1'; }}
            >{tr('cta.consult')}</a>
            <a href="/calculator" style={{ background: 'transparent', border: `1px solid ${t.border2}`, borderRadius: 5, color: t.txt2, fontSize: '0.75rem', padding: '10px 18px', textDecoration: 'none', transition: 'all 0.2s' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = t.gold3; el.style.color = t.gold; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = t.border2; el.style.color = t.txt2; }}
            >{tr('insights.tryCalc')}</a>
          </div>
        </div>

        {/* Back link */}
        <div style={{ marginTop: 36, paddingTop: 24, borderTop: `1px solid ${t.border}` }}>
          <Link href="/insights" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: t.gold, fontSize: '0.8rem', textDecoration: 'none', transition: 'gap 0.2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.gap = '12px'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.gap = '6px'; }}
          >
            <ArrowRight size={14} /> {tr('cta.backToArticles')}
          </Link>
        </div>
      </div>

      {/* Related articles */}
      {related.length > 0 && (
        <div style={{ background: t.altBg, borderTop: `1px solid ${t.border}`, padding: isMobile ? '40px 18px 52px' : '60px 32px 72px' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <h3 style={{ fontFamily: "'Marcellus', serif", color: t.txt, fontSize: '1.1rem', marginBottom: 28 }}>{tr('insights.related')}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: 16 }}>
              {related.map(a => (
                <Link key={a.slug} href={`/insights/${a.slug}`} style={{ textDecoration: 'none' }}>
                  <div style={{ background: t.bg, border: `1px solid ${t.border}`, borderRadius: 8, overflow: 'hidden', transition: 'border-color 0.25s, transform 0.3s cubic-bezier(0.22,1,0.36,1)' }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = t.gold3; el.style.transform = 'translateY(-3px)'; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = t.border; el.style.transform = 'translateY(0)'; }}
                  >
                    <div style={{ height: 130, overflow: 'hidden' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={a.photo} alt={a.titleAr} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </div>
                    <div style={{ padding: '14px 14px' }}>
                      <div style={{ color: t.gold, fontSize: '0.6rem', fontWeight: 600, marginBottom: 6 }}>{a.categoryAr}</div>
                      <div style={{ fontFamily: "'Marcellus', serif", color: t.txt, fontSize: '0.85rem', lineHeight: 1.5 }}>{a.titleAr}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <FooterSection />
    </main>
  );
}
