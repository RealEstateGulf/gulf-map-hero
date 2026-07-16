// Middleware already handles auth protection for /admin/* routes.
// This layout just provides the sidebar + main-content shell.
// The login page (/admin/login) is excluded from protection in middleware.

import AdminSidebar from '@/components/admin/AdminSidebar';

export const metadata = { title: 'Gulf Invest — Admin Panel' };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
        direction: 'ltr',
        background: '#080810',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <AdminSidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  );
}
