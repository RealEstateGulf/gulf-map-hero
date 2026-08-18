import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession, hashPassword, comparePassword, signToken, COOKIE_NAME } from '@/lib/auth';
import { checkRateLimit, rateLimitMessage } from '@/lib/rateLimit';
import { changePasswordSchema } from '@/lib/validation';
import { serverError } from '@/lib/errorResponse';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const limit = await checkRateLimit('changePassword', session.userId);
  if (!limit.allowed) {
    return NextResponse.json({ error: rateLimitMessage(limit.retryAfterSeconds) }, { status: 429 });
  }

  try {
    const parsed = changePasswordSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: 'Geçersiz veri' }, { status: 400 });
    const { currentPassword, newPassword } = parsed.data;

    const user = await prisma.user.findUnique({ where: { id: session.userId } });
    if (!user) return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });

    const valid = await comparePassword(currentPassword, user.password);
    if (!valid) return NextResponse.json({ error: 'Mevcut şifre yanlış' }, { status: 400 });

    const hashed = await hashPassword(newPassword);
    // Bump sessionVersion so every OTHER copy of this user's token (another
    // device, a stolen session, etc.) is rejected on its next use. Sign a
    // fresh token with the new version and re-set the cookie so this browser
    // isn't forced to log back in right after changing its own password.
    const updated = await prisma.user.update({
      where: { id: session.userId },
      data: { password: hashed, sessionVersion: { increment: 1 } },
    });

    const token = await signToken({
      userId: updated.id, email: updated.email, name: updated.name,
      role: updated.role, sessionVersion: updated.sessionVersion,
    });
    const res = NextResponse.json({ ok: true });
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
    return res;
  } catch (e) {
    return serverError(e);
  }
}
