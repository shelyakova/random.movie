"use client";

import { Datepicker as FlowbiteDatepicker } from "flowbite-react";

interface DatePickerProps {
  value?: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  isRightPopupOriented?: boolean;
  className?: string;
}

export default function DatePicker({
  value,
  onChange,
  placeholder,
  className,
  isRightPopupOriented,
}: DatePickerProps) {
  return (
    <FlowbiteDatepicker
      key={value}
      value={value ? new Date(value) : null}
      onChange={(date: Date | null) => {
        onChange(date ? date.toISOString().split("T")[0] : null);
      }}
      placeholder={placeholder}
      className={className}
      theme={{
        root: {
          input: {
            field: {
              input: {
                base: "block w-full text-sm text-foreground placeholder-muted-foreground focus:outline-none",
                colors: {
                  gray: "border border-border bg-transparent focus:border-border focus:ring-0 dark:bg-transparent",
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
  );
}
