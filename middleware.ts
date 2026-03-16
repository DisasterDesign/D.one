import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow login page and auth API
  if (pathname === '/matcher/login' || pathname.startsWith('/api/matcher/auth')) {
    return NextResponse.next();
  }

  const token = request.cookies.get('matcher_token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/matcher/login', request.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/matcher/login', request.url));
  }
}

export const config = {
  matcher: ['/matcher/:path*', '/api/matcher/:path*'],
};
