"use client";

import { ComponentProps, forwardRef } from "react";

const Textarea = forwardRef<HTMLTextAreaElement, ComponentProps<"textarea">>(function Textarea(
  { className, rows = 4, ...props },
  ref,
) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={`border-border text-foreground placeholder-muted-foreground w-full resize-none rounded-3xl border px-5 py-3 text-sm focus:outline-none ${className ?? ""}`}
      {...props}
    />
  );
});

export default Textarea;
