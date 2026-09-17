"use client";

import { useEffect, useRef, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { useTmdbSearch } from "@/hooks/useTmdb";
import { TmdbSearchResult } from "@/lib/types";

interface TmdbSearchDropdownProps {
  value: string;
  onQueryChange: (query: string) => void;
  onSelect: (result: TmdbSearchResult) => void;
  placeholder?: string;
  className?: string;
  error?: boolean;
}

export default function TmdbSearchDropdown({
  value,
  onQueryChange,
  onSelect,
  placeholder = "Search a title…",
  className,
  error,
}: TmdbSearchDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(value, 400);

  const { data: results = [], isFetching } = useTmdbSearch(debouncedQuery);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleSelect = (result: TmdbSearchResult) => {
    onSelect(result);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className ?? ""}`}>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onQueryChange(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        className={`w-full rounded-full border px-5 py-3 text-sm focus:outline-none dark:bg-transparent dark:text-white ${
          error ? "border-red-500" : "border-zinc-300 dark:border-zinc-700"
        }`}
      />

      {isOpen && debouncedQuery.trim().length > 1 && (
        <div className="absolute top-[calc(100%+8px)] left-0 z-20 max-h-64 w-full overflow-y-auto rounded-3xl border border-zinc-300 bg-white p-2 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
          {isFetching && <p className="px-3 py-2 text-sm text-zinc-500">Searching…</p>}

          {!isFetching && results.length === 0 && (
            <p className="px-3 py-2 text-sm text-zinc-500">No results found</p>
          )}

          {!isFetching &&
            results.map((result) => (
              <button
                key={`${result.type}-${result.tmdbId}`}
                type="button"
                onClick={() => handleSelect(result)}
                className="flex w-full items-center justify-between gap-2 rounded-2xl px-3 py-2 text-left text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <span className="truncate text-black dark:text-white">{result.name}</span>
                {result.year && <span className="shrink-0 text-zinc-500">{result.year}</span>}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
