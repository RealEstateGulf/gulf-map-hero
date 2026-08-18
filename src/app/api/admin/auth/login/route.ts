import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { signToken, comparePassword, COOKIE_NAME } from '@/lib/auth';
import { checkRateLimit, rateLimitMessage, getClientIp } from '@/lib/rateLimit';

// A precomputed bcrypt hash of a random value, with no matching plaintext.
// Used to run comparePassword() on the "user not found" path too, so the
// response time doesn't reveal whether an email exists (timing-based
// user enumeration).
const DUMMY_HASH = '$2b$12$C6UzMDM.H6dfI/f/IKcEeO0Gh3ClfMdM6yDwXKfSCVQm8h6LlpQY.';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
      return NextResponse.json({ error: 'Email ve şifre gerekli' }, { status: 400 });
    }

    // Limit by IP (stops a single source hammering many accounts) and by
    // the targeted email (stops credential stuffing spread across IPs at
    // one account) — either one tripping blocks the request.
    const normalizedEmail = email.toLowerCase().trim();
    const ipLimit = await checkRateLimit('login', getClientIp(req));
    const emailLimit = ipLimit.allowed ? await checkRateLimit('login', `email:${normalizedEmail}`) : ipLimit;
    if (!ipLimit.allowed) {
      return NextResponse.json({ error: rateLimitMessage(ipLimit.retryAfterSeconds) }, { status: 429 });
    }
    if (!emailLimit.allowed) {
      return NextResponse.json({ error: rateLimitMessage(emailLimit.retryAfterSeconds) }, { status: 429 });
    }

    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    const valid = await comparePassword(password, user?.password ?? DUMMY_HASH);
    if (!user || !user.active || !valid) {
      return NextResponse.json({ error: 'Geçersiz email veya şifre' }, { status: 401 });
    }
    const token = await signToken({ userId: user.id, email: user.email, name: user.name, role: user.role });
    const res = NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
    return res;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
