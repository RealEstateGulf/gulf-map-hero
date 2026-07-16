import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import AdminHeader from '@/components/admin/AdminHeader';
import Link from 'next/link';
import { Plus, BookOpen } from 'lucide-react';

export default async function InsightsPage() {
  const session = await getSession();
  const posts = await prisma.insightPost.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <>
      <AdminHeader title="Blog / Insights" userName={session?.name} userRole={session?.role} />
      <main style={{ flex: 1, overflowY: 'auto', padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h2 style={{ color: '#fff', fontSize: '1rem', fontWeight: 600, margin: 0 }}>Blog Yazıları ({posts.length})</h2>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', margin: '4px 0 0' }}>AR/EN içerikli blog yazılarını yönet</p>
          </div>
          <Link href="/admin/insights/new" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 18px', background: '#D4AF37', borderRadius: 9, color: '#000', fontSize: '0.82rem', fontWeight: 700, textDecoration: 'none' }}>
            <Plus size={14} />Yeni Yazı
          </Link>
        </div>

        <div style={{ background: '#0d0d18', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, overflow: 'hidden' }}>
          {posts.length === 0 ? (
            <div style={{ padding: '64px 24px', textAlign: 'center' }}>
              <BookOpen size={36} color="rgba(255,255,255,0.1)" style={{ margin: '0 auto 12px', display: 'block' }} />
              <p style={{ color: 'rgba(255,255,255,0.3)', margin: '0 0 8px' }}>Henüz blog yazısı yok</p>
              <Link href="/admin/insights/new" style={{ color: '#D4AF37', fontSize: '0.8rem', textDecoration: 'none' }}>İlk yazıyı ekle →</Link>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {['Başlık', 'Slug', 'Kategori', 'Okuma', 'Durum', 'İşlem'].map(h => (
                    <th key={h} style={{ padding: '11px 16px', textAlign: 'left', color: 'rgba(255,255,255,0.35)', fontSize: '0.7rem', fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {posts.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td style={{ padding: '13px 16px', maxWidth: 240 }}>
                      <div style={{ color: '#fff', fontSize: '0.8rem', fontWeight: 500 }}>{p.titleEn}</div>
                      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', direction: 'rtl' }}>{p.titleAr}</div>
                    </td>
                    <td style={{ padding: '13px 16px', color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', fontFamily: 'monospace' }}>{p.slug}</td>
                    <td style={{ padding: '13px 16px' }}>
                      <span style={{ padding: '3px 9px', borderRadius: 99, fontSize: '0.65rem', background: 'rgba(96,165,250,0.1)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.2)' }}>{p.category}</span>
                    </td>
                    <td style={{ padding: '13px 16px', color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>{p.readTime} dk</td>
                    <td style={{ padding: '13px 16px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: 99, fontSize: '0.65rem', fontWeight: 600, background: p.published ? 'rgba(52,211,153,0.1)' : 'rgba(255,80,80,0.08)', color: p.published ? '#34d399' : '#ff6060', border: `1px solid ${p.published ? 'rgba(52,211,153,0.2)' : 'rgba(255,80,80,0.15)'}` }}>
                        {p.published ? 'Yayında' : 'Taslak'}
                      </span>
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <Link href={`/admin/insights/${p.id}`} style={{ display: 'inline-flex', padding: '5px 12px', borderRadius: 7, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', fontSize: '0.72rem', textDecoration: 'none' }}>
                        Düzenle
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </>
  );
}
