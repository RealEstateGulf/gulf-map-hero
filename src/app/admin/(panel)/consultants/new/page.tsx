import AdminHeader from '@/components/admin/AdminHeader';
import ConsultantForm from '@/components/admin/ConsultantForm';
import { getSession } from '@/lib/auth';

export default async function NewConsultantPage() {
  const session = await getSession();
  return (
    <>
      <AdminHeader title="Yeni Danışman" userName={session?.name} userRole={session?.role} />
      <main style={{ flex: 1, overflowY: 'auto', padding: '28px' }}>
        <ConsultantForm />
      </main>
    </>
  );
}
