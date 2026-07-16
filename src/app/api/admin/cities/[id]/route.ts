import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  try {
    const body = await req.json();
    const city = await prisma.city.update({
      where: { id },
      data: {
        nameAr: body.nameAr, nameEn: body.nameEn,
        lat: parseFloat(body.lat), lng: parseFloat(body.lng),
        active: body.active ?? true,
        sortOrder: body.sortOrder ?? 0,
      },
    });
    return NextResponse.json(city);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Hata' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  try {
    await prisma.city.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Hata' }, { status: 500 });
  }
}
