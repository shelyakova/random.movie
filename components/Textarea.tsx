"use client";

import { ComponentProps, forwardRef, useId } from "react";

interface TextareaProps extends ComponentProps<"textarea"> {
  label: string;
  error?: boolean;
  errorMessage?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, rows = 4, label, error, errorMessage, id, ...props },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;
  const showError = Boolean(error && errorMessage);

  return (
    <div className="w-full">
      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>
      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={showError ? errorId : undefined}
        className={`text-foreground placeholder-muted-foreground w-full resize-none rounded-3xl border px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1 focus:ring-offset-background ${
          error ? "border-danger" : "border-border"
        } ${className ?? ""}`}
        {...props}
      />
      {showError && (
        <p id={errorId} className="text-danger mt-1 text-xs">
          {errorMessage}
        </p>
      )}
    </div>
  );
});

export default Textarea;
