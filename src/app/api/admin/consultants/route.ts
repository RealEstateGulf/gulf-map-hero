import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { consultantSchema } from '@/lib/validation';
import { serverError } from '@/lib/errorResponse';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const parsed = consultantSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: 'Geçersiz veri' }, { status: 400 });
    const body = parsed.data;
    const c = await prisma.consultant.create({
      data: {
        nameAr: body.nameAr, nameEn: body.nameEn, phone: body.phone,
        whatsapp: body.whatsapp || null, email: body.email || null,
        photoUrl: body.photoUrl || null, bioAr: body.bioAr || null,
        bioEn: body.bioEn || null, active: body.active ?? true,
      },
    });
    return NextResponse.json(c);
  } catch (e) { return serverError(e); }
}
