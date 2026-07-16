import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function detectSource(referer: string | null, origin: string): string {
  if (!referer) return 'direct';
  try {
    const url = new URL(referer);
    const host = url.hostname.toLowerCase();
    // Same origin = direct
    if (origin && referer.startsWith(origin)) return 'direct';
    if (host.includes('google.') || host.includes('googleads.')) return 'google';
    if (host.includes('facebook.com') || host.includes('fb.com') || host.includes('instagram.com') || host.includes('ig.me')) return 'meta';
    if (host.includes('bing.com') || host.includes('yahoo.com') || host.includes('yandex.')) return 'search';
    if (host.includes('twitter.com') || host.includes('t.co') || host.includes('x.com')) return 'twitter';
    if (host.includes('linkedin.com')) return 'linkedin';
    if (host.includes('tiktok.com')) return 'tiktok';
    if (host.includes('youtube.com') || host.includes('youtu.be')) return 'youtube';
    if (host.includes('whatsapp.com') || host.includes('wa.me')) return 'whatsapp';
    return 'other';
  } catch {
    return 'direct';
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { page: string; referer?: string };
    const page = body.page ?? '/';
    const referer = body.referer ?? null;
    const origin = req.headers.get('origin') ?? '';
    const source = detectSource(referer, origin);

    await prisma.pageView.create({
      data: { page, source, referer: referer?.slice(0, 500) ?? null },
    });

    return NextResponse.json({ ok: true });
  } catch {
    // Silently ignore track errors — don't break the user experience
    return NextResponse.json({ ok: false });
  }
}
