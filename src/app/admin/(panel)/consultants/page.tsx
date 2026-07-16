import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import AdminHeader from '@/components/admin/AdminHeader';
import Link from 'next/link';
import { UserPlus, Phone, Mail } from 'lucide-react';

export default async function ConsultantsPage() {
  const session = await getSession();
  const consultants = await prisma.consultant.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <>
      <AdminHeader title="Danışmanlar" userName={session?.name} userRole={session?.role} />
      <main style={{ flex: 1, overflowY: 'auto', padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ color: '#fff', fontSize: '1rem', fontWeight: 600, margin: 0 }}>
            Danışmanlar ({consultants.length})
          </h2>
          <Link
            href="/admin/consultants/new"
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '9px 18px', background: '#D4AF37',
              borderRadius: 9, color: '#000', fontSize: '0.82rem',
              fontWeight: 700, textDecoration: 'none',
            }}
          >
            <UserPlus size={14} />
            Yeni Danışman
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
          {consultants.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', padding: '48px', textAlign: 'center', background: '#0d0d18', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14 }}>
              <p style={{ color: 'rgba(255,255,255,0.3)', margin: 0 }}>Henüz danışman yok</p>
            </div>
          ) : consultants.map(c => (
            <div
              key={c.id}
              style={{ background: '#0d0d18', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '20px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>{c.nameEn}</div>
                  <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.78rem', direction: 'rtl', marginTop: 2 }}>{c.nameAr}</div>
                </div>
                <span style={{
                  padding: '3px 9px', borderRadius: 99, fontSize: '0.62rem',
                  background: c.active ? 'rgba(52,211,153,0.1)' : 'rgba(255,80,80,0.08)',
                  color: c.active ? '#34d399' : '#ff6060',
                  border: `1px solid ${c.active ? 'rgba(52,211,153,0.2)' : 'rgba(255,80,80,0.15)'}`,
                }}>{c.active ? 'Aktif' : 'Pasif'}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 14 }}>
                {c.phone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>
                    <Phone size={12} />{c.phone}
                  </div>
                )}
                {c.email && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>
                    <Mail size={12} />{c.email}
                  </div>
                )}
              </div>
              <Link
                href={`/admin/consultants/${c.id}`}
                style={{
                  display: 'block', textAlign: 'center', padding: '8px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 8, color: 'rgba(255,255,255,0.6)',
                  fontSize: '0.75rem', textDecoration: 'none',
                }}
              >
                Düzenle
              </Link>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
