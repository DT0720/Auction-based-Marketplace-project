import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { CookieEnum } from './domain/enums/CookieEnum';
import { getPublicRoutes,getProtectedRoutes, ROUTES } from './application/routing/routes';

const publicPaths = getPublicRoutes();
const protectedPaths = getProtectedRoutes();
const allPaths = [...publicPaths, ...protectedPaths];

export async function middleware(req: NextRequest) {

    const cookies = req.cookies;
    const token = cookies.get(CookieEnum.AuthToken)?.value;

    const requestedPath = req.nextUrl.pathname;

    // Allow users to access public paths without a token
    if (publicPaths.includes(requestedPath)) {
      if (token) {
        // If the user is authenticated and attempts to access a public route like login/signup, redirect them back to the referer
        const referer = req.headers.get('referer');
        if (referer && !publicPaths.includes(new URL(referer).pathname)) {
          return NextResponse.redirect(referer);
        }
        // If there's no referer or it's also a public page, redirect to home
        return NextResponse.redirect(new URL('/', req.url));
      }
      // User is not authenticated and accessing a public path, so allow
      return NextResponse.next();
    }

    const isProtectedPath = protectedPaths.some((protectedRoute) => {
      return new RegExp(`^${protectedRoute.replace(/\[.*?\]/g, '[^/]+')}$`).test(requestedPath);
    });
  
    if (!token && isProtectedPath) {
      console.log(allPaths);
        return NextResponse.redirect(new URL('/login', req.url));
    }
  
    // If token is present and user is trying to access a protected route, allow the request
    return NextResponse.next();
}

export const config = {
    matcher: ['/login', '/signup', '/forgot-password', '/buyer_dashboard', '/seller_dashboard', '/review_dashboard', '/product/:path*'], 
};


