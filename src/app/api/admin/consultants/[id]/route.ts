import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  try {
    const body = await req.json();
    const c = await prisma.consultant.update({
      where: { id },
      data: {
        nameAr: body.nameAr, nameEn: body.nameEn, phone: body.phone,
        whatsapp: body.whatsapp || null, email: body.email || null,
        photoUrl: body.photoUrl || null, bioAr: body.bioAr || null,
        bioEn: body.bioEn || null, active: body.active ?? true,
      },
    });
    return NextResponse.json(c);
  } catch (e) { console.error(e); return NextResponse.json({ error: 'Hata' }, { status: 500 }); }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  try {
    await prisma.consultant.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) { console.error(e); return NextResponse.json({ error: 'Hata' }, { status: 500 }); }
}
