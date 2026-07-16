'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, AlertCircle, X, Upload, Loader2 } from 'lucide-react';
import ImageUpload from './ImageUpload';

type Consultant = { id: string; nameEn: string; nameAr: string };
type Agent = { id: string; name: string };
type City = { id: string; nameAr: string; nameEn: string };
type Listing = {
  id: string; city: string; cityEn: string; titleAr: string; titleEn: string;
  locationAr: string; locationEn: string; price: string; area: number; rooms: string;
  typeAr: string; typeEn: string; category: string; badge?: string | null;
  descriptionAr?: string | null; descriptionEn?: string | null;
  featuresAr: string; featuresEn: string; photos: string; thumbGradient: string;
  published: boolean; featured: boolean;
  agentId?: string | null; consultantId?: string | null;
};

interface Props {
  listing?: Listing;
  consultants: Consultant[];
  agents: Agent[];
  cities: City[];
}

const INPUT = {
  width: '100%', boxSizing: 'border-box' as const,
  padding: '10px 12px',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 9, color: '#fff', fontSize: '0.85rem',
  outline: 'none', transition: 'border-color 0.15s',
  fontFamily: 'inherit',
};

const LABEL = { color: 'rgba(255,255,255,0.5)', fontSize: '0.73rem', display: 'block' as const, marginBottom: 5 };
const FIELD = { display: 'flex', flexDirection: 'column' as const, gap: 0 };

const CATEGORIES = ['BEACHFRONT', 'VILLA', 'APARTMENT', 'PENTHOUSE', 'STUDIO', 'COMMERCIAL'];
const GRADIENTS = [
  'from-blue-900 to-blue-700', 'from-green-900 to-green-700',
  'from-purple-900 to-purple-700', 'from-amber-900 to-amber-700',
  'from-rose-900 to-rose-700', 'from-teal-900 to-teal-700',
];

export default function ListingForm({ listing, consultants, agents, cities }: Props) {
  const router = useRouter();
  const isEdit = !!listing;

  const initialCityId = cities.find(c => c.nameEn === listing?.cityEn)?.id ?? '';
  const [cityId, setCityId] = useState(initialCityId);

  const [form, setForm] = useState({
    city: listing?.city ?? '',
    cityEn: listing?.cityEn ?? '',
    titleAr: listing?.titleAr ?? '',
    titleEn: listing?.titleEn ?? '',
    locationAr: listing?.locationAr ?? '',
    locationEn: listing?.locationEn ?? '',
    price: listing?.price ?? '',
    area: listing?.area?.toString() ?? '',
    rooms: listing?.rooms ?? '',
    typeAr: listing?.typeAr ?? '',
    typeEn: listing?.typeEn ?? '',
    category: listing?.category ?? 'APARTMENT',
    badge: listing?.badge ?? '',
    descriptionAr: listing?.descriptionAr ?? '',
    descriptionEn: listing?.descriptionEn ?? '',
    featuresAr: (() => { try { return JSON.parse(listing?.featuresAr ?? '[]').join('\n'); } catch { return ''; } })(),
    featuresEn: (() => { try { return JSON.parse(listing?.featuresEn ?? '[]').join('\n'); } catch { return ''; } })(),
    thumbGradient: listing?.thumbGradient ?? GRADIENTS[0],
    published: listing?.published ?? true,
    featured: listing?.featured ?? false,
    agentId: listing?.agentId ?? '',
    consultantId: listing?.consultantId ?? '',
  });

  // photos state: array of URLs
  const [photos, setPhotos] = useState<string[]>(() => {
    try { return JSON.parse(listing?.photos ?? '[]'); } catch { return []; }
  });
  const [photoUploading, setPhotoUploading] = useState(false);

  const addPhoto = async (file: File) => {
    setPhotoUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (res.ok) setPhotos(p => [...p, data.url]);
    } finally {
      setPhotoUploading(false);
    }
  };

  const [tab, setTab] = useState<'ar' | 'en'>('ar');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }));

  const toggle = (key: 'published' | 'featured') => () =>
    setForm(f => ({ ...f, [key]: !f[key] }));

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setCityId(id);
    const city = cities.find(c => c.id === id);
    setForm(f => ({ ...f, city: city?.nameAr ?? '', cityEn: city?.nameEn ?? '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    setLoading(true);
    try {
      const body = {
        ...form,
        area: parseInt(form.area) || 0,
        featuresAr: JSON.stringify(form.featuresAr.split('\n').map((s: string) => s.trim()).filter(Boolean)),
        featuresEn: JSON.stringify(form.featuresEn.split('\n').map((s: string) => s.trim()).filter(Boolean)),
        photos: JSON.stringify(photos),
        agentId: form.agentId || null,
        consultantId: form.consultantId || null,
      };
      const url = isEdit ? `/api/admin/listings/${listing.id}` : '/api/admin/listings';
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Hata oluştu'); return; }
      setSuccess(isEdit ? 'İlan güncellendi!' : 'İlan oluşturuldu!');
      if (!isEdit) router.push(`/admin/listings/${data.id}`);
    } catch {
      setError('Bağlantı hatası');
    } finally {
      setLoading(false);
    }
  };

  const focusBorder = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = 'rgba(212,175,55,0.5)';
  };
  const blurBorder = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, alignItems: 'start' }}>
        
        {/* Main content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          
          {/* Language tabs */}
          <div style={{ background: '#0d0d18', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex' }}>
              {(['ar', 'en'] as const).map(t => (
                <button
                  key={t} type="button" onClick={() => setTab(t)}
                  style={{
                    padding: '12px 20px', border: 'none', cursor: 'pointer', fontSize: '0.82rem',
                    background: tab === t ? 'rgba(212,175,55,0.08)' : 'transparent',
                    color: tab === t ? '#D4AF37' : 'rgba(255,255,255,0.4)',
                    borderBottom: tab === t ? '2px solid #D4AF37' : '2px solid transparent',
                    fontWeight: tab === t ? 600 : 400,
                  }}
                >
                  {t === 'ar' ? 'عربي (Arabic)' : 'English'}
                </button>
              ))}
            </div>
            <div style={{ padding: '20px' }}>
              {tab === 'ar' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={FIELD}>
                    <label style={LABEL}>عنوان الإعلان (العنوان بالعربية)</label>
                    <input style={{ ...INPUT, direction: 'rtl' }} value={form.titleAr} onChange={set('titleAr')} onFocus={focusBorder} onBlur={blurBorder} placeholder="مثلاً: فيلا فاخرة على البحر" required />
                  </div>
                  <div style={FIELD}>
                    <label style={LABEL}>الموقع (بالعربية)</label>
                    <input style={{ ...INPUT, direction: 'rtl' }} value={form.locationAr} onChange={set('locationAr')} onFocus={focusBorder} onBlur={blurBorder} placeholder="مثلاً: الساحل الشمالي، بورصة" />
                  </div>
                  <div style={FIELD}>
                    <label style={LABEL}>نوع العقار (بالعربية)</label>
                    <input style={{ ...INPUT, direction: 'rtl' }} value={form.typeAr} onChange={set('typeAr')} onFocus={focusBorder} onBlur={blurBorder} placeholder="مثلاً: فيلا" />
                  </div>
                  <div style={FIELD}>
                    <label style={LABEL}>الوصف (بالعربية)</label>
                    <textarea style={{ ...INPUT, direction: 'rtl', minHeight: 100, resize: 'vertical' }} value={form.descriptionAr} onChange={set('descriptionAr')} onFocus={focusBorder} onBlur={blurBorder} placeholder="وصف تفصيلي للعقار..." />
                  </div>
                  <div style={FIELD}>
                    <label style={LABEL}>المميزات (بالعربية) — سطر واحد لكل ميزة</label>
                    <textarea style={{ ...INPUT, direction: 'rtl', minHeight: 80, resize: 'vertical' }} value={form.featuresAr} onChange={set('featuresAr')} onFocus={focusBorder} onBlur={blurBorder} placeholder="مسبح خاص&#10;إطلالة على البحر&#10;موقف سيارة" />
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={FIELD}>
                    <label style={LABEL}>Listing Title (English)</label>
                    <input style={INPUT} value={form.titleEn} onChange={set('titleEn')} onFocus={focusBorder} onBlur={blurBorder} placeholder="e.g. Luxury Seafront Villa" required />
                  </div>
                  <div style={FIELD}>
                    <label style={LABEL}>Location (English)</label>
                    <input style={INPUT} value={form.locationEn} onChange={set('locationEn')} onFocus={focusBorder} onBlur={blurBorder} placeholder="e.g. North Coast, Bursa" />
                  </div>
                  <div style={FIELD}>
                    <label style={LABEL}>Property Type (English)</label>
                    <input style={INPUT} value={form.typeEn} onChange={set('typeEn')} onFocus={focusBorder} onBlur={blurBorder} placeholder="e.g. Villa" />
                  </div>
                  <div style={FIELD}>
                    <label style={LABEL}>Description (English)</label>
                    <textarea style={{ ...INPUT, minHeight: 100, resize: 'vertical' }} value={form.descriptionEn} onChange={set('descriptionEn')} onFocus={focusBorder} onBlur={blurBorder} placeholder="Detailed property description..." />
                  </div>
                  <div style={FIELD}>
                    <label style={LABEL}>Features (English) — one per line</label>
                    <textarea style={{ ...INPUT, minHeight: 80, resize: 'vertical' }} value={form.featuresEn} onChange={set('featuresEn')} onFocus={focusBorder} onBlur={blurBorder} placeholder="Private pool&#10;Sea view&#10;Parking" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* City */}
          <div style={{ background: '#0d0d18', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '20px' }}>
            <h3 style={{ color: '#fff', fontSize: '0.88rem', fontWeight: 600, margin: '0 0 16px' }}>Şehir</h3>
            <div style={FIELD}>
              <label style={LABEL}>İlanın bulunduğu şehir</label>
              <select style={{ ...INPUT, cursor: 'pointer' }} value={cityId} onChange={handleCityChange} onFocus={focusBorder} onBlur={blurBorder} required>
                <option value="" style={{ background: '#0d0d18' }}>Seç...</option>
                {cities.map(c => <option key={c.id} value={c.id} style={{ background: '#0d0d18' }}>{c.nameEn} ({c.nameAr})</option>)}
              </select>
              <a href="/admin/cities/new" target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: 8, color: '#D4AF37', fontSize: '0.72rem', textDecoration: 'none' }}>
                + Yeni şehir ekle
              </a>
            </div>
          </div>

          {/* Property details */}
          <div style={{ background: '#0d0d18', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '20px' }}>
            <h3 style={{ color: '#fff', fontSize: '0.88rem', fontWeight: 600, margin: '0 0 16px' }}>Detaylar</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              <div style={FIELD}>
                <label style={LABEL}>Fiyat (USD)</label>
                <input style={INPUT} type="text" value={form.price} onChange={set('price')} onFocus={focusBorder} onBlur={blurBorder} placeholder="250000" required />
              </div>
              <div style={FIELD}>
                <label style={LABEL}>Alan (m²)</label>
                <input style={INPUT} type="number" value={form.area} onChange={set('area')} onFocus={focusBorder} onBlur={blurBorder} placeholder="180" />
              </div>
              <div style={FIELD}>
                <label style={LABEL}>Oda (örn: 3+1)</label>
                <input style={INPUT} value={form.rooms} onChange={set('rooms')} onFocus={focusBorder} onBlur={blurBorder} placeholder="3+1" />
              </div>
              <div style={FIELD}>
                <label style={LABEL}>Kategori</label>
                <select style={{ ...INPUT, cursor: 'pointer' }} value={form.category} onChange={set('category')} onFocus={focusBorder} onBlur={blurBorder}>
                  {CATEGORIES.map(c => <option key={c} value={c} style={{ background: '#0d0d18' }}>{c}</option>)}
                </select>
              </div>
              <div style={FIELD}>
                <label style={LABEL}>Badge (örn: Öne Çıkan)</label>
                <input style={INPUT} value={form.badge} onChange={set('badge')} onFocus={focusBorder} onBlur={blurBorder} placeholder="Opsiyonel" />
              </div>
              <div style={FIELD}>
                <label style={LABEL}>Kart Arka Plan</label>
                <select style={{ ...INPUT, cursor: 'pointer' }} value={form.thumbGradient} onChange={set('thumbGradient')} onFocus={focusBorder} onBlur={blurBorder}>
                  {GRADIENTS.map(g => <option key={g} value={g} style={{ background: '#0d0d18' }}>{g}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Photos */}
          <div style={{ background: '#0d0d18', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '20px' }}>
            <h3 style={{ color: '#fff', fontSize: '0.88rem', fontWeight: 600, margin: '0 0 14px' }}>Fotoğraflar</h3>
            {/* Grid of uploaded photos */}
            {photos.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 12 }}>
                {photos.map((url, i) => (
                  <div key={i} style={{ position: 'relative', paddingBottom: '75%', borderRadius: 8, overflow: 'hidden', background: '#111' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button type="button" onClick={() => setPhotos(p => p.filter((_, j) => j !== i))} style={{ position: 'absolute', top: 4, right: 4, width: 22, height: 22, background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', padding: 0 }}>
                      <X size={11} />
                    </button>
                    {i === 0 && <div style={{ position: 'absolute', bottom: 4, left: 4, background: '#D4AF37', color: '#000', fontSize: '0.55rem', fontWeight: 700, padding: '2px 6px', borderRadius: 3 }}>KAPAK</div>}
                  </div>
                ))}
              </div>
            )}
            {/* Upload button */}
            <label style={{ display: 'block', padding: '14px', border: '2px dashed rgba(255,255,255,0.12)', borderRadius: 10, textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.15s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLLabelElement).style.borderColor = 'rgba(212,175,55,0.4)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLLabelElement).style.borderColor = 'rgba(255,255,255,0.12)'; }}
            >
              <input type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={async e => {
                const files = Array.from(e.target.files ?? []);
                for (const f of files) await addPhoto(f);
                e.target.value = '';
              }} />
              {photoUploading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: '#D4AF37', fontSize: '0.78rem' }}>
                  <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />Yükleniyor...
                </div>
              ) : (
                <div>
                  <Upload size={16} color="rgba(255,255,255,0.25)" style={{ margin: '0 auto 4px', display: 'block' }} />
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.73rem' }}>Fotoğraf ekle (çoklu seçim)</div>
                  <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.62rem', marginTop: 2 }}>JPEG, PNG, WebP — maks. 10MB/adet</div>
                </div>
              )}
            </label>
            <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.62rem', margin: '8px 0 0', textAlign: 'center' }}>
              İlk fotoğraf kapak görseli olarak kullanılır
            </p>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
          </div>
        </div>

        {/* Sidebar options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          
          {/* Status */}
          <div style={{ background: '#0d0d18', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '18px' }}>
            <h3 style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600, margin: '0 0 14px' }}>Yayın Durumu</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { key: 'published', label: 'Yayında', sub: 'Sitede görünür' },
                { key: 'featured', label: 'Öne Çıkan', sub: 'Anasayfada öne çıkar' },
              ].map(({ key, label, sub }) => (
                <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                  <div
                    onClick={toggle(key as 'published' | 'featured')}
                    style={{
                      width: 36, height: 20, borderRadius: 10, flexShrink: 0,
                      background: form[key as 'published' | 'featured'] ? '#D4AF37' : 'rgba(255,255,255,0.1)',
                      position: 'relative', transition: 'background 0.2s', cursor: 'pointer',
                    }}
                  >
                    <div style={{
                      position: 'absolute', top: 3, left: form[key as 'published' | 'featured'] ? 18 : 3,
                      width: 14, height: 14, borderRadius: '50%', background: '#fff',
                      transition: 'left 0.2s',
                    }} />
                  </div>
                  <div>
                    <div style={{ color: '#fff', fontSize: '0.8rem' }}>{label}</div>
                    <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.68rem' }}>{sub}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Assignment */}
          <div style={{ background: '#0d0d18', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '18px' }}>
            <h3 style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600, margin: '0 0 14px' }}>Atama</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={FIELD}>
                <label style={LABEL}>Danışman</label>
                <select style={{ ...INPUT, cursor: 'pointer' }} value={form.consultantId} onChange={set('consultantId')} onFocus={focusBorder} onBlur={blurBorder}>
                  <option value="" style={{ background: '#0d0d18' }}>Seç...</option>
                  {consultants.map(c => <option key={c.id} value={c.id} style={{ background: '#0d0d18' }}>{c.nameEn} ({c.nameAr})</option>)}
                </select>
              </div>
              <div style={FIELD}>
                <label style={LABEL}>Temsilci (Agent)</label>
                <select style={{ ...INPUT, cursor: 'pointer' }} value={form.agentId} onChange={set('agentId')} onFocus={focusBorder} onBlur={blurBorder}>
                  <option value="" style={{ background: '#0d0d18' }}>Seç...</option>
                  {agents.map(a => <option key={a.id} value={a.id} style={{ background: '#0d0d18' }}>{a.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Feedback */}
          {error && (
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: 8, padding: '12px 14px',
              background: 'rgba(255,80,80,0.08)', border: '1px solid rgba(255,80,80,0.2)',
              borderRadius: 10, color: '#ff6060', fontSize: '0.78rem',
            }}>
              <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
              {error}
            </div>
          )}
          {success && (
            <div style={{
              padding: '12px 14px', background: 'rgba(52,211,153,0.08)',
              border: '1px solid rgba(52,211,153,0.2)', borderRadius: 10,
              color: '#34d399', fontSize: '0.78rem',
            }}>
              {success}
            </div>
          )}

          {/* Save */}
          <button
            type="submit"
            disabled={loading}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '12px', background: loading ? 'rgba(212,175,55,0.4)' : '#D4AF37',
              border: 'none', borderRadius: 10, color: '#000',
              fontSize: '0.88rem', fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <Save size={15} />
            {loading ? 'Kaydediliyor...' : isEdit ? 'Güncelle' : 'İlan Oluştur'}
          </button>

          {isEdit && (
            <a
              href="/admin/listings"
              style={{
                display: 'block', textAlign: 'center', padding: '10px',
                color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', textDecoration: 'none',
              }}
            >
              ← Listeye Dön
            </a>
          )}
        </div>
      </div>
    </form>
  );
}
