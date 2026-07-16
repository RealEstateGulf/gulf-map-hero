import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession, hashPassword } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  try {
    const body = await req.json();
    const data: Record<string, unknown> = { name: body.name, email: body.email, role: body.role, phone: body.phone || null, active: body.active };
    if (body.password) data.password = await hashPassword(body.password);
    const user = await prisma.user.update({ where: { id }, data });
    const { password: _, ...safe } = user;
    return NextResponse.json(safe);
  } catch (e) { console.error(e); return NextResponse.json({ error: 'Hata' }, { status: 500 }); }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== 'SUPER_ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  if (id === session.userId) return NextResponse.json({ error: 'Kendinizi silemezsiniz' }, { status: 400 });
  try {
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) { console.error(e); return NextResponse.json({ error: 'Hata' }, { status: 500 }); }
}
