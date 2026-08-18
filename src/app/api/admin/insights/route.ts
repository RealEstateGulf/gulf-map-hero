import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { insightSchema } from '@/lib/validation';
import { serverError } from '@/lib/errorResponse';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const parsed = insightSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: 'Geçersiz veri' }, { status: 400 });
    const body = parsed.data;
    const post = await prisma.insightPost.create({
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
  } catch (e: unknown) {
    const msg = e instanceof Error && e.message.includes('Unique') ? 'Bu slug zaten kullanılıyor' : 'Hata';
    return serverError(e, msg);
  }
}
