import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { insightSchema } from '@/lib/validation';
import { serverError } from '@/lib/errorResponse';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  try {
    const parsed = insightSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: 'Geçersiz veri' }, { status: 400 });
    const body = parsed.data;
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
  } catch (e) { return serverError(e); }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  try {
    await prisma.insightPost.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) { return serverError(e); }
}
