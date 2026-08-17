import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set. Refusing to start with an insecure default.');
}
const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

const COOKIE_NAME = 'gi_admin_token';

export type JWTPayload = {
  userId: string;
  email: string;
  name: string;
  role: string;
};

export async function signToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload) return null;

  // The JWT itself stays valid for 7 days regardless of DB state, so a
  // deactivated/deleted account must be re-checked here on every request —
  // otherwise revoking access (e.g. offboarding staff) would only take
  // effect once the old token expires.
  const user = await prisma.user.findUnique({ where: { id: payload.userId }, select: { active: true } });
  if (!user || !user.active) return null;

  return payload;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export { COOKIE_NAME };
