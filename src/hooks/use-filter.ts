import { FilterContext, FilterContextType } from "@/application/context/FilterContext";
import { useContext } from "react";

/**
 * Custom hook to access the filter context.
 * Ensures that the hook is used within a `FilterProvider`.
 * 
 * @throws Will throw an error if the hook is used outside of a `FilterProvider`.
 * @returns The current filter context value as `FilterContextType`.
 */
export const useFilters = (): FilterContextType => {
    const context = useContext(FilterContext);
    if (!context) {
        throw new Error("useFilters must be used within a FilterProvider");
    }
    return context;
};
