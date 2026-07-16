import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import AdminHeader from '@/components/admin/AdminHeader';
import Link from 'next/link';
import { Search, Globe } from 'lucide-react';

const PAGE_NAMES: Record<string, string> = {
  home: 'Ana Sayfa',
  about: 'Hakkımızda',
  services: 'Hizmetler',
  turkey: 'Türkiye',
  citizenship: 'Vatandaşlık',
  vip: 'VIP',
  contact: 'İletişim',
  properties: 'İlanlar',
  insights: 'Blog / Insights',
};

export default async function SeoPage() {
  const session = await getSession();
  const seoSettings = await prisma.seoSettings.findMany({ orderBy: { pageKey: 'asc' } });

  return (
    <>
      <AdminHeader title="SEO Ayarları" userName={session?.name} userRole={session?.role} />
      <main style={{ flex: 1, overflowY: 'auto', padding: '28px' }}>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ color: '#fff', fontSize: '1rem', fontWeight: 600, margin: '0 0 4px' }}>SEO Yönetimi</h2>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', margin: 0 }}>
            Her sayfa için Türkçe, İngilizce ve Arapça SEO meta içerikleri yönet.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
          {seoSettings.map(s => {
            const name = PAGE_NAMES[s.pageKey] ?? s.pageKey;
            const hasAr = !!s.titleAr;
            const hasEn = !!s.titleEn;
            return (
              <Link
                key={s.id}
                href={`/admin/seo/${s.pageKey}`}
                style={{
                  display: 'block', textDecoration: 'none',
                  background: '#0d0d18',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 14, padding: '20px',
                  transition: 'border-color 0.15s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 9,
                      background: 'rgba(212,175,55,0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Search size={16} color="#D4AF37" />
                    </div>
                    <div>
                      <div style={{ color: '#fff', fontSize: '0.88rem', fontWeight: 600 }}>{name}</div>
                      <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.68rem' }}>/{s.pageKey}</div>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <span style={{
                    padding: '2px 8px', borderRadius: 99, fontSize: '0.62rem',
                    background: hasAr ? 'rgba(52,211,153,0.1)' : 'rgba(255,80,80,0.08)',
                    color: hasAr ? '#34d399' : '#ff6060',
                    border: `1px solid ${hasAr ? 'rgba(52,211,153,0.2)' : 'rgba(255,80,80,0.15)'}`,
                  }}>AR {hasAr ? '✓' : '✗'}</span>
                  <span style={{
                    padding: '2px 8px', borderRadius: 99, fontSize: '0.62rem',
                    background: hasEn ? 'rgba(52,211,153,0.1)' : 'rgba(255,80,80,0.08)',
                    color: hasEn ? '#34d399' : '#ff6060',
                    border: `1px solid ${hasEn ? 'rgba(52,211,153,0.2)' : 'rgba(255,80,80,0.15)'}`,
                  }}>EN {hasEn ? '✓' : '✗'}</span>
                  <span style={{
                    padding: '2px 8px', borderRadius: 99, fontSize: '0.62rem',
                    background: s.keywords ? 'rgba(96,165,250,0.1)' : 'rgba(255,255,255,0.04)',
                    color: s.keywords ? '#60a5fa' : 'rgba(255,255,255,0.3)',
                    border: `1px solid ${s.keywords ? 'rgba(96,165,250,0.2)' : 'rgba(255,255,255,0.06)'}`,
                  }}>Keywords</span>
                </div>
                <div style={{ marginTop: 12, color: '#D4AF37', fontSize: '0.72rem' }}>
                  Düzenle →
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </>
  );
}
