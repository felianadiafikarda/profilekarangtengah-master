// middleware.ts
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Jika sudah login tapi masih buka halaman login, lempar ke beranda admin
    if (pathname === '/login' && token) {
      return NextResponse.redirect(new URL('/admin/beranda', req.url));
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ token, req }) {
        const { pathname } = req.nextUrl;
        // Hanya proteksi folder admin
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
  // Pastikan matcher tidak mengganggu aset statis dan folder user
  matcher: [
    '/admin/:path*', 
    '/login',
    // Hindari menjalankan middleware pada file internal
    '/((?!api|_next/static|_next/image|favicon.ico|user).*)'
  ],
};