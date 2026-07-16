import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { toFrontendCategory } from '@/lib/categoryMap';

function parseJsonArray(value: string): string[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function GET() {
  const listings = await prisma.property.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
  });

  const properties = listings.map(p => ({
    id: p.id,
    city: p.city,
    cityEn: p.cityEn,
    titleAr: p.titleAr,
    titleEn: p.titleEn,
    locationAr: p.locationAr,
    locationEn: p.locationEn,
    price: p.price,
    area: p.area,
    rooms: p.rooms,
    typeAr: p.typeAr,
    typeEn: p.typeEn,
    category: toFrontendCategory(p.category),
    badge: p.badge ?? undefined,
    description: p.descriptionAr ?? undefined,
    descriptionEn: p.descriptionEn ?? undefined,
    features: parseJsonArray(p.featuresAr),
    featuresEn: parseJsonArray(p.featuresEn),
    thumbGradient: p.thumbGradient,
    photos: parseJsonArray(p.photos),
  }));

  return NextResponse.json(properties);
}
