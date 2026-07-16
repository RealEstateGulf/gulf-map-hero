import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

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
    const body = await req.json();
    const city = await prisma.city.create({
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
    return NextResponse.json({ error: 'Kayıt hatası' }, { status: 500 });
  }
}
