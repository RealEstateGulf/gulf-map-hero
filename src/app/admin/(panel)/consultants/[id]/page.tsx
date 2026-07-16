import { notFound } from 'next/navigation';
import AdminHeader from '@/components/admin/AdminHeader';
import ConsultantForm from '@/components/admin/ConsultantForm';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import DeleteButton from '@/components/admin/DeleteButton';

export default async function EditConsultantPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  const consultant = await prisma.consultant.findUnique({ where: { id } });
  if (!consultant) notFound();
  return (
    <>
      <AdminHeader title="Danışmanı Düzenle" userName={session?.name} userRole={session?.role} />
      <main style={{ flex: 1, overflowY: 'auto', padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
          <DeleteButton id={id} endpoint={`/api/admin/consultants/${id}`} redirectTo="/admin/consultants" label="Danışmanı Sil" />
        </div>
        <ConsultantForm consultant={consultant} />
      </main>
    </>
  );
}
