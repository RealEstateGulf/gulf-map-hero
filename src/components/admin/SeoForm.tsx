'use client';

import { useState } from 'react';
import { Save, AlertCircle } from 'lucide-react';

type SeoSettings = {
  id: string; pageKey: string;
  titleAr: string; titleEn: string;
  descriptionAr: string; descriptionEn: string;
  keywords?: string | null; ogImageUrl?: string | null; canonicalUrl?: string | null;
};

const INPUT: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box',
  padding: '10px 12px',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 9, color: '#fff', fontSize: '0.85rem',
  outline: 'none', transition: 'border-color 0.15s',
  fontFamily: 'inherit',
};
const LABEL: React.CSSProperties = { color: 'rgba(255,255,255,0.5)', fontSize: '0.73rem', display: 'block', marginBottom: 5 };

export default function SeoForm({ seo }: { seo: SeoSettings }) {
  const [form, setForm] = useState({
    titleAr: seo.titleAr ?? '',
    titleEn: seo.titleEn ?? '',
    descriptionAr: seo.descriptionAr ?? '',
    descriptionEn: seo.descriptionEn ?? '',
    keywords: seo.keywords ?? '',
    ogImageUrl: seo.ogImageUrl ?? '',
    canonicalUrl: seo.canonicalUrl ?? '',
  });
  const [tab, setTab] = useState<'ar' | 'en'>('ar');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const focus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = 'rgba(212,175,55,0.5)';
  };
  const blur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/seo/${seo.pageKey}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Hata'); return; }
      setSuccess('SEO ayarları kaydedildi!');
    } catch {
      setError('Bağlantı hatası');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Language tabs */}
      <div style={{ background: '#0d0d18', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex' }}>
          {(['ar', 'en'] as const).map(t => (
            <button key={t} type="button" onClick={() => setTab(t)} style={{
              padding: '12px 20px', border: 'none', cursor: 'pointer', fontSize: '0.82rem',
              background: tab === t ? 'rgba(212,175,55,0.08)' : 'transparent',
              color: tab === t ? '#D4AF37' : 'rgba(255,255,255,0.4)',
              borderBottom: tab === t ? '2px solid #D4AF37' : '2px solid transparent',
              fontWeight: tab === t ? 600 : 400,
            }}>
              {t === 'ar' ? 'عربي (Arabic)' : 'English'}
            </button>
          ))}
        </div>
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {tab === 'ar' ? (
            <>
              <div>
                <label style={LABEL}>عنوان الصفحة (Title AR) — يظهر في نتائج البحث</label>
                <input style={{ ...INPUT, direction: 'rtl' }} value={form.titleAr} onChange={set('titleAr')} onFocus={focus} onBlur={blur} placeholder="مثلاً: الاستثمار العقاري في تركيا — غلف إنفست" />
                <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.68rem', marginTop: 4 }}>
                  {form.titleAr.length}/60 karakter (önerilen: 50-60)
                </div>
              </div>
              <div>
                <label style={LABEL}>وصف الصفحة (Description AR) — يظهر تحت العنوان في جوجل</label>
                <textarea style={{ ...INPUT, direction: 'rtl', minHeight: 80, resize: 'vertical' }} value={form.descriptionAr} onChange={set('descriptionAr')} onFocus={focus} onBlur={blur} placeholder="وصف مختصر للصفحة لمحركات البحث..." />
                <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.68rem', marginTop: 4 }}>
                  {form.descriptionAr.length}/160 karakter (önerilen: 120-160)
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label style={LABEL}>Page Title (EN) — shown in Google results</label>
                <input style={INPUT} value={form.titleEn} onChange={set('titleEn')} onFocus={focus} onBlur={blur} placeholder="e.g. Real Estate Investment in Turkey — Gulf Invest" />
                <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.68rem', marginTop: 4 }}>
                  {form.titleEn.length}/60 characters (recommended: 50-60)
                </div>
              </div>
              <div>
                <label style={LABEL}>Meta Description (EN)</label>
                <textarea style={{ ...INPUT, minHeight: 80, resize: 'vertical' }} value={form.descriptionEn} onChange={set('descriptionEn')} onFocus={focus} onBlur={blur} placeholder="Short description for search engines..." />
                <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.68rem', marginTop: 4 }}>
                  {form.descriptionEn.length}/160 characters (recommended: 120-160)
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Shared fields */}
      <div style={{ background: '#0d0d18', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <h3 style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>Ortak Ayarlar</h3>
        <div>
          <label style={LABEL}>Keywords (virgülle ayır)</label>
          <input style={INPUT} value={form.keywords} onChange={set('keywords')} onFocus={focus} onBlur={blur} placeholder="emlak türkiye, yatırım, bursa, استثمار, عقارات" />
        </div>
        <div>
          <label style={LABEL}>OG Image URL (sosyal medya önizleme görseli)</label>
          <input style={INPUT} value={form.ogImageUrl} onChange={set('ogImageUrl')} onFocus={focus} onBlur={blur} placeholder="https://..." />
        </div>
        <div>
          <label style={LABEL}>Canonical URL (opsiyonel)</label>
          <input style={INPUT} value={form.canonicalUrl} onChange={set('canonicalUrl')} onFocus={focus} onBlur={blur} placeholder="https://gulfinvest.com/..." />
        </div>
      </div>

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 14px', background: 'rgba(255,80,80,0.08)', border: '1px solid rgba(255,80,80,0.2)', borderRadius: 9, color: '#ff6060', fontSize: '0.8rem' }}>
          <AlertCircle size={14} />{error}
        </div>
      )}
      {success && (
        <div style={{ padding: '11px 14px', background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: 9, color: '#34d399', fontSize: '0.8rem' }}>
          {success}
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <button type="submit" disabled={loading} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '11px 22px', background: loading ? 'rgba(212,175,55,0.4)' : '#D4AF37',
          border: 'none', borderRadius: 9, color: '#000',
          fontSize: '0.85rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
        }}>
          <Save size={14} />
          {loading ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
        <a href="/admin/seo" style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', textDecoration: 'none' }}>← SEO Listesine Dön</a>
      </div>
    </form>
  );
}
