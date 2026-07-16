'use client';

// ssr:false must live inside a Client Component (Next.js 16 requirement)
import dynamic from 'next/dynamic';

const InvestmentMap = dynamic(() => import('./InvestmentMap'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: '#0a0a0e',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#D9BAA0',
        fontSize: '0.85rem',
        direction: 'ltr',
      }}
    >
      Harita yükleniyor…
    </div>
  ),
});

export default function MapLoader() {
  return <InvestmentMap />;
}
