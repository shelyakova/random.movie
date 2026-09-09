"use client";

import { ComponentProps, forwardRef } from "react";

const Textarea = forwardRef<HTMLTextAreaElement, ComponentProps<"textarea">>(
  function Textarea({ className, rows = 4, ...props }, ref) {
    return (
      <textarea
        ref={ref}
        rows={rows}
        className={`w-full resize-none rounded-3xl border border-zinc-300 px-5 py-3 text-sm text-black placeholder-zinc-500 focus:outline-none dark:border-zinc-700 dark:text-white ${className ?? ""}`}
        {...props}
      />
    );
  },
);

export default Textarea;
