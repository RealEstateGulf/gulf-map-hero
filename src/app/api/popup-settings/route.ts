import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const rows = await prisma.pageContent.findMany({ where: { pageKey: 'popup' } });
  const get = (key: string, def: string) => rows.find(r => r.key === key)?.valueAr ?? def;
  return NextResponse.json({
    enabled:       get('enabled', 'true') === 'true',
    delay_minutes: parseFloat(get('delay_minutes', '2')),
    title_ar:      get('title_ar', 'تواصل معنا'),
    title_en:      get('title_en', 'Contact Us'),
    subtitle_ar:   get('subtitle_ar', 'اختر طريقة التواصل المفضلة لديك'),
    subtitle_en:   get('subtitle_en', 'Choose your preferred contact method'),
    wa_number:     get('wa_number', '905072308453'),
    wa_text_ar:    get('wa_text_ar', 'انضم لقناة واتساب'),
    wa_text_en:    get('wa_text_en', 'Join WhatsApp Channel'),
    leave_text_ar: get('leave_text_ar', 'اترك رقمك وسنتصل بك'),
    leave_text_en: get('leave_text_en', "Leave your number, we'll call you"),
    success_ar:    get('success_ar', 'شكراً لك!'),
    success_en:    get('success_en', 'Thank You!'),
  });
}
