import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import AdminHeader from '@/components/admin/AdminHeader';
import PopupSettingsForm from '@/components/admin/PopupSettingsForm';

export default async function PopupSettingsPage() {
  const session = await getSession();

  // Load popup settings from PageContent with pageKey='popup'
  const rows = await prisma.pageContent.findMany({ where: { pageKey: 'popup' } });
  const get = (key: string) => rows.find(r => r.key === key);

  const settings = {
    enabled:        get('enabled')?.valueAr ?? 'true',
    delay_minutes:  get('delay_minutes')?.valueAr ?? '2',
    title_ar:       get('title_ar')?.valueAr ?? 'تواصل معنا',
    title_en:       get('title_en')?.valueAr ?? 'Contact Us',
    subtitle_ar:    get('subtitle_ar')?.valueAr ?? 'اختر طريقة التواصل المفضلة لديك',
    subtitle_en:    get('subtitle_en')?.valueAr ?? 'Choose your preferred contact method',
    wa_number:      get('wa_number')?.valueAr ?? '905072308453',
    wa_text_ar:     get('wa_text_ar')?.valueAr ?? 'انضم لقناة واتساب',
    wa_text_en:     get('wa_text_en')?.valueAr ?? 'Join WhatsApp Channel',
    leave_text_ar:  get('leave_text_ar')?.valueAr ?? 'اترك رقمك وسنتصل بك',
    leave_text_en:  get('leave_text_en')?.valueAr ?? "Leave your number, we'll call you",
    success_ar:     get('success_ar')?.valueAr ?? 'شكراً لك!',
    success_en:     get('success_en')?.valueAr ?? 'Thank You!',
  };

  return (
    <>
      <AdminHeader title="Popup Ayarları" userName={session?.name} userRole={session?.role} />
      <main style={{ flex: 1, overflowY: 'auto', padding: '28px' }}>
        <PopupSettingsForm settings={settings} />
      </main>
    </>
  );
}
