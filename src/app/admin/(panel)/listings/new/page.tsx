import ListingForm from '@/components/admin/ListingForm';
import AdminHeader from '@/components/admin/AdminHeader';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function NewListingPage() {
  const session = await getSession();
  const [consultants, agents, cities] = await Promise.all([
    prisma.consultant.findMany({ where: { active: true }, select: { id: true, nameEn: true, nameAr: true } }),
    prisma.user.findMany({ where: { active: true, role: { in: ['AGENT', 'ADMIN', 'SUPER_ADMIN'] } }, select: { id: true, name: true } }),
    prisma.city.findMany({ where: { active: true }, orderBy: { sortOrder: 'asc' }, select: { id: true, nameAr: true, nameEn: true } }),
  ]);

  return (
    <>
      <AdminHeader title="Yeni İlan Ekle" userName={session?.name} userRole={session?.role} />
      <main style={{ flex: 1, overflowY: 'auto', padding: '28px' }}>
        <ListingForm consultants={consultants} agents={agents} cities={cities} />
      </main>
    </>
  );
}
