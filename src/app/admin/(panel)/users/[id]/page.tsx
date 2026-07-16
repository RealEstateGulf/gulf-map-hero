import { notFound } from 'next/navigation';
import AdminHeader from '@/components/admin/AdminHeader';
import UserForm from '@/components/admin/UserForm';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import DeleteButton from '@/components/admin/DeleteButton';

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  const user = await prisma.user.findUnique({ where: { id }, select: { id: true, name: true, email: true, role: true, phone: true, active: true } });
  if (!user) notFound();
  return (
    <>
      <AdminHeader title="Kullanıcıyı Düzenle" userName={session?.name} userRole={session?.role} />
      <main style={{ flex: 1, overflowY: 'auto', padding: '28px' }}>
        {session?.role === 'SUPER_ADMIN' && user.id !== session.userId && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
            <DeleteButton id={id} endpoint={`/api/admin/users/${id}`} redirectTo="/admin/users" label="Kullanıcıyı Sil" />
          </div>
        )}
        <UserForm user={user} />
      </main>
    </>
  );
}
