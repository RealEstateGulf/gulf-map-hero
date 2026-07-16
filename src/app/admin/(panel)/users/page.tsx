import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import AdminHeader from '@/components/admin/AdminHeader';
import Link from 'next/link';
import { UserPlus, Shield } from 'lucide-react';

const ROLE_LABELS: Record<string, { label: string; color: string }> = {
  SUPER_ADMIN: { label: 'Süper Admin', color: '#D4AF37' },
  ADMIN: { label: 'Admin', color: '#60a5fa' },
  AGENT: { label: 'İlan Sorumlusu', color: '#34d399' },
  CONSULTANT: { label: 'Danışman', color: '#a78bfa' },
};

export default async function UsersPage() {
  const session = await getSession();
  
  // Only SUPER_ADMIN can manage users
  if (session?.role !== 'SUPER_ADMIN' && session?.role !== 'ADMIN') {
    return (
      <>
        <AdminHeader title="Kullanıcılar" userName={session?.name} userRole={session?.role} />
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
            <Shield size={36} style={{ marginBottom: 12 }} />
            <p>Bu sayfaya erişim yetkiniz yok.</p>
          </div>
        </main>
      </>
    );
  }

  const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <>
      <AdminHeader title="Kullanıcılar" userName={session?.name} userRole={session?.role} />
      <main style={{ flex: 1, overflowY: 'auto', padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ color: '#fff', fontSize: '1rem', fontWeight: 600, margin: 0 }}>
            Sistem Kullanıcıları ({users.length})
          </h2>
          <Link
            href="/admin/users/new"
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '9px 18px', background: '#D4AF37',
              borderRadius: 9, color: '#000', fontSize: '0.82rem',
              fontWeight: 700, textDecoration: 'none',
            }}
          >
            <UserPlus size={14} />
            Yeni Kullanıcı
          </Link>
        </div>

        <div style={{ background: '#0d0d18', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Ad Soyad', 'Email', 'Rol', 'Durum', 'Eklenme', 'İşlem'].map(h => (
                  <th key={h} style={{ padding: '11px 18px', textAlign: 'left', color: 'rgba(255,255,255,0.35)', fontSize: '0.7rem', fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(u => {
                const role = ROLE_LABELS[u.role] ?? { label: u.role, color: '#fff' };
                return (
                  <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td style={{ padding: '13px 18px', color: '#fff', fontSize: '0.83rem', fontWeight: 500 }}>{u.name}</td>
                    <td style={{ padding: '13px 18px', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>{u.email}</td>
                    <td style={{ padding: '13px 18px' }}>
                      <span style={{
                        padding: '3px 10px', borderRadius: 99, fontSize: '0.65rem', fontWeight: 600,
                        background: `${role.color}18`, color: role.color, border: `1px solid ${role.color}33`,
                      }}>{role.label}</span>
                    </td>
                    <td style={{ padding: '13px 18px' }}>
                      <span style={{
                        padding: '3px 10px', borderRadius: 99, fontSize: '0.65rem', fontWeight: 600,
                        background: u.active ? 'rgba(52,211,153,0.1)' : 'rgba(255,80,80,0.08)',
                        color: u.active ? '#34d399' : '#ff6060',
                        border: `1px solid ${u.active ? 'rgba(52,211,153,0.2)' : 'rgba(255,80,80,0.15)'}`,
                      }}>{u.active ? 'Aktif' : 'Pasif'}</span>
                    </td>
                    <td style={{ padding: '13px 18px', color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem' }}>
                      {new Date(u.createdAt).toLocaleDateString('tr-TR')}
                    </td>
                    <td style={{ padding: '13px 18px' }}>
                      <Link
                        href={`/admin/users/${u.id}`}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 5,
                          padding: '5px 12px', borderRadius: 7,
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          color: 'rgba(255,255,255,0.7)', fontSize: '0.72rem', textDecoration: 'none',
                        }}
                      >
                        Düzenle
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}
