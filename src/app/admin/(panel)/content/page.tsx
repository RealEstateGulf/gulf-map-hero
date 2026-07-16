import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import AdminHeader from '@/components/admin/AdminHeader';
import Link from 'next/link';
import { FileText, ChevronRight } from 'lucide-react';

const PAGES: { key: string; label: string; desc: string }[] = [
  { key: 'home',        label: 'Ana Sayfa',      desc: 'Hero başlık, alt başlık, CTA butonları' },
  { key: 'about',       label: 'Hakkımızda',     desc: 'Şirket tanıtımı, değerler, istatistikler' },
  { key: 'services',    label: 'Hizmetler',      desc: 'Hizmet başlıkları ve açıklamaları' },
  { key: 'turkey',      label: 'Türkiye',        desc: 'Türkiye yatırım sayfası içerikleri' },
  { key: 'citizenship', label: 'Vatandaşlık',    desc: 'Yatırımla vatandaşlık içerikleri' },
  { key: 'vip',         label: 'VIP',            desc: 'VIP danışmanlık sayfası içerikleri' },
  { key: 'contact',     label: 'İletişim',       desc: 'İletişim formu ve bilgi içerikleri' },
  { key: 'properties',  label: 'İlanlar',        desc: 'İlanlar listesi sayfası içerikleri' },
  { key: 'insights',    label: 'Blog',           desc: 'Blog sayfası başlık ve açıklamaları' },
];

export default async function ContentPage() {
  const session = await getSession();

  // Count how many content rows each page has
  const counts = await prisma.pageContent.groupBy({
    by: ['pageKey'],
    _count: { key: true },
  });
  const countMap = Object.fromEntries(counts.map(c => [c.pageKey, c._count.key]));

  return (
    <>
      <AdminHeader title="Sayfa İçerikleri" userName={session?.name} userRole={session?.role} />
      <main style={{ flex: 1, overflowY: 'auto', padding: '28px' }}>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ color: '#fff', fontSize: '1rem', fontWeight: 600, margin: '0 0 4px' }}>
            AR / EN İçerik Yönetimi
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', margin: 0 }}>
            Her sayfa için Arapça ve İngilizce içerikleri ayrı ayrı düzenle. Sitedeki metinler buradan yönetilir.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {PAGES.map(p => {
            const count = countMap[p.key] ?? 0;
            return (
              <Link
                key={p.key}
                href={`/admin/content/${p.key}`}
                style={{
                  display: 'flex', alignItems: 'center', gap: 16,
                  padding: '18px 20px',
                  background: '#0d0d18',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 12, textDecoration: 'none',
                  transition: 'border-color 0.15s, background 0.15s',
                }}
                onMouseEnter={undefined}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                  background: 'rgba(212,175,55,0.08)',
                  border: '1px solid rgba(212,175,55,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <FileText size={16} color="#D4AF37" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.88rem', marginBottom: 2 }}>
                    {p.label}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.73rem' }}>
                    {p.desc}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{
                    padding: '3px 10px', borderRadius: 99, fontSize: '0.65rem',
                    background: count > 0 ? 'rgba(52,211,153,0.1)' : 'rgba(255,255,255,0.04)',
                    color: count > 0 ? '#34d399' : 'rgba(255,255,255,0.25)',
                    border: `1px solid ${count > 0 ? 'rgba(52,211,153,0.2)' : 'rgba(255,255,255,0.06)'}`,
                  }}>
                    {count > 0 ? `${count} içerik` : 'Boş'}
                  </span>
                  <ChevronRight size={16} color="rgba(255,255,255,0.25)" />
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </>
  );
}
