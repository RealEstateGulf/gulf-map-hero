import { notFound } from 'next/navigation';
import AdminHeader from '@/components/admin/AdminHeader';
import CityForm from '@/components/admin/CityForm';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import DeleteButton from '@/components/admin/DeleteButton';

export default async function EditCityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  const city = await prisma.city.findUnique({ where: { id } });
  if (!city) notFound();
  return (
    <>
      <AdminHeader title="Şehri Düzenle" userName={session?.name} userRole={session?.role} />
      <main style={{ flex: 1, overflowY: 'auto', padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
          <DeleteButton id={id} endpoint={`/api/admin/cities/${id}`} redirectTo="/admin/cities" label="Şehri Sil" />
        </div>
        <CityForm city={city} />
      </main>
    </>
  );
}
