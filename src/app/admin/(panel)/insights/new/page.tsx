import AdminHeader from '@/components/admin/AdminHeader';
import InsightForm from '@/components/admin/InsightForm';
import { getSession } from '@/lib/auth';
export default async function NewInsightPage() {
  const session = await getSession();
  return (
    <>
      <AdminHeader title="Yeni Blog Yazısı" userName={session?.name} userRole={session?.role} />
      <main style={{ flex: 1, overflowY: 'auto', padding: '28px' }}><InsightForm /></main>
    </>
  );
}
