"use client";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import React from "react";

interface SearchFormProps {
  search: string | number;
  setSearch: (search: string) => void;
  setPage: (page: number) => void;
  placeholder: string;
  resetPage?: boolean;
  className?: string;
}
const SearchForm = ({
  search,
  setPage,
  setSearch,
  placeholder,
  resetPage = true,
  className = "",
}: SearchFormProps) => {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    if (resetPage) {
      setPage?.(1);
    }
  };
  return (
    <div className={`relative w-full sm:w-lg  `}>
      <Search className="absolute left-2 top-4 h-5 w-5 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        className={`pl-8  ${className ?? "w-lg"} py-6`}
        value={search}
        onChange={handleSearch}
      />
    </div>
  );
};

export default SearchForm;
