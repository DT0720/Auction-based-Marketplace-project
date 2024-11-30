"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface FilterContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  category: string;
  setCategory: (category: string) => void;
}

export const FilterContext = createContext<FilterContextType | undefined>(undefined);

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

