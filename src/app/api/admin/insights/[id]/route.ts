import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  try {
    const body = await req.json();
    const post = await prisma.insightPost.update({
      where: { id },
      data: {
        slug: body.slug, titleAr: body.titleAr, titleEn: body.titleEn,
        excerptAr: body.excerptAr ?? '', excerptEn: body.excerptEn ?? '',
        contentAr: body.contentAr ?? '', contentEn: body.contentEn ?? '',
        coverImage: body.coverImage || null, category: body.category ?? 'general',
        published: body.published ?? false, featured: body.featured ?? false,
        readTime: body.readTime ?? 5,
      },
    });
    return NextResponse.json(post);
  } catch (e) { console.error(e); return NextResponse.json({ error: 'Hata' }, { status: 500 }); }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  try {
    await prisma.insightPost.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) { console.error(e); return NextResponse.json({ error: 'Hata' }, { status: 500 }); }
}
