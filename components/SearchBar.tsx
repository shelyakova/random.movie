"use client";

import { useId } from "react";
import { SearchIcon } from "./icons";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export default function SearchBar({
  value,
  onChange,
  label = "Search a movie or a series",
}: SearchBarProps) {
  const inputId = useId();

  return (
    <div className="relative w-full max-w-xl min-w-0">
      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>
      <span className="text-muted-foreground pointer-events-none absolute top-1/2 left-4 -translate-y-1/2">
        <SearchIcon />
      </span>
      <input
        id={inputId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type="text"
        placeholder="Search a movie or a series"
        className="border-border-subtle bg-surface text-foreground placeholder-muted-foreground focus-ring min-h-11 w-full rounded-full border py-2.5 pr-4 pl-11 text-sm"
      />
    </div>
  );
}
