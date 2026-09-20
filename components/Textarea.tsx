"use client";

import { ComponentProps, forwardRef, useId } from "react";
import { useTranslateError } from "@/hooks/useTranslateError";

interface TextareaProps extends ComponentProps<"textarea"> {
  label: string;
  error?: boolean;
  errorMessage?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, rows = 4, label, error, errorMessage, id, ...props },
  ref,
) {
  const translateError = useTranslateError();
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;
  const showError = Boolean(error && errorMessage);

  return (
    <div className="w-full">
      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>
      <div
        className={`has-focus-visible:ring-accent has-focus-visible:ring-offset-background rounded-3xl border py-3 pr-3 pl-5 has-focus-visible:ring-2 has-focus-visible:ring-offset-1 ${
          error ? "border-danger" : "border-border"
        } ${className ?? ""}`}
      >
        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={showError ? errorId : undefined}
          className="themed-scrollbar text-foreground placeholder-muted-foreground block w-full resize-none bg-transparent pr-2 text-sm outline-none"
          {...props}
        />
      </div>
      {showError && (
        <p id={errorId} className="text-danger mt-1 text-xs">
          {translateError(errorMessage)}
        </p>
      )}
    </div>
  );
});

export default Textarea;
