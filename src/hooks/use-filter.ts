import { FilterContext, FilterContextType } from "@/application/context/FilterContext";
import { useContext } from "react";

export const useFilters = (): FilterContextType => {
    const context = useContext(FilterContext);
    if (!context) {
      throw new Error("useFilters must be used within a FilterProvider");
    }
    return context;
  };