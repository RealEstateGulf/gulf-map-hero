import { notFound } from 'next/navigation';
import ListingForm from '@/components/admin/ListingForm';
import AdminHeader from '@/components/admin/AdminHeader';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import DeleteButton from '@/components/admin/DeleteButton';

export default async function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();

  const [listing, consultants, agents, cities] = await Promise.all([
    prisma.property.findUnique({ where: { id } }),
    prisma.consultant.findMany({ where: { active: true }, select: { id: true, nameEn: true, nameAr: true } }),
    prisma.user.findMany({ where: { active: true, role: { in: ['AGENT', 'ADMIN', 'SUPER_ADMIN'] } }, select: { id: true, name: true } }),
    prisma.city.findMany({ where: { active: true }, orderBy: { sortOrder: 'asc' }, select: { id: true, nameAr: true, nameEn: true } }),
  ]);

  if (!listing) notFound();

  return (
    <>
      <AdminHeader title="İlanı Düzenle" userName={session?.name} userRole={session?.role} />
      <main style={{ flex: 1, overflowY: 'auto', padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
          <DeleteButton id={id} endpoint={`/api/admin/listings/${id}`} redirectTo="/admin/listings" label="İlanı Sil" />
        </div>
        <ListingForm listing={listing} consultants={consultants} agents={agents} cities={cities} />
      </main>
    </>
  );
}
