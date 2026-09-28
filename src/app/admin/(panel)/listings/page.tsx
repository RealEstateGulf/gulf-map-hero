import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import AdminHeader from '@/components/admin/AdminHeader';
import Link from 'next/link';
import { Building2, Plus, Star } from 'lucide-react';
import PropertyInstagramButton from '@/components/PropertyInstagramButton';

function parsePhotos(json: string): string[] {
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default async function ListingsPage() {
  const session = await getSession();
  const [listings, waSetting] = await Promise.all([
    prisma.property.findMany({
      orderBy: { createdAt: 'desc' },
      include: { agent: { select: { name: true } }, consultant: { select: { nameEn: true } } },
    }),
    prisma.pageContent.findFirst({ where: { pageKey: 'popup', key: 'wa_number' } }),
  ]);
  const waNumber = waSetting?.valueAr || '905072308453';
  const phoneDisplay = /^\d{12}$/.test(waNumber)
    ? `+${waNumber.slice(0, 2)} ${waNumber.slice(2, 5)} ${waNumber.slice(5, 8)} ${waNumber.slice(8, 10)} ${waNumber.slice(10, 12)}`
    : `+${waNumber}`;

  return (
    <>
      <AdminHeader title="İlanlar" userName={session?.name} userRole={session?.role} />
      <main style={{ flex: 1, overflowY: 'auto', padding: '28px' }}>
        
        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h2 style={{ color: '#fff', fontSize: '1rem', fontWeight: 600, margin: 0 }}>
              Tüm İlanlar ({listings.length})
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', margin: '4px 0 0' }}>
              Gayrimenkul ilanlarını yönet, AR/EN içerik düzenle
            </p>
          </div>
          <Link
            href="/admin/listings/new"
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '9px 18px', background: '#D4AF37',
              borderRadius: 9, color: '#000', fontSize: '0.82rem',
              fontWeight: 700, textDecoration: 'none',
            }}
          >
            <Plus size={15} />
            Yeni İlan
          </Link>
        </div>

        {/* Table */}
        <div style={{ background: '#0d0d18', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, overflow: 'hidden' }}>
          {listings.length === 0 ? (
            <div style={{ padding: '64px 24px', textAlign: 'center' }}>
              <Building2 size={36} color="rgba(255,255,255,0.1)" style={{ margin: '0 auto 12px', display: 'block' }} />
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.9rem', margin: 0 }}>Henüz ilan yok</p>
              <Link href="/admin/listings/new" style={{ color: '#D4AF37', fontSize: '0.8rem', textDecoration: 'none' }}>
                İlk ilanı ekle →
              </Link>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {['Başlık (AR/EN)', 'Şehir', 'Kategori', 'Fiyat', 'Temsilci', 'Durum', 'İşlem'].map(h => (
                    <th key={h} style={{ padding: '11px 16px', textAlign: 'left', color: 'rgba(255,255,255,0.35)', fontSize: '0.7rem', fontWeight: 500, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {listings.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td style={{ padding: '13px 16px', maxWidth: 220 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {p.featured && <Star size={12} color="#D4AF37" fill="#D4AF37" style={{ flexShrink: 0 }} />}
                        <div>
                          <div style={{ color: '#fff', fontSize: '0.8rem', fontWeight: 500, direction: 'rtl', textAlign: 'right' }}>{p.titleAr}</div>
                          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem' }}>{p.titleEn}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '13px 16px', color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                      <div>{p.city}</div>
                      <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem' }}>{p.cityEn}</div>
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <span style={{
                        padding: '3px 9px', borderRadius: 99, fontSize: '0.65rem',
                        background: 'rgba(212,175,55,0.1)', color: '#D4AF37',
                        border: '1px solid rgba(212,175,55,0.2)',
                      }}>{p.category}</span>
                    </td>
                    <td style={{ padding: '13px 16px', color: '#D4AF37', fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                      ${p.price}
                    </td>
                    <td style={{ padding: '13px 16px', color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>
                      {p.agent?.name ?? p.consultant?.nameEn ?? '—'}
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <span style={{
                        padding: '3px 10px', borderRadius: 99, fontSize: '0.65rem', fontWeight: 600,
                        background: p.published ? 'rgba(52,211,153,0.1)' : 'rgba(255,80,80,0.08)',
                        color: p.published ? '#34d399' : '#ff6060',
                        border: `1px solid ${p.published ? 'rgba(52,211,153,0.2)' : 'rgba(255,80,80,0.15)'}`,
                      }}>
                        {p.published ? 'Yayında' : 'Taslak'}
                      </span>
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Link
                          href={`/admin/listings/${p.id}`}
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: 5,
                            padding: '6px 12px', borderRadius: 7,
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            color: 'rgba(255,255,255,0.7)', fontSize: '0.72rem',
                            textDecoration: 'none', whiteSpace: 'nowrap',
                          }}
                        >
                          Düzenle
                        </Link>
                        <PropertyInstagramButton
                          compact
                          phoneDisplay={phoneDisplay}
                          property={{
                            slug: p.slug,
                            photos: parsePhotos(p.photos),
                            typeAr: p.typeAr,
                            locationAr: p.locationAr,
                            titleAr: p.titleAr,
                            badge: p.badge,
                            price: p.price,
                            rooms: p.rooms,
                            area: p.area,
                          }}
                        />
                      </div>
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
