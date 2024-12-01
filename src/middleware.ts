import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { CookieEnum } from './domain/enums/CookieEnum';
import { getPublicRoutes, getProtectedRoutes, ROUTES } from './application/routing/routes';

const publicPaths = [ROUTES.HOME, ROUTES.LOGIN, ROUTES.SIGNUP];
const buyerPaths = [ROUTES.BUYER_DASHBOARD, ROUTES.CHECKOUT, ROUTES.SHOPPING_CART, ROUTES.PRODUCT_ON_AUCTION(':id')];
const sellerPaths = [ROUTES.SELLER_DASHBOARD, ROUTES.ADD_ITEM_ON_SALE(':id'), ROUTES.ADD_ITEM_ON_AUCTION(':id'), ROUTES.ADD_PRODUCT];
const protectedPaths = [ROUTES.USER_PROFILE, ...buyerPaths, ...sellerPaths];
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

    // Check if requestedPath is a public route
    const isPublicPath = publicPaths.some((publicRoute) => new RegExp(`^${publicRoute.replace(/:\w+/g, '[^/]+')}$`).test(requestedPath));

    // Allow users to access public paths without a token
    if (isPublicPath) {
        if (token) {
            // Redirect authenticated users trying to access public routes like login/signup
            const user = parseUserFromToken(token);
            return user?.type === 'b'
                ? NextResponse.redirect(new URL(ROUTES.BUYER_DASHBOARD, req.url))
                : NextResponse.redirect(new URL(ROUTES.SELLER_DASHBOARD, req.url));
        }
        return NextResponse.next();
    }

    // Check if the requested path is a protected route
    const isProtectedPath = protectedPaths.some((protectedRoute) =>
        new RegExp(`^${protectedRoute.replace(/:\w+/g, '[^/]+')}$`).test(requestedPath)
    );

    if (!token && isProtectedPath) {
        return NextResponse.redirect(new URL(ROUTES.LOGIN, req.url));
    }

    // If authenticated, restrict access based on user type
    if (token) {
        const user = parseUserFromToken(token);
        const userType = user?.type?.toLocaleLowerCase();

        // If the user is a buyer and trying to access seller-specific routes, redirect to buyer dashboard
        if (userType === 'b' && sellerPaths.some((sellerRoute) => new RegExp(`^${sellerRoute.replace(/:\w+/g, '[^/]+')}$`).test(requestedPath))) {
            return NextResponse.redirect(new URL(ROUTES.BUYER_DASHBOARD, req.url));
        }

        // If the user is a seller and trying to access buyer-specific routes, redirect to seller dashboard
        if (userType === 's' && buyerPaths.some((buyerRoute) => new RegExp(`^${buyerRoute.replace(/:\w+/g, '[^/]+')}$`).test(requestedPath))) {
            return NextResponse.redirect(new URL(ROUTES.SELLER_DASHBOARD, req.url));
        }
    }

    // Allow all other requests
    return NextResponse.next();
}

// Helper function to parse user information from token
function parseUserFromToken(token: string) {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.user;
    } catch (error) {
        console.error('Failed to parse token:', error);
        return null;
    }
}

export const config = {
    matcher: ['/login', '/signup', '/forgot-password', '/buyer_dashboard', '/seller_dashboard', '/user_profile', '/product/:path*'],
};

