"use client";

import { useEffect, useId, useRef, useState } from "react";
import { SearchIcon } from "./icons";
import { useTranslations } from "next-intl";
import { useDebounce } from "@/hooks";

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

  const [localValue, setLocalValue] = useState(value);
  const debouncedLocalValue = useDebounce(localValue, 500);

  const lastSyncedValue = useRef(value);
  const onChangeRef = useRef(onChange);
  
  useEffect(() => {
    onChangeRef.current = onChange;
  });

  useEffect(() => {
    if (debouncedLocalValue !== lastSyncedValue.current) {
      lastSyncedValue.current = debouncedLocalValue;
      onChangeRef.current(debouncedLocalValue);
    }
  }, [debouncedLocalValue]);

  useEffect(() => {
    if (value !== lastSyncedValue.current) {
      lastSyncedValue.current = value;
      setLocalValue(value);
    }
  }, [value]);

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
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        type="text"
        placeholder={text}
        className="border-border-subtle bg-surface text-foreground placeholder-muted-foreground focus-ring min-h-11 w-full rounded-full border py-2.5 pr-4 pl-11 text-sm"
      />
    </div>
  );
}
