"use client";

import { useEffect, useId, useRef, useState } from "react";
import Tag from "./Tag";
import { ChevronRightIcon } from "./icons";
import { TagRadius } from "@/lib/types";

interface MultiSelectOption {
  id: number;
  name: string;
}

interface MultiSelectDropdownProps {
  options: MultiSelectOption[];
  selectedIds: number[];
  onChange: (ids: number[]) => void;
  label: string;
  placeholder?: string;
  className?: string;
  error?: boolean;
  errorMessage?: string;
}

export default function MultiSelectDropdown({
  options,
  selectedIds,
  onChange,
  label,
  placeholder = "Select",
  className,
  error,
  errorMessage,
}: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonId = useId();
  const errorId = `${buttonId}-error`;
  const showError = Boolean(error && errorMessage);

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

  const selectedNames = options
    .filter((option) => selectedIds.includes(option.id))
    .map((option) => option.name)
    .join(", ");

  const toggleOption = (id: number) => {
    onChange(
      selectedIds.includes(id)
        ? selectedIds.filter((selectedId) => selectedId !== id)
        : [...selectedIds, id],
    );
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className ?? ""}`}>
      <label htmlFor={buttonId} className="sr-only">
        {label}
      </label>
      <button
        id={buttonId}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={showError ? errorId : undefined}
        className={`focus-ring flex w-full items-center justify-between gap-3 rounded-full border px-5 py-3 text-left text-sm ${
          error ? "border-danger" : "border-border"
        }`}
      >
        <span className={`truncate ${selectedNames ? "text-foreground" : "text-muted-foreground"}`}>
          {selectedNames || placeholder}
        </span>
        <span
          className={`text-muted-foreground shrink-0 rotate-90 transition-transform ${isOpen ? "-rotate-90" : ""}`}
        >
          <ChevronRightIcon />
        </span>
      </button>

      {isOpen && (
        <div className="border-border bg-surface absolute top-[calc(100%+8px)] left-0 z-20 max-h-48 w-full overflow-y-auto rounded-3xl border p-4 shadow-lg">
          <div className="flex flex-wrap gap-2">
            {options.map((option) => (
              <Tag
                key={option.id}
                radius={option.name.length > 20 ? TagRadius.Lg : TagRadius.Full}
                selected={selectedIds.includes(option.id)}
                onClick={() => toggleOption(option.id)}
              >
                {option.name}
              </Tag>
            ))}
          </div>
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
