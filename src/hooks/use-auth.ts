import { AuthContext } from "@/application/context/AuthContext";
import { useContext } from "react";

/**
 * Custom hook to access the authentication context.
 * Ensures that the hook is used within an `AuthProvider`.
 * 
 * @throws Will throw an error if the hook is used outside of an `AuthProvider`.
 * @returns The current authentication context value.
 */
const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default useAuth;

