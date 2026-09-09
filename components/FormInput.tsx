"use client";

import { ComponentProps, forwardRef, useState } from "react";
import { EyeIcon, EyeOffIcon } from "./icons";

interface FormInputProps extends ComponentProps<"input"> {
  error?: boolean;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  function FormInput({ className, type, error, ...props }, ref) {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";

    return (
      <div className="relative w-full">
        <input
          ref={ref}
          type={isPassword && showPassword ? "text" : type}
          className={`w-full rounded-full border px-5 py-3 text-sm text-black placeholder-zinc-500 focus:outline-none dark:text-white ${
            error ? "border-red-500" : "border-zinc-300 dark:border-zinc-700"
          } ${isPassword ? "pr-11" : ""} ${className ?? ""}`}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-zinc-500"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        )}
      </div>
    );
  },
);

export default FormInput;
