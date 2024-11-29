import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { CookieEnum } from './domain/enums/CookieEnum';
import { getPublicRoutes,getProtectedRoutes } from './application/routing/routes';

const publicPaths = getPublicRoutes();
const protectedPaths = getProtectedRoutes();
const allPaths = [...publicPaths, ...protectedPaths];
/**
 * Middleware to handle route access control based on authentication status.
 *
 * @param {NextRequest} req - The incoming request object.
 * @returns {Promise<NextResponse>} - The response object to proceed or redirect.
 */
export async function middleware(req: NextRequest): Promise<NextResponse> {

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

/**
 * Configures the routes that the middleware should match.
 */
export const config = {
    matcher: ['/login', '/signup', '/forgot-password', '/buyer_dashboard', '/seller_dashboard', '/review_dashboard', '/product/:path*'], 
};


