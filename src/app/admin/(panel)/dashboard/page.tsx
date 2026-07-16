import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import AdminHeader from '@/components/admin/AdminHeader';
import { Building2, Users, UserCheck, Eye } from 'lucide-react';

export default async function DashboardPage() {
  const session = await getSession();

  const [totalListings, publishedListings, totalUsers, totalConsultants] = await Promise.all([
    prisma.property.count(),
    prisma.property.count({ where: { published: true } }),
    prisma.user.count(),
    prisma.consultant.count(),
  ]);

  const recentListings = await prisma.property.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: { id: true, titleAr: true, titleEn: true, city: true, cityEn: true, price: true, published: true, category: true },
  });

  const stats = [
    { label: 'Toplam İlan', value: totalListings, sub: `${publishedListings} yayında`, icon: Building2, color: '#D4AF37' },
    { label: 'Kullanıcılar', value: totalUsers, sub: 'Aktif hesaplar', icon: Users, color: '#60a5fa' },
    { label: 'Danışmanlar', value: totalConsultants, sub: 'Kayıtlı danışman', icon: UserCheck, color: '#34d399' },
    { label: 'Sayfa Görünüm', value: '—', sub: 'Yakında', icon: Eye, color: '#a78bfa' },
  ];

  return (
    <>
      <AdminHeader title="Dashboard" userName={session?.name} userRole={session?.role} />
      <main style={{ flex: 1, overflowY: 'auto', padding: '28px' }}>

        {/* Welcome */}
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 700, margin: '0 0 4px' }}>
            Hoş geldin, {session?.name} 👋
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', margin: 0 }}>
            Gulf Invest Admin Paneli — Tüm içerik ve ilanları buradan yönetebilirsin.
          </p>
        </div>

        {/* Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
          {stats.map(({ label, value, sub, icon: Icon, color }) => (
            <div
              key={label}
              style={{
                background: '#0d0d18',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 14,
                padding: '20px 22px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div
                  style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: `${color}18`,
                    border: `1px solid ${color}33`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <Icon size={18} color={color} />
                </div>
              </div>
              <div style={{ color: '#fff', fontSize: '1.8rem', fontWeight: 700, lineHeight: 1 }}>{value}</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', marginTop: 4 }}>{label}</div>
              <div style={{ color, fontSize: '0.68rem', marginTop: 4 }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* Recent Listings */}
        <div
          style={{
            background: '#0d0d18',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 14,
            overflow: 'hidden',
          }}
        >
          <div style={{ padding: '18px 22px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 600, margin: 0 }}>Son Eklenen İlanlar</h3>
            <a href="/admin/listings" style={{ color: '#D4AF37', fontSize: '0.75rem', textDecoration: 'none' }}>Tümünü Gör →</a>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                {['İlan Başlığı (AR)', 'Şehir', 'Fiyat', 'Kategori', 'Durum'].map(h => (
                  <th key={h} style={{ padding: '10px 22px', textAlign: 'left', color: 'rgba(255,255,255,0.35)', fontSize: '0.7rem', fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentListings.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '32px 22px', textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: '0.85rem' }}>
                    Henüz ilan yok — ilk ilanı ekle!
                  </td>
                </tr>
              ) : (
                recentListings.map(p => (
                  <tr
                    key={p.id}
                    className="admin-dashboard-row"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', cursor: 'pointer' }}
                  >
                    <td style={{ padding: '12px 22px', color: '#fff', fontSize: '0.82rem', direction: 'rtl' }}>{p.titleAr}</td>
                    <td style={{ padding: '12px 22px', color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem' }}>{p.cityEn}</td>
                    <td style={{ padding: '12px 22px', color: '#D4AF37', fontSize: '0.82rem', fontWeight: 600 }}>${p.price}</td>
                    <td style={{ padding: '12px 22px', color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem' }}>{p.category}</td>
                    <td style={{ padding: '12px 22px' }}>
                      <span style={{
                        padding: '3px 10px', borderRadius: 999, fontSize: '0.65rem', fontWeight: 600,
                        background: p.published ? 'rgba(52,211,153,0.12)' : 'rgba(255,80,80,0.1)',
                        color: p.published ? '#34d399' : '#ff6060',
                        border: `1px solid ${p.published ? 'rgba(52,211,153,0.25)' : 'rgba(255,80,80,0.2)'}`,
                      }}>
                        {p.published ? 'Yayında' : 'Taslak'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}
