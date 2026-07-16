'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  LayoutDashboard, Building2, Users, UserCheck, FileText,
  Search, Settings, LogOut, ChevronLeft, ChevronRight,
  Newspaper, MessageCircle, BarChart2, MapPin
} from 'lucide-react';

const NAV = [
  { label: 'Dashboard',       href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'İlanlar',         href: '/admin/listings',  icon: Building2 },
  { label: 'Şehirler',        href: '/admin/cities',    icon: MapPin },
  { label: 'Kullanıcılar',    href: '/admin/users',     icon: Users },
  { label: 'Danışmanlar',     href: '/admin/consultants', icon: UserCheck },
  { label: 'Sayfa İçerikleri', href: '/admin/content',  icon: FileText },
  { label: 'Blog / Insights', href: '/admin/insights',  icon: Newspaper },
  { label: 'Analitik',        href: '/admin/analytics', icon: BarChart2 },
  { label: 'SEO Ayarları',    href: '/admin/seo',       icon: Search },
  { label: 'Popup Ayarları',  href: '/admin/popup',     icon: MessageCircle },
  { label: 'Ayarlar',         href: '/admin/settings',  icon: Settings },
];

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await fetch('/api/admin/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const W = collapsed ? 64 : 240;

  return (
    <aside
      style={{
        width: W,
        minWidth: W,
        height: '100vh',
        background: '#0a0a0f',
        borderRight: '1px solid rgba(212,175,55,0.15)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.25s ease, min-width 0.25s ease',
        position: 'sticky',
        top: 0,
        overflow: 'hidden',
        zIndex: 50,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: collapsed ? '10px 8px' : '10px 14px',
          borderBottom: '1px solid rgba(212,175,55,0.1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 68,
          gap: 2,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo-miftah.png"
          alt="Miftah Turkiye"
          style={{
            height: collapsed ? 30 : 42,
            width: 'auto',
            objectFit: 'contain',
            display: 'block',
            mixBlendMode: 'screen',
            transition: 'height 0.25s ease',
          }}
        />
        {!collapsed && (
          <div style={{ color: 'rgba(255,255,255,0.28)', fontSize: '0.55rem', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            Admin Panel
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
        {NAV.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || (href !== '/admin/dashboard' && pathname.startsWith(href));
          return (
            <button
              key={href}
              onClick={() => router.push(href)}
              title={collapsed ? label : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: collapsed ? '10px 0' : '10px 12px',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                background: active ? 'rgba(212,175,55,0.12)' : 'transparent',
                color: active ? '#D4AF37' : 'rgba(255,255,255,0.5)',
                fontSize: '0.82rem',
                fontWeight: active ? 600 : 400,
                transition: 'all 0.15s',
                width: '100%',
                justifyContent: collapsed ? 'center' : 'flex-start',
                borderLeft: active ? '2px solid #D4AF37' : '2px solid transparent',
              }}
              onMouseEnter={e => {
                if (!active) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                  e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
                }
              }}
            >
              <Icon size={18} strokeWidth={active ? 2 : 1.5} style={{ flexShrink: 0 }} />
              {!collapsed && <span style={{ whiteSpace: 'nowrap' }}>{label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Bottom: collapse toggle + logout */}
      <div style={{ padding: '12px 8px', borderTop: '1px solid rgba(212,175,55,0.1)', display: 'flex', flexDirection: 'column', gap: 4 }}>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: collapsed ? '10px 0' : '10px 12px',
            borderRadius: 8, border: 'none', cursor: 'pointer',
            background: 'transparent', color: 'rgba(255,80,80,0.7)',
            fontSize: '0.82rem', fontWeight: 400,
            justifyContent: collapsed ? 'center' : 'flex-start',
            width: '100%', transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,80,80,0.08)'; e.currentTarget.style.color = '#ff5050'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,80,80,0.7)'; }}
        >
          <LogOut size={18} strokeWidth={1.5} style={{ flexShrink: 0 }} />
          {!collapsed && <span>{loggingOut ? 'Çıkış...' : 'Çıkış Yap'}</span>}
        </button>

        <button
          onClick={() => setCollapsed(c => !c)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '8px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)',
            cursor: 'pointer', background: 'transparent', color: 'rgba(255,255,255,0.3)',
            width: '100%', transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; }}
        >
          {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>
      </div>
    </aside>
  );
}
