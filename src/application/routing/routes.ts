// src/interfaces/modules/routing/routes.ts

export const ROUTES = {
    HOME: "/",
    SIGNUP: "/signup",
    LOGIN: "/login",
    PROFILE: "/profile",
    BUYER_DASHBOARD: "/buyer_dashboard",
    FORGOT_PASSWORD: "/forgot-password",
  } as const;
  
export type RouteKey = keyof typeof ROUTES;
  