import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

function isAdminToken(token: string): boolean {
  try {
    // Decode JWT payload (base64) to check role
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    const payload = JSON.parse(atob(parts[1]));
    // Check expiration
    if (payload.exp && payload.exp * 1000 < Date.now()) return false;
    // Check admin role
    return payload.role === 'ADMIN';
  } catch {
    return false;
  }
}

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Redirect /{locale}/admin to /admin
  if (pathname.match(/^\/(fr|en|ar)\/admin/)) {
    const newPath = pathname.replace(/^\/(fr|en|ar)\/admin/, '/admin');
    return NextResponse.redirect(new URL(newPath, request.url));
  }

  // Protect /admin routes - require valid admin auth-token
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('auth-token')?.value;
    if (!token || !isAdminToken(token)) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      // Clear invalid cookie if present
      if (token) {
        response.cookies.delete('auth-token');
      }
      return response;
    }
    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // i18n routes (excludes api, _next, static files)
    '/((?!api|_next|images|favicon\\.ico|manifest\\.json|robots\\.txt|sitemap\\.xml|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.webp|.*\\.ico).*)',
    // Admin routes (for auth protection + locale redirect)
    '/admin/:path*',
    '/(fr|en|ar)/admin/:path*',
  ],
};
