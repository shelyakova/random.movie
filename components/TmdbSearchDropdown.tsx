"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { useTmdbSearch } from "@/hooks/useTmdb";
import { TmdbSearchResult } from "@/lib/types";

interface TmdbSearchDropdownProps {
  value: string;
  onQueryChange: (query: string) => void;
  onSelect: (result: TmdbSearchResult) => void;
  label: string;
  placeholder?: string;
  className?: string;
  error?: boolean;
  errorMessage?: string;
}

export default function TmdbSearchDropdown({
  value,
  onQueryChange,
  onSelect,
  label,
  placeholder = "Search a title…",
  className,
  error,
  errorMessage,
}: TmdbSearchDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(value, 400);
  const inputId = useId();
  const errorId = `${inputId}-error`;
  const showError = Boolean(error && errorMessage);

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
      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>
      <input
        id={inputId}
        type="text"
        value={value}
        onChange={(e) => {
          onQueryChange(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={showError ? errorId : undefined}
        className={`text-foreground focus-ring w-full rounded-full border px-5 py-3 text-sm dark:bg-transparent ${
          error ? "border-danger" : "border-border"
        }`}
      />

      {isOpen && debouncedQuery.trim().length > 1 && (
        <div className="border-border bg-surface absolute top-[calc(100%+8px)] left-0 z-20 max-h-64 w-full overflow-y-auto rounded-3xl border p-2 shadow-lg">
          {isFetching && <p className="text-muted-foreground px-3 py-2 text-sm">Searching…</p>}

          {!isFetching && results.length === 0 && (
            <p className="text-muted-foreground px-3 py-2 text-sm">No results found</p>
          )}

          {!isFetching &&
            results.map((result) => (
              <button
                key={`${result.type}-${result.tmdbId}`}
                type="button"
                onClick={() => handleSelect(result)}
                className="hover:bg-neutral-fill-hover focus-ring flex min-h-11 w-full items-center justify-between gap-2 rounded-2xl px-3 py-2 text-left text-sm"
              >
                <span className="text-foreground truncate">{result.name}</span>
                {result.year && (
                  <span className="text-muted-foreground shrink-0">{result.year}</span>
                )}
              </button>
            ))}
        </div>
      )}

      {showError && (
        <p id={errorId} className="text-danger mt-1 text-xs">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
