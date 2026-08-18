import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession, hashPassword } from '@/lib/auth';
import { userCreateSchema } from '@/lib/validation';
import { serverError } from '@/lib/errorResponse';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || (session.role !== 'SUPER_ADMIN' && session.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const parsed = userCreateSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: 'Geçersiz veri' }, { status: 400 });
    const body = parsed.data;
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
    const msg = e instanceof Error && e.message.includes('Unique') ? 'Bu email zaten kayıtlı' : 'Hata';
    return serverError(e, msg);
  }
}
