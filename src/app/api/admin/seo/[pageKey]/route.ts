import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ pageKey: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { pageKey } = await params;
  try {
    const body = await req.json();
    const seo = await prisma.seoSettings.update({
      where: { pageKey },
      data: {
        titleAr: body.titleAr ?? '',
        titleEn: body.titleEn ?? '',
        descriptionAr: body.descriptionAr ?? '',
        descriptionEn: body.descriptionEn ?? '',
        keywords: body.keywords || null,
        ogImageUrl: body.ogImageUrl || null,
        canonicalUrl: body.canonicalUrl || null,
      },
    });
    return NextResponse.json(seo);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Güncelleme hatası' }, { status: 500 });
  }
}
