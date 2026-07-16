import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const [cities, counts] = await Promise.all([
    prisma.city.findMany({ where: { active: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.property.groupBy({
      by: ['cityEn'],
      where: { published: true },
      _count: { _all: true },
    }),
  ]);

  const countByCityEn = new Map(counts.map(c => [c.cityEn, c._count._all]));

  const result = cities.map(c => ({
    id: c.id,
    nameAr: c.nameAr,
    nameEn: c.nameEn,
    lat: c.lat,
    lng: c.lng,
    count: countByCityEn.get(c.nameEn) ?? 0,
  }));

  return NextResponse.json(result);
}
