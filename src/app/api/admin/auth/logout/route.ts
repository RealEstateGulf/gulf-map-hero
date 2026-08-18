import { NextResponse } from 'next/server';
import { getSession, COOKIE_NAME } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST() {
  // Deleting the cookie only removes it from this browser — the JWT itself
  // stays cryptographically valid until it naturally expires. Bump the
  // user's sessionVersion so the token is actually rejected server-side on
  // its very next use, from here or anywhere else it might exist.
  const session = await getSession();
  if (session) {
    await prisma.user.update({
      where: { id: session.userId },
      data: { sessionVersion: { increment: 1 } },
    });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.delete(COOKIE_NAME);
  return res;
}
