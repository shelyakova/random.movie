"use client";

import { ComponentProps, forwardRef, useId, useState } from "react";
import { EyeIcon, EyeOffIcon } from "./icons";
import Tooltip from "./Tooltip";

interface FormInputProps extends ComponentProps<"input"> {
  label: string;
  error?: boolean;
  errorMessage?: string;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(function FormInput(
  { className, type, error, errorMessage, label, id, ...props },
  ref,
) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;
  const showError = Boolean(error && errorMessage);

  return (
    <div className="relative w-full">
      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>
      <input
        ref={ref}
        id={inputId}
        type={isPassword && showPassword ? "text" : type}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={showError ? errorId : undefined}
        className={`text-foreground placeholder-muted-foreground focus-ring w-full rounded-full border px-5 py-3 text-sm ${
          error ? "border-danger" : "border-border"
        } ${isPassword ? "pr-11" : ""} ${className ?? ""}`}
        {...props}
      />

      {isPassword && (
        <Tooltip
          content={showPassword ? "Hide password" : "Show password"}
          className="absolute top-1/2 right-4 -translate-y-1/2"
        >
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="text-muted-foreground focus-ring -m-3.5 cursor-pointer rounded-full p-3.5"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </Tooltip>
      )}

      {showError && (
        <p id={errorId} className="text-danger mt-1 text-xs">
          {errorMessage}
        </p>
      )}
    </div>
  );
});

export default FormInput;
