// src/interfaces/modules/routing/routes.ts

/**
 * List of public paths in the application.
 * These are routes that are accessible without authentication.
 *
 * @constant {string[]} publicPaths
 */
const publicPaths = ["/", "/login", "/signup", "/forgot-password"];

/**
 * A constant object representing all routes in the application.
 * This includes both static and dynamic routes.
 *
 * @readonly
 * @enum {string}
 * @property {string} HOME - The home page route ("/").
 * @property {string} SIGNUP - The signup page route ("/signup").
 * @property {string} LOGIN - The login page route ("/login").
 * @property {string} USER_PROFILE - The user profile page route ("/user_profile").
 * @property {string} BUYER_DASHBOARD - The buyer dashboard page route ("/buyer_dashboard").
 * @property {string} SELLER_DASHBOARD - The seller dashboard page route ("/seller_dashboard").
 * @property {string} DISCOUNT - The discount page route ("/discount").
 * @property {string} FORGOT_PASSWORD - The forgot password page route ("/forgot-password").
 * @property {string} REVIEW_DASHBOARD - The review dashboard page route ("/review_dashboard").
 * @property {string} ADD_PRODUCT - The add product page route ("/product/addItem").
 * @property {string} CHECKOUT - The checkout page route ("/checkout").
 * @property {string} SHOPPING_CART - The shopping cart page route ("/shopping_cart").
 * @property {function} ADD_ITEM_ON_SALE - The dynamic route for adding an item on sale (`/product/${id}/addItem/on_sale`).
 * @property {function} ADD_ITEM_ON_AUCTION - The dynamic route for adding an item on auction (`/product/${id}/addItem/on_auction`).
 * @property {function} PRODUCT_ON_AUCTION - The dynamic route for viewing a product on auction (`/product/${id}/auction`).
 */

export const ROUTES = {
    HOME: "/",
    SIGNUP: "/signup",
    LOGIN: "/login",
    USER_PROFILE: "/user_profile",
    BUYER_DASHBOARD: "/buyer_dashboard",
    SELLER_DASHBOARD: "/seller_dashboard",
    DISCOUNT: "/discount",
    FORGOT_PASSWORD: "/forgot-password",
    REVIEW_DASHBOARD: "/review_dashboard",
    ADD_PRODUCT: "/product/addItem",
    CHECKOUT: "/checkout",
    SHOPPING_CART: "/shopping_cart",
    ADD_ITEM_ON_SALE: (id: string | number) => `/product/${id}/addItem/on_sale`,
    ADD_ITEM_ON_AUCTION: (id: string | number) =>
        `/product/${id}/addItem/on_auction`,
    PRODUCT_ON_AUCTION: (id: string | number) => `/product/${id}/auction`,
} as const;

/**
 * Type representing the keys of the ROUTES object.
 *
 * @typedef {keyof typeof ROUTES} RouteKey
 */

export type RouteKey = keyof typeof ROUTES;

/**
 * Helper function to get only static routes (excluding dynamic functions).
 * Static routes are routes that do not require parameters to be included.
 *
 * @returns {string[]} - An array of static routes.
 */
const getStaticRoutes = (): string[] => {
    return Object.values(ROUTES).filter(
        (route) => typeof route === "string"
    ) as string[];
};

/**
 * Function to get protected routes.
 * Protected routes are routes that require authentication to access.
 *
 * @returns {string[]} - An array of protected routes (excluding public paths).
 */
export const getProtectedRoutes = (): string[] => {
    const staticRoutes = getStaticRoutes();
    const protectedRoutes = staticRoutes.filter(
        (route) => !publicPaths.includes(route)
    );
    return protectedRoutes;
};

/**
 * Function to get public routes.
 * Public routes are routes that are accessible without authentication.
 *
 * @returns {string[]} - An array of public routes.
 */
export const getPublicRoutes = (): string[] => {
    return [...publicPaths];
};

/**
 * Function to get all routes (static and dynamic).
 * This includes both public and protected routes.
 *
 * @returns {string[]} - An array of all static routes.
 */
export const getAllRoutes = (): string[] => {
    return getStaticRoutes();
};
