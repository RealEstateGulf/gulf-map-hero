import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { contentRowsSchema } from '@/lib/validation';
import { serverError } from '@/lib/errorResponse';

export async function GET() {
  const rows = await prisma.pageContent.findMany({ where: { pageKey: 'popup' } });
  return NextResponse.json(Object.fromEntries(rows.map(r => [r.key, r.valueAr])));
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const parsed = contentRowsSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: 'Geçersiz veri' }, { status: 400 });
    const { rows } = parsed.data;
    await Promise.all(
      rows.map(r =>
        prisma.pageContent.upsert({
          where: { pageKey_key: { pageKey: 'popup', key: r.key } },
          update: { valueAr: r.valueAr, valueEn: r.valueEn },
          create: { pageKey: 'popup', key: r.key, valueAr: r.valueAr, valueEn: r.valueEn },
        })
      )
    );
    return NextResponse.json({ ok: true });
  } catch (e) { return serverError(e); }
}
