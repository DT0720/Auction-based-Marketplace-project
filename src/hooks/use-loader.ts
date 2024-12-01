import { LoaderContext } from "@/application/context/LoaderContext";
import { useContext } from "react";

/**
 * Custom hook to access the loader context.
 * Ensures that the hook is used within a `LoaderProvider`.
 * 
 * @throws Will throw an error if the hook is used outside of a `LoaderProvider`.
 * @returns The current loader context value.
 */
export const useLoader = () => {
    const context = useContext(LoaderContext);
    if (!context) {
        throw new Error("useLoader must be used within a LoaderProvider");
    }
    return context;
};
