"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

/**
 * Interface for the Filter Context.
 * Provides state and setters for search query and category filtering.
 *
 * @interface FilterContextType
 * @property {string} searchQuery - The current search query used for filtering.
 * @property {function} setSearchQuery - Function to update the search query.
 * @property {string} category - The selected category for filtering.
 * @property {function} setCategory - Function to update the selected category.
 */

export interface FilterContextType {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    category: string;
    setCategory: (category: string) => void;
}

/**
 * React Context to manage filter states, such as search query and category selection.
 * Should be accessed using `useContext(FilterContext)`.
 */

export const FilterContext = createContext<FilterContextType | undefined>(
    undefined
);

/**
 * FilterProvider component that wraps children components to provide filter-related state and actions.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {ReactNode} props.children - The children components that need access to the FilterContext.
 *
 * @returns {React.ReactElement} - The FilterProvider component with context.
 */

export const FilterProvider = ({ children }: { children: ReactNode }) => {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [category, setCategory] = useState<string>("All"); // Default to "All"

    return (
        <FilterContext.Provider
            value={{
                searchQuery,
                setSearchQuery,
                category,
                setCategory,
            }}
        >
            {children}
        </FilterContext.Provider>
    );
};
