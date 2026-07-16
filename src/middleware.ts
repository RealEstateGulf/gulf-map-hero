import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'gulf-invest-super-secret-key-2026-change-in-production'
);

// Site geneli için basit HTTP Basic Auth. SITE_BASIC_AUTH_USER/PASS tanımlı değilse
// (örn. lokal geliştirmede) devre dışı kalır, kimseyi bloklamaz.
function passesSiteAuth(request: NextRequest): boolean {
  const user = process.env.SITE_BASIC_AUTH_USER;
  const pass = process.env.SITE_BASIC_AUTH_PASS;
  if (!user || !pass) return true;

  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Basic ')) return false;

  const [providedUser, providedPass] = atob(authHeader.slice(6)).split(':');
  return providedUser === user && providedPass === pass;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!passesSiteAuth(request)) {
    return new NextResponse('Authentication required', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Gulf Invest"' },
    });
  }

  // Only protect /admin routes (except /admin/login)
  if (!pathname.startsWith('/admin')) return NextResponse.next();
  if (pathname === '/admin/login') return NextResponse.next();

  const token = request.cookies.get('gi_admin_token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  try {
    await jwtVerify(token, SECRET);
    return NextResponse.next();
  } catch {
    const res = NextResponse.redirect(new URL('/admin/login', request.url));
    res.cookies.delete('gi_admin_token');
    return res;
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
