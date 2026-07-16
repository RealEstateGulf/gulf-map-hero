import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession, hashPassword } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || (session.role !== 'SUPER_ADMIN' && session.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await req.json();
    if (!body.password) return NextResponse.json({ error: 'Şifre zorunludur' }, { status: 400 });
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
