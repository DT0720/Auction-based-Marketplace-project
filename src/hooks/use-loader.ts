import { LoaderContext } from "@/application/context/LoaderContext";
import { useContext } from "react";

// Custom hook to use loader context
export const useLoader = () => {
    const context = useContext(LoaderContext);
    if (!context) {
      throw new Error("useLoader must be used within a LoaderProvider");
    }
    return context;
};