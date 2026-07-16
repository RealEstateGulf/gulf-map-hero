'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, AlertCircle, Eye, EyeOff } from 'lucide-react';

type User = { id: string; name: string; email: string; role: string; phone?: string | null; active: boolean };

const ROLES = [
  { value: 'SUPER_ADMIN', label: 'Süper Admin', desc: 'Tam yetki' },
  { value: 'ADMIN', label: 'Admin', desc: 'Tüm yönetim işlemleri' },
  { value: 'AGENT', label: 'İlan Sorumlusu', desc: 'İlan ekle/düzenle' },
  { value: 'CONSULTANT', label: 'Danışman', desc: 'Sadece görüntüle' },
];

const INPUT: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box', padding: '10px 12px',
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 9, color: '#fff', fontSize: '0.85rem', outline: 'none',
  transition: 'border-color 0.15s', fontFamily: 'inherit',
};
const LABEL: React.CSSProperties = { color: 'rgba(255,255,255,0.5)', fontSize: '0.73rem', display: 'block', marginBottom: 5 };

export default function UserForm({ user }: { user?: User }) {
  const router = useRouter();
  const isEdit = !!user;
  const [form, setForm] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    role: user?.role ?? 'AGENT',
    phone: user?.phone ?? '',
    password: '',
    active: user?.active ?? true,
  });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const fo = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.5)'; };
  const bl = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    setLoading(true);
    try {
      const url = isEdit ? `/api/admin/users/${user.id}` : '/api/admin/users';
      const method = isEdit ? 'PUT' : 'POST';
      const body: Record<string, unknown> = { name: form.name, email: form.email, role: form.role, phone: form.phone || null, active: form.active };
      if (form.password) body.password = form.password;
      if (!isEdit && !form.password) { setError('Yeni kullanıcı için şifre zorunludur.'); setLoading(false); return; }

      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Hata'); return; }
      setSuccess(isEdit ? 'Kullanıcı güncellendi!' : 'Kullanıcı oluşturuldu!');
      if (!isEdit) router.push(`/admin/users/${data.id}`);
    } catch {
      setError('Bağlantı hatası');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16, alignItems: 'start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ background: '#0d0d18', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <h3 style={{ color: '#fff', fontSize: '0.88rem', fontWeight: 600, margin: 0 }}>Kullanıcı Bilgileri</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><label style={LABEL}>Ad Soyad</label><input style={INPUT} value={form.name} onChange={set('name')} onFocus={fo} onBlur={bl} placeholder="Ali Yılmaz" required /></div>
            <div><label style={LABEL}>Email</label><input style={INPUT} type="email" value={form.email} onChange={set('email')} onFocus={fo} onBlur={bl} placeholder="ali@gulfinvest.com" required /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><label style={LABEL}>Telefon</label><input style={INPUT} value={form.phone} onChange={set('phone')} onFocus={fo} onBlur={bl} placeholder="+90 555 000 0000" /></div>
            <div>
              <label style={LABEL}>{isEdit ? 'Yeni Şifre (boş bırakırsan değişmez)' : 'Şifre'}</label>
              <div style={{ position: 'relative' }}>
                <input
                  style={{ ...INPUT, paddingRight: 38 }}
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={set('password')}
                  onFocus={fo}
                  onBlur={bl}
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPw(s => !s)} style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', display: 'flex', padding: 0 }}>
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div style={{ background: '#0d0d18', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '20px' }}>
          <h3 style={{ color: '#fff', fontSize: '0.88rem', fontWeight: 600, margin: '0 0 14px' }}>Rol Seçimi</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {ROLES.map(r => (
              <label key={r.value} style={{
                display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px',
                borderRadius: 10, cursor: 'pointer',
                background: form.role === r.value ? 'rgba(212,175,55,0.08)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${form.role === r.value ? 'rgba(212,175,55,0.3)' : 'rgba(255,255,255,0.06)'}`,
                transition: 'all 0.15s',
              }}>
                <input type="radio" name="role" value={r.value} checked={form.role === r.value} onChange={set('role')} style={{ accentColor: '#D4AF37', marginTop: 2 }} />
                <div>
                  <div style={{ color: form.role === r.value ? '#D4AF37' : '#fff', fontSize: '0.82rem', fontWeight: 600 }}>{r.label}</div>
                  <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.68rem' }}>{r.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ background: '#0d0d18', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '18px' }}>
          <h3 style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600, margin: '0 0 14px' }}>Durum</h3>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <div onClick={() => setForm(f => ({ ...f, active: !f.active }))} style={{ width: 36, height: 20, borderRadius: 10, background: form.active ? '#D4AF37' : 'rgba(255,255,255,0.1)', position: 'relative', transition: 'background 0.2s', cursor: 'pointer' }}>
              <div style={{ position: 'absolute', top: 3, left: form.active ? 18 : 3, width: 14, height: 14, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
            </div>
            <div>
              <div style={{ color: '#fff', fontSize: '0.8rem' }}>Aktif</div>
              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.68rem' }}>Sisteme giriş yapabilir</div>
            </div>
          </label>
        </div>
        {error && <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 14px', background: 'rgba(255,80,80,0.08)', border: '1px solid rgba(255,80,80,0.2)', borderRadius: 9, color: '#ff6060', fontSize: '0.78rem' }}><AlertCircle size={14} />{error}</div>}
        {success && <div style={{ padding: '11px 14px', background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: 9, color: '#34d399', fontSize: '0.78rem' }}>{success}</div>}
        <button type="submit" disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '11px', background: loading ? 'rgba(212,175,55,0.4)' : '#D4AF37', border: 'none', borderRadius: 9, color: '#000', fontSize: '0.85rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer' }}>
          <Save size={14} />{loading ? 'Kaydediliyor...' : isEdit ? 'Güncelle' : 'Kullanıcı Oluştur'}
        </button>
        <a href="/admin/users" style={{ display: 'block', textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', textDecoration: 'none' }}>← Listeye Dön</a>
      </div>
    </form>
  );
}
