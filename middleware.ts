// middleware.ts
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    if (pathname === '/login' && token) {
      return NextResponse.redirect(new URL('/admin/beranda', req.url));
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ token, req }) {
        const { pathname } = req.nextUrl;
        if (pathname.startsWith('/admin')) {
          return !!token;
        }
        return true;
      },
    },
    pages: {
      signIn: '/login',
    },
  }
);

export const config = {
  /*
   * Menggunakan satu baris regex yang mengecualikan:
   * api, _next/static, _next/image, folder user, 
   * dan semua file dengan ekstensi gambar/icon.
   */
  matcher: [
    '/((?!api|_next/static|_next/image|user|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};