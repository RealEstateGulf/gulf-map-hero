'use client';
import { useState } from 'react';
import { Save, AlertCircle, CheckCircle, MessageCircle, Phone, Clock, ToggleLeft, ToggleRight } from 'lucide-react';

type Settings = {
  enabled: string; delay_minutes: string;
  title_ar: string; title_en: string;
  subtitle_ar: string; subtitle_en: string;
  wa_number: string; wa_text_ar: string; wa_text_en: string;
  leave_text_ar: string; leave_text_en: string;
  success_ar: string; success_en: string;
};

const INPUT: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box', padding: '10px 12px',
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 9, color: '#fff', fontSize: '0.85rem', outline: 'none',
  transition: 'border-color 0.15s', fontFamily: 'inherit',
};
const LABEL: React.CSSProperties = { color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem', display: 'block', marginBottom: 5 };
const CARD: React.CSSProperties = { background: '#0d0d18', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '20px' };

const fo = (e: React.FocusEvent<HTMLInputElement>) => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.5)'; };
const bl = (e: React.FocusEvent<HTMLInputElement>) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; };

export default function PopupSettingsForm({ settings }: { settings: Settings }) {
  const [form, setForm] = useState({ ...settings });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const set = (k: keyof Settings) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const isEnabled = form.enabled === 'true';

  const handleSave = async () => {
    setError(''); setSuccess('');
    setLoading(true);
    try {
      const rows = Object.entries(form).map(([key, value]) => ({ key, valueAr: value, valueEn: value }));
      const res = await fetch('/api/admin/popup', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Hata'); return; }
      setSuccess('Popup ayarları kaydedildi!');
      setTimeout(() => setSuccess(''), 3000);
    } catch { setError('Bağlantı hatası'); } finally { setLoading(false); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 900 }}>
      {/* Enable / Disable + Delay */}
      <div style={{ ...CARD, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <h3 style={{ color: '#fff', fontSize: '0.88rem', fontWeight: 600, margin: 0 }}>Genel Ayarlar</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            onClick={() => setForm(f => ({ ...f, enabled: f.enabled === 'true' ? 'false' : 'true' }))}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
          >
            {isEnabled
              ? <ToggleRight size={32} color="#D4AF37" />
              : <ToggleLeft size={32} color="rgba(255,255,255,0.2)" />}
            <div>
              <div style={{ color: isEnabled ? '#D4AF37' : 'rgba(255,255,255,0.4)', fontWeight: 600, fontSize: '0.85rem' }}>
                {isEnabled ? 'Popup Açık' : 'Popup Kapalı'}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem' }}>
                {isEnabled ? 'Ziyaretçilere popup gösterilecek' : 'Popup gösterilmeyecek'}
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 12, alignItems: 'center' }}>
          <div>
            <label style={{ ...LABEL, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Clock size={12} />Gecikme (dakika)
            </label>
            <input type="number" min="0" max="60" style={INPUT} value={form.delay_minutes} onChange={set('delay_minutes')} onFocus={fo} onBlur={bl} />
          </div>
          <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', paddingTop: 20 }}>
            Ziyaretçi sayfaya girdikten kaç dakika sonra popup açılsın? <strong style={{ color: 'rgba(255,255,255,0.5)' }}>0</strong> = anında açılır.
          </div>
        </div>
      </div>

      {/* Title & Subtitle */}
      <div style={{ ...CARD, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <h3 style={{ color: '#fff', fontSize: '0.88rem', fontWeight: 600, margin: 0 }}>Popup Başlık & Alt Başlık</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div><label style={LABEL}>Başlık (Arapça)</label><input style={{ ...INPUT, direction: 'rtl' }} value={form.title_ar} onChange={set('title_ar')} onFocus={fo} onBlur={bl} placeholder="تواصل معنا" /></div>
          <div><label style={LABEL}>Title (English)</label><input style={INPUT} value={form.title_en} onChange={set('title_en')} onFocus={fo} onBlur={bl} placeholder="Contact Us" /></div>
          <div><label style={LABEL}>Alt Başlık (Arapça)</label><input style={{ ...INPUT, direction: 'rtl' }} value={form.subtitle_ar} onChange={set('subtitle_ar')} onFocus={fo} onBlur={bl} /></div>
          <div><label style={LABEL}>Subtitle (English)</label><input style={INPUT} value={form.subtitle_en} onChange={set('subtitle_en')} onFocus={fo} onBlur={bl} /></div>
        </div>
      </div>

      {/* WhatsApp */}
      <div style={{ ...CARD, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <h3 style={{ color: '#fff', fontSize: '0.88rem', fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 24, height: 24, borderRadius: 6, background: 'linear-gradient(135deg,#25D366,#128C7E)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <MessageCircle size={12} color="white" />
          </span>
          WhatsApp Ayarları
        </h3>
        <div>
          <label style={LABEL}>WhatsApp Numarası (ülke kodu dahil, + olmadan)</label>
          <input style={{ ...INPUT, fontFamily: 'monospace' }} value={form.wa_number} onChange={set('wa_number')} onFocus={fo} onBlur={bl} placeholder="905072308453" />
          <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.65rem', marginTop: 4 }}>
            Örnek: 905072308453 (Türkiye +90 için) — başında + veya boşluk olmadan yaz
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div><label style={LABEL}>WA Butonu Metni (Arapça)</label><input style={{ ...INPUT, direction: 'rtl' }} value={form.wa_text_ar} onChange={set('wa_text_ar')} onFocus={fo} onBlur={bl} /></div>
          <div><label style={LABEL}>WA Button Text (English)</label><input style={INPUT} value={form.wa_text_en} onChange={set('wa_text_en')} onFocus={fo} onBlur={bl} /></div>
        </div>
      </div>

      {/* Leave number */}
      <div style={{ ...CARD, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <h3 style={{ color: '#fff', fontSize: '0.88rem', fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Phone size={14} color="rgba(255,255,255,0.5)" />
          Numara Bırak Butonu
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div><label style={LABEL}>Buton Metni (Arapça)</label><input style={{ ...INPUT, direction: 'rtl' }} value={form.leave_text_ar} onChange={set('leave_text_ar')} onFocus={fo} onBlur={bl} /></div>
          <div><label style={LABEL}>Button Text (English)</label><input style={INPUT} value={form.leave_text_en} onChange={set('leave_text_en')} onFocus={fo} onBlur={bl} /></div>
        </div>
      </div>

      {/* Success */}
      <div style={{ ...CARD, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <h3 style={{ color: '#fff', fontSize: '0.88rem', fontWeight: 600, margin: 0 }}>Başarı Mesajı</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div><label style={LABEL}>Başlık (Arapça)</label><input style={{ ...INPUT, direction: 'rtl' }} value={form.success_ar} onChange={set('success_ar')} onFocus={fo} onBlur={bl} /></div>
          <div><label style={LABEL}>Title (English)</label><input style={INPUT} value={form.success_en} onChange={set('success_en')} onFocus={fo} onBlur={bl} /></div>
        </div>
      </div>

      {/* Preview hint */}
      <div style={{ padding: '12px 16px', background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: 10, color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>
        Kaydet sonrası değişiklikler siteye anında yansır. Popup görmek için site oturumunu temizle (incognito) veya sessionStorage sıfırla.
      </div>

      {/* Save */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button type="button" onClick={handleSave} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 24px', background: loading ? 'rgba(212,175,55,0.4)' : '#D4AF37', border: 'none', borderRadius: 9, color: '#000', fontSize: '0.85rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer' }}>
          <Save size={15} />{loading ? 'Kaydediliyor...' : 'Popup Ayarlarını Kaydet'}
        </button>
        {error && <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#ff6060', fontSize: '0.78rem' }}><AlertCircle size={13} />{error}</div>}
        {success && <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#34d399', fontSize: '0.78rem' }}><CheckCircle size={13} />{success}</div>}
      </div>
    </div>
  );
}
