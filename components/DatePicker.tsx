// components/DatePicker.tsx
"use client";

import { Datepicker as FlowbiteDatepicker } from "flowbite-react";

interface DatePickerProps {
  value?: string;
  onChange: (value: string | undefined) => void;
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
      value={value ? new Date(value) : null}
      onChange={(date: Date | null) => {
        onChange(date ? date.toISOString().split("T")[0] : undefined);
      }}
      placeholder={placeholder}
      className={className}
      theme={{
        root: {
          input: {
            field: {
              input: {
                base: "block w-full text-sm text-black placeholder-zinc-500 focus:outline-none dark:text-white",
                colors: {
                  gray: "border border-zinc-300 bg-transparent focus:border-zinc-300 focus:ring-0 dark:border-zinc-700 dark:bg-transparent dark:focus:border-zinc-700",
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
            inner: "p-2 border border-zinc-300 dark:border-zinc-700",
          },
        },
      }}
    />
  );
}
