import { notFound } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import AdminHeader from '@/components/admin/AdminHeader';
import SeoForm from '@/components/admin/SeoForm';

export default async function SeoEditPage({ params }: { params: Promise<{ pageKey: string }> }) {
  const { pageKey } = await params;
  const session = await getSession();
  const seo = await prisma.seoSettings.findUnique({ where: { pageKey } });
  if (!seo) notFound();

  return (
    <>
      <AdminHeader title={`SEO — ${pageKey}`} userName={session?.name} userRole={session?.role} />
      <main style={{ flex: 1, overflowY: 'auto', padding: '28px', maxWidth: 800 }}>
        <SeoForm seo={seo} />
      </main>
    </>
  );
}
