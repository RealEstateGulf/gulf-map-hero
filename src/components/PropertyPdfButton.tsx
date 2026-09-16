'use client';

import { useState } from 'react';
import { Download, Loader2, AlertCircle } from 'lucide-react';
import { pdf } from '@react-pdf/renderer';
import type { Property } from '@/data/properties';
import { useTheme } from '@/context/ThemeContext';
import PropertyBrochureDocument from './pdf/PropertyBrochureDocument';

interface Props {
  property: Property;
  agentPhone: string;
  agentEmail: string;
}

// react-pdf's <Image> fetches the URL itself and throws the whole document
// if that fetch fails (CORS, a dead link, ...). Resolve it to a data URL
// ourselves first so a bad photo just means "no cover image", not "no PDF".
async function toDataUrl(url: string): Promise<string | undefined> {
  try {
    const res = await fetch(url);
    if (!res.ok) return undefined;
    const blob = await res.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return undefined;
  }
}

export default function PropertyPdfButton({ property, agentPhone, agentEmail }: Props) {
  const { t } = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDownload = async () => {
    setLoading(true);
    setError('');
    try {
      const coverImage = property.photos?.[0] ? await toDataUrl(property.photos[0]) : undefined;
      const blob = await pdf(
        <PropertyBrochureDocument property={property} agentPhone={agentPhone} agentEmail={agentEmail} coverImage={coverImage} />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${property.slug}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('PDF generation failed:', e);
      setError('تعذر إنشاء ملف PDF، حاول مرة أخرى');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleDownload}
        disabled={loading}
        style={{
          width: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          background: 'transparent', border: `1px solid ${t.border2}`, borderRadius: 6,
          padding: '12px', color: t.txt2, fontSize: '0.78rem',
          cursor: loading ? 'default' : 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
        }}
        onMouseEnter={e => { if (!loading) { e.currentTarget.style.borderColor = t.gold3; e.currentTarget.style.color = t.gold; } }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = t.border2; e.currentTarget.style.color = t.txt2; }}
      >
        {loading ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Download size={14} />}
        {loading ? 'جارٍ التجهيز...' : 'تحميل ملف PDF'}
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </button>
      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, color: '#ff6060', fontSize: '0.72rem' }}>
          <AlertCircle size={12} />
          {error}
        </div>
      )}
    </div>
  );
}
