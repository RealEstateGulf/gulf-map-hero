'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, AlertCircle } from 'lucide-react';

type Consultant = {
  id: string; nameAr: string; nameEn: string; phone: string;
  whatsapp?: string | null; email?: string | null; photoUrl?: string | null;
  bioAr?: string | null; bioEn?: string | null; active: boolean;
};

const INPUT: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box', padding: '10px 12px',
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 9, color: '#fff', fontSize: '0.85rem', outline: 'none',
  transition: 'border-color 0.15s', fontFamily: 'inherit',
};
const LABEL: React.CSSProperties = { color: 'rgba(255,255,255,0.5)', fontSize: '0.73rem', display: 'block', marginBottom: 5 };

export default function ConsultantForm({ consultant }: { consultant?: Consultant }) {
  const router = useRouter();
  const isEdit = !!consultant;
  const [form, setForm] = useState({
    nameAr: consultant?.nameAr ?? '',
    nameEn: consultant?.nameEn ?? '',
    phone: consultant?.phone ?? '',
    whatsapp: consultant?.whatsapp ?? '',
    email: consultant?.email ?? '',
    photoUrl: consultant?.photoUrl ?? '',
    bioAr: consultant?.bioAr ?? '',
    bioEn: consultant?.bioEn ?? '',
    active: consultant?.active ?? true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const fo = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.5)'; };
  const bl = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    setLoading(true);
    try {
      const url = isEdit ? `/api/admin/consultants/${consultant.id}` : '/api/admin/consultants';
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, whatsapp: form.whatsapp || null, email: form.email || null, photoUrl: form.photoUrl || null }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Hata'); return; }
      setSuccess(isEdit ? 'Danışman güncellendi!' : 'Danışman oluşturuldu!');
      if (!isEdit) router.push(`/admin/consultants/${data.id}`);
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
          <h3 style={{ color: '#fff', fontSize: '0.88rem', fontWeight: 600, margin: 0 }}>İsim Bilgileri</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={LABEL}>الاسم (بالعربية)</label>
              <input style={{ ...INPUT, direction: 'rtl' }} value={form.nameAr} onChange={set('nameAr')} onFocus={fo} onBlur={bl} placeholder="أحمد الخالد" required />
            </div>
            <div>
              <label style={LABEL}>Name (English)</label>
              <input style={INPUT} value={form.nameEn} onChange={set('nameEn')} onFocus={fo} onBlur={bl} placeholder="Ahmed Al-Khalid" required />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={LABEL}>Telefon</label>
              <input style={INPUT} value={form.phone} onChange={set('phone')} onFocus={fo} onBlur={bl} placeholder="+90 555 000 0000" required />
            </div>
            <div>
              <label style={LABEL}>WhatsApp (farklıysa)</label>
              <input style={INPUT} value={form.whatsapp} onChange={set('whatsapp')} onFocus={fo} onBlur={bl} placeholder="+966 50 000 0000" />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={LABEL}>Email</label>
              <input style={INPUT} type="email" value={form.email} onChange={set('email')} onFocus={fo} onBlur={bl} placeholder="danisan@gulfinvest.com" />
            </div>
            <div>
              <label style={LABEL}>Fotoğraf URL</label>
              <input style={INPUT} value={form.photoUrl} onChange={set('photoUrl')} onFocus={fo} onBlur={bl} placeholder="https://..." />
            </div>
          </div>
        </div>
        <div style={{ background: '#0d0d18', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <h3 style={{ color: '#fff', fontSize: '0.88rem', fontWeight: 600, margin: 0 }}>Bio</h3>
          <div>
            <label style={LABEL}>السيرة الذاتية (بالعربية)</label>
            <textarea style={{ ...INPUT, direction: 'rtl', minHeight: 90, resize: 'vertical' }} value={form.bioAr} onChange={set('bioAr')} onFocus={fo} onBlur={bl} placeholder="خبرة 10 سنوات في سوق العقارات..." />
          </div>
          <div>
            <label style={LABEL}>Biography (English)</label>
            <textarea style={{ ...INPUT, minHeight: 90, resize: 'vertical' }} value={form.bioEn} onChange={set('bioEn')} onFocus={fo} onBlur={bl} placeholder="10 years of experience in real estate..." />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ background: '#0d0d18', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '18px' }}>
          <h3 style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600, margin: '0 0 14px' }}>Durum</h3>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <div onClick={() => setForm(f => ({ ...f, active: !f.active }))} style={{
              width: 36, height: 20, borderRadius: 10,
              background: form.active ? '#D4AF37' : 'rgba(255,255,255,0.1)',
              position: 'relative', transition: 'background 0.2s', cursor: 'pointer',
            }}>
              <div style={{
                position: 'absolute', top: 3, left: form.active ? 18 : 3,
                width: 14, height: 14, borderRadius: '50%', background: '#fff',
                transition: 'left 0.2s',
              }} />
            </div>
            <div>
              <div style={{ color: '#fff', fontSize: '0.8rem' }}>Aktif</div>
              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.68rem' }}>Sitede görünür</div>
            </div>
          </label>
        </div>
        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 14px', background: 'rgba(255,80,80,0.08)', border: '1px solid rgba(255,80,80,0.2)', borderRadius: 9, color: '#ff6060', fontSize: '0.78rem' }}>
            <AlertCircle size={14} />{error}
          </div>
        )}
        {success && (
          <div style={{ padding: '11px 14px', background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: 9, color: '#34d399', fontSize: '0.78rem' }}>{success}</div>
        )}
        <button type="submit" disabled={loading} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          padding: '11px', background: loading ? 'rgba(212,175,55,0.4)' : '#D4AF37',
          border: 'none', borderRadius: 9, color: '#000',
          fontSize: '0.85rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
        }}>
          <Save size={14} />{loading ? 'Kaydediliyor...' : isEdit ? 'Güncelle' : 'Danışman Ekle'}
        </button>
        <a href="/admin/consultants" style={{ display: 'block', textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', textDecoration: 'none' }}>← Listeye Dön</a>
      </div>
    </form>
  );
}
