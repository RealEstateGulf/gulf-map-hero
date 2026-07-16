import AdminHeader from '@/components/admin/AdminHeader';
import UserForm from '@/components/admin/UserForm';
import { getSession } from '@/lib/auth';

export default async function NewUserPage() {
  const session = await getSession();
  return (
    <>
      <AdminHeader title="Yeni Kullanıcı" userName={session?.name} userRole={session?.role} />
      <main style={{ flex: 1, overflowY: 'auto', padding: '28px' }}>
        <UserForm />
      </main>
    </>
  );
}
