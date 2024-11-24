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
  } as const;
  
export type RouteKey = keyof typeof ROUTES;
  
// Function to get protected routes
export const getProtectedRoutes = (): string[] => {
  const allRoutes = Object.values(ROUTES);
  const protectedRoutes = allRoutes.filter(route => !publicPaths.includes(route));
  return protectedRoutes;
};

// Function to get public paths
export const getPublicRoutes = (): string[] => {
  return [...publicPaths];
};

// Function to get all paths
export const getAllRoutes = (): string[] => {
  return Object.values(ROUTES);
};