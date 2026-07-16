import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ pageKey: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { pageKey } = await params;
  const rows = await prisma.pageContent.findMany({ where: { pageKey }, orderBy: { key: 'asc' } });
  return NextResponse.json(rows);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ pageKey: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { pageKey } = await params;
  try {
    const { rows } = await req.json() as { rows: { key: string; valueAr: string; valueEn: string }[] };
    if (!Array.isArray(rows)) return NextResponse.json({ error: 'Geçersiz veri' }, { status: 400 });

    // Upsert all rows, delete removed ones
    const savedKeys = rows.map(r => r.key);

    // Delete keys that were removed
    await prisma.pageContent.deleteMany({
      where: { pageKey, key: { notIn: savedKeys } },
    });

    // Upsert each row
    await Promise.all(
      rows.map(r =>
        prisma.pageContent.upsert({
          where: { pageKey_key: { pageKey, key: r.key } },
          update: { valueAr: r.valueAr, valueEn: r.valueEn },
          create: { pageKey, key: r.key, valueAr: r.valueAr, valueEn: r.valueEn },
        })
      )
    );

    return NextResponse.json({ ok: true, count: rows.length });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Kaydetme hatası' }, { status: 500 });
  }
}
