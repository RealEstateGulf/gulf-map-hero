'use client';

import { useState, useRef } from 'react';
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react';

interface Props {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUpload({ value, onChange, label = 'Görsel' }: Props) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    setError('');
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Yükleme hatası'); return; }
      onChange(data.url);
    } catch {
      setError('Yükleme başarısız');
    } finally {
      setUploading(false);
    }
  };

  const handleFiles = (files: FileList | null) => {
    if (!files?.length) return;
    upload(files[0]);
  };

  return (
    <div>
      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.73rem', marginBottom: 6 }}>{label}</div>

      {/* Preview */}
      {value && (
        <div style={{ position: 'relative', marginBottom: 10, borderRadius: 10, overflow: 'hidden', height: 160, background: '#111' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          <button
            type="button"
            onClick={() => onChange('')}
            style={{
              position: 'absolute', top: 8, right: 8, width: 28, height: 28,
              background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '50%', cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center', color: '#fff',
            }}
          >
            <X size={13} />
          </button>
        </div>
      )}

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        style={{
          border: `2px dashed ${dragging ? '#D4AF37' : 'rgba(255,255,255,0.12)'}`,
          borderRadius: 10, padding: '18px 14px', textAlign: 'center', cursor: 'pointer',
          background: dragging ? 'rgba(212,175,55,0.04)' : 'rgba(255,255,255,0.02)',
          transition: 'all 0.15s',
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          style={{ display: 'none' }}
          onChange={e => handleFiles(e.target.files)}
        />
        {uploading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: '#D4AF37', fontSize: '0.8rem' }}>
            <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
            Yükleniyor...
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 4 }}>
              {dragging ? <Upload size={18} color="#D4AF37" /> : <ImageIcon size={18} color="rgba(255,255,255,0.25)" />}
            </div>
            <div style={{ color: dragging ? '#D4AF37' : 'rgba(255,255,255,0.35)', fontSize: '0.75rem' }}>
              {value ? 'Değiştirmek için tıkla veya sürükle' : 'Görsel yüklemek için tıkla veya buraya sürükle'}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.65rem', marginTop: 4 }}>
              JPEG, PNG, WebP — maks. 10 MB
            </div>
          </>
        )}
      </div>

      {/* Or URL input */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
        <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.65rem' }}>ya da URL gir</span>
        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
      </div>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="https://..."
        style={{
          marginTop: 8, width: '100%', boxSizing: 'border-box', padding: '9px 12px',
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 8, color: '#fff', fontSize: '0.8rem', outline: 'none',
          fontFamily: 'inherit',
        }}
        onFocus={e => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.5)'; }}
        onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
      />

      {error && (
        <div style={{ marginTop: 6, color: '#ff6060', fontSize: '0.72rem' }}>{error}</div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
