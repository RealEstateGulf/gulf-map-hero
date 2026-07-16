'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, AlertCircle, Search, Loader2, MapPin } from 'lucide-react';

type City = {
  id: string; nameAr: string; nameEn: string; lat: number; lng: number;
  active: boolean; sortOrder: number;
};

type GeoResult = { text: string; placeName: string; lat: number; lng: number };

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? '';

const INPUT: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box', padding: '10px 12px',
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 9, color: '#fff', fontSize: '0.85rem', outline: 'none',
  transition: 'border-color 0.15s', fontFamily: 'inherit',
};
const LABEL: React.CSSProperties = { color: 'rgba(255,255,255,0.5)', fontSize: '0.73rem', display: 'block', marginBottom: 5 };

export default function CityForm({ city }: { city?: City }) {
  const router = useRouter();
  const isEdit = !!city;
  const [form, setForm] = useState({
    nameAr: city?.nameAr ?? '',
    nameEn: city?.nameEn ?? '',
    lat: city?.lat?.toString() ?? '',
    lng: city?.lng?.toString() ?? '',
    active: city?.active ?? true,
    sortOrder: city?.sortOrder ?? 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<GeoResult[]>([]);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const fo = (e: React.FocusEvent<HTMLInputElement>) => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.5)'; };
  const bl = (e: React.FocusEvent<HTMLInputElement>) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; };

  const handleSearch = async () => {
    if (!query.trim() || !TOKEN) return;
    setSearching(true);
    setResults([]);
    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${TOKEN}&types=place&language=en&limit=5`,
      );
      const data = await res.json();
      setResults(
        (data.features ?? []).map((f: { text: string; place_name: string; center: [number, number] }) => ({
          text: f.text,
          placeName: f.place_name,
          lng: f.center[0],
          lat: f.center[1],
        })),
      );
    } finally {
      setSearching(false);
    }
  };

  const pickResult = (r: GeoResult) => {
    setForm(f => ({ ...f, nameEn: f.nameEn || r.text, lat: r.lat.toFixed(4), lng: r.lng.toFixed(4) }));
    setResults([]);
    setQuery('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    setLoading(true);
    try {
      const url = isEdit ? `/api/admin/cities/${city.id}` : '/api/admin/cities';
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Hata'); return; }
      setSuccess(isEdit ? 'Şehir güncellendi!' : 'Şehir oluşturuldu!');
      if (!isEdit) router.push(`/admin/cities/${data.id}`);
    } catch {
      setError('Bağlantı hatası');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16, alignItems: 'start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {TOKEN && (
          <div style={{ background: '#0d0d18', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <h3 style={{ color: '#fff', fontSize: '0.88rem', fontWeight: 600, margin: 0 }}>Haritada Ara</h3>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                style={INPUT} value={query} onChange={e => setQuery(e.target.value)} onFocus={fo} onBlur={bl}
                placeholder="Şehir ara, ör. Antalya"
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleSearch(); } }}
              />
              <button type="button" onClick={handleSearch} disabled={searching} style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '0 16px',
                background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.3)',
                borderRadius: 9, color: '#D4AF37', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', flexShrink: 0,
              }}>
                {searching ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Search size={14} />}
                Ara
              </button>
            </div>
            {results.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {results.map((r, i) => (
                  <button
                    key={i} type="button" onClick={() => pickResult(r)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px',
                      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 8, color: 'rgba(255,255,255,0.75)', fontSize: '0.78rem',
                      cursor: 'pointer', textAlign: 'left',
                    }}
                  >
                    <MapPin size={13} color="#D4AF37" style={{ flexShrink: 0 }} />
                    {r.placeName}
                  </button>
                ))}
              </div>
            )}
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        <div style={{ background: '#0d0d18', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <h3 style={{ color: '#fff', fontSize: '0.88rem', fontWeight: 600, margin: 0 }}>Şehir Bilgileri</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={LABEL}>اسم المدينة (بالعربية)</label>
              <input style={{ ...INPUT, direction: 'rtl' }} value={form.nameAr} onChange={set('nameAr')} onFocus={fo} onBlur={bl} placeholder="أنطاليا" required />
            </div>
            <div>
              <label style={LABEL}>City Name (English)</label>
              <input style={INPUT} value={form.nameEn} onChange={set('nameEn')} onFocus={fo} onBlur={bl} placeholder="Antalya" required />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={LABEL}>Enlem (lat)</label>
              <input style={INPUT} type="number" step="any" value={form.lat} onChange={set('lat')} onFocus={fo} onBlur={bl} placeholder="36.8969" required />
            </div>
            <div>
              <label style={LABEL}>Boylam (lng)</label>
              <input style={INPUT} type="number" step="any" value={form.lng} onChange={set('lng')} onFocus={fo} onBlur={bl} placeholder="30.7133" required />
            </div>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.68rem', margin: 0 }}>
            Koordinatları yukarıdaki arama kutusuyla otomatik doldurabilir veya elle girebilirsiniz.
          </p>
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
              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.68rem' }}>Haritada ve ilan formunda görünür</div>
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
          <Save size={14} />{loading ? 'Kaydediliyor...' : isEdit ? 'Güncelle' : 'Şehir Ekle'}
        </button>
        <a href="/admin/cities" style={{ display: 'block', textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', textDecoration: 'none' }}>← Listeye Dön</a>
      </div>
    </form>
  );
}
