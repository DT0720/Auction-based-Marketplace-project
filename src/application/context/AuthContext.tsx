"use client"; // Required for App Router client-side context

import React, { createContext, useState, useEffect } from "react";
import { User } from "@/domain/entities/User";
import Cookies from "js-cookie";
import { CookieEnum } from "@/domain/enums/CookieEnum";
import { getUserBalance } from "../usecases/walletManagement/getWallet";

/**
 * Interface for the Auth Context properties.
 * Provides the structure for authentication-related state and actions.
 *
 * @interface AuthContextProps
 * @property {User | null} user - The current authenticated user or `null` if not logged in.
 * @property {number} currentBalance - The current balance of the authenticated user's wallet.
 * @property {boolean} isAuthenticated - Indicates if the user is authenticated.
 * @property {number} buyer_seller_id - ID indicating whether the user is a buyer or seller.
 * @property {function} login - Function to log in the user. Updates context and sets a cookie.
 * @property {function} logout - Function to log out the user. Clears context and removes the cookie.
 * @property {function} fetchAndUpdateBalance - Function to fetch the latest wallet balance for the user and update the state.
 */

interface AuthContextProps {
    user: User | null;
    currentBalance: number;
    isAuthenticated: boolean;
    buyer_seller_id: number;
    login: (
        token: string,
        user: User,
        credit: number,
        buyer_seller_id: number
    ) => void;
    logout: () => void;
    fetchAndUpdateBalance: () => Promise<void>;
}

/**
 * React Context for authentication-related state and actions.
 * Should be accessed using `useContext(AuthContext)`.
 */

export const AuthContext = createContext<AuthContextProps | undefined>(
    undefined
);

/**
 * AuthProvider component to manage authentication state and logic.
 * Wrap your application or required components with this provider.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {React.ReactNode} props.children - The children components that need access to the AuthContext.
 *
 * @returns {React.ReactElement} - The AuthProvider component with context.
 */

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<User | null>(null);
    const [currentBalance, setCurrentBalance] = useState(0);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [buyer_seller_id, setBuyerSellerId] = useState(0);

    /**
     * Restores the user session on initial load by checking the authentication token in cookies.
     * Decodes the token and sets user-related state variables.
     */

    useEffect(() => {
        const token = Cookies.get(CookieEnum.AuthToken); // Get token from cookie
        if (token) {
            try {
                // Decode or verify the token as needed
                const decodedUser = JSON.parse(atob(token.split(".")[1])); // Parse JWT payload (base64-decoded)
                setUser(decodedUser.user); // Set user from token
                setCurrentBalance(decodedUser.credit ?? 0); // Set credit from token
                setBuyerSellerId(decodedUser.buyer_seller_id ?? 0); // Set buyer_seller_id from token
                setIsAuthenticated(true);
            } catch (error) {
                console.error("Failed to decode token:", error);
                Cookies.remove(CookieEnum.AuthToken); // Remove the cookie if decoding fails
            }
        }
        setLoading(false); // Loading completed
    }, []);

    /**
     * Logs in the user by saving the authentication token in cookies and updating context state.
     *
     * @param {string} token - The authentication token.
     * @param {User} user - The user object containing user details.
     * @param {number} credit - The initial wallet balance for the user.
     * @param {number} buyer_seller_id - The buyer or seller ID of the user.
     */

    const login = (
        token: string,
        user: User,
        credit: number,
        buyer_seller_id: number
    ) => {
        if (token) {
            Cookies.set(CookieEnum.AuthToken, token, {
                expires: 7,
                path: "/",
                secure: process.env.NODE_ENV === "production",
            }); // Set the cookie
            setBuyerSellerId(buyer_seller_id ?? 0);
            setCurrentBalance(credit ?? 0);
            setUser(user);
            setIsAuthenticated(true);
        }
    };

    /**
     * Logs out the user by clearing the authentication token from cookies and resetting context state.
     */

    const logout = () => {
        Cookies.remove(CookieEnum.AuthToken); // Remove the cookie
        setBuyerSellerId(0);
        setCurrentBalance(0);
        setUser(null);
        setIsAuthenticated(false);
    };

    /**
     * Fetches the latest wallet balance for the authenticated user and updates the state.
     *
     * @async
     * @returns {Promise<void>} - A promise that resolves once the balance is updated.
     */

    const fetchAndUpdateBalance = async () => {
        if (user && user.user_id) {
            try {
                const balance = await getUserBalance(user.user_id);
                if (balance !== null) {
                    setCurrentBalance(balance);
                }
            } catch (error) {
                console.error("Failed to fetch wallet balance:", error);
            }
        }
    };

    // Function to fetch and update current balance from the database

    if (loading) {
        return null;
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                currentBalance,
                isAuthenticated,
                buyer_seller_id,
                login,
                logout,
                fetchAndUpdateBalance,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
