"use client";

import { ComponentProps, forwardRef, useState } from "react";
import { EyeIcon, EyeOffIcon } from "./icons";
import Tooltip from "./Tooltip";

interface FormInputProps extends ComponentProps<"input"> {
  error?: boolean;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(function FormInput(
  { className, type, error, ...props },
  ref,
) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="relative w-full">
      <input
        ref={ref}
        type={isPassword && showPassword ? "text" : type}
        className={`text-foreground placeholder-muted-foreground w-full rounded-full border px-5 py-3 text-sm focus:outline-none ${
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
            className="text-muted-foreground cursor-pointer"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </Tooltip>
      )}
    </div>
  );
});

export default FormInput;
