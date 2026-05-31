import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
  // Protect all admin routes (API and UI)
  if (request.nextUrl.pathname.startsWith('/api/admin') || request.nextUrl.pathname.startsWith('/admin')) {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      if (request.nextUrl.pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      } else {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'gravity_super_secret_key');
      const { payload } = await jwtVerify(token, secret);

      if (payload.role !== 'admin') {
        if (request.nextUrl.pathname.startsWith('/api/')) {
          return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        } else {
          return NextResponse.redirect(new URL('/', request.url));
        }
      }
    } catch (e) {
      if (request.nextUrl.pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      } else {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/admin/:path*', '/admin/:path*'],
};
