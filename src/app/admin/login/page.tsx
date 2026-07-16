'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Globe, Lock, Mail } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Giriş başarısız'); return; }
      router.push('/admin/dashboard');
    } catch {
      setError('Bağlantı hatası');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        direction: 'ltr',
        minHeight: '100vh',
        background: '#07070f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: '20px',
      }}
    >
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14, margin: '0 auto 14px',
            background: 'linear-gradient(135deg, #D4AF37, #8B6914)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Globe size={26} color="#000" />
          </div>
          <h1 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 700, margin: '0 0 4px' }}>Gulf Invest</h1>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.82rem', margin: 0 }}>Admin Paneli</p>
        </div>

        {/* Card */}
        <div style={{
          background: '#0d0d18',
          border: '1px solid rgba(212,175,55,0.15)',
          borderRadius: 18,
          padding: '32px 28px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}>
          <h2 style={{ color: '#fff', fontSize: '1rem', fontWeight: 600, margin: '0 0 24px', textAlign: 'center' }}>
            Giriş Yap
          </h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Email */}
            <div>
              <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', display: 'block', marginBottom: 6 }}>
                Email
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} color="rgba(255,255,255,0.25)" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@gulfinvest.com"
                  required
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    padding: '11px 14px 11px 38px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 10, color: '#fff', fontSize: '0.88rem',
                    outline: 'none', transition: 'border-color 0.15s',
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.5)'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', display: 'block', marginBottom: 6 }}>
                Şifre
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} color="rgba(255,255,255,0.25)" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    padding: '11px 42px 11px 38px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 10, color: '#fff', fontSize: '0.88rem',
                    outline: 'none', transition: 'border-color 0.15s',
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.5)'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(s => !s)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', display: 'flex',
                    padding: 0,
                  }}
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.2)',
                borderRadius: 8, padding: '10px 14px', color: '#ff6060', fontSize: '0.8rem',
              }}>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '12px', background: loading ? 'rgba(212,175,55,0.4)' : '#D4AF37',
                border: 'none', borderRadius: 10, color: '#000',
                fontSize: '0.88rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s', marginTop: 4,
              }}
            >
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '0.7rem', marginTop: 20 }}>
          Gulf Invest Admin — Yetkisiz erişim yasaktır.
        </p>
      </div>
    </div>
  );
}
