import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set. Refusing to start with an insecure default.');
}
const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

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

  // Protect /admin pages and /api/admin endpoints. Each API route already
  // re-checks the session server-side (defense in depth) — this is an
  // additional gate so a route can never accidentally ship without one.
  const isAdminPage = pathname.startsWith('/admin');
  const isAdminApi = pathname.startsWith('/api/admin');
  if (!isAdminPage && !isAdminApi) return NextResponse.next();

  // Endpoints that must stay reachable without a token (login itself, logout).
  const PUBLIC_ADMIN_PATHS = new Set(['/admin/login', '/api/admin/auth/login', '/api/admin/auth/logout']);
  if (PUBLIC_ADMIN_PATHS.has(pathname)) return NextResponse.next();

  const token = request.cookies.get('gi_admin_token')?.value;

  if (!token) {
    if (isAdminApi) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  try {
    await jwtVerify(token, SECRET);
    return NextResponse.next();
  } catch {
    if (isAdminApi) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const res = NextResponse.redirect(new URL('/admin/login', request.url));
    res.cookies.delete('gi_admin_token');
    return res;
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
