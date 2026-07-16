import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const listings = await prisma.property.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(listings);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const listing = await prisma.property.create({
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
        photos: body.photos ?? '[]',
        thumbGradient: body.thumbGradient ?? 'from-blue-900 to-blue-700',
        published: body.published ?? true,
        featured: body.featured ?? false,
        agentId: body.agentId || null,
        consultantId: body.consultantId || null,
      },
    });
    return NextResponse.json(listing);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Kayıt hatası' }, { status: 500 });
  }
}
