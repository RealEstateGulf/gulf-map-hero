'use client';

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { pdf } from '@react-pdf/renderer';
import type { Property } from '@/data/properties';
import { useTheme } from '@/context/ThemeContext';
import PropertyBrochureDocument from './pdf/PropertyBrochureDocument';

interface Props {
  property: Property;
  agentPhone: string;
  agentEmail: string;
}

export default function PropertyPdfButton({ property, agentPhone, agentEmail }: Props) {
  const { t } = useTheme();
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const blob = await pdf(
        <PropertyBrochureDocument property={property} agentPhone={agentPhone} agentEmail={agentEmail} />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${property.slug}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  };

  return (
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
  );
}
