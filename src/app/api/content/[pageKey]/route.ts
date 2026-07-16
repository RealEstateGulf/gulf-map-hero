import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Never cache this route — content can change any time via admin
export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ pageKey: string }> }) {
  const { pageKey } = await params;
  const rows = await prisma.pageContent.findMany({ where: { pageKey }, orderBy: { key: 'asc' } });
  // Return as a map { key: { ar: valueAr, en: valueEn } }
  const map = Object.fromEntries(rows.map(r => [r.key, { ar: r.valueAr, en: r.valueEn }]));
  return NextResponse.json(map, {
    headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
  });
}
