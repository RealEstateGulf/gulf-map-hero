import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { citySchema } from '@/lib/validation';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const cities = await prisma.city.findMany({ orderBy: { sortOrder: 'asc' } });
  return NextResponse.json(cities);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const parsed = citySchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: 'Geçersiz veri' }, { status: 400 });
    const body = parsed.data;
    const city = await prisma.city.create({
      data: {
        nameAr: body.nameAr, nameEn: body.nameEn,
        lat: body.lat, lng: body.lng,
        active: body.active ?? true,
        sortOrder: body.sortOrder ?? 0,
      },
    });
    return NextResponse.json(city);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Kayıt hatası' }, { status: 500 });
  }
}
