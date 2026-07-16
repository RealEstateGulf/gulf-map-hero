import AdminHeader from '@/components/admin/AdminHeader';
import CityForm from '@/components/admin/CityForm';
import { getSession } from '@/lib/auth';

export default async function NewCityPage() {
  const session = await getSession();
  return (
    <>
      <AdminHeader title="Yeni Şehir" userName={session?.name} userRole={session?.role} />
      <main style={{ flex: 1, overflowY: 'auto', padding: '28px' }}>
        <CityForm />
      </main>
    </>
  );
}
