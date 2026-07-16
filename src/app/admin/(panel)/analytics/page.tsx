'use client';
import { useState, useEffect } from 'react';
import { TrendingUp, Eye, Globe2, BarChart2, ExternalLink, RefreshCw } from 'lucide-react';

type DailyData = { date: string; views: number };
type PageData = { page: string; views: number };
type SourceData = { source: string; label: string; color: string; count: number };

type AnalyticsData = {
  totalViews: number;
  views7d: number;
  daily: DailyData[];
  topPages: PageData[];
  sources: SourceData[];
};

const CARD: React.CSSProperties = {
  background: '#0d0d18',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: 12,
  padding: '20px 22px',
};

const LABEL_STYLE: React.CSSProperties = {
  color: 'rgba(255,255,255,0.4)',
  fontSize: '0.7rem',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  marginBottom: 6,
};

export default function AnalyticsPage() {
  const [days, setDays] = useState(30);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [ga4Id, setGa4Id] = useState('');
  const [metaPixelId, setMetaPixelId] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/analytics?days=${days}`);
      const json = await res.json();
      setData(json);
    } catch { /* ignore */ } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [days]); // eslint-disable-line react-hooks/exhaustive-deps

  // Load analytics IDs
  useEffect(() => {
    fetch('/api/content/analytics')
      .then(r => r.json())
      .then((d: Record<string, { ar: string; en: string }>) => {
        if (d?.ga4_id?.ar) setGa4Id(d.ga4_id.ar);
        if (d?.meta_pixel_id?.ar) setMetaPixelId(d.meta_pixel_id.ar);
      })
      .catch(() => {});
  }, []);

  const saveIds = async () => {
    setSaving(true);
    try {
      await fetch('/api/admin/content/analytics', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rows: [
            { key: 'ga4_id', valueAr: ga4Id, valueEn: ga4Id },
            { key: 'meta_pixel_id', valueAr: metaPixelId, valueEn: metaPixelId },
          ],
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch { /* ignore */ } finally { setSaving(false); }
  };

  const maxDaily = data ? Math.max(...data.daily.map(d => d.views), 1) : 1;
  const maxSource = data && data.sources.length > 0 ? Math.max(...data.sources.map(s => s.count), 1) : 1;
  const totalSourceViews = data ? data.sources.reduce((sum, s) => sum + s.count, 0) : 0;

  const INPUT: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box', padding: '9px 12px',
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8, color: '#fff', fontSize: '0.83rem', outline: 'none', fontFamily: 'inherit',
  };

  return (
    <div style={{ direction: 'ltr', display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{ padding: '20px 28px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <BarChart2 size={18} color="#D4AF37" />
          <h1 style={{ color: '#fff', fontSize: '1rem', fontWeight: 600, margin: 0 }}>Ziyaretçi Analitiği</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Period selector */}
          {[7, 30, 90].map(d => (
            <button key={d} onClick={() => setDays(d)} style={{
              padding: '6px 14px', borderRadius: 7, fontSize: '0.75rem', fontWeight: 600,
              border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer',
              background: days === d ? '#D4AF37' : 'rgba(255,255,255,0.04)',
              color: days === d ? '#000' : 'rgba(255,255,255,0.5)',
            }}>Son {d} Gün</button>
          ))}
          <button onClick={load} style={{ padding: '6px 10px', borderRadius: 7, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center' }}>
            <RefreshCw size={13} />
          </button>
        </div>
      </div>

      <main style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
        {loading && !data ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'rgba(255,255,255,0.3)' }}>Yükleniyor...</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Summary cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
              <div style={CARD}>
                <div style={LABEL_STYLE}>Toplam Görüntüleme ({days}g)</div>
                <div style={{ fontFamily: "'Marcellus', serif", color: '#D4AF37', fontSize: '2rem', lineHeight: 1 }}>{data?.totalViews?.toLocaleString() ?? 0}</div>
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', marginTop: 6 }}>sayfa görüntüleme</div>
              </div>
              <div style={CARD}>
                <div style={LABEL_STYLE}>Son 7 Günde</div>
                <div style={{ fontFamily: "'Marcellus', serif", color: '#60a5fa', fontSize: '2rem', lineHeight: 1 }}>{data?.views7d?.toLocaleString() ?? 0}</div>
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', marginTop: 6 }}>sayfa görüntüleme</div>
              </div>
              <div style={CARD}>
                <div style={LABEL_STYLE}>En Popüler Kaynak</div>
                {data?.sources && data.sources.length > 0 ? (
                  <>
                    <div style={{ color: data.sources[0].color, fontSize: '1.1rem', fontWeight: 700, lineHeight: 1.3 }}>
                      {data.sources.sort((a, b) => b.count - a.count)[0].label}
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', marginTop: 6 }}>
                      {data.sources.sort((a, b) => b.count - a.count)[0].count} ziyaret
                    </div>
                  </>
                ) : (
                  <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.82rem', marginTop: 8 }}>Henüz veri yok</div>
                )}
              </div>
            </div>

            {/* Daily chart */}
            <div style={{ ...CARD, padding: '20px 22px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
                <TrendingUp size={14} color="#D4AF37" />
                <span style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600 }}>Günlük Görüntülemeler</span>
              </div>
              {data?.daily && data.daily.length > 0 ? (
                <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end', height: 100, overflowX: 'auto' }}>
                  {data.daily.map(({ date, views }) => {
                    const h = maxDaily > 0 ? Math.max((views / maxDaily) * 100, views > 0 ? 4 : 1) : 1;
                    const label = new Date(date + 'T00:00:00').toLocaleDateString('tr', { month: 'short', day: 'numeric' });
                    return (
                      <div key={date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minWidth: 12 }} title={`${label}: ${views} görüntüleme`}>
                        <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.48rem', textAlign: 'center' }}>{views > 0 ? views : ''}</span>
                        <div style={{ width: '100%', background: views > 0 ? '#D4AF37' : 'rgba(255,255,255,0.06)', borderRadius: '2px 2px 0 0', height: `${h}%`, transition: 'height 0.3s ease' }} />
                        <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.42rem', transform: 'rotate(-45deg)', transformOrigin: 'center', whiteSpace: 'nowrap', marginTop: 4 }}>{label}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '30px 0', color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem' }}>Henüz veri yok — site ziyaret edildikçe burada görünecek</div>
              )}
            </div>

            {/* Sources + Top pages */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

              {/* Traffic sources */}
              <div style={CARD}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <Globe2 size={14} color="#D4AF37" />
                  <span style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600 }}>Trafik Kaynakları</span>
                </div>
                {data?.sources && data.sources.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[...data.sources].sort((a, b) => b.count - a.count).map(({ source, label, color, count }) => {
                      const pct = totalSourceViews > 0 ? Math.round((count / totalSourceViews) * 100) : 0;
                      return (
                        <div key={source}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem' }}>{label}</span>
                            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem' }}>{count} ({pct}%)</span>
                          </div>
                          <div style={{ height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                            <div style={{ height: '100%', borderRadius: 3, background: color, width: `${(count / maxSource) * 100}%`, transition: 'width 0.5s ease' }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '24px 0', color: 'rgba(255,255,255,0.2)', fontSize: '0.78rem' }}>Henüz kaynak verisi yok</div>
                )}
              </div>

              {/* Top pages */}
              <div style={CARD}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <Eye size={14} color="#D4AF37" />
                  <span style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600 }}>En Çok Ziyaret Edilen Sayfalar</span>
                </div>
                {data?.topPages && data.topPages.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {data.topPages.map(({ page, views }, i) => (
                      <div key={page} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: 7 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ width: 18, height: 18, borderRadius: 4, background: i === 0 ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: i === 0 ? '#D4AF37' : 'rgba(255,255,255,0.3)', fontSize: '0.6rem', fontWeight: 700 }}>{i + 1}</span>
                          <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.76rem', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{page === '/' ? 'Ana Sayfa' : page}</span>
                        </div>
                        <span style={{ color: '#D4AF37', fontSize: '0.76rem', fontWeight: 600 }}>{views.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '24px 0', color: 'rgba(255,255,255,0.2)', fontSize: '0.78rem' }}>Henüz sayfa verisi yok</div>
                )}
              </div>
            </div>

            {/* External Analytics IDs */}
            <div style={{ ...CARD, borderColor: 'rgba(212,175,55,0.15)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <ExternalLink size={14} color="#D4AF37" />
                <span style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600 }}>Harici Analitik Entegrasyonları</span>
              </div>
              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', marginBottom: 18, lineHeight: 1.7 }}>
                Organik Google araması ve Meta reklam trafik kaynakları için bu ID&apos;leri girin. Siteye script otomatik eklenecek.
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem', display: 'block', marginBottom: 5 }}>
                    Google Analytics 4 — Measurement ID
                  </label>
                  <input
                    style={INPUT}
                    value={ga4Id}
                    onChange={e => setGa4Id(e.target.value)}
                    placeholder="G-XXXXXXXXXX"
                    onFocus={e => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.5)'; }}
                    onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                  />
                  <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer" style={{ color: '#4285f4', fontSize: '0.68rem', textDecoration: 'none', marginTop: 5, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    Google Analytics Paneli <ExternalLink size={10} />
                  </a>
                </div>
                <div>
                  <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem', display: 'block', marginBottom: 5 }}>
                    Meta Pixel ID (Facebook/Instagram)
                  </label>
                  <input
                    style={INPUT}
                    value={metaPixelId}
                    onChange={e => setMetaPixelId(e.target.value)}
                    placeholder="123456789012345"
                    onFocus={e => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.5)'; }}
                    onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                  />
                  <a href="https://business.facebook.com/events_manager" target="_blank" rel="noopener noreferrer" style={{ color: '#1877f2', fontSize: '0.68rem', textDecoration: 'none', marginTop: 5, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    Meta Business Suite <ExternalLink size={10} />
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button onClick={saveIds} disabled={saving} style={{ padding: '9px 22px', background: saving ? 'rgba(212,175,55,0.4)' : '#D4AF37', border: 'none', borderRadius: 8, color: '#000', fontSize: '0.82rem', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer' }}>
                  {saving ? 'Kaydediliyor...' : 'ID\'leri Kaydet'}
                </button>
                {saved && <span style={{ color: '#34d399', fontSize: '0.78rem' }}>✓ Kaydedildi! Sayfayı yenile.</span>}
              </div>

              <div style={{ marginTop: 16, padding: '14px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', fontWeight: 700, marginBottom: 8 }}>Organik Trafik Nasıl Ölçülür?</div>
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', lineHeight: 1.8 }}>
                  1. Google Analytics 4 hesabı oluştur → Measurement ID al (G-XXXXXXXX) → yukarıya gir → kaydet<br />
                  2. Google Search Console&apos;a siteyi ekle → organik aramalar, keyword&apos;ler ve sıralamalar görünür<br />
                  3. Meta Pixel ID gir → Facebook/Instagram reklamlardan gelen trafiği ve dönüşümleri takip et
                </div>
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}
