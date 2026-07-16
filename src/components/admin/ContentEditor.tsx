'use client';

import { useState } from 'react';
import { Save, Plus, Trash2, AlertCircle, CheckCircle, Info, Eye } from 'lucide-react';
import ImageUpload from './ImageUpload';

type Row = {
  id: string; pageKey: string; key: string; label: string;
  type: 'text' | 'textarea' | 'image';
  defaultAr: string; defaultEn: string;
  valueAr: string; valueEn: string;
};

const fo = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.5)'; };
const bl = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; };

const INPUT_BASE: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box', padding: '9px 12px',
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8, color: '#fff', fontSize: '0.82rem', outline: 'none',
  transition: 'border-color 0.15s', fontFamily: 'inherit', resize: 'vertical',
};

export default function ContentEditor({ pageKey, initialRows }: { pageKey: string; initialRows: Row[] }) {
  const [rows, setRows] = useState<Row[]>(initialRows.map(r => ({ ...r })));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newKey, setNewKey] = useState('');
  const [addingNew, setAddingNew] = useState(false);
  const [showDefaults, setShowDefaults] = useState(true);

  const update = (index: number, field: 'valueAr' | 'valueEn', value: string) =>
    setRows(rs => rs.map((r, i) => i === index ? { ...r, [field]: value } : r));

  const remove = (index: number) => setRows(rs => rs.filter((_, i) => i !== index));

  const addRow = () => {
    if (!newKey.trim()) return;
    if (rows.find(r => r.key === newKey.trim())) { alert('Bu anahtar zaten mevcut'); return; }
    setRows(rs => [...rs, { id: '', pageKey, key: newKey.trim(), label: newKey.trim(), type: 'text', defaultAr: '', defaultEn: '', valueAr: '', valueEn: '' }]);
    setNewKey(''); setAddingNew(false);
  };

  const handleSave = async () => {
    setError(''); setSuccess('');
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/content/${pageKey}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows: rows.map(r => ({ key: r.key, valueAr: r.valueAr, valueEn: r.valueEn })) }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Kaydetme hatası'); return; }
      setSuccess('Kaydedildi!');
      setTimeout(() => setSuccess(''), 3000);
    } catch { setError('Bağlantı hatası'); } finally { setLoading(false); }
  };

  const hasAnyDefault = rows.some(r => r.defaultAr || r.defaultEn);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Info + toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>
          <Info size={13} />
          Değer girilmediğinde sitede mevcut hardcoded metin gösterilir. Sadece değiştirmek istediğin alanları doldur.
        </div>
        {hasAnyDefault && (
          <button type="button" onClick={() => setShowDefaults(s => !s)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            <Eye size={12} />{showDefaults ? 'Mevcut değerleri gizle' : 'Mevcut değerleri göster'}
          </button>
        )}
      </div>

      {/* Rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {rows.map((row, i) => (
          <div key={`${row.key}-${i}`} style={{ background: '#0d0d18', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '16px 18px' }}>
            {/* Row header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem', fontWeight: 600 }}>{row.label}</span>
                <code style={{ color: '#D4AF37', fontSize: '0.62rem', background: 'rgba(212,175,55,0.08)', padding: '2px 7px', borderRadius: 4 }}>
                  {row.key}
                </code>
                <span style={{ fontSize: '0.6rem', padding: '2px 7px', borderRadius: 4,
                  background: row.type === 'image' ? 'rgba(96,165,250,0.1)' : row.type === 'textarea' ? 'rgba(167,139,250,0.1)' : 'rgba(255,255,255,0.05)',
                  color: row.type === 'image' ? '#60a5fa' : row.type === 'textarea' ? '#a78bfa' : 'rgba(255,255,255,0.3)',
                  border: `1px solid ${row.type === 'image' ? 'rgba(96,165,250,0.2)' : row.type === 'textarea' ? 'rgba(167,139,250,0.2)' : 'rgba(255,255,255,0.06)'}`,
                }}>
                  {row.type === 'image' ? 'Görsel' : row.type === 'textarea' ? 'Uzun Metin' : 'Kısa Metin'}
                </span>
              </div>
              <button type="button" onClick={() => remove(i)} style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid rgba(255,80,80,0.15)', background: 'rgba(255,80,80,0.06)', cursor: 'pointer', color: 'rgba(255,80,80,0.5)', display: 'flex', alignItems: 'center' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#ff6060'; e.currentTarget.style.background = 'rgba(255,80,80,0.12)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,80,80,0.5)'; e.currentTarget.style.background = 'rgba(255,80,80,0.06)'; }}>
                <Trash2 size={12} />
              </button>
            </div>

            {row.type === 'image' ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.65rem', marginBottom: 6 }}>Görsel URL (AR ve EN için aynı kullanılır)</div>
                  <ImageUpload label="" value={row.valueAr} onChange={url => { update(i, 'valueAr', url); update(i, 'valueEn', url); }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {row.valueAr ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={row.valueAr} alt="preview" style={{ maxWidth: '100%', maxHeight: 160, borderRadius: 8, objectFit: 'cover' }} />
                  ) : (
                    <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem', textAlign: 'center' }}>
                      Görsel yüklenmemiş<br /><span style={{ fontSize: '0.65rem' }}>Mevcut site görseli kullanılır</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {/* AR */}
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.65rem', marginBottom: 5, display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ background: 'rgba(52,211,153,0.1)', color: '#34d399', fontSize: '0.58rem', padding: '1px 6px', borderRadius: 3 }}>AR</span>
                    Arapça
                  </div>
                  {showDefaults && row.defaultAr && (
                    <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.68rem', marginBottom: 6, padding: '6px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: 6, border: '1px solid rgba(255,255,255,0.05)', direction: 'rtl', lineHeight: 1.5 }}>
                      <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '0.58rem', display: 'block', marginBottom: 2, direction: 'ltr' }}>Mevcut:</span>
                      {row.defaultAr}
                    </div>
                  )}
                  {row.type === 'textarea' ? (
                    <textarea value={row.valueAr} onChange={e => update(i, 'valueAr', e.target.value)} onFocus={fo} onBlur={bl}
                      placeholder={row.defaultAr ? `Mevcut: ${row.defaultAr.slice(0, 40)}...` : 'Arapça metin...'}
                      rows={3} style={{ ...INPUT_BASE, direction: 'rtl', minHeight: 80 }} />
                  ) : (
                    <input value={row.valueAr} onChange={e => update(i, 'valueAr', e.target.value)} onFocus={fo} onBlur={bl}
                      placeholder={row.defaultAr ? `Mevcut: ${row.defaultAr.slice(0, 40)}` : 'الخطأ بالعربية...'}
                      style={{ ...INPUT_BASE, direction: 'rtl' }} />
                  )}
                </div>
                {/* EN */}
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.65rem', marginBottom: 5, display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ background: 'rgba(96,165,250,0.1)', color: '#60a5fa', fontSize: '0.58rem', padding: '1px 6px', borderRadius: 3 }}>EN</span>
                    İngilizce
                  </div>
                  {showDefaults && row.defaultEn && (
                    <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.68rem', marginBottom: 6, padding: '6px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: 6, border: '1px solid rgba(255,255,255,0.05)', lineHeight: 1.5 }}>
                      <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '0.58rem', display: 'block', marginBottom: 2 }}>Current:</span>
                      {row.defaultEn}
                    </div>
                  )}
                  {row.type === 'textarea' ? (
                    <textarea value={row.valueEn} onChange={e => update(i, 'valueEn', e.target.value)} onFocus={fo} onBlur={bl}
                      placeholder={row.defaultEn ? `Current: ${row.defaultEn.slice(0, 40)}...` : 'English text...'}
                      rows={3} style={{ ...INPUT_BASE, minHeight: 80 }} />
                  ) : (
                    <input value={row.valueEn} onChange={e => update(i, 'valueEn', e.target.value)} onFocus={fo} onBlur={bl}
                      placeholder={row.defaultEn ? `Current: ${row.defaultEn.slice(0, 40)}` : 'English text...'}
                      style={INPUT_BASE} />
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add new */}
      {addingNew ? (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '12px 14px', background: '#0d0d18', border: '1px dashed rgba(212,175,55,0.25)', borderRadius: 10 }}>
          <input value={newKey} onChange={e => setNewKey(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') addRow(); if (e.key === 'Escape') setAddingNew(false); }}
            placeholder="örn: hero.badge.label" autoFocus
            style={{ ...INPUT_BASE, fontFamily: 'monospace', fontSize: '0.8rem', flex: 1 }} onFocus={fo} onBlur={bl} />
          <button type="button" onClick={addRow} style={{ padding: '8px 16px', background: '#D4AF37', border: 'none', borderRadius: 8, color: '#000', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>Ekle</button>
          <button type="button" onClick={() => { setAddingNew(false); setNewKey(''); }} style={{ padding: '8px 12px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', cursor: 'pointer' }}>İptal</button>
        </div>
      ) : (
        <button type="button" onClick={() => setAddingNew(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 10, color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', cursor: 'pointer' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.3)'; e.currentTarget.style.color = '#D4AF37'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; }}>
          <Plus size={14} />Yeni Alan Ekle
        </button>
      )}

      {/* Save bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 4 }}>
        <button type="button" onClick={handleSave} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 24px', background: loading ? 'rgba(212,175,55,0.4)' : '#D4AF37', border: 'none', borderRadius: 9, color: '#000', fontSize: '0.85rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer' }}>
          <Save size={15} />{loading ? 'Kaydediliyor...' : 'Tümünü Kaydet'}
        </button>
        <a href="/admin/content" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.78rem', textDecoration: 'none' }}>← Geri</a>
        {error && <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#ff6060', fontSize: '0.78rem' }}><AlertCircle size={13} />{error}</div>}
        {success && <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#34d399', fontSize: '0.78rem' }}><CheckCircle size={13} />{success}</div>}
      </div>
    </div>
  );
}
