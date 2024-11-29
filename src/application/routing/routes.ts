// src/interfaces/modules/routing/routes.ts

// List of public paths in the application
const publicPaths = ['/', '/login', '/signup', '/forgot-password'];

export const ROUTES = {
    HOME: "/",
    SIGNUP: "/signup",
    LOGIN: "/login",
    PROFILE: "/profile",
    BUYER_DASHBOARD: "/buyer_dashboard",
    SELLER_DASHBOARD: "/seller_dashboard",
    DISCOUNT: "/discount",
    FORGOT_PASSWORD: "/forgot-password",
    REVIEW_DASHBOARD: "/review_dashboard",
    ADD_PRODUCT: "/product/addItem",
    SHOPPING_CART: "/shopping_cart",
    ADD_ITEM_ON_SALE: (id: string | number) => `/product/${id}/addItem/on_sale`,
    ADD_ITEM_ON_AUCTION: (id: string | number) => `/product/${id}/addItem/on_auction`,
    PRODUCT_ON_AUCTION: (id: string | number) => `/product/${id}/auction`,
  } as const;
  
export type RouteKey = keyof typeof ROUTES;
  
// Helper function to get only static routes (excluding functions)
const getStaticRoutes = (): string[] => {
  return Object.values(ROUTES).filter((route) => typeof route === 'string') as string[];
};

// Function to get protected routes
export const getProtectedRoutes = (): string[] => {
  const staticRoutes = getStaticRoutes();
  const protectedRoutes = staticRoutes.filter(route => !publicPaths.includes(route));
  return protectedRoutes;
};

// Function to get public paths
export const getPublicRoutes = (): string[] => {
  return [...publicPaths];
};

// Function to get all static paths
export const getAllRoutes = (): string[] => {
  return getStaticRoutes();
};