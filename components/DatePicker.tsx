"use client";

import { useId } from "react";
import { Datepicker as FlowbiteDatepicker } from "flowbite-react";

interface DatePickerProps {
  value?: string | null;
  onChange: (value: string | null) => void;
  label: string;
  placeholder?: string;
  isRightPopupOriented?: boolean;
  className?: string;
}

export default function DatePicker({
  value,
  onChange,
  label,
  placeholder,
  className,
  isRightPopupOriented,
}: DatePickerProps) {
  const inputId = useId();

  return (
    <div className={className ?? "w-full"}>
      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>
      <FlowbiteDatepicker
        key={value}
        id={inputId}
        value={value ? new Date(value) : null}
        onChange={(date: Date | null) => {
          onChange(date ? date.toISOString().split("T")[0] : null);
        }}
        placeholder={placeholder}
        theme={{
          root: {
            input: {
              field: {
                input: {
                  base: "block w-full text-sm text-foreground placeholder-muted-foreground focus-ring",
                  colors: {
                    gray: "border border-border bg-transparent focus:border-border dark:bg-transparent",
                  },
                  sizes: {
                    md: "px-5 py-3 text-sm",
                  },
                  withAddon: {
                    off: "rounded-full",
                  },
                },
              },
            },
          },
          popup: {
            root: {
              base: isRightPopupOriented ? "right-0" : "",
              inner: "p-2 border border-border",
            },
          },
        }}
      />
    </div>
  );
}
