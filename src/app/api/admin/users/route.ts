import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession, hashPassword } from '@/lib/auth';

const VALID_ROLES = ['AGENT', 'ADMIN', 'SUPER_ADMIN'];

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || (session.role !== 'SUPER_ADMIN' && session.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await req.json();
    if (!body.password) return NextResponse.json({ error: 'Şifre zorunludur' }, { status: 400 });
    if (body.password.length < 8) return NextResponse.json({ error: 'Şifre en az 8 karakter olmalı' }, { status: 400 });
    if (body.role !== undefined && !VALID_ROLES.includes(body.role)) {
      return NextResponse.json({ error: 'Geçersiz rol' }, { status: 400 });
    }
    if (session.role !== 'SUPER_ADMIN' && body.role === 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const hashed = await hashPassword(body.password);
    const user = await prisma.user.create({
      data: { name: body.name, email: body.email, password: hashed, role: body.role ?? 'AGENT', phone: body.phone || null, active: body.active ?? true },
    });
    const { password: _, ...safe } = user;
    return NextResponse.json(safe);
  } catch (e: unknown) {
    console.error(e);
    const msg = e instanceof Error && e.message.includes('Unique') ? 'Bu email zaten kayıtlı' : 'Hata';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
