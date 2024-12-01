// LoaderContext.tsx
"use client";

import React, { createContext, useState, useContext } from "react";

/**
 * Interface for the Loader Context.
 * Provides state and functions to control the loading state in the application.
 *
 * @interface LoaderContextType
 * @property {boolean} isLoading - Indicates whether the loader is currently visible.
 * @property {function} showLoader - Function to show the loader.
 * @property {function} hideLoader - Function to hide the loader.
 */

interface LoaderContextType {
    isLoading: boolean;
    showLoader: () => void;
    hideLoader: () => void;
}

/**
 * React Context for managing a global loading state.
 * Should be accessed using `useContext(LoaderContext)`.
 */

export const LoaderContext = createContext<LoaderContextType | undefined>(
    undefined
);

/**
 * LoaderProvider component that wraps children components to provide loader state and controls.
 * Displays a loading overlay when the loader is active.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {React.ReactNode} props.children - The children components that need access to the LoaderContext.
 *
 * @returns {React.ReactElement} - The LoaderProvider component with context.
 */

export const LoaderProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoading, setIsLoading] = useState(false);

    /**
     * Activates the loader.
     */

    const showLoader = () => setIsLoading(true);

    /**
     * Deactivates the loader.
     */

    const hideLoader = () => setIsLoading(false);

    return (
        <LoaderContext.Provider value={{ isLoading, showLoader, hideLoader }}>
            {children}
            {isLoading && (
                <div className="loader-overlay">
                    <div className="loader"></div>
                </div>
            )}
        </LoaderContext.Provider>
    );
};
