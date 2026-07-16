'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, AlertCircle } from 'lucide-react';
import ImageUpload from './ImageUpload';

type Post = {
  id: string; slug: string; titleAr: string; titleEn: string;
  excerptAr: string; excerptEn: string; contentAr: string; contentEn: string;
  coverImage?: string | null; category: string; published: boolean; featured: boolean; readTime: number;
};

const INPUT: React.CSSProperties = { width: '100%', boxSizing: 'border-box', padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 9, color: '#fff', fontSize: '0.85rem', outline: 'none', transition: 'border-color 0.15s', fontFamily: 'inherit' };
const LABEL: React.CSSProperties = { color: 'rgba(255,255,255,0.5)', fontSize: '0.73rem', display: 'block', marginBottom: 5 };
const CATEGORIES = ['general', 'market', 'legal', 'lifestyle', 'investment', 'citizenship'];

export default function InsightForm({ post }: { post?: Post }) {
  const router = useRouter();
  const isEdit = !!post;
  const [form, setForm] = useState({
    slug: post?.slug ?? '',
    titleAr: post?.titleAr ?? '', titleEn: post?.titleEn ?? '',
    excerptAr: post?.excerptAr ?? '', excerptEn: post?.excerptEn ?? '',
    contentAr: post?.contentAr ?? '', contentEn: post?.contentEn ?? '',
    coverImage: post?.coverImage ?? '',
    category: post?.category ?? 'general',
    published: post?.published ?? false,
    featured: post?.featured ?? false,
    readTime: post?.readTime?.toString() ?? '5',
  });
  const [tab, setTab] = useState<'ar' | 'en'>('ar');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const fo = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.5)'; };
  const bl = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; };

  // Auto-generate slug from English title
  const generateSlug = () => {
    const slug = form.titleEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    setForm(f => ({ ...f, slug }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    setLoading(true);
    try {
      const url = isEdit ? `/api/admin/insights/${post.id}` : '/api/admin/insights';
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, readTime: parseInt(form.readTime) || 5, coverImage: form.coverImage || null }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Hata'); return; }
      setSuccess(isEdit ? 'Yazı güncellendi!' : 'Yazı oluşturuldu!');
      if (!isEdit) router.push(`/admin/insights/${data.id}`);
    } catch {
      setError('Bağlantı hatası');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16, alignItems: 'start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Slug */}
        <div style={{ background: '#0d0d18', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '18px', display: 'flex', gap: 10, alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <label style={LABEL}>URL Slug (benzersiz olmalı)</label>
            <input style={{ ...INPUT, fontFamily: 'monospace' }} value={form.slug} onChange={set('slug')} onFocus={fo} onBlur={bl} placeholder="luxury-villa-bursa" required />
          </div>
          <button type="button" onClick={generateSlug} style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 9, color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            EN'den Oluştur
          </button>
        </div>

        {/* Language tabs */}
        <div style={{ background: '#0d0d18', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex' }}>
            {(['ar', 'en'] as const).map(t => (
              <button key={t} type="button" onClick={() => setTab(t)} style={{ padding: '12px 20px', border: 'none', cursor: 'pointer', fontSize: '0.82rem', background: tab === t ? 'rgba(212,175,55,0.08)' : 'transparent', color: tab === t ? '#D4AF37' : 'rgba(255,255,255,0.4)', borderBottom: tab === t ? '2px solid #D4AF37' : '2px solid transparent', fontWeight: tab === t ? 600 : 400 }}>
                {t === 'ar' ? 'عربي' : 'English'}
              </button>
            ))}
          </div>
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {tab === 'ar' ? (
              <>
                <div><label style={LABEL}>عنوان المقال</label><input style={{ ...INPUT, direction: 'rtl' }} value={form.titleAr} onChange={set('titleAr')} onFocus={fo} onBlur={bl} placeholder="عنوان المقال بالعربية" required /></div>
                <div><label style={LABEL}>مقتطف (للبطاقات والسيو)</label><textarea style={{ ...INPUT, direction: 'rtl', minHeight: 70, resize: 'vertical' }} value={form.excerptAr} onChange={set('excerptAr')} onFocus={fo} onBlur={bl} placeholder="وصف مختصر..." /></div>
                <div><label style={LABEL}>محتوى المقال</label><textarea style={{ ...INPUT, direction: 'rtl', minHeight: 200, resize: 'vertical' }} value={form.contentAr} onChange={set('contentAr')} onFocus={fo} onBlur={bl} placeholder="محتوى المقال الكامل (Markdown desteklenir)..." /></div>
              </>
            ) : (
              <>
                <div><label style={LABEL}>Article Title (English)</label><input style={INPUT} value={form.titleEn} onChange={set('titleEn')} onFocus={fo} onBlur={bl} placeholder="Your article title in English" required /></div>
                <div><label style={LABEL}>Excerpt (for cards & SEO)</label><textarea style={{ ...INPUT, minHeight: 70, resize: 'vertical' }} value={form.excerptEn} onChange={set('excerptEn')} onFocus={fo} onBlur={bl} placeholder="Short description..." /></div>
                <div><label style={LABEL}>Article Content</label><textarea style={{ ...INPUT, minHeight: 200, resize: 'vertical' }} value={form.contentEn} onChange={set('contentEn')} onFocus={fo} onBlur={bl} placeholder="Full article content (Markdown supported)..." /></div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ background: '#0d0d18', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h3 style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>Ayarlar</h3>
          <div><label style={LABEL}>Kategori</label>
            <select style={{ ...INPUT, cursor: 'pointer' }} value={form.category} onChange={set('category')} onFocus={fo} onBlur={bl}>
              {CATEGORIES.map(c => <option key={c} value={c} style={{ background: '#0d0d18' }}>{c}</option>)}
            </select>
          </div>
          <div><label style={LABEL}>Okuma Süresi (dakika)</label>
            <input style={INPUT} type="number" min="1" value={form.readTime} onChange={set('readTime')} onFocus={fo} onBlur={bl} />
          </div>
          <ImageUpload
            label="Kapak Görseli"
            value={form.coverImage}
            onChange={url => setForm(f => ({ ...f, coverImage: url }))}
          />
          {(['published', 'featured'] as const).map(k => (
            <label key={k} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <div onClick={() => setForm(f => ({ ...f, [k]: !f[k] }))} style={{ width: 36, height: 20, borderRadius: 10, background: form[k] ? '#D4AF37' : 'rgba(255,255,255,0.1)', position: 'relative', transition: 'background 0.2s', cursor: 'pointer' }}>
                <div style={{ position: 'absolute', top: 3, left: form[k] ? 18 : 3, width: 14, height: 14, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
              </div>
              <div>
                <div style={{ color: '#fff', fontSize: '0.8rem' }}>{k === 'published' ? 'Yayında' : 'Öne Çıkan'}</div>
                <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.68rem' }}>{k === 'published' ? 'Sitede görünür' : 'Anasayfada öne çıkar'}</div>
              </div>
            </label>
          ))}
        </div>
        {error && <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 14px', background: 'rgba(255,80,80,0.08)', border: '1px solid rgba(255,80,80,0.2)', borderRadius: 9, color: '#ff6060', fontSize: '0.78rem' }}><AlertCircle size={14} />{error}</div>}
        {success && <div style={{ padding: '11px 14px', background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: 9, color: '#34d399', fontSize: '0.78rem' }}>{success}</div>}
        <button type="submit" disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '11px', background: loading ? 'rgba(212,175,55,0.4)' : '#D4AF37', border: 'none', borderRadius: 9, color: '#000', fontSize: '0.85rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer' }}>
          <Save size={14} />{loading ? 'Kaydediliyor...' : isEdit ? 'Güncelle' : 'Yazı Oluştur'}
        </button>
        <a href="/admin/insights" style={{ display: 'block', textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', textDecoration: 'none' }}>← Listeye Dön</a>
      </div>
    </form>
  );
}
