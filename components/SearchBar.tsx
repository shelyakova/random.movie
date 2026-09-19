"use client";

import { useId } from "react";
import { SearchIcon } from "./icons";
import { useTranslations } from "next-intl";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}

export default function SearchBar({ value, onChange, label, className }: SearchBarProps) {
  const t = useTranslations("search");
  const inputId = useId();
  const text = t("movieOrSeries");

  return (
    <div className={`relative w-full max-w-xl min-w-0 ${className ?? ""}`}>
      <label htmlFor={inputId} className="sr-only">
        {label ?? text}
      </label>
      <span className="text-muted-foreground pointer-events-none absolute top-1/2 left-4 -translate-y-1/2">
        <SearchIcon />
      </span>
      <input
        id={inputId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type="text"
        placeholder={text}
        className="border-border-subtle bg-surface text-foreground placeholder-muted-foreground focus-ring min-h-11 w-full rounded-full border py-2.5 pr-4 pl-11 text-sm"
      />
    </div>
  );
}
