'use client';
import { useState, useEffect } from 'react';
import { Key, AlertCircle, CheckCircle, ImageIcon } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';

export default function SettingsPage() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Logo state
  const [logoUrl, setLogoUrl] = useState('');
  const [logoSaving, setLogoSaving] = useState(false);
  const [logoSuccess, setLogoSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/content/settings')
      .then(r => r.json())
      .then((data: Record<string, { ar: string; en: string }>) => {
        if (data?.logo?.ar) setLogoUrl(data.logo.ar);
      })
      .catch(() => {});
  }, []);

  const saveLogo = async () => {
    setLogoSaving(true);
    setLogoSuccess(false);
    try {
      await fetch('/api/admin/content/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows: [{ key: 'logo', valueAr: logoUrl, valueEn: logoUrl }] }),
      });
      setLogoSuccess(true);
      setTimeout(() => setLogoSuccess(false), 3000);
    } catch { /* ignore */ } finally { setLogoSaving(false); }
  };

  const INPUT: React.CSSProperties = { width: '100%', boxSizing: 'border-box', padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 9, color: '#fff', fontSize: '0.85rem', outline: 'none', transition: 'border-color 0.15s', fontFamily: 'inherit' };
  const LABEL: React.CSSProperties = { color: 'rgba(255,255,255,0.5)', fontSize: '0.73rem', display: 'block', marginBottom: 5 };

  const fo = (e: React.FocusEvent<HTMLInputElement>) => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.5)'; };
  const bl = (e: React.FocusEvent<HTMLInputElement>) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (form.newPassword !== form.confirmPassword) { setError('Yeni şifreler eşleşmiyor.'); return; }
    if (form.newPassword.length < 8) { setError('Şifre en az 8 karakter olmalı.'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/admin/auth/change-password', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: form.currentPassword, newPassword: form.newPassword }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Hata'); return; }
      setSuccess('Şifre başarıyla değiştirildi!');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch { setError('Bağlantı hatası'); } finally { setLoading(false); }
  };

  return (
    <div style={{ direction: 'ltr', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '20px 28px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <h1 style={{ color: '#fff', fontSize: '1rem', fontWeight: 600, margin: 0 }}>Ayarlar</h1>
      </div>
      <main style={{ flex: 1, overflowY: 'auto', padding: '28px' }}>
        <div style={{ maxWidth: 560, display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Logo Section */}
          <div style={{ background: '#0d0d18', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(212,175,55,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ImageIcon size={16} color="#D4AF37" />
              </div>
              <div>
                <div style={{ color: '#fff', fontSize: '0.88rem', fontWeight: 600 }}>Site Logosu</div>
                <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem' }}>Navbar ve site genelinde görünen logo</div>
              </div>
            </div>

            {/* Preview */}
            {(logoUrl || true) && (
              <div style={{ marginBottom: 16, padding: '12px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', whiteSpace: 'nowrap' }}>Önizleme:</span>
                <div style={{ background: '#090919', padding: '6px 12px', borderRadius: 8, display: 'flex', alignItems: 'center', flex: 1 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logoUrl || '/logo-miftah.png'}
                    alt="Logo önizleme"
                    style={{ height: 40, width: 'auto', mixBlendMode: 'screen', objectFit: 'contain' }}
                  />
                </div>
              </div>
            )}

            <ImageUpload
              label="Logo Görseli (PNG/SVG — saydam veya siyah arka planlı)"
              value={logoUrl}
              onChange={setLogoUrl}
            />

            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                onClick={saveLogo}
                disabled={logoSaving}
                style={{ padding: '10px 22px', background: logoSaving ? 'rgba(212,175,55,0.4)' : '#D4AF37', border: 'none', borderRadius: 9, color: '#000', fontSize: '0.82rem', fontWeight: 700, cursor: logoSaving ? 'not-allowed' : 'pointer' }}
              >
                {logoSaving ? 'Kaydediliyor...' : 'Logoyu Kaydet'}
              </button>
              {logoSuccess && <span style={{ color: '#34d399', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 5 }}><CheckCircle size={13} /> Kaydedildi!</span>}
            </div>
            <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.7rem', marginTop: 10 }}>
              Varsayılan logo: <code style={{ color: 'rgba(255,255,255,0.4)' }}>/logo-miftah.png</code> — Yeni logo yükleyerek değiştirebilirsiniz.
            </p>
          </div>

          {/* Password Section */}
          <div style={{ background: '#0d0d18', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(212,175,55,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Key size={16} color="#D4AF37" />
              </div>
              <div>
                <div style={{ color: '#fff', fontSize: '0.88rem', fontWeight: 600 }}>Şifre Değiştir</div>
                <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem' }}>Hesap güvenliğin için şifreni düzenli güncelle</div>
              </div>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div><label style={LABEL}>Mevcut Şifre</label><input style={INPUT} type="password" value={form.currentPassword} onChange={e => setForm(f => ({ ...f, currentPassword: e.target.value }))} onFocus={fo} onBlur={bl} required /></div>
              <div><label style={LABEL}>Yeni Şifre (min. 8 karakter)</label><input style={INPUT} type="password" value={form.newPassword} onChange={e => setForm(f => ({ ...f, newPassword: e.target.value }))} onFocus={fo} onBlur={bl} required /></div>
              <div><label style={LABEL}>Yeni Şifre (Tekrar)</label><input style={INPUT} type="password" value={form.confirmPassword} onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))} onFocus={fo} onBlur={bl} required /></div>
              {error && <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 13px', background: 'rgba(255,80,80,0.08)', border: '1px solid rgba(255,80,80,0.2)', borderRadius: 8, color: '#ff6060', fontSize: '0.78rem' }}><AlertCircle size={13} />{error}</div>}
              {success && <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 13px', background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: 8, color: '#34d399', fontSize: '0.78rem' }}><CheckCircle size={13} />{success}</div>}
              <button type="submit" disabled={loading} style={{ padding: '11px', background: loading ? 'rgba(212,175,55,0.4)' : '#D4AF37', border: 'none', borderRadius: 9, color: '#000', fontSize: '0.85rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer' }}>
                {loading ? 'Değiştiriliyor...' : 'Şifreyi Güncelle'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
