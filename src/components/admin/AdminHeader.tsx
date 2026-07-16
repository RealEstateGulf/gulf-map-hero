'use client';

import { Bell, User } from 'lucide-react';

interface Props {
  title: string;
  userName?: string;
  userRole?: string;
}

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: 'Süper Admin',
  ADMIN: 'Admin',
  AGENT: 'İlan Sorumlusu',
  CONSULTANT: 'Danışman',
};

export default function AdminHeader({ title, userName, userRole }: Props) {
  return (
    <header
      style={{
        height: 64,
        padding: '0 28px',
        background: '#0d0d14',
        borderBottom: '1px solid rgba(212,175,55,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}
    >
      <h1 style={{ color: '#fff', fontSize: '1.05rem', fontWeight: 600, margin: 0 }}>
        {title}
      </h1>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button
          style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: 'rgba(255,255,255,0.4)', padding: 6, borderRadius: 8, display: 'flex',
          }}
        >
          <Bell size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(212,175,55,0.3), rgba(212,175,55,0.1))',
              border: '1px solid rgba(212,175,55,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <User size={16} color="#D4AF37" />
          </div>
          <div>
            <div style={{ color: '#fff', fontSize: '0.8rem', fontWeight: 600 }}>{userName ?? 'Admin'}</div>
            <div style={{ color: 'rgba(212,175,55,0.7)', fontSize: '0.65rem' }}>
              {userRole ? ROLE_LABELS[userRole] ?? userRole : ''}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
