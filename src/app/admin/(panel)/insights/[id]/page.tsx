import { notFound } from 'next/navigation';
import AdminHeader from '@/components/admin/AdminHeader';
import InsightForm from '@/components/admin/InsightForm';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import DeleteButton from '@/components/admin/DeleteButton';
export default async function EditInsightPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  const post = await prisma.insightPost.findUnique({ where: { id } });
  if (!post) notFound();
  return (
    <>
      <AdminHeader title="Yazıyı Düzenle" userName={session?.name} userRole={session?.role} />
      <main style={{ flex: 1, overflowY: 'auto', padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
          <DeleteButton id={id} endpoint={`/api/admin/insights/${id}`} redirectTo="/admin/insights" label="Yazıyı Sil" />
        </div>
        <InsightForm post={post} />
      </main>
    </>
  );
}
