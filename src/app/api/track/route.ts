import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { trackSchema } from '@/lib/validation';

// Referer is an arbitrary URL from outside our control — a query string or
// fragment on it could carry another site's token, email, or other PII
// (e.g. a visitor arriving from a link like `?token=...`). We only ever
// need the origin/path to know *where* someone came from, never the query,
// so strip it before this ever reaches storage.
function sanitizeReferer(referer: string | null): string | null {
  if (!referer) return null;
  try {
    const url = new URL(referer);
    return `${url.origin}${url.pathname}`.slice(0, 500);
  } catch {
    return null;
  }
}

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
    // Fire-and-forget analytics — never surface an error to the visitor,
    // just drop the hit once the sender's rate limit is exceeded.
    const limit = await checkRateLimit('track', getClientIp(req));
    if (!limit.allowed) return NextResponse.json({ ok: false });

    const parsed = trackSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ ok: false });
    const page = parsed.data.page ?? '/';
    const referer = parsed.data.referer ?? null;
    const origin = req.headers.get('origin') ?? '';
    const source = detectSource(referer, origin);

    await prisma.pageView.create({
      data: { page, source, referer: sanitizeReferer(referer) },
    });

    return NextResponse.json({ ok: true });
  } catch {
    // Silently ignore track errors — don't break the user experience
    return NextResponse.json({ ok: false });
  }
}
