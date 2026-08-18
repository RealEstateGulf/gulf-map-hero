import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { listingSchema } from '@/lib/validation';
import { serverError } from '@/lib/errorResponse';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  try {
    const parsed = listingSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: 'Geçersiz veri' }, { status: 400 });
    const body = parsed.data;
    const listing = await prisma.property.update({
      where: { id },
      data: {
        slug: body.slug,
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
  } catch (e: unknown) {
    const msg = e instanceof Error && e.message.includes('Unique') ? 'Bu slug zaten kullanılıyor' : 'Güncelleme hatası';
    return serverError(e, msg);
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
    return serverError(e, 'Silme hatası');
  }
}
