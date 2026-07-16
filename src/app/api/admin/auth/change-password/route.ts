import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession, hashPassword, comparePassword } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { currentPassword, newPassword } = await req.json();
    if (!currentPassword || !newPassword) return NextResponse.json({ error: 'Eksik alan' }, { status: 400 });
    if (newPassword.length < 8) return NextResponse.json({ error: 'Şifre en az 8 karakter olmalı' }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { id: session.userId } });
    if (!user) return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });

    const valid = await comparePassword(currentPassword, user.password);
    if (!valid) return NextResponse.json({ error: 'Mevcut şifre yanlış' }, { status: 400 });

    const hashed = await hashPassword(newPassword);
    await prisma.user.update({ where: { id: session.userId }, data: { password: hashed } });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
