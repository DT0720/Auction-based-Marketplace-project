// src/components/SearchBar.tsx

"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"; // Adjust imports if needed
import { Input } from "@/components/ui/input"; // Input component
import { Search } from "lucide-react"; // Search icon
import { ProductTypeEnum, ProductTypeEnumKey } from "@/domain/enums/ProductTypeEnum";
import { Select, SelectTrigger,SelectContent,SelectValue,SelectItem } from "../select";

const SearchBar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ProductTypeEnumKey | "">("");
  const router = useRouter();

  const selectRef = useRef<HTMLDivElement | null>(null); // Ref for the select element
  const spanRef = useRef<HTMLSpanElement | null>(null); // Ref for the hidden span

  useEffect(() => {
    if (selectRef.current && spanRef.current) {
      // Update the hidden span with the selected category text
      spanRef.current.innerText = selectedCategory ? ProductTypeEnum[selectedCategory] : ProductTypeEnum.ALL;
      // Adjust the select width based on the hidden span's width
      const spanWidth = spanRef.current.offsetWidth;
      selectRef.current.style.width = `${spanWidth + 16}px`; // Add some padding
    }
  }, [selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`); // Redirect to search results page
    }
  };

  return (
    <form onSubmit={handleSearchSubmit} className="w-full max-w-3xl flex items-center space-x-4">
      {/* Category Select Dropdown */}
      <div ref={selectRef} className="w-auto">
        <Select onValueChange={(value: ProductTypeEnumKey | "") => setSelectedCategory(value)}>
          <SelectTrigger className="w-auto">
            <SelectValue placeholder= {ProductTypeEnum.ALL} />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(ProductTypeEnum).map(([key, value]) => (
              <SelectItem key={key} value={key}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Search Input */}
      <Input
        type="text"
        placeholder="Search for products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="flex-grow border rounded-md px-4 py-2"
      />

      {/* Search Button */}
      <Button type="submit" variant="outline" className="ml-2">
        <Search />
      </Button>
    </form>
  );
};

export default SearchBar;
