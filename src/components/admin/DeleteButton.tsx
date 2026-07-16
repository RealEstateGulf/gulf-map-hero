'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';

export default function DeleteButton({ id, endpoint, redirectTo, label = 'Sil' }: {
  id: string; endpoint: string; redirectTo: string; label?: string;
}) {
  const router = useRouter();
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    const res = await fetch(endpoint, { method: 'DELETE' });
    if (res.ok) router.push(redirectTo);
    else setLoading(false);
  };

  if (confirm) return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>Emin misin?</span>
      <button onClick={handleDelete} disabled={loading} style={{ padding: '7px 14px', background: '#dc2626', border: 'none', borderRadius: 8, color: '#fff', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}>
        {loading ? 'Siliniyor...' : 'Evet, Sil'}
      </button>
      <button onClick={() => setConfirm(false)} style={{ padding: '7px 14px', background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 8, color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem', cursor: 'pointer' }}>
        İptal
      </button>
    </div>
  );

  return (
    <button onClick={() => setConfirm(true)} style={{
      display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px',
      background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.25)',
      borderRadius: 8, color: '#ef4444', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
    }}>
      <Trash2 size={14} />{label}
    </button>
  );
}
