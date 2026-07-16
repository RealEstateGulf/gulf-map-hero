import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  try {
    const body = await req.json();
    const listing = await prisma.property.update({
      where: { id },
      data: {
        city: body.city, cityEn: body.cityEn,
        titleAr: body.titleAr, titleEn: body.titleEn,
        locationAr: body.locationAr, locationEn: body.locationEn,
        price: body.price, area: body.area, rooms: body.rooms,
        typeAr: body.typeAr, typeEn: body.typeEn,
        category: body.category, badge: body.badge || null,
        descriptionAr: body.descriptionAr || null,
        descriptionEn: body.descriptionEn || null,
        featuresAr: body.featuresAr ?? '[]',
        featuresEn: body.featuresEn ?? '[]',
        thumbGradient: body.thumbGradient,
        published: body.published,
        featured: body.featured,
        agentId: body.agentId || null,
        consultantId: body.consultantId || null,
      },
    });
    return NextResponse.json(listing);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Güncelleme hatası' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  try {
    await prisma.property.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Silme hatası' }, { status: 500 });
  }
}
